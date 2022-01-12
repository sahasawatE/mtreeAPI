const express = require('express');
const cors = require('cors');
const Users = require('./firebase-config');

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(cors());

app.post('/createUser', (req,res) => {
    const data = req.body;
    Users.add({data}).then(() => {
            res.send(`your data is ${JSON.stringify(data)}`)
    }).catch(err => {
        console.log(err);
        res.send('fail')
    })
})

app.listen(PORT, () => {
    console.log(`this api is running on port ${PORT}`)
})