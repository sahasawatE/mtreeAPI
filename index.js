const express = require('express');
const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const cors = require('cors');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');
const config = require('./config');
const verify = require('./verifyToken');
const Users = require('./Routes/Users');
const Products = require('./Routes/Products');

dotenv.config();

initializeApp({
    databaseURL: process.env.DATABASE_URL,
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
})

const firebaseAuth = getAuth()

const app = express();
const auth = admin.auth()
const users = config.collection("Users");
const port = process.env.PORT;

app.use(bodyParser.json())
app.use(cors());

app.use('/Users', verify, Users);
app.use('/Products', verify, Products);

app.post('/register',async (req,res) => {
    const userId = req.body.User_id; //username or user display name
    const userEmail = req.body.User_email;
    const userPassword = req.body.User_password;

    auth.createUser({
        displayName: userId,
        email: userEmail,
        password: userPassword
    }).then(() => {
        // res.send(result.toJSON())
        res.send('register is completed')
    }).catch(err => {
        console.log(err);
        res.send('user is already exists')
    })
})

app.post('/login',(req,res) => {
    const userEmail = req.body.User_email; //login with email only
    const userPassword = req.body.User_password;
    // var queryUser = [];

    signInWithEmailAndPassword(firebaseAuth, userEmail, userPassword)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            res.status(200).send(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.send({code: errorCode, message: errorMessage})
        });
})

app.listen(port, () => {
    console.log(`this api is running on port ${port}`)
})