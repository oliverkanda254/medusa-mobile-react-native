# Medusa Mobile

![Medusa Mobile](https://i.imgur.com/mCnY05s.png)

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
![Multiple themes](https://i.imgur.com/P5D5m1u.png)

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
- React Native development environment set up
- A running Medusa backend server
- iOS/Android development tools installed

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
Edit `.env` with your Medusa backend URL and publishable key.

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

Work in progress. Minor setup to be done.

## 📁 Project Structure

```
app/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── data/          # Context providers and data management
├── styles/        # Theme and style utilities
├── utils/         # Helper functions
└── api/           # API client configuration
```

## ⚙️ Configuration

### Medusa Backend

This app requires a Medusa backend server. Ensure that the server is running and accessible.

1. Install and start Medusa server
2. Update the `MEDUSA_BACKEND_URL` in your `.env` file. If you set the URL as localhost, then the Android emulator will not be able to connect to the server. Use your local IP address instead. ex: `http://192.168.1.100:9000` Run `ipconfig` to get your local IP address.

### Theme Customization

The app supports multiple themes built-in with light and dark mode support. You can also create your own theme or customize the themes in:
```
app/styles/themes.ts
```

## 📍 Roadmap

Here are the planned features and improvements:

- 💳 Stripe integration for secure payments
- 🌍 Region selector for multi-region support
- 🎁 Gift card and coupon code support
- 🔄 Related products suggestions
- 🔍 Product search functionality
- 🎨 Advanced customization options
- 🌐 Multi-language support and translations
- 🔌 Plugins to extend the functionality of the app

## 🛡️ License

This project is licensed under the MIT License.

