/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
  },
  reactStrictMode: true,
  // experimental: {
  //   appDir: true,
  // },
  env: {
    FIREBASE_API_KEY: "AIzaSyC-aU7h07Sd7N1VfnKhhbHsqEo0C9_adGY",
    FIREBASE_AUTH_DOMAIN: "sabaagro-2607.firebaseapp.com",
    FIREBASE_PROJECT_ID: "sabaagro-2607",
    FIREBASE_STORAGE_BUCKET: "sabaagro-2607.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "672390000303",
    FIREBASE_APP_ID: "1:672390000303:web:531b45f820f76b01cb6e5a",
    FIREBASE_MEASUREMENT_ID: "G-ETT6LWZ4E5",
  },
};

module.exports = nextConfig;
