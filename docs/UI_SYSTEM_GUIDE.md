
# Modern UI System Guide

## Overview

This guide covers the modern, shadcn/ui-inspired component library built for your AI Personal Assistant app. The UI system is designed with React Native + Tailwind principles, featuring smooth Framer Motion-style animations and a clean, breathable design.

## Design Philosophy

### Core Principles

- **Clean & Minimal**: Inspired by shadcn/ui's aesthetic
- **Smooth Animations**: Framer Motion-style transitions using react-native-reanimated
- **Accessible**: High contrast colors and clear visual hierarchy
- **Responsive**: Works seamlessly across iOS, Android, and Web
- **Themeable**: Full dark mode support

### Color System

The color palette is defined in `styles/commonStyles.ts`:

**Primary Colors:**
- Primary: `#0ea5e9` (Sky Blue)
- Success: `#22c55e` (Green)
- Error: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)
- Info: `#3b82f6` (Blue)

**Accent Colors:**
- Violet: `#8b5cf6`
- Pink: `#ec4899`
- Emerald: `#10b981`
- Indigo: `#6366f1`
- Teal: `#14b8a6`
- Rose: `#f43f5e`

**Neutral Colors:**
- Background: `#ffffff` / `#0a0a0a` (dark)
- Card: `#ffffff` / `#0f0f0f` (dark)
- Text: `#09090b` / `#fafafa` (dark)
- Border: `#e4e4e7` / `#27272a` (dark)

## Components

### Button

A versatile button component with multiple variants and sizes.

**Variants:**
- `primary` - Main call-to-action button
- `secondary` - Secondary actions
- `outline` - Outlined button
- `ghost` - Transparent button
- `destructive` - Dangerous actions
- `link` - Link-style button

**Sizes:**
- `sm` - Small (10px vertical padding)
- `md` - Medium (14px vertical padding) - Default
- `lg` - Large (16px vertical padding)

**Props:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  haptic?: boolean; // Enable haptic feedback (default: true)
}
```

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" onPress={() => console.log('Pressed')}>
  Click Me
</Button>

<Button variant="outline" size="sm" loading={isLoading}>
  Loading...
</Button>
```

### Card

A container component with multiple variants and optional interactivity.

**Variants:**
- `default` - Standard card (24px padding)
- `compact` - Reduced padding (20px)
- `small` - Minimal padding (16px)
- `elevated` - Enhanced shadow

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'compact' | 'small' | 'elevated';
  interactive?: boolean; // Enable press animations
  onPress?: () => void;
  animated?: boolean; // Enable scale/opacity animations
}
```

**Usage:**
```tsx
import { Card } from '@/components/ui/Card';

<Card variant="compact">
  <Text>Card Content</Text>
</Card>

<Card interactive onPress={() => console.log('Card pressed')}>
  <Text>Interactive Card</Text>
</Card>
```

### AnimatedCard

A card with entrance animations.

**Animations:**
- `fadeInDown` - Fade in from top
- `fadeInUp` - Fade in from bottom
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `zoomIn` - Zoom in effect
- `slideInDown` / `slideInUp` / `slideInLeft` / `slideInRight` - Slide effects

**Props:**
```typescript
interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'compact' | 'small' | 'elevated';
  interactive?: boolean;
  onPress?: () => void;
  animation?: 'fadeInDown' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn' | 'slideInDown' | 'slideInUp' | 'slideInLeft' | 'slideInRight';
  delay?: number; // Animation delay in ms
  duration?: number; // Animation duration in ms
}
```

**Usage:**
```tsx
import { AnimatedCard } from '@/components/ui/AnimatedCard';

<AnimatedCard animation="fadeInDown" delay={100}>
  <Text>Animated Content</Text>
</AnimatedCard>

{items.map((item, index) => (
  <AnimatedCard
    key={item.id}
    animation="zoomIn"
    delay={index * 100}
    interactive
    onPress={() => handlePress(item)}
  >
    <Text>{item.title}</Text>
  </AnimatedCard>
))}
```

### Badge

A small label component for status indicators.

**Variants:**
- `default` - Neutral badge
- `primary` - Primary color
- `success` - Success state
- `warning` - Warning state
- `error` - Error state
- `info` - Information
- `outline` - Outlined badge

**Sizes:**
- `sm` - Small (8px horizontal padding)
- `md` - Medium (12px horizontal padding) - Default
- `lg` - Large (16px horizontal padding)

**Usage:**
```tsx
import { Badge } from '@/components/ui/Badge';

<Badge variant="success">Active</Badge>
<Badge variant="error" size="sm">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

### Input

A text input component with label, error, and helper text support.

**Props:**
```typescript
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Usage:**
```tsx
import { Input } from '@/components/ui/Input';
import { IconSymbol } from '@/components/IconSymbol';

<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  leftIcon={<IconSymbol name="envelope" size={20} color={colors.textMuted} />}
/>

<Input
  label="Password"
  placeholder="Enter password"
  secureTextEntry
  error="Password is required"
