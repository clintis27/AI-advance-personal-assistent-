
# Voice & Communication Layer Guide

## Overview

The Voice & Communication Layer enables your AI personal assistant to speak naturally, understand speech, and handle calls or meetings autonomously. This guide covers all voice-related features and their configuration.

---

## Features

### 1. Speech-to-Text (STT)
Convert audio to text in real-time or from recordings.

**Supported Providers:**
- **OpenAI Whisper**: High-quality speech recognition with support for 50+ languages
- **OpenAI Realtime API**: Real-time bidirectional audio streaming
- **Deepgram**: Fast and accurate with live streaming support
- **AssemblyAI**: Advanced features including speaker diarization

**Use Cases:**
- Transcribe voice memos
- Convert meeting recordings to text
- Real-time voice commands
- Voicemail transcription

**Configuration:**
```json
{
  "provider": "openai-whisper",
  "language": "en-US",
  "model": "whisper-1",
  "realTime": false
}
```

---

### 2. Text-to-Speech (TTS)
Generate realistic voice replies from text.

**Supported Providers:**
- **OpenAI TTS**: Natural-sounding voices (alloy, echo, fable, onyx, nova, shimmer)
- **ElevenLabs**: Ultra-realistic voice synthesis with emotion control
- **Play.ht**: High-quality voice generation with multiple languages
- **Amazon Polly**: AWS text-to-speech with neural voices
- **Azure Neural Voice**: Microsoft's advanced neural TTS

**Use Cases:**
- Voice responses during calls
- Audio notifications
- Reading emails/messages aloud
- Meeting summaries

**Configuration:**
```json
{
  "provider": "openai",
  "voice": "alloy",
  "speed": 1.0,
  "pitch": 1.0,
  "language": "en-US"
}
```

---

### 3. Voice Cloning
Create a custom voice that sounds like you.

**Supported Providers:**
- **ElevenLabs**: Professional voice cloning (3+ samples, 30s each)
- **Resemble.ai**: Custom voice creation (5+ samples, 60s each)

**Requirements:**
- ✅ Explicit consent required
- ✅ High-quality audio samples
- ✅ Minimum sample count and duration
- ✅ Clear recording environment

**Use Cases:**
- Agent speaks in your voice during calls
- Personalized voice messages
- Consistent brand voice for business

**Important:** Voice cloning requires explicit written consent and should only be used ethically.

---

### 4. Real-time Voice Interaction
Enable live conversations with your AI assistant.

**Technologies:**
- **WebRTC**: Real-time audio streaming
- **OpenAI Realtime API**: Bidirectional voice conversation
- **Low-latency processing**: < 500ms response time

**Features:**
- Natural conversation flow
- Interruption handling
- Context awareness
- Silence detection

**Use Cases:**
- Voice-based task management
- Hands-free operation
- Meeting participation
- Phone call handling

---

### 5. Call Integration
Handle voice calls, SMS, and voicemail automatically.

**Supported Providers:**
- **Twilio**: Comprehensive voice and SMS platform
- **Vonage**: Global communications with video support
- **SignalWire**: Modern communications API

**Features:**
- ✅ Inbound/outbound calls
- ✅ SMS messaging
- ✅ Voicemail transcription
- ✅ Call recording
- ✅ Call routing
- ✅ Conference calls

**Use Cases:**
- Auto-answer calls when busy
- Screen unknown callers
- Take messages
- Schedule callbacks
- Send SMS notifications

---

## Setup Instructions

### Step 1: Configure API Keys

1. Navigate to **AI Config** screen
2. Go to **APIs** tab
3. Enable desired voice providers
4. Enter API keys securely

**Getting API Keys:**

- **OpenAI**: https://platform.openai.com/api-keys
- **ElevenLabs**: https://elevenlabs.io/app/settings/api-keys
- **Deepgram**: https://console.deepgram.com/
- **AssemblyAI**: https://www.assemblyai.com/app/account
- **Twilio**: https://console.twilio.com/

### Step 2: Enable Voice Features

1. Go to **Voice & Communication** screen
2. Toggle desired features:
   - Speech-to-Text
   - Text-to-Speech
   - Voice Cloning
   - Real-time Voice
   - Call Integration

### Step 3: Configure Voice Agent

1. Navigate to **Agent** screen
2. Enable **Handle Calls** capability
3. Configure voice settings:
   - Select voice profile
   - Set response style
   - Configure business hours
   - Set greeting/away messages

### Step 4: Set Privacy Preferences

1. Go to **Privacy** screen
2. Configure voice consent:
   - Voice cloning consent
   - Call recording consent
   - Transcript storage
   - Data retention period

---

## Voice Profiles

### Pre-configured Profiles

**Professional Male**
- Voice: OpenAI "onyx"
- Style: Authoritative, clear
- Best for: Business calls, formal meetings

**Friendly Female**
- Voice: OpenAI "nova"
- Style: Warm, approachable
- Best for: Customer service, casual conversations

**Neutral Assistant**
- Voice: OpenAI "alloy"
- Style: Balanced, professional
- Best for: General purpose

### Custom Voice Profiles

Create your own voice profile:

1. Record 3-5 audio samples (30-60 seconds each)
2. Upload to voice cloning service
3. Wait for training (1-24 hours)
4. Test and activate

---

## Privacy & Security

### Data Handling

**Audio Recordings:**
- Stored locally by default
- Optional cloud backup (encrypted)
- Configurable retention period (7-90 days)
- Automatic deletion after retention period

**Transcripts:**
- Stored in secure local database
- End-to-end encryption
- User-controlled retention
- Export/delete anytime

