
# Quick Start: AI Integration

Get your PVA+ AI features up and running in 5 steps.

## Step 1: Choose Your Backend

Pick one option:

### Option A: Supabase (Easiest)
- ✅ No server management
- ✅ Free tier available
- ✅ 5 minutes setup

[Follow Supabase Setup →](./BACKEND_SETUP_GUIDE.md#option-1-supabase-edge-functions-recommended)

### Option B: Node.js
- ✅ Full control
- ✅ Easy to customize
- ✅ 10 minutes setup

[Follow Node.js Setup →](./BACKEND_SETUP_GUIDE.md#option-2-nodejs--express)

### Option C: FastAPI
- ✅ Python-based
- ✅ Great for AI
- ✅ 10 minutes setup

[Follow FastAPI Setup →](./BACKEND_SETUP_GUIDE.md#option-3-fastapi-python)

## Step 2: Get API Keys

### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account / Sign in
3. Navigate to API Keys
4. Create new key
5. Copy and save securely

### Pinecone (Optional)
1. Go to [pinecone.io](https://www.pinecone.io)
2. Create account
3. Create new index
4. Copy API key and index name

### ElevenLabs (Optional, for voice)
1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Create account
3. Get API key from profile

## Step 3: Deploy Backend

### If using Supabase:
```bash
# Deploy functions
supabase functions deploy openai-completion
supabase functions deploy pinecone-search

# Set secrets
supabase secrets set OPENAI_API_KEY=your_key
```

### If using Node.js:
```bash
# Deploy to Vercel
vercel deploy

# Or Railway
railway up

# Or Heroku
git push heroku main
```

### If using FastAPI:
```bash
# Deploy to Railway
railway up

# Or use Docker
docker build -t pva-backend .
docker run -p 8000:8000 pva-backend
```

## Step 4: Configure App

1. **Open the app**
2. **Navigate to**: Home → AI Status → AI Dashboard
3. **Or**: Profile → AI Config
4. **Enter endpoints**:
   - OpenAI: `https://your-backend.com/api/openai/completion`
   - LangChain: `https://your-backend.com/api/langchain/agent/execute`
   - Pinecone: `https://your-backend.com/api/pinecone/search`
5. **Test connections**

## Step 5: Test Features

### Test OpenAI
1. Go to **AI Dashboard**
2. Enter test prompt: "Hello, how are you?"
3. Tap **Test OpenAI**
4. See response

### Test Problem Solver
1. Go to **Problem Solver** tab
2. Tap **Analyze**
3. See AI-generated solutions

### Test Travel Assistant
1. Go to **Travel** tab
2. Enter destination
3. Tap **Search**
4. See AI-powered recommendations

## Verify Everything Works

Check the **AI Dashboard** for:
- ✅ All services showing "online"
- ✅ Test prompt returns response
- ✅ No error messages

## Troubleshooting

### Services show "offline"
- ✅ Check backend is running
- ✅ Verify API keys are set
- ✅ Check endpoint URLs are correct

### "Endpoint not configured" error
- ✅ Go to AI Config
- ✅ Enter backend URLs
- ✅ Save and test

### OpenAI errors
- ✅ Verify API key is valid
- ✅ Check you have credits
- ✅ Review backend logs

## What's Next?

### Explore Features
- **Problem Solver**: AI-powered problem analysis
- **Travel Assistant**: Intelligent travel planning
- **Email Triage**: Automatic email categorization
- **Behavior AI**: Learn from your patterns
- **Voice Features**: Speech-to-text and text-to-speech

### Customize
- Adjust AI temperature settings
- Configure autonomy levels
- Set up automation workflows
- Customize voice profiles

### Advanced
- Set up LangChain agents
- Configure Pinecone for memory
- Implement custom workflows
- Add more integrations

## Need Help?

1. **Check AI Dashboard** for service status
2. **Review logs** in backend
3. **Test individual services** one by one
4. **Read full guides**:
   - [AI Integration Guide](./AI_INTEGRATION_GUIDE.md)
   - [Backend Setup Guide](./BACKEND_SETUP_GUIDE.md)

## Example Backend URLs

### Supabase
```
https://your-project.supabase.co/functions/v1/openai-completion
https://your-project.supabase.co/functions/v1/langchain-agent
https://your-project.supabase.co/functions/v1/pinecone-search
```

### Vercel/Railway/Heroku
```
https://your-app.vercel.app/api/openai/completion
https://your-app.vercel.app/api/langchain/agent/execute
https://your-app.vercel.app/api/pinecone/search
```

### Local Development
```
http://localhost:3000/api/openai/completion
http://localhost:3000/api/langchain/agent/execute
http://localhost:3000/api/pinecone/search
```

## Success! 🎉

Your PVA+ is now powered by AI. Start exploring the features and customize to your needs!
