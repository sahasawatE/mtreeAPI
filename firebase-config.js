const admin = require('firebase-admin');

const firebaseConfig = {
    apiKey: "AIzaSyBQTqYZcQOiHF_ZbXBZSjR3ma2xKcKonoY",
    authDomain: "mtree-cf9b0.firebaseapp.com",
    projectId: "mtree-cf9b0",
    storageBucket: "mtree-cf9b0.appspot.com",
    messagingSenderId: "201316539258",
    appId: "1:201316539258:web:9e9f784c7abfd087ba54c3",
    measurementId: "G-FLWDHR32P5"
};

admin.initializeApp(firebaseConfig)
const db = admin.firestore()
const Users = db.collection("Users")

module.exports = Users;

