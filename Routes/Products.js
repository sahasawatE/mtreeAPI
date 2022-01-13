const express = require('express');
const config = require('../config');
const productsRoute = express.Router();

const products = config.collection("Products");

productsRoute.get("/", (req, res) => {
    products.get().then((result) => {
        res.send(result.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
        }))
    }).catch(err => {
        console.log(err);
        res.send('fail to find products')
    });
});

productsRoute.post('/createProduct', (req, res) => {
    const data = req.body;
    products.add({ data }).then(() => {
        res.send(`your data is ${JSON.stringify(data)}`)
    }).catch(err => {
        console.log(err);
        res.send('fail');
    })
})

module.exports = productsRoute;