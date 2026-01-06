# 📝 Taskify

Taskify is a premium, high-performance task management mobile application built with **React Native** and **Expo**. It features a modern Glass-Skeuomorphic UI, real-time task tracking, and a secure authentication system.

---

## ✨ Features

* **Premium UI/UX:** Glassmorphic design with smooth gradients and intuitive navigation.
* **Smart Dashboard:** Visual progress tracking with dynamic daily stats.
* **Authentication:** Secure Login and Registration system using JWT and Expo SecureStore.
* **Dynamic Calendar:** Horizontal scrollable date picker for efficient task planning.
* **Cross-Platform:** Highly optimized for both Android and iOS devices.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React Native (Expo) |
| **Navigation** | React Navigation (Stack) |
| **Storage** | Expo SecureStore (for sensitive user tokens) |
| **Styling** | Expo Linear Gradient & Native StyleSheet |
| **Backend** | Node.js / Express (Hosted on Render) |

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v16 or newer)
* **Expo Go** app on your physical device
* **EAS CLI** (for building APKs)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/taskify.git](https://github.com/yourusername/taskify.git)
    cd taskify
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API URL:**
    Open `src/config/index.js` and update the `API_URL` to your live backend:
    ```javascript
    export const API_URL = "[https://your-api-link.render.com](https://your-api-link.render.com)";
    ```

4.  **Start the app:**
    ```bash
    npx expo start
    ```
    *Scan the QR code with your **Expo Go** app to preview.*

---

## 📦 Building for Production

To generate a shareable Android APK using Expo Application Services (EAS):

```bash
eas build -p android --profile preview