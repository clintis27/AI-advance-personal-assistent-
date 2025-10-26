
# Backend Setup Guide for PVA+

## Overview

Your PVA+ app requires a backend to securely handle AI API calls. This guide covers three recommended approaches:

1. **Supabase Edge Functions** (Easiest, Serverless)
2. **Node.js + Express** (Traditional, Full Control)
3. **FastAPI** (Python, Best for AI Routing)

## Option 1: Supabase Edge Functions (Recommended)

### Why Supabase?
- ✅ Serverless (no server management)
- ✅ Built-in authentication
- ✅ Automatic scaling
- ✅ Free tier available
- ✅ Easy deployment

### Setup Steps

#### 1. Create Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Initialize project
supabase init
```

#### 2. Create Edge Functions

**OpenAI Completion Function**:
```bash
supabase functions new openai-completion
```

```typescript
// supabase/functions/openai-completion/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request
    const { messages, model, temperature, max_tokens } = await req.json();

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o',
        messages,
        temperature: temperature ?? 0.7,
        max_tokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      id: data.id,
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
      finishReason: data.choices[0].finish_reason,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

**LangChain Agent Function**:
```bash
supabase functions new langchain-agent
```

```typescript
// supabase/functions/langchain-agent/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { agentId, input, tools } = await req.json();
  
  // Implement LangChain agent logic here
  // This is a placeholder - actual implementation depends on your needs
  
  return new Response(JSON.stringify({
    output: 'Agent response',
    toolsUsed: tools || [],
    executionTime: 1000,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**Pinecone Search Function**:
```bash
supabase functions new pinecone-search
```

```typescript
// supabase/functions/pinecone-search/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { query, top_k, filter, namespace } = await req.json();
  
  // Get embedding from OpenAI
  const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: query,
    }),
  });
  
  const embeddingData = await embeddingResponse.json();
  const embedding = embeddingData.data[0].embedding;
  
  // Search Pinecone
  const pineconeResponse = await fetch(
    `https://${Deno.env.get('PINECONE_INDEX')}/query`,
    {
      method: 'POST',
      headers: {
        'Api-Key': Deno.env.get('PINECONE_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vector: embedding,
        topK: top_k || 5,
        filter,
        namespace,
        includeMetadata: true,
      }),
    }
  );
  
  const results = await pineconeResponse.json();
  
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

#### 3. Set Environment Variables

```bash
# Set secrets
supabase secrets set OPENAI_API_KEY=your_openai_key
supabase secrets set PINECONE_API_KEY=your_pinecone_key
supabase secrets set PINECONE_INDEX=your_index_name
```

#### 4. Deploy Functions

```bash
supabase functions deploy openai-completion
supabase functions deploy langchain-agent
supabase functions deploy pinecone-search
```

#### 5. Configure App

In your app's AI Config screen, set:
- OpenAI Endpoint: `https://your-project.supabase.co/functions/v1/openai-completion`
- LangChain Endpoint: `https://your-project.supabase.co/functions/v1/langchain-agent`
- Pinecone Endpoint: `https://your-project.supabase.co/functions/v1/pinecone-search`

## Option 2: Node.js + Express

### Setup Steps

#### 1. Initialize Project

```bash
mkdir pva-backend
cd pva-backend
npm init -y
npm install express cors dotenv openai @pinecone-database/pinecone langchain
```

#### 2. Create Server

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// OpenAI completion
app.post('/api/openai/completion', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o',
      messages,
      temperature: temperature ?? 0.7,
      max_tokens,
    });
    
    res.json({
      id: completion.id,
      content: completion.choices[0].message.content,
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices[0].finish_reason,
    });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pinecone search
app.post('/api/pinecone/search', async (req, res) => {
  try {
    const { query, top_k, filter, namespace } = req.body;
    
    // Get embedding
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });
    
    // Search Pinecone
    const index = pinecone.index(process.env.PINECONE_INDEX);
    const results = await index.query({
      vector: embedding.data[0].embedding,
      topK: top_k || 5,
      filter,
      namespace,
      includeMetadata: true,
    });
    
    res.json(results);
  } catch (error) {
    console.error('Pinecone error:', error);
    res.status(500).json({ error: error.message });
  }
});

