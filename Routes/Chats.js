const express = require('express');
const config = require('../config');
const route = express.Router();

const chats = config.collection("Chats");

// get
route.get("/", (req, res) => {
    console.log(Date.now())
    chats.get().then((result) => {
        res.send(result.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
        }))
    }).catch(err => {
        console.log(err);
        res.send('failed to find chats')
    });
})

route.get("/queryByMember", (req, res) => {
    console.log(new Date(Date.now()).toLocaleString(), ": queryByMember called")
    const member = req.body.member
    // console.log(member)
    chats
        .where("member", "array-contains-any", member)
        .get()
        .then((result) => {
            createArrayFromResult(result).then(result => {
                console.log(result[0])
                const chatRoom = chats.doc(result[0].id).collection("Chat")
                chatRoom.get().then((result) => {
                    createArrayFromResult(result).then(allChat=>{
                        allChat.sort((a, b) =>
                        a.timeStamp - b.timeStamp
                    )
                    res.send(allChat)
                    })

                })

            })
        })
        .catch(err => {
            console.log(err);
            res.send('failed to query a chats');
        })
})


async function createArrayFromResult(result) {
    return new Promise((resolve, reject) => {
        resolve(result.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            }))
    })

}


//post

route.post
module.exports = route;