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

productsRoute.get("/queryByUserId",(req,res) => {
    const userId = req.body.userId;
    products.where("userId", "==", userId).get()
    .then((result) => {
        res.send(result.docs.map(doc => {
            return {id: doc.id, ...doc.data()}
        }))
    })
    .catch(err => {
        console.log(err);
        res.send('faile to query a product');
    })
})

function filterQueryDataFromTags(queryData,tags){
    if(tags.length !== 0){
        if(queryData.length > 1){
            return (queryData.map(v => {
                if (v.tag.includes(tags[0])) {
                    return filterQueryDataFromTags(v, tags.filter(e => e !== tags[0]))
                }
            }))
        }
        else{
            if(queryData.length !== 0){
                if (queryData.tag.includes(tags[0])) {
                    return (queryData)
                }
                else {
                    return ('empty')
                }
            }
            else{
                return ('empty')
            }
        }
    }
    else{
        return(queryData)
    }
}

productsRoute.get('/queryByTags',async (req,res) => {
    const tags = req.body.tag; //get list of tags
    var queryData = [];
    if(tags.length > 0) {
        const query = new Promise((resolve, reject) => {
            products.where("tag", "array-contains", tags[tags.length - 1]).get()
                .then(result => resolve(result.docs.map(doc => {
                    return {id: doc.id, ...doc.data()}
                })))
                .catch(err => reject(err))
        })

        await query.then(d => {
            d.map(v => {
                queryData.push(v)
            })
        }).catch(err => console.log(err))

        await tags.pop()

        if(tags.length === 0){
            res.send(queryData)
        }
        else{
            if (filterQueryDataFromTags(queryData, tags) !== 'empty'){
                res.send(filterQueryDataFromTags(queryData, tags).filter(e => e !== undefined && e !== 'empty' && e !== null))
            }
            else{
                res.send('empty results')
            }
        }
    }
    else{
        res.send('empty tags list')
    }
})

productsRoute.post('/createProduct', (req, res) => {
    const userId = req.body.userId;
    const productname = req.body.product_name;
    const updateDate = req.body.update_date;
    const price = req.body.price;
    const tag = req.body.tag; //get list of tags
    products.add({
        userId: userId,
        product_name : productname,
        update_date : updateDate,
        price: price,
        tag: tag
    }).then(() => {
        res.send(`your product is uploaded. User id is ${JSON.stringify(userId)}`)
    }).catch(err => {
        console.log(err);
        res.send('fail');
    })
})

productsRoute.delete('/deleteProduct',(req,res) => {
    const id = req.body.id;
    products.doc(id).delete().then(() => {
        res.send(`${JSON.stringify(id)} has been deleted`)
    }).catch(err => {
        console.log(err);
        res.send('delete product failed');
    })
})

module.exports = productsRoute;