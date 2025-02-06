# Medusa Mobile

![Medusa Mobile](https://i.imgur.com/LKvNyGX.png)

A modern e-commerce mobile application built with React Native and Medusa. This app provides a complete shopping experience with features like product browsing, cart management, user authentication, and order tracking.

## ✨ Features

- 🛍️ Product browsing with infinite scroll
- 👤 User authentication and profile management
- 🔍 Categories and collections
- 🛒 Cart management
- 🏃‍♂️ Guest checkout
- 📦 Order tracking
- 🎨 Beautiful UI with smooth animations
- 🌙 Dark/Light theme support
- 🎭 Multiple themes built-in
- 📱 Native performance with Reanimated

## 🎨 Themes
![Multiple themes](https://i.imgur.com/CfogW5z.png)

Fully customizable using the existing themes or create your own.

## 🛠️ Tech Stack

- React Native
- TypeScript
- Medusa JS
- React Query
- React Navigation
- NativeWind (TailwindCSS)
- React Native Reanimated

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v20 or newer)
- React Native development environment - [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)
- A running Medusa v2 backend server - [Medusa v2 installation](https://docs.medusajs.com/learn/installation)

## 🚀 Getting Started

### Step 1: Environment Setup

1. Clone the repository:
```bash
git clone git@github.com:bloomsynth/medusa-mobile-react-native.git medusa-mobile
cd medusa-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.template .env
```
Edit `.env` with your Medusa backend URL and publishable API key.

NOTE: Update the `MEDUSA_BACKEND_URL` in your `.env` file. If you set the URL as localhost, then the Android emulator will not be able to connect to the server. Use your local IP address instead. example: `http://192.168.1.100:9000` Run `ipconfig` to get your local IP address.

### Step 2: Start Metro Server

```bash
npm start
```

### Step 3: Run the Application

For Android:
```bash
npm run android
```

For iOS:
Install dependencies for iOS:
```bash
npx pod-install ios
```

Run the application:
```bash
npm run ios
```

## 📁 Project Structure

```
app/
├── screens/       # Screen components
├── components/    # Reusable UI components
├── data/          # Data context providers
├── styles/        # Theme and style utilities
├── utils/         # Helper functions
└── api/           # API client configuration
```

## 📍 Roadmap

Here are the planned features and improvements:

- 💳 Stripe integration for secure payments
- 🌍 Region selector for multi-region support
- 🎁 Gift card and coupon code support
- 🔄 Related products suggestions
- 🔍 Product search functionality
- 📦 cli-tool to generate a new project from this template
- 🎨 Advanced customization options
- 🔌 Plugins to extend the functionality of the app

## 🛡️ License

This project is licensed under the MIT License.

