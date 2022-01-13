const express = require('express');
const config = require('../config');
const usersRoute = express.Router();

const users = config.collection("Users");

usersRoute.get("/", (req, res) => {
    users.get().then((result) => {
        res.send(result.docs.map((doc) => {
            return {id: doc.id, ...doc.data()}
        }))
    }).catch(err => {
        console.log(err);
        res.send('fail to find users')
    });
});

usersRoute.delete('/deleteUser', (req,res) => {
    const id = req.body.id;
    users.doc(id).delete().then(() => {
        res.send(`${JSON.stringify(id)} has been deleted`)
    }).catch(err => {
        console.log(err);
        res.send('delete user failed');
    })
})

module.exports = usersRoute;