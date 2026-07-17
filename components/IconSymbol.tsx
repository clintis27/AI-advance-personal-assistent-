// This file is a fallback for using MaterialIcons on Android and web.

import React from "react";
import { SymbolWeight } from "expo-symbols";
import {
  OpaqueColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.

  // Navigation & Home
  "house.fill": "home",
  "house": "cottage",
  "arrow.left": "arrow-back",
  "arrow.right": "arrow-forward",
  "arrow.up": "arrow-upward",
  "arrow.down": "arrow-downward",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "chevron.up": "keyboard-arrow-up",
  "chevron.down": "keyboard-arrow-down",
  "arrow.clockwise": "refresh",
  "arrow.counterclockwise": "refresh",

  // Communication & Social
  "paperplane.fill": "send",
  "paperplane": "outgoing-mail",
  "envelope.fill": "mail",
  "envelope": "mail-outline",
  "phone.fill": "phone",
  "phone": "phone-in-talk",
  "message.fill": "chat",
  "message": "chat-bubble-outline",
  "bell.fill": "notifications",
  "bell": "notifications-none",
  "heart.fill": "favorite",
  "heart": "favorite-border",

  // Actions & Controls
  "plus": "add",
  "minus": "remove",
  "xmark": "close",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "checkmark.circle": "check-circle-outline",
  "checkmark.square.fill": "check-box",
  "checkmark.square": "check-box-outline-blank",
  "multiply": "clear",
  "trash.fill": "delete",
  "trash": "delete-outline",

  // Editing & Creation
  "pencil": "edit",
  "pencil.and.list.clipboard": "edit-note",
  "square.and.pencil": "edit",
  "doc.text.fill": "description",
  "doc.text": "description",
  "folder.fill": "folder",
  "folder": "folder-open",
  "doc.fill": "insert-drive-file",
  "doc": "insert-drive-file",

  // Media & Content
  "photo.fill": "image",
  "photo": "image",
  "camera.fill": "camera-alt",
  "camera": "camera-alt",
  "video.fill": "videocam",
  "video": "videocam-off",
  "music.note": "music-note",
  "speaker.wave.2.fill": "volume-up",
  "speaker.slash.fill": "volume-off",
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "stop.fill": "stop",

  // System & Settings
  "gear": "settings",
  "gearshape.fill": "settings",
  "slider.horizontal.3": "tune",
  "info.circle.fill": "info",
  "info.circle": "info-outline",
  "exclamationmark.triangle.fill": "warning",
  "exclamationmark.triangle": "warning-amber",
  "questionmark.circle.fill": "help",
  "questionmark.circle": "help-outline",

  // Shapes & Symbols
  "square": "square",
  "square.grid.3x3": "apps",
  "circle": "circle",
  "triangle.fill": "change-history",
  "star.fill": "star",
  "star": "star-border",
  "bookmark.fill": "bookmark",
  "bookmark": "bookmark-border",

  // Technology & Code
  "chevron.left.forwardslash.chevron.right": "code",
  "qrcode.viewfinder": "qr-code",
  "wifi": "wifi",
  "antenna.radiowaves.left.and.right": "signal-cellular-alt",
  "battery.100": "battery-full",
  "battery.25": "battery-2-bar",
  "lock.fill": "lock",
  "lock.open.fill": "lock-open",

  // Shopping & Commerce
  "cart.fill": "shopping-cart",
  "cart": "add-shopping-cart",
  "creditcard.fill": "credit-card",
  "creditcard": "credit-card",
  "dollarsign.circle.fill": "monetization-on",
  "bag.fill": "shopping-bag",
  "bag": "shopping-bag",

  // Location & Maps
  "location.fill": "location-on",
  "location": "location-on",
  "map.fill": "map",
  "map": "map",
  "compass.drawing": "explore",

  // Time & Calendar
  "clock.fill": "access-time",
  "clock": "access-time",
  "calendar": "event",
  "timer": "timer",

  // User & Profile
  "person": "person",
  "person.fill": "person",
  "person.2.fill": "group",
  "person.2": "group",
  "person.circle.fill": "account-circle",
  "person.circle": "account-circle",
  "person.crop.circle.fill": "account-circle",
  "person.crop.circle": "account-circle",

  // Sharing & Export
  "square.and.arrow.up": "share",
  "square.and.arrow.down": "download",
  "arrow.up.doc.fill": "upload-file",
  "link": "link",

  // Search & Discovery
  "magnifyingglass": "search",
  "line.3.horizontal.decrease": "filter-list",
  "arrow.up.arrow.down": "sort",

  // Visibility & Display
  "eye": "visibility",
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
  "lightbulb.fill": "lightbulb",
  "moon.fill": "dark-mode",
  "sun.max.fill": "light-mode",

  // Travel & Places
  "airplane": "flight",
  "airplane.circle.fill": "flight",
  "airplane.departure": "flight-takeoff",
  "bed.double.fill": "bed",

  // Brands & Logos
  "apple.logo": "apple",
  "app.fill": "apps",
  "g.circle.fill": "g-translate",

  // Communication (extended)
  "at": "alternate-email",
  "envelope.badge.fill": "mark-email-unread",
  "bell.badge.fill": "notifications-active",
  "bubble.left.and.bubble.right.fill": "forum",
  "text.bubble.fill": "chat-bubble",
  "phone.badge.plus": "phone-forwarded",
  "phone.bubble.left.fill": "phone-callback",
  "person.wave.2": "waving-hand",
  "person.wave.2.fill": "waving-hand",

  // AI & Technology (extended)
  "brain": "psychology",
  "brain.head.profile": "psychology",
  "cpu": "memory",
  "cylinder.split.1x2.fill": "storage",
  "externaldrive.fill": "sd-storage",
  "mic": "mic-none",
  "mic.fill": "mic",
  "waveform": "graphic-eq",
  "waveform.badge.plus": "graphic-eq",
  "waveform.circle": "graphic-eq",
  "waveform.circle.fill": "graphic-eq",
  "speaker.wave.2": "volume-up",
  "speaker.wave.3": "volume-up",
  "speaker.wave.3.fill": "volume-up",
  "recordingtape": "voicemail",
  "wifi.slash": "wifi-off",
  "wand.and.stars": "auto-fix-high",
  "sparkles": "auto-awesome",

  // Actions & Controls (extended)
  "arrow.right.square.fill": "exit-to-app",
  "arrow.triangle.2.circlepath": "autorenew",
  "clock.arrow.circlepath": "history",
  "calendar.badge.clock": "event-note",
  "calendar.badge.plus": "post-add",
  "plus.circle.fill": "add-circle",
  "xmark.circle.fill": "cancel",
  "checkmark.seal.fill": "verified",
  "checkmark.shield.fill": "verified-user",
  "lock.shield.fill": "security",
  "key.fill": "vpn-key",
  "bolt.fill": "bolt",
  "target": "adjust",
  "hand.tap": "back-hand",
  "hand.thumbsup.fill": "thumb-up",
  "hand.thumbsdown.fill": "thumb-down",
  "leaf.fill": "eco",
  "globe": "public",
  "archivebox": "archive",
  "tray.fill": "inbox",
  "square.and.arrow.down.fill": "file-download",

  // Lists & Grids
  "line.3.horizontal.decrease.circle": "filter-list-alt",
  "link.circle.fill": "link",
  "list.bullet.circle.fill": "format-list-bulleted",
  "list.bullet.clipboard.fill": "assignment",
  "square.grid.2x2.fill": "grid-view",

  // People & Status
  "person.3.fill": "groups",
  "person.badge.clock.fill": "schedule",
  "person.badge.plus.fill": "person-add",
  "person.crop.circle.badge.checkmark": "account-circle",

  // Media (extended)
  "play.circle.fill": "play-circle-filled",
  "briefcase.fill": "work",
  "bell.slash.fill": "notifications-off",
  "cup.and.saucer.fill": "local-cafe",
  "doc.richtext.fill": "article",
  "list.bullet": "list",
  "chart.bar.fill": "bar-chart",
  "chart.line.uptrend.xyaxis": "trending-up",
  "gearshape": "settings",
} as Partial<
  Record<
    import("expo-symbols").SymbolViewProps["name"],
    React.ComponentProps<typeof MaterialIcons>["name"]
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style as StyleProp<TextStyle>}
    />
  );
}
