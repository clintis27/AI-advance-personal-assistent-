
# AI Integration Guide

## Overview

This guide covers the integration of advanced AI services into your PVA+ (Personal Virtual Assistant Plus) application. The app is designed to work with a modern AI tech stack including OpenAI GPT, LangChain, Pinecone, Whisper, and ElevenLabs.

## Architecture

### Frontend (React Native + Expo)
- **Hooks**: Custom React hooks for each AI service
- **Services**: Centralized service layer for configuration and management
- **Components**: UI components for AI status and interaction
- **Secure Storage**: Encrypted storage for API keys and tokens

### Backend Requirements
The frontend requires backend services to securely handle AI API calls. **Never expose API keys in the frontend code.**

Recommended backend options:
1. **Supabase Edge Functions** (Serverless, recommended)
2. **Node.js + Express** (Traditional API server)
3. **FastAPI** (Python, for AI routing)

## AI Services

### 1. OpenAI GPT Integration

**Hook**: `useOpenAI()`

**Features**:
- Text completion with GPT-4o/GPT-5
- Multi-turn conversations
- Problem-solving analysis
- Email response generation
- Task prediction

**Usage**:
```typescript
import { useOpenAI } from '@/hooks/useOpenAI';

function MyComponent() {
  const openai = useOpenAI();
  
  const handleGenerate = async () => {
    const result = await openai.generateCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello!' },
      ],
      temperature: 0.7,
    });
    
    if (result) {
      console.log(result.content);
    }
  };
  
  return (
    <Button onPress={handleGenerate} disabled={openai.loading}>
      {openai.loading ? 'Generating...' : 'Generate'}
    </Button>
  );
}
```

**Backend Endpoint Required**:
- `POST /api/openai/completion`
- Request: `{ messages, model, temperature, max_tokens }`
- Response: `{ id, content, model, usage }`

### 2. LangChain Integration

**Hook**: `useLangChain()`

**Features**:
- Agent execution with tools
- Workflow automation
- Multi-step reasoning
- Memory management

**Usage**:
```typescript
import { useLangChain } from '@/hooks/useLangChain';

function MyComponent() {
  const langchain = useLangChain();
  
  const handleExecute = async () => {
    const result = await langchain.executeAgent({
      agentId: 'task-agent',
      input: 'Schedule a meeting for tomorrow',
      tools: ['calendar', 'email'],
    });
    
    if (result) {
      console.log(result.output);
    }
  };
}
```

**Backend Endpoint Required**:
- `POST /api/langchain/agent/execute`
- `POST /api/langchain/workflow/create`

### 3. Pinecone Vector Database

**Hook**: `usePinecone()`

**Features**:
- Semantic search
- Document storage
- Memory retrieval
- Context-aware responses

**Usage**:
```typescript
import { usePinecone } from '@/hooks/usePinecone';

function MyComponent() {
  const pinecone = usePinecone();
  
  const handleSearch = async () => {
    const results = await pinecone.search({
      query: 'How do I reset my password?',
      topK: 5,
    });
    
    if (results) {
      console.log(results);
    }
  };
}
```

**Backend Endpoint Required**:
- `POST /api/pinecone/search`
- `POST /api/pinecone/upsert`
- `POST /api/pinecone/delete`

### 4. Voice Services (Whisper + ElevenLabs)

**Services**: Already implemented in `utils/voiceServices.ts`

**Features**:
- Speech-to-Text (Whisper)
- Text-to-Speech (ElevenLabs)
- Voice cloning
- Real-time transcription

See `docs/VOICE_COMMUNICATION_GUIDE.md` for details.

## Configuration

### Setting Up Endpoints

1. **Via AI Config Screen**:
   - Navigate to Settings → AI Config
   - Enter backend endpoint URLs
   - Test connections