**API Keys:**
- Stored in device secure storage (Keychain/Keystore)
- Never transmitted to third parties
- Encrypted at rest
- Deleted on logout

### Consent Management

**Required Consents:**
- ✅ Voice cloning: Explicit written consent
- ✅ Call recording: Per-call or blanket consent
- ✅ Transcript storage: Opt-in required
- ✅ Voice-as-user: Explicit consent per contact

**Consent Tracking:**
- Timestamp recorded
- Revocable anytime
- Audit trail maintained
- Contact-specific permissions

---

## Best Practices

### For Speech-to-Text

1. **Audio Quality**: Use good microphone, minimize background noise
2. **Language**: Specify correct language for better accuracy
3. **Context**: Provide context for technical terms
4. **Review**: Always review transcripts for accuracy

### For Text-to-Speech

1. **Natural Text**: Write conversational, not formal text
2. **Punctuation**: Use proper punctuation for natural pauses
3. **Speed**: Adjust speed based on content complexity
4. **Testing**: Test with sample text before production use

### For Voice Cloning

1. **Sample Quality**: Record in quiet environment
2. **Consistency**: Use same microphone for all samples
3. **Variety**: Include different emotions and tones
4. **Length**: Longer samples = better quality
5. **Ethics**: Only clone your own voice or with explicit consent

### For Call Handling

1. **Business Hours**: Set appropriate availability
2. **Greeting**: Create professional greeting message
3. **Screening**: Configure allowed/blocked contacts
4. **Fallback**: Always have human escalation option
5. **Testing**: Test with known contacts first

---

## Troubleshooting

### Common Issues

**STT Not Working:**
- ✅ Check API key is valid
- ✅ Verify microphone permissions
- ✅ Test audio input levels
- ✅ Check internet connection

**TTS Audio Quality Poor:**
- ✅ Try different voice provider
- ✅ Adjust speed/pitch settings
- ✅ Check audio output device
- ✅ Verify API quota not exceeded

**Voice Cloning Failed:**
- ✅ Ensure minimum sample count met
- ✅ Check audio quality (no background noise)
- ✅ Verify consent given
- ✅ Wait for training completion

**Calls Not Connecting:**
- ✅ Verify Twilio/Vonage credentials
- ✅ Check phone number format
- ✅ Ensure sufficient account balance
- ✅ Test with simple outbound call first

---

## API Rate Limits

### OpenAI
- Whisper: 50 requests/minute
- TTS: 50 requests/minute
- Realtime API: 100 concurrent connections

### ElevenLabs
- Free: 10,000 characters/month
- Starter: 30,000 characters/month
- Creator: 100,000 characters/month

### Deepgram
- Pay-as-you-go: $0.0043/minute
- Growth: 45,000 minutes/month included

### Twilio
- Voice: $0.0085/minute (US)
- SMS: $0.0075/message (US)
- Recording: $0.0025/minute

---

## Cost Optimization

### Tips to Reduce Costs

1. **Cache TTS**: Store frequently used audio responses
2. **Batch Processing**: Process multiple transcriptions together
3. **Quality Settings**: Use lower quality for non-critical audio
4. **Local Processing**: Use on-device STT when possible
5. **Smart Routing**: Route to cheapest provider based on requirements

### Estimated Monthly Costs

**Light Usage** (10 hours voice/month):
- STT: ~$5
- TTS: ~$3
- Calls: ~$10
- **Total: ~$18/month**

**Medium Usage** (50 hours voice/month):
- STT: ~$25
- TTS: ~$15
- Calls: ~$50
- **Total: ~$90/month**

**Heavy Usage** (200 hours voice/month):
- STT: ~$100
- TTS: ~$60
- Calls: ~$200
- **Total: ~$360/month**

---

## Advanced Features

### Speaker Diarization
Identify different speakers in audio (AssemblyAI).

### Emotion Detection
Detect emotional tone in voice (ElevenLabs).

### Language Detection
Auto-detect spoken language (Whisper).

### Noise Cancellation
Remove background noise from recordings.

### Voice Activity Detection
Detect when someone is speaking vs silence.

---

## Integration Examples

### Example 1: Voice Memo Transcription

```typescript
import { STTService } from '@/utils/voiceServices';

const sttService = new STTService({
  provider: 'openai-whisper',
  language: 'en-US',
  realTime: false,
});

const result = await sttService.transcribe(audioUri);
console.log('Transcript:', result.text);
```

### Example 2: Generate Voice Response

```typescript
import { TTSService } from '@/utils/voiceServices';

const ttsService = new TTSService({
  provider: 'openai',
  voice: 'alloy',
  speed: 1.0,
  pitch: 1.0,
  language: 'en-US',
});

const audio = await ttsService.synthesize('Hello, how can I help you?');
// Play audio.audioUrl
```

### Example 3: Handle Incoming Call

```typescript
import { CallService } from '@/utils/voiceServices';

const callService = new CallService('twilio');

// Answer call
await callService.answerCall(callId);

// Get transcript
const transcript = await callService.transcribeVoicemail(voicemailId);
```

---

## Support & Resources

### Documentation
- OpenAI: https://platform.openai.com/docs
- ElevenLabs: https://docs.elevenlabs.io
- Twilio: https://www.twilio.com/docs

### Community
- Discord: [Join our community]
- GitHub: [Report issues]
- Email: support@yourapp.com

### Updates
Check the app regularly for new voice features and improvements.

---

## Roadmap

### Coming Soon
- ✨ Multi-language support
- ✨ Voice commands
- ✨ Meeting transcription
- ✨ Voice analytics
- ✨ Custom wake words
- ✨ Offline STT/TTS

---

**Last Updated:** January 2025
**Version:** 1.0.0
