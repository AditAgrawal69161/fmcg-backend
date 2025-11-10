import admin from "firebase-admin";

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully");
  }
} catch (err) {
  console.error("❌ Firebase Admin init failed:", err.message);
}

export default admin;
