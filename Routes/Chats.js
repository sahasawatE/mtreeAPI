const { Router } = require('express');
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
// ------------- deciding to be deprecated --------------
route.get("/queryChatRoomByMember", async (req, res) => {
    console.log(new Date(Date.now()).toLocaleString(), ": queryByMember called")
    const member = req.body.member
    const chatRoom = await getChatRoomByMember(member)
    chatRoom.get().then((result) => {
        createArrayFromResult(result).then(allChat => {
            allChat.sort((a, b) =>
                a.timeStamp - b.timeStamp
            )
            res.send(allChat)
        })

    })
})
// ------------------------------------------------------

route.get("/queryByChatRoomID", async (req, res) => {
    console.log(new Date(Date.now()).toLocaleString(), ": queryByChatRoomID called")
    const room_id = req.body.room_id
    const chatRoom = chats.doc(room_id).collection("Chat")
    chatRoom.get().then((result) => {
        createArrayFromResult(result).then(allChat => {
            allChat.sort((a, b) =>
                a.timeStamp - b.timeStamp
            )
            res.send(allChat)
        })

    })
})


async function createArrayFromResult(result) {
    return new Promise((resolve, reject) => {
        let array = result.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
        })
        resolve(array)
    })

}

async function getChatRoomByMember(member) {
    return new Promise((resolve, reject) => {
        chats
            .where("member", "array-contains-any", member)
            .get()
            .then(result => {
                createArrayFromResult(result).then(result => {
                    console.log(result)
                    const chatRoom = chats.doc(result[0].id).collection("Chat")
                    resolve(chatRoom)
                })
            })
            .catch(err => {
                console.log(err);
                reject(err)
            })
    })
}


//post

route.post("/sendChat", async (req, res) => {
    console.log(new Date(Date.now()).toLocaleString(), ": sendChat called")

    const sender_id = req.body.sender_id
    const room_id = req.body.room_id
    const message = req.body.message
    const file = req.body.file
    console.log("sending a message to room_id:", room_id)
    chats
        .doc(room_id)
        .get()
        .then(doc => {
            if (doc) {
                const member = doc.data().member
                console.log("member -----------------", member)
                if (member.includes(sender_id)) {
                    console.log("include")
                    const chatRoom = chats.doc(room_id).collection("Chat")
                    const chat = {
                        file: file,
                        message: message,
                        sender_id: sender_id,
                        timeStamp: Date.now()
                    }
                    console.log(chat)

                    chatRoom.add(chat).then(() => {
                        res.send(`Message sent!`)
                    }).catch(err => {
                        console.log(err);
                        res.send('Sending message failed!', err);
                    })

                } else {
                    console.log("user not in this room")
                    res.send("user not in this room")
                }

            } else {
                console.log("No room with this ID")
                res.send("No room with this ID")
            }

        })




})
module.exports = route;