/>
```

### Switch

A toggle switch component with smooth animations.

**Sizes:**
- `sm` - Small (36x20)
- `md` - Medium (44x24) - Default
- `lg` - Large (56x32)

**Usage:**
```tsx
import { Switch } from '@/components/ui/Switch';

<Switch
  value={enabled}
  onValueChange={setEnabled}
/>

<Switch
  value={enabled}
  onValueChange={setEnabled}
  size="lg"
  disabled={isLoading}
/>
```

### Progress

A progress bar component with smooth animations.

**Props:**
```typescript
interface ProgressProps {
  value: number; // 0-100
  max?: number; // Default: 100
  height?: number; // Default: 8
  color?: string; // Custom color
  backgroundColor?: string; // Custom background
  style?: ViewStyle;
  animated?: boolean; // Default: true
}
```

**Usage:**
```tsx
import { Progress } from '@/components/ui/Progress';

<Progress value={75} />
<Progress value={50} color={colors.warning} height={12} />
<Progress value={progress} animated={false} />
```

### Separator

A divider component for visual separation.

**Props:**
```typescript
interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}
```

**Usage:**
```tsx
import { Separator } from '@/components/ui/Separator';

<Separator />
<Separator orientation="vertical" />
```

### Skeleton

A loading placeholder component with pulse animation.

**Usage:**
```tsx
import { Skeleton } from '@/components/ui/Skeleton';

<Skeleton width="60%" height={24} borderRadius={8} />
<Skeleton width="100%" height={16} />
<Skeleton width={200} height={200} borderRadius={16} />
```

## Animation Presets

Pre-configured spring animations in `styles/commonStyles.ts`:

```typescript
export const animationPresets = {
  spring: {
    damping: 25,
    stiffness: 150,
    mass: 0.8,
  },
  springBouncy: {
    damping: 15,
    stiffness: 200,
    mass: 1,
  },
  springSmooth: {
    damping: 30,
    stiffness: 120,
    mass: 0.6,
  },
  springGentle: {
    damping: 35,
    stiffness: 100,
    mass: 0.5,
  },
};
```

**Usage:**
```tsx
import { animationPresets } from '@/styles/commonStyles';
import { withSpring } from 'react-native-reanimated';

scale.value = withSpring(1, animationPresets.spring);
```

## Timing Presets

```typescript
export const timingPresets = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};
```

## Best Practices

### 1. Consistent Spacing

Use multiples of 4 or 8 for spacing:
- Small gaps: 8px, 12px
- Medium gaps: 16px, 20px, 24px
- Large gaps: 32px, 40px, 48px

### 2. Animation Guidelines

- Use `AnimatedCard` for list items with staggered delays
- Keep animation durations between 200-600ms
- Use spring animations for interactive elements
- Use timing animations for simple transitions

### 3. Color Usage

- Use primary color for main actions
- Use success/error/warning for status indicators
- Use muted colors for secondary information
- Maintain high contrast for accessibility

### 4. Component Composition

```tsx
// Good: Compose components for complex UIs
<AnimatedCard animation="fadeInDown" delay={100}>
  <View style={styles.header}>
    <Text style={styles.title}>Task Title</Text>
    <Badge variant="success">Complete</Badge>
  </View>
  <Separator />
  <Progress value={75} />
  <Button variant="primary" onPress={handleAction}>
    Take Action
  </Button>
</AnimatedCard>
```

### 5. Haptic Feedback

Enable haptic feedback for interactive elements:
```tsx
<Button haptic onPress={handlePress}>
  Press Me
</Button>
```

## Dark Mode Support

All components automatically adapt to dark mode using the `useTheme` hook from `@react-navigation/native`.

**Example:**
```tsx
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';

const theme = useTheme();
const textColor = theme.dark ? colors.textDark : colors.text;
```

## Performance Tips

1. **Use `animated={false}` for static cards** in long lists
2. **Memoize complex components** with `React.memo`
3. **Use `FlatList` for long lists** instead of mapping in ScrollView
4. **Limit simultaneous animations** to maintain 60fps
5. **Use `useCallback` for event handlers** to prevent re-renders

## Examples

See `app/(tabs)/ui-showcase.tsx` for a comprehensive showcase of all components.

## Tech Stack Integration

This UI system integrates with your PVA+ tech stack:

- **Frontend**: React Native + Modern UI Components
- **Animations**: react-native-reanimated (Framer Motion-style)
- **Styling**: Inspired by shadcn/ui + Tailwind principles
- **Haptics**: expo-haptics for tactile feedback
- **Icons**: expo-symbols for SF Symbols
- **Theme**: @react-navigation/native for dark mode

## Future Enhancements

Planned additions:
- [ ] Toast notifications
- [ ] Modal/Dialog components
- [ ] Dropdown/Select components
- [ ] Tabs component
- [ ] Accordion component
- [ ] Tooltip component
- [ ] Date picker
- [ ] Bottom sheet
