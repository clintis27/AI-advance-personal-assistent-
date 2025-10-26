
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { Card } from '@/components/ui/Card';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Separator } from '@/components/ui/Separator';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { IconSymbol } from '@/components/IconSymbol';

export default function UIShowcaseScreen() {
  const theme = useTheme();
  const [switchValue, setSwitchValue] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleButtonPress = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'UI Components',
          headerStyle: {
            backgroundColor: theme.dark ? colors.backgroundDark : colors.background,
          },
          headerTintColor: theme.dark ? colors.textDark : colors.text,
        }}
      />
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme.dark ? colors.backgroundDark : colors.background },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Buttons Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Buttons
          </Text>
          <View style={styles.buttonGroup}>
            <Button variant="primary" onPress={handleButtonPress} loading={loading}>
              Primary Button
            </Button>
            <Button variant="secondary" onPress={() => console.log('Secondary pressed')}>
              Secondary Button
            </Button>
            <Button variant="outline" onPress={() => console.log('Outline pressed')}>
              Outline Button
            </Button>
            <Button variant="ghost" onPress={() => console.log('Ghost pressed')}>
              Ghost Button
            </Button>
            <Button variant="destructive" onPress={() => console.log('Destructive pressed')}>
              Destructive Button
            </Button>
            <Button variant="link" onPress={() => console.log('Link pressed')}>
              Link Button
            </Button>
          </View>
        </View>

        <Separator />

        {/* Button Sizes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Button Sizes
          </Text>
          <View style={styles.buttonGroup}>
            <Button variant="primary" size="sm">
              Small Button
            </Button>
            <Button variant="primary" size="md">
              Medium Button
            </Button>
            <Button variant="primary" size="lg">
              Large Button
            </Button>
          </View>
        </View>

        <Separator />

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Badges
          </Text>
          <View style={styles.badgeGroup}>
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </View>
        </View>

        <Separator />

        {/* Badge Sizes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Badge Sizes
          </Text>
          <View style={styles.badgeGroup}>
            <Badge variant="primary" size="sm">Small</Badge>
            <Badge variant="primary" size="md">Medium</Badge>
            <Badge variant="primary" size="lg">Large</Badge>
          </View>
        </View>

        <Separator />

        {/* Cards Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Cards
          </Text>
          <Card variant="default">
            <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Default Card
            </Text>
            <Text style={[styles.cardText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              This is a default card with standard padding and styling.
            </Text>
          </Card>
          <Card variant="compact">
            <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Compact Card
            </Text>
            <Text style={[styles.cardText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              This is a compact card with reduced padding.
            </Text>
          </Card>
          <Card variant="small">
            <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Small Card
            </Text>
            <Text style={[styles.cardText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              This is a small card with minimal padding.
            </Text>
          </Card>
          <Card variant="elevated">
            <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Elevated Card
            </Text>
            <Text style={[styles.cardText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              This is an elevated card with enhanced shadow.
            </Text>
          </Card>
        </View>

        <Separator />

        {/* Interactive Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Interactive Cards
          </Text>
          <Card
            variant="compact"
            interactive
            onPress={() => console.log('Card pressed')}
          >
            <View style={styles.interactiveCardContent}>
              <IconSymbol name="hand.tap" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
                Tap Me!
              </Text>
              <Text style={[styles.cardText, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
                This card has interactive animations
              </Text>
            </View>
          </Card>
        </View>

        <Separator />

        {/* Animated Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Animated Cards
          </Text>
          <AnimatedCard animation="fadeInDown" delay={0}>
            <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Fade In Down
            </Text>
          </AnimatedCard>
          <AnimatedCard animation="fadeInUp" delay={100}>
            <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Fade In Up
            </Text>
          </AnimatedCard>
          <AnimatedCard animation="fadeInLeft" delay={200}>
            <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Fade In Left
            </Text>
          </AnimatedCard>
          <AnimatedCard animation="fadeInRight" delay={300}>
            <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Fade In Right
            </Text>
          </AnimatedCard>
          <AnimatedCard animation="zoomIn" delay={400}>
            <Text style={[styles.cardTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
              Zoom In
            </Text>
          </AnimatedCard>
        </View>

        <Separator />

        {/* Inputs Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Inputs
          </Text>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={inputValue}
            onChangeText={setInputValue}
            leftIcon={<IconSymbol name="envelope" size={20} color={colors.textMuted} />}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            rightIcon={<IconSymbol name="eye" size={20} color={colors.textMuted} />}
          />
          <Input
            label="With Error"
            placeholder="This field has an error"
            error="This field is required"
          />
          <Input
            label="With Helper Text"
            placeholder="Enter something"
            helperText="This is helper text to guide you"
          />
        </View>

        <Separator />

        {/* Switches Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Switches
          </Text>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: theme.dark ? colors.textDark : colors.text }]}>
              Enable Notifications
            </Text>
            <Switch value={switchValue} onValueChange={setSwitchValue} />
          </View>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: theme.dark ? colors.textDark : colors.text }]}>
              Small Switch
            </Text>
            <Switch value={switchValue} onValueChange={setSwitchValue} size="sm" />
          </View>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: theme.dark ? colors.textDark : colors.text }]}>
              Large Switch
            </Text>
            <Switch value={switchValue} onValueChange={setSwitchValue} size="lg" />
          </View>
        </View>

        <Separator />

        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Progress Bars
          </Text>
          <View style={styles.progressGroup}>
            <Text style={[styles.progressLabel, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              25% Complete
            </Text>
            <Progress value={25} />
          </View>
          <View style={styles.progressGroup}>
            <Text style={[styles.progressLabel, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              50% Complete
            </Text>
            <Progress value={50} color={colors.warning} />
          </View>
          <View style={styles.progressGroup}>
            <Text style={[styles.progressLabel, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              75% Complete
            </Text>
            <Progress value={75} color={colors.success} />
          </View>
          <View style={styles.progressGroup}>
            <Text style={[styles.progressLabel, { color: theme.dark ? colors.textSecondaryDark : colors.textSecondary }]}>
              100% Complete
            </Text>
            <Progress value={100} color={colors.emerald} />
          </View>
        </View>

        <Separator />

        {/* Skeletons Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.dark ? colors.textDark : colors.text }]}>
            Skeleton Loaders
          </Text>
          <Card variant="compact">
            <Skeleton width="60%" height={24} borderRadius={8} style={{ marginBottom: 12 }} />
            <Skeleton width="100%" height={16} borderRadius={6} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={16} borderRadius={6} style={{ marginBottom: 8 }} />
            <Skeleton width="90%" height={16} borderRadius={6} />
          </Card>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  buttonGroup: {
    gap: 12,
  },
  badgeGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  interactiveCardContent: {
    alignItems: 'center',
    gap: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  progressGroup: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
});
