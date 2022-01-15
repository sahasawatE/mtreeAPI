const admin = require("firebase-admin");
const dotenv = require('dotenv');

const serviceAccount = require('./privateKey/mtree-cf9b0-firebase-adminsdk-jo88o-b173c053ff.json');

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
});

const db = admin.firestore();

module.exports = db;