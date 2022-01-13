const express = require('express');
const cors = require('cors');
const admin = require("firebase-admin");
const dotenv = require('dotenv');

const serviceAccount = require('./privateKey/mtree-cf9b0-firebase-adminsdk-jo88o-962fce3b96.json');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
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

const db = admin.firestore()
const Users = db.collection("Users");
const Products = db.collection("Products")

app.post('/createUser', (req,res) => {
    const data = req.body;
    Users.add({data}).then(() => {
            res.send(`your data is ${JSON.stringify(data)}`)
    }).catch(err => {
        console.log(err);
        res.send('fail');
    })
})

app.post('/createProduct', (req,res) => {
    const data = req.body;
    Products.add({data}).then(() => {
        res.send(`your data is ${JSON.stringify(data)}`)
    }).catch(err => {
        console.log(err);
        res.send('fail');
    })
})

app.listen(port, () => {
    console.log(`this api is running on port ${port}`)
})