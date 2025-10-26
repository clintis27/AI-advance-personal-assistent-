
# Digital Body Language Engine - Complete Guide

## Overview

The **Digital Body Language (DBL) Engine** is a sophisticated behavioral intelligence system that interprets user's digital behavioral signals to infer their current state and trigger appropriate assistant actions. This module is the core of the Personal Virtual Assistant's ability to understand and adapt to user needs proactively.

---

## 1. Input Streams

The DBL Engine ingests data from multiple streams to build a comprehensive understanding of user behavior.

### 1.1 Calendar Events
- **Type**: `calendar_event`
- **Sampling Frequency**: Real-time, on event change
- **Privacy Constraints**: User consent required; anonymize event details where possible
- **Data Points**:
  - Event start/end times
  - Meeting duration
  - Attendee count
  - Event updates

### 1.2 Email Response Latency
- **Type**: `email_response_latency`
- **Sampling Frequency**: Continuous, calculate average latency per hour
- **Privacy Constraints**: Only track latency, not content; aggregate data to preserve privacy
- **Data Points**:
  - Time to respond to emails
  - Email priority level
  - Response patterns

### 1.3 Microphone Audio Tone
- **Type**: `microphone_audio_tone`
- **Sampling Frequency**: Intermittent, during active app usage or voice commands
- **Privacy Constraints**: User consent required; process audio locally; delete audio data immediately after analysis
- **Data Points**:
  - Frequency and pitch
  - Speech intensity
  - Frustration score (0-100)
  - Speech rate
  - Pause frequency

### 1.4 Device Unlock Time
- **Type**: `device_unlock`
- **Sampling Frequency**: On event change
- **Privacy Constraints**: No personal info, just unlock/lock timestamps
- **Data Points**:
  - Unlock/lock events
  - Session duration
  - Unlock method (biometric, PIN, pattern)

### 1.5 App Usage Switch
- **Type**: `app_usage_switch`
- **Sampling Frequency**: On event change
- **Privacy Constraints**: User consent required; limit tracking to relevant app categories
- **Data Points**:
  - App foreground/background events
  - App category (productivity, communication, entertainment)
  - Time spent in each app
  - App switching frequency

---

## 2. Feature Engineering

The DBL Engine extracts meaningful features from raw input streams.

### 2.1 Calendar Features
- **Time Since Last Meeting**: Minutes elapsed since last calendar event ended
- **Upcoming Meeting Count**: Number of meetings scheduled in the next 4 hours
- **Average Meeting Duration**: Average length of meetings
- **Meeting Density**: Meetings per hour ratio

### 2.2 Email Features
- **Average Email Latency (Last Hour)**: Mean response time in seconds
- **Latency Change from Baseline**: Percentage change from user's typical response time
- **Email Velocity**: Number of emails sent/received per hour

### 2.3 Audio Features
- **Frustration Score**: 0-100 score derived from voice tone analysis
- **Speech Rate**: Words per minute
- **Pause Frequency**: Number of pauses per minute

### 2.4 Device Features
- **Unlock Frequency**: Number of device unlocks per hour
- **Time Since Last Unlock**: Minutes since last device unlock
- **Average Session Duration**: Mean time between unlock and lock

### 2.5 App Usage Features
- **Productivity App Time**: Minutes spent in productivity apps in last hour
- **App Switch Frequency**: Number of app switches per hour
- **Focus Score**: 0-100 score based on app switching patterns (lower switching = higher focus)

### 2.6 Derived Features
- **Contextual Busyness**: 0-100 composite score of calendar density and email velocity
- **Cognitive Load**: 0-100 score indicating mental workload
- **Interruptibility**: 0-100 score indicating how receptive user is to interruptions

---

## 3. State Space

The DBL Engine recognizes 9 distinct user states:

### 3.1 Idle
- **Description**: User is not actively engaged with devices or tasks
- **Indicators**: Low device activity, no recent meetings, minimal app usage
- **Typical Duration**: 30+ minutes
- **Interruptibility**: High
- **Color**: Gray (#71717a)
- **Icon**: moon.fill

### 3.2 Focus-Deep
- **Description**: User is deeply focused on a single task with minimal interruptions
- **Indicators**: Single app focus, no app switching, DND enabled, long session
- **Typical Duration**: 60-120 minutes
- **Interruptibility**: Low
- **Color**: Violet (#8b5cf6)
- **Icon**: brain

### 3.3 Focus-Shallow
- **Description**: User is working but easily distracted or multitasking
- **Indicators**: Moderate app switching, quick responses, short sessions
- **Typical Duration**: 20-45 minutes
- **Interruptibility**: Medium
- **Color**: Blue (#3b82f6)
- **Icon**: target

### 3.4 Travelling
- **Description**: User is in transit or moving between locations
- **Indicators**: Location changes, travel apps active, sporadic connectivity
- **Typical Duration**: 30-180 minutes
- **Interruptibility**: Medium
- **Color**: Sky Blue (#0ea5e9)
- **Icon**: airplane

### 3.5 InCall
- **Description**: User is on a phone call or video conference
- **Indicators**: Call app active, microphone in use, no other app activity
- **Typical Duration**: 15-60 minutes
- **Interruptibility**: Low
- **Color**: Green (#22c55e)
- **Icon**: phone.fill

### 3.6 InMeeting
- **Description**: User is in a scheduled meeting
- **Indicators**: Calendar event active, meeting app open, multiple attendees
- **Typical Duration**: 30-60 minutes
- **Interruptibility**: Low
- **Color**: Amber (#f59e0b)
- **Icon**: person.3.fill

### 3.7 Overloaded
- **Description**: User is stressed and overwhelmed with high cognitive load
- **Indicators**: High email velocity, back-to-back meetings, elevated frustration
- **Typical Duration**: 60-240 minutes
- **Interruptibility**: Low
- **Color**: Red (#ef4444)
- **Icon**: exclamationmark.triangle.fill

### 3.8 ReadyForBooking
- **Description**: User is likely planning a trip or activity
- **Indicators**: Travel searches, calendar gaps, booking app usage
- **Typical Duration**: 15-45 minutes
- **Interruptibility**: High
- **Color**: Teal (#14b8a6)
- **Icon**: calendar.badge.plus

### 3.9 Available
- **Description**: User is available and responsive
- **Indicators**: Quick responses, active communication, normal activity
- **Typical Duration**: 30-120 minutes
- **Interruptibility**: High
- **Color**: Emerald (#10b981)
- **Icon**: checkmark.circle.fill

---

## 4. Inference Engine / Scoring

The DBL Engine uses a **hybrid ensemble approach** combining multiple ML techniques.

### 4.1 Model Architecture
- **Primary Model**: Ensemble combining:
  - Logistic Regression (for linear relationships)
  - Decision Trees (for rule-based patterns)
  - Neural Network (for complex patterns)
  - Rule-Based System (for explicit conditions)

### 4.2 Scoring Algorithm

For each state, the engine computes a probability score (0-1) based on feature values:

```typescript
// Example: Focus-Deep scoring
function scoreFocusDeep(features: ExtractedFeatures): number {
  let score = 0;
  if (features.focusScore > 80) score += 0.4;
  if (features.appSwitchFrequency < 3) score += 0.3;
  if (features.interruptibility < 30) score += 0.3;
  return score;
}
```

### 4.3 Probability Vector
The engine computes a probability distribution across all states:
```typescript
{
  'Focus-Deep': 0.65,
  'Focus-Shallow': 0.20,
  'Available': 0.10,
  'Overloaded': 0.03,
  'Idle': 0.02,
  // ... other states
}
```

### 4.4 State Transition Rules
- **Confidence Threshold**: 70% minimum to trigger state change
- **Transition Cooldown**: 5 minutes between state changes (prevents rapid oscillation)
- **Weighted Features**: Different features have different importance weights:
  - Calendar: 25%
  - Email: 20%
  - Audio: 15%
  - Device: 20%
  - App Usage: 20%

---

## 5. Action Mapping

Actions are mapped to states and autonomy levels.

### 5.1 Autonomy Levels

#### Suggest-Only
- **Description**: Assistant suggests actions but requires user approval
- **Use Case**: Low-risk suggestions, learning phase
- **Example**: "Would you like me to enable Do Not Disturb?"

#### Semi-Autonomous
- **Description**: Assistant executes low-impact actions automatically, suggests high-impact ones
- **Use Case**: Balanced automation with user oversight
- **Example**: Automatically postpone notifications, suggest calendar blocking

#### Fully-Autonomous
- **Description**: Assistant executes all actions automatically within configured limits
- **Use Case**: Maximum automation for experienced users
- **Example**: Auto-reply to emails, block calendar, reschedule meetings

### 5.2 State-Action Mappings

#### Overloaded State
**Suggest-Only**:
- Suggest taking a 15-minute break
- Suggest postponing non-urgent notifications

**Semi-Autonomous**:
- Postpone non-urgent notifications for 1 hour
- Summarize upcoming meeting updates

**Fully-Autonomous**:
- Automatically postpone all non-urgent notifications
- Send auto-reply to non-urgent emails
- Block next available slot for focus time

#### Focus-Deep State
**Suggest-Only**:
- Suggest enabling Do Not Disturb

**Semi-Autonomous**:
- Enable Do Not Disturb mode

**Fully-Autonomous**:
- Automatically enable Do Not Disturb
- Postpone all notifications until focus session ends

#### InMeeting State
**Suggest-Only**:
- Suggest preparing meeting briefing

**Semi-Autonomous**:
- Prepare meeting briefing automatically

**Fully-Autonomous**:
- Auto-prepare and display meeting briefing
- Send status update to team

#### ReadyForBooking State
**Suggest-Only**:
- Suggest travel booking options

**Semi-Autonomous**:
- Search and present booking options

**Fully-Autonomous**:
- Auto-book based on preferences (requires 90% confidence)

---

## 6. Feedback & Learning Loop

The DBL Engine continuously learns from user feedback.

### 6.1 Feedback Types
- **Approve**: User confirms action was correct
- **Reject**: User disagrees with action
- **Modify**: User adjusts action parameters
- **Undo**: User reverses executed action

### 6.2 Learning Process

1. **Feedback Collection**: User provides feedback on executed actions
2. **Weight Adjustment**: Model weights are adjusted based on feedback sentiment
3. **Threshold Tuning**: Confidence thresholds are refined
4. **Rule Updates**: New transition rules are added or modified
5. **Performance Tracking**: Accuracy metrics are updated

### 6.3 Adaptive Weights

The system maintains user-specific weights that evolve over time:

```typescript
interface AdaptiveWeights {
  userId: string;
  weights: {
    calendar: number;
    email: number;
    audio: number;
    device: number;
    appUsage: number;
  };
  thresholds: Record<UserState, number>;
  lastUpdated: string;
  trainingDataPoints: number;
  accuracy: number;
}
```

### 6.4 Performance Metrics
- **Accuracy**: Percentage of correct state predictions
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1 Score**: Harmonic mean of precision and recall

---

## 7. Privacy & Transparency

### 7.1 Data Handling
- **Encryption**: All behavioral data encrypted at rest and in transit
- **Processing Location**: Local processing by default, optional cloud sync
- **Anonymization**: Personal identifiers removed from analytics
- **Data Retention**: Configurable retention periods (default: 30 days for activities, 7 days for moods)

### 7.2 User Consent
- **Per-Stream Consent**: Users grant consent for each input stream individually
- **Granular Control**: Users can enable/disable specific features
- **Consent Expiration**: Consent can be time-limited
- **Easy Revocation**: One-tap consent withdrawal

### 7.3 Transparency Features
- **Data Inspection**: Users can view all collected behavioral data
- **Audit Log**: Complete history of data collection and processing
- **Action History**: Full record of all executed actions
- **Undo Capability**: Reversible actions can be undone

### 7.4 Compliance
- **GDPR Compliant**: Right to access, rectify, and delete data
- **CCPA Compliant**: Opt-out of data sale, data portability
- **Data Export**: Users can export all their data in JSON format
- **Data Deletion**: Complete data deletion on request

---

## 8. Example Scenarios

### Scenario 1: Overloaded User

**Input Streams**:
- Calendar: 5 back-to-back meetings in last 3 hours
- Email: 15 emails received in last hour, average response latency increased by 200%
- Audio: Frustration score of 75
- Device: 25 unlocks in last hour
- App: Switching between email, calendar, and messaging apps every 2 minutes

**Extracted Features**:
- `meetingDensity`: 1.67 (high)
- `emailVelocity`: 15 (high)
- `frustrationScore`: 75 (high)
- `cognitiveLoad`: 85 (very high)
- `focusScore`: 25 (low)

**Inferred State**: **Overloaded** (confidence: 92%)

**Assistant Actions** (Semi-Autonomous):
1. Postpone non-urgent notifications for 1 hour
2. Summarize upcoming meeting updates
3. Suggest taking a 15-minute break

**User Feedback**: User approves notification postponement, takes suggested break

**Learning Update**: Increase weight for `frustrationScore` in Overloaded state detection

---

### Scenario 2: Deep Focus Session

**Input Streams**:
- Calendar: No meetings for next 2 hours
- Email: No emails sent/received in last 30 minutes
- Device: 2 unlocks in last hour
- App: Single productivity app (code editor) active for 45 minutes, no switches

**Extracted Features**:
- `focusScore`: 95 (very high)
- `appSwitchFrequency`: 0 (none)
- `interruptibility`: 15 (very low)
- `productivityAppTime`: 45 (high)

**Inferred State**: **Focus-Deep** (confidence: 88%)

**Assistant Actions** (Fully-Autonomous):
1. Automatically enable Do Not Disturb
2. Postpone all notifications until focus session ends
3. Block calendar for next 30 minutes

**User Feedback**: No feedback (implicit approval)

**Learning Update**: Maintain current weights, increase confidence threshold slightly

---

### Scenario 3: Travel Planning

**Input Streams**:
- Calendar: Gap in calendar next week (5 consecutive days)
- App: Travel booking app active for 20 minutes
- Device: Frequent unlocks to check different travel options

**Extracted Features**:
- `upcomingMeetingCount`: 0 (for next week)
- `appCategory`: 'travel' (active)
- `contextualBusyness`: 30 (low)

**Inferred State**: **ReadyForBooking** (confidence: 78%)

**Assistant Actions** (Suggest-Only):
1. Suggest travel booking options based on calendar gap
2. Offer to search for flights and hotels

**User Feedback**: User approves and provides destination preferences

**Learning Update**: Increase confidence in ReadyForBooking detection when travel apps are active

---

## 9. Implementation Details

### 9.1 Core Classes

#### `FeatureExtractor`
Extracts features from input streams.

```typescript
class FeatureExtractor {
  static async extractFeatures(
    streams: InputStreamData[],
    historicalData?: any
  ): Promise<ExtractedFeatures>
}
```

#### `InferenceEngine`
Infers user state from features.

```typescript
class InferenceEngine {
  static async inferState(
    features: ExtractedFeatures
  ): Promise<StateInference>
  
  static async getCurrentState(): Promise<StateInference | null>
  
  static async getStateHistory(): Promise<StateInference[]>
}
```

#### `ActionExecutor`
Executes assistant actions.

```typescript
class ActionExecutor {
  static getActionsForState(
    state: UserState,
    autonomyLevel: AutonomyLevel
  ): AssistantAction[]
  
  static async executeAction(
    action: AssistantAction,
    state: UserState,
    autonomyLevel: AutonomyLevel
  ): Promise<ExecutedAction>
}
```

#### `FeedbackLearner`
Handles user feedback and learning.

```typescript
class FeedbackLearner {
  static async recordFeedback(
    feedback: UserFeedback
  ): Promise<void>
  
  static async getAllFeedback(): Promise<UserFeedback[]>
}
```

#### `DBLDashboard`
Provides dashboard data.

```typescript
class DBLDashboard {
  static async getDashboardData(): Promise<DBLDashboardData>
}
```

### 9.2 Data Storage

All data is stored securely using `expo-secure-store`:

- `dbl_current_state`: Current state inference
- `dbl_state_history`: Historical state inferences (last 100)
- `dbl_features`: Extracted features
- `dbl_actions`: Executed actions (last 50)
- `dbl_feedback`: User feedback (last 100)
- `dbl_adaptive_weights`: User-specific model weights
- `dbl_transitions`: State transition history

### 9.3 Performance Optimization

- **Batch Processing**: Features extracted in batches every 5 minutes
- **Caching**: Recent inferences cached for 1 minute
- **Lazy Loading**: Historical data loaded on demand
- **Data Compression**: Old data compressed to reduce storage

---

## 10. Future Enhancements

### 10.1 Advanced Features
- **Voice Tone Analysis**: Real-time emotion detection from voice
- **Biometric Integration**: Heart rate, stress levels from wearables
- **Cross-Device Sync**: Unified state across multiple devices
- **Team Insights**: Aggregate team behavioral patterns
- **Predictive Scheduling**: AI-powered calendar optimization

### 10.2 ML Improvements
- **Deep Learning Models**: LSTM networks for temporal patterns
- **Transfer Learning**: Pre-trained models for faster adaptation
- **Federated Learning**: Privacy-preserving collaborative learning
- **Explainable AI**: Detailed explanations for state inferences

### 10.3 Integration Enhancements
- **Calendar Integration**: Direct integration with Google Calendar, Outlook
- **Email Integration**: Gmail, Outlook email analysis
- **Slack Integration**: Team communication patterns
- **Zoom Integration**: Meeting participation analysis

---

## 11. Troubleshooting

### Common Issues

#### Low Confidence Scores
- **Cause**: Insufficient training data
- **Solution**: Use system for 1-2 weeks to build behavioral baseline

#### Incorrect State Detection
- **Cause**: Unusual behavior patterns
- **Solution**: Provide feedback to help system learn

#### Actions Not Executing
- **Cause**: Autonomy level too restrictive
- **Solution**: Adjust autonomy level in settings

#### High Battery Usage
- **Cause**: Frequent state updates
- **Solution**: Increase update interval in settings

---

## 12. Best Practices

1. **Start with Suggest-Only**: Begin with lowest autonomy level and gradually increase
2. **Provide Feedback**: Regularly approve/reject actions to improve accuracy
3. **Review Privacy Settings**: Ensure you're comfortable with data collection
4. **Monitor Performance**: Check accuracy metrics weekly
5. **Adjust Weights**: Fine-tune feature weights based on your workflow
6. **Set Boundaries**: Configure quiet hours and do-not-disturb periods
7. **Regular Audits**: Review action history monthly

---

## 13. API Reference

See `types/digital-body-language.ts` for complete type definitions.

### Key Types

- `InputStreamData`: Raw input stream data
- `ExtractedFeatures`: Engineered features
- `StateInference`: State prediction with confidence
- `AssistantAction`: Action definition
- `ExecutedAction`: Action execution record
- `UserFeedback`: User feedback record
- `AutonomyLevel`: Autonomy configuration

---

## Conclusion

The Digital Body Language Engine represents a significant advancement in personal assistant technology, enabling truly adaptive and context-aware automation. By continuously learning from user behavior and feedback, it becomes increasingly accurate and helpful over time.

For questions or support, please refer to the main documentation or contact support.
