
/**
 * Type definitions for Voice & Communication Layer
 */

// Speech-to-Text Types
export interface STTConfig {
  provider: 'openai-whisper' | 'openai-realtime' | 'deepgram' | 'assemblyai';
  language: string;
  model?: string;
  realTime: boolean;
  apiKey?: string;
}

export interface STTResult {
  text: string;
  confidence: number;
  duration: number;
  language?: string;
  timestamp: string;
}

export interface TranscriptionSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  speaker?: string;
  confidence: number;
}

// Text-to-Speech Types
export interface TTSConfig {
  provider: 'openai' | 'elevenlabs' | 'playht' | 'polly' | 'azure';
  voice: string;
  voiceId?: string;
  speed: number;
  pitch: number;
  language: string;
  apiKey?: string;
}

export interface TTSResult {
  audioUrl: string;
  duration: number;
  format: 'mp3' | 'wav' | 'ogg';
  size: number;
}

export interface VoiceProfile {
  id: string;
  name: string;
  provider: string;
  voiceId: string;
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'middle' | 'senior';
  style: 'professional' | 'casual' | 'friendly' | 'authoritative';
  language: string;
  sample?: string;
  isCustom: boolean;
}

// Voice Cloning Types
export interface VoiceCloningConfig {
  provider: 'elevenlabs' | 'resemble';
  name: string;
  description: string;
  sampleAudioUrls: string[];
  consentGiven: boolean;
  consentTimestamp?: string;
  apiKey?: string;
}

export interface ClonedVoice {
  id: string;
  name: string;
  provider: string;
  voiceId: string;
  status: 'training' | 'ready' | 'failed';
  createdAt: string;
  sampleCount: number;
  quality: 'high' | 'medium' | 'low';
}

// Real-time Voice Interaction Types
export interface VoiceSessionConfig {
  mode: 'listen' | 'speak' | 'conversation';
  sttConfig: STTConfig;
  ttsConfig: TTSConfig;
  enableInterruption: boolean;
  silenceThreshold: number;
  maxDuration: number;
}

export interface VoiceSession {
  id: string;
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'ended';
  startTime: string;
  endTime?: string;
  transcripts: TranscriptionSegment[];
  audioUrl?: string;
  duration: number;
}

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: string;
  confidence?: number;
}

// Call Integration Types
export interface CallConfig {
  provider: 'twilio' | 'vonage' | 'signalwire';
  phoneNumber?: string;
  accountSid?: string;
  authToken?: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface CallSession {
  id: string;
  type: 'inbound' | 'outbound';
  from: string;
  to: string;
  status: 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer';
  startTime: string;
  endTime?: string;
  duration?: number;
  recording?: string;
  transcript?: string;
  summary?: string;
}

export interface SMSMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'failed';
  direction: 'inbound' | 'outbound';
}

export interface VoicemailMessage {
  id: string;
  from: string;
  timestamp: string;
  duration: number;
  audioUrl: string;
  transcript?: string;
  transcribed: boolean;
  listened: boolean;
}

// Voice Agent Types
export interface VoiceAgentConfig {
  enabled: boolean;
  autoAnswer: boolean;
  autoAnswerDelay: number;
  voiceProfile: string;
  responseStyle: 'concise' | 'detailed' | 'friendly' | 'professional';
  allowedContacts: string[];
  blockedContacts: string[];
  businessHours?: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  greetingMessage?: string;
  awayMessage?: string;
}

export interface VoiceAgentAction {
  id: string;
  type: 'call-answered' | 'call-declined' | 'message-sent' | 'voicemail-transcribed';
  callId?: string;
  contact: string;
  action: string;
  timestamp: string;
  confidence: number;
  transcript?: string;
  summary?: string;
  userApproved?: boolean;
}

// Audio Recording Types
export interface AudioRecording {
  id: string;
  uri: string;
  duration: number;
  format: 'mp3' | 'wav' | 'm4a';
  size: number;
  timestamp: string;
  transcribed: boolean;
  transcript?: string;
}

export interface RecordingConfig {
  format: 'mp3' | 'wav' | 'm4a';
  quality: 'low' | 'medium' | 'high';
  maxDuration: number;
  enableNoiseCancellation: boolean;
}

// Privacy & Consent Types
export interface VoiceConsent {
  voiceCloning: boolean;
  callRecording: boolean;
  transcriptStorage: boolean;
  voiceAsUser: boolean;
  dataRetentionDays: number;
  timestamp: string;
}

export interface VoicePrivacySettings {
  storeRecordings: boolean;
  storeTranscripts: boolean;
  retentionDays: number;
  shareWithThirdParty: boolean;
  anonymizeData: boolean;
}

// Analytics Types
export interface VoiceAnalytics {
  totalCalls: number;
  totalDuration: number;
  averageCallDuration: number;
  transcriptionAccuracy: number;
  voiceAgentSuccessRate: number;
  mostActiveHours: string[];
  topContacts: string[];
}