2. **Programmatically**:
```typescript
import { aiService } from '@/services/aiService';

await aiService.updateConfig({
  openaiEndpoint: 'https://your-backend.com/api/openai',
  langchainEndpoint: 'https://your-backend.com/api/langchain',
  pineconeEndpoint: 'https://your-backend.com/api/pinecone',
});
```

### Secure Storage

All API keys and tokens are stored securely using `expo-secure-store`:

```typescript
import { SecureStorage } from '@/utils/secureStorage';

// Store
await SecureStorage.setItem('api_key', 'your-key');

// Retrieve
const key = await SecureStorage.getItem('api_key');

// Delete
await SecureStorage.deleteItem('api_key');
```

## Backend Implementation Examples

### Supabase Edge Function (Recommended)

```typescript
// supabase/functions/openai-completion/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { messages, model, temperature } = await req.json();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      messages,
      temperature: temperature || 0.7,
    }),
  });
  
  const data = await response.json();
  
  return new Response(JSON.stringify({
    id: data.id,
    content: data.choices[0].message.content,
    model: data.model,
    usage: data.usage,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Node.js + Express

```javascript
// server.js
const express = require('express');
const OpenAI = require('openai');

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/openai/completion', async (req, res) => {
  try {
    const { messages, model, temperature } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o',
      messages,
      temperature: temperature || 0.7,
    });
    
    res.json({
      id: completion.id,
      content: completion.choices[0].message.content,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## AI Dashboard

The AI Dashboard (`app/(tabs)/ai-dashboard.tsx`) provides:

- **Service Status Monitoring**: Real-time status of all AI services
- **Connection Testing**: Test each service individually
- **Quick Testing**: Test OpenAI with custom prompts
- **Quick Actions**: Navigate to AI-powered features

Access via:
- Home screen AI status indicator
- Settings → AI Config → Dashboard button

## Automation Service

The Automation Service (`services/automationService.ts`) integrates with n8n or custom workflows:

```typescript
import { automationService } from '@/services/automationService';

// Create workflow
const workflowId = await automationService.createWorkflow({
  name: 'Email Triage',
  description: 'Automatically categorize incoming emails',
  trigger: {
    type: 'event',
    config: { event: 'email.received' },
  },
  actions: [
    { type: 'ai.analyze', config: { model: 'gpt-4o' } },
    { type: 'email.categorize', config: {} },
  ],
  enabled: true,
});

// Execute workflow
const execution = await automationService.executeWorkflow(workflowId, {
  email: emailData,
});
```

## Best Practices

### Security
1. **Never** store API keys in the frontend code
2. Always use backend services for API calls
3. Use secure storage for tokens and configuration
4. Implement proper authentication and authorization
5. Rotate API keys regularly

### Performance
1. Implement request caching where appropriate
2. Use streaming for long responses
3. Implement request cancellation
4. Show loading states to users
5. Handle errors gracefully

### User Experience
1. Show clear loading indicators
2. Provide meaningful error messages
3. Allow users to cancel long-running operations
4. Display AI confidence scores
5. Offer manual overrides for AI decisions

## Troubleshooting

### Service Offline
- Check backend endpoint configuration
- Verify API keys are valid
- Check network connectivity
- Review backend logs

### Slow Responses
- Check backend server performance
- Consider implementing caching
- Use streaming for real-time feedback
- Optimize prompts for faster responses

### High Costs
- Implement rate limiting
- Cache common responses
- Use appropriate model sizes
- Monitor token usage

## Next Steps

1. **Set up backend services** (Supabase or Node.js)
2. **Configure API endpoints** in AI Config
3. **Test each service** in AI Dashboard
4. **Implement features** using the provided hooks
5. **Monitor usage** and optimize as needed

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [LangChain Documentation](https://js.langchain.com/docs)
- [Pinecone Documentation](https://docs.pinecone.io)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [n8n Documentation](https://docs.n8n.io)

## Support

For issues or questions:
1. Check the AI Dashboard for service status
2. Review backend logs
3. Test individual services
4. Verify configuration settings
