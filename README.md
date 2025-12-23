# screen-flow 🧭

> **Navigation intelligence, not just analytics.** One-stop, platform-agnostic tracker for React and React Native.

[![license](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/your-username/screen-flow/blob/main/LICENSE)
[![size](https://img.shields.io/bundlephobia/minzip/screen-flow)](https://bundlephobia.com/package/screen-flow)
[![tests](https://img.shields.io/badge/tests-90%25%2B-brightgreen)](https://github.com/your-username/screen-flow)

---

## 🚀 Why ScreenFlow?

In a world of bloated analytics SDKs (Segment, Firebase, Mixpanel), **ScreenFlow** is the minimalist's choice.

- **⚡ Zero Bloat:** Only a few KB. Won't slow down your app or increase your bundle size like 2MB+ commercial SDKs.
- **🛡️ Privacy First:** No data ever leaves the device unless *you* want it to. Total control over your user's privacy.
- **📱 True Cross-Platform:** Write once, track everywhere. Same API for Web and React Native with automatic lifecycle detection.
- **🧠 More than Counters:** Automatically tracks **duration**, maintains **history**, and detects **back-navigation** using smart algorithms.
- **💾 Persistence Ready:** Unlike other lightweight trackers, ScreenFlow can persist data across app restarts.
- **🧪 100% Transparent:** Open-source and fully covered by unit tests. No "black-box" tracking.

---

## ✨ Features

- 🔄 **Flow Tracking**: Keeps track of the last 30 screens visited.
- ⏱️ **Time Awareness**: Automatically tracks time spent on each screen.
- 🔙 **Smart Back Detection**: Detects back navigation even across multiple screens.
- ⏸️ **Smart Pausing**: Pauses timers when the app is in background.
- ⚛️ **React Ready**: Comes with first-class hooks like `useScreenFlow`.
- 🔌 **Adapter Pattern**: Send data to Console, Firestore, Segment, or your own API.

---

## 🚀 Installation

```bash
npm install screen-flow
```

---

## ⚙️ Quick Start

### 1. Initialize (Optional but recommended)

Setup your storage and output adapter.

```typescript
import { initScreenFlow, ConsoleAdapter } from 'screen-flow';

initScreenFlow({
  adapter: new ConsoleAdapter(),
  // Persistence for Web (localStorage) or React Native (AsyncStorage)
  storage: localStorage, 
  sessionTimeout: 30 * 60 * 1000 // 30 mins
});
```

### 2. Track Screens

#### ⚛️ Functional Components (React)

```tsx
import { useScreenFlow } from 'screen-flow';

const Dashboard = () => {
  useScreenFlow('Dashboard', { tab: 'overview' });
  return <div>My Dashboard</div>;
};
```

#### 🖱️ Manual Tracking

```typescript
import { onScreenChange } from 'screen-flow';

// Anywhere in your logic
await onScreenChange('Settings');
```

---

## 🔌 Customizing Output (Adapters)

Connect ScreenFlow to any service in seconds.

```typescript
import { Adapter, ScreenEvent } from 'screen-flow';

class MyBrandAdapter implements Adapter {
  onEvent(event: ScreenEvent) {
    console.log(`User stayed on ${event.previousScreen} for ${event.duration}ms`);
    // Send to your own server
    myApi.log(event);
  }
}
```

---

## 📄 Screen Event Data Structure

| Property | Type | Description |
| :--- | :--- | :--- |
| `screen` | `string` | Current screen name |
| `previousScreen` | `string \| null` | Name of the last screen |
| `duration` | `number` | Time spent on the last screen (ms) |
| `flow` | `string[]` | Last 30 screens visited |
| `isBack` | `boolean` | True if this move was a "Back" navigation |
| `sessionId` | `string` | Unique, persistent session ID |
| `params` | `object` | Custom metadata provided by you |

---

## 💖 Support

If ScreenFlow saved you hours of work or helped you build a faster app, consider supporting the development!

<a href="https://www.buymeacoffee.com/Mansikansagara9" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 30% !important;width: 30% !important;" ></a>

---

## 🛡️ License

ISC (Free and Open Source)