// LangChain agent
app.post('/api/langchain/agent/execute', async (req, res) => {
  try {
    const { agentId, input, tools } = req.body;
    
    // Implement your LangChain agent logic here
    
    res.json({
      output: 'Agent response',
      toolsUsed: tools || [],
      executionTime: 1000,
    });
  } catch (error) {
    console.error('LangChain error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 3. Create .env File

```bash
# .env
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=your_index_name
PORT=3000
```

#### 4. Run Server

```bash
node server.js
```

#### 5. Deploy

Deploy to:
- **Vercel**: `vercel deploy`
- **Railway**: `railway up`
- **Heroku**: `git push heroku main`
- **AWS**: Use Elastic Beanstalk or EC2

## Option 3: FastAPI (Python)

### Setup Steps

#### 1. Initialize Project

```bash
mkdir pva-backend
cd pva-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn openai pinecone-client langchain python-dotenv
```

#### 2. Create Server

```python
# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import openai
import pinecone
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"))

class Message(BaseModel):
    role: str
    content: str

class CompletionRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = "gpt-4o"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = None

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
    filter: Optional[Dict[str, Any]] = None
    namespace: Optional[str] = None

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/openai/completion")
async def openai_completion(request: CompletionRequest):
    try:
        response = openai.ChatCompletion.create(
            model=request.model,
            messages=[msg.dict() for msg in request.messages],
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        
        return {
            "id": response.id,
            "content": response.choices[0].message.content,
            "model": response.model,
            "usage": response.usage,
            "finishReason": response.choices[0].finish_reason,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pinecone/search")
async def pinecone_search(request: SearchRequest):
    try:
        # Get embedding
        embedding_response = openai.Embedding.create(
            model="text-embedding-ada-002",
            input=request.query
        )
        embedding = embedding_response.data[0].embedding
        
        # Search Pinecone
        index = pinecone.Index(os.getenv("PINECONE_INDEX"))
        results = index.query(
            vector=embedding,
            top_k=request.top_k,
            filter=request.filter,
            namespace=request.namespace,
            include_metadata=True,
        )
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### 3. Create .env File

```bash
# .env
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=your_index_name
```

#### 4. Run Server

```bash
uvicorn main:app --reload
```

## Security Best Practices

### 1. Authentication
- Implement JWT or OAuth 2.0
- Validate tokens on every request
- Use short-lived access tokens

### 2. Rate Limiting
```javascript
// Express example
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Input Validation
- Validate all inputs
- Sanitize user data
- Limit request sizes

### 4. Error Handling
- Don't expose internal errors
- Log errors securely
- Return generic error messages

### 5. HTTPS Only
- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use secure headers

## Testing Your Backend

### Using curl

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test OpenAI completion
curl -X POST http://localhost:3000/api/openai/completion \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Using the App

1. Open AI Config screen
2. Enter your backend URL
3. Tap "Test Connection"
4. Check AI Dashboard for status

## Monitoring & Logging

### Recommended Tools
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog**: Performance monitoring
- **CloudWatch**: AWS logging

### Example Logging

```javascript
// Winston logger
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

app.post('/api/openai/completion', async (req, res) => {
  logger.info('OpenAI completion request', { userId: req.user?.id });
  // ... rest of code
});
```

## Cost Management

### Tips to Reduce Costs
1. **Cache responses** for common queries
2. **Use smaller models** when appropriate
3. **Implement rate limiting** per user
4. **Set max_tokens** limits
5. **Monitor usage** regularly

### Example Caching

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

app.post('/api/openai/completion', async (req, res) => {
  const cacheKey = JSON.stringify(req.body);
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }
  
  // ... make API call
  cache.set(cacheKey, result);
  res.json(result);
});
```

## Next Steps

1. Choose your backend approach
2. Set up the backend server
3. Deploy to production
4. Configure endpoints in the app
5. Test all services
6. Monitor usage and costs

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Pinecone Documentation](https://docs.pinecone.io)
