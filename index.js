const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const verify = require('./verifyToken');
const Users = require('./Routes/Users');
const Products = require('./Routes/Products');

dotenv.config();

const app = express();
const users = config.collection("Users");
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

function generateAccessToken(id) {
    return jwt.sign({ _id: id }, process.env.SALT, { expiresIn: "24h" });
}

app.use('/Users', verify, Users);
app.use('/Products', verify, Products);

app.post('/register', async (req, res) => {
    const userId = req.body.User_id;
    const userPassword = req.body.User_password;

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userPassword, salt);

    users.add({
        user_id: userId,
        user_password: hashPassword
    }).then(() => {
        res.send(`register is completed as ${userId}`)
    }).catch(err => {
        console.log(err);
        res.send('create user failed');
    })
})

app.post('/login',(req,res) => {
    const userId = req.body.User_id;
    const userPassword = req.body.User_password;
    var queryUser = [];

    users.where("user_id", "==", userId).get()
    .then(async (result) => {
        if(result.empty){
            res.send('no user is found')
        }
        else{
            queryUser = result.docs.map(doc => {
                return { id: doc.id, ...doc.data() }
            })
            const validatePassword = await bcrypt.compare(userPassword, queryUser[0].user_password);
            if (!validatePassword) {
                res.send('fail to login');
            }
            else {
                //create and assign token
                const token = generateAccessToken(queryUser[0].user_id);
                res.header("auth-token", token).send(token);
            } 
        }
    }).catch(err => {
        console.log(err);
        res.send('login failed')
    })
})

app.listen(port, () => {
    console.log(`this api is running on port ${port}`)
})