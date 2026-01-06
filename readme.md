#📝 Taskify

Taskify is a premium, high-performance task management mobile application built with React Native and Expo. It features a modern Glass-Skeuomorphic UI, real-time task tracking, and a secure authentication system.✨ FeaturesPremium UI/UX: Glassmorphic design with smooth gradients and intuitive navigation.Smart Dashboard: Visual progress tracking with dynamic daily stats.Authentication: Secure Login and Registration system using JWT and Expo SecureStore.Dynamic Calendar: Horizontal scrollable date picker for efficient task planning.Cross-Platform: Optimized for both Android and iOS devices.🛠️ Tech StackFrontend: React Native (Expo)Navigation: React Navigation (Stack)Storage: Expo SecureStore (for sensitive user tokens)Styling: Expo Linear Gradient & Native StyleSheetBackend: Node.js / Express (Hosted on Render)🚀 Getting StartedPrerequisitesNode.js (v16 or newer)Expo Go app on your physical deviceEAS CLI (for building APKs)Installation
#Clone the repository 
 git clone https://github.com/yourtext/taskify.git
  cd taskify
#Install dependencies
 npm install
Configure API URLOpen src/config/index.js and update the API_URL to your live backend:JavaScriptexport const API_URL = "https://your-api-link.render.com";
Start the app npx expo start
Scan the QR code with your Expo Go app to preview.📦 Building for ProductionTo generate a shareable Android APK, use Expo Application Services (EAS):Basheas build -p android --profile preview
📂 Project StructurePlaintextsrc/
├── api/          # Fetch/Axios API logic
├── components/   # Reusable UI components (TaskCards, Inputs)
├── config/       # Global configuration (API URLs)
├── navigation/   # Stack & Tab navigators
├── screens/      # Main Application screens
└── theme/        # Global color palettes and fonts
