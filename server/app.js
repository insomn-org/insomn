if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}
const { User, Post, Comment, Category, Follow } = require('./models')
const { Op } = require('sequelize')

const cors = require('cors');
const express = require('express');
const router = require('./router');
const errorHandler = require('./middlewares/errorHandler');

const app = express()
const port = process.env.PORT || 3000

const { createServer } = require('http')
const { Server } = require("socket.io");
const { verifyToken } = require('./helpers/helper');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors())
app.use(router)
app.use(errorHandler)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

let onlineUser = []

io.on('connection', (socket) => {

  const currentUser = socket.handshake.auth.username;

  if (!onlineUser.includes(currentUser)) {
    onlineUser.push(currentUser);
  }

  console.log(currentUser, "current user brooo")

  io.emit("online:users", onlineUser)

  // socket.on("new-post", async () => {
  //   try {
  //     const allPost = await Post.findAll({ attributes: { exclude: ['UserId'] }, order: [['votes', 'DESC']], include: Category })
  //     socket.broadcast.emit("post-new", allPost)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // })

  socket.on("new-comment", async (PostId) => {
    try {
      const comment = await Comment.findAll({
        where: {
          PostId
        },
        include: [
          {
            model: Comment,
            attributes: ['author', 'content'],
            as: 'Quote'
          }
        ]
      })
      socket.broadcast.emit("comment-new", comment)
    } catch (error) {
      console.log(error);
    }

  })


  socket.on('new-vote', async (idCategory) => {
    try {
      //untuk halaman home
      const allPost = await Post.findAll({attributes: { exclude: ['UserId'] }, order:[['votes', 'DESC']], include: Category})
      socket.broadcast.emit("vote-new", allPost)

      //untuk halaman home-following
      // let followingId = []
      // const token = socket.handshake.auth.access_token
      // const payload = verifyToken(token)
      // const {id} = payload
      // const user = await User.findByPk(id,{
      //     attributes: ['id', 'username'],
      //     include:[
      //         {
      //             model: Category,
      //             through: 'Follows',
      //             attributes: ['id', 'name']
      //         }
      //     ]
      // })
      // user.Categories.map(el => followingId.push(el.id))

      // const allFollowingPost = await Post.findAll({
      //     attributes: { exclude: ['UserId'] },
      //     where:{
      //         CategoryId:{
      //             [Op.in]: followingId
      //         }
      //     },
      //     order:[['votes', 'DESC']], include: Category
      // })
      // console.log("ini data ?>>>>>>>", allFollowingPost);
      socket.emit("vote-following:new")
    } catch (error) {
      console.log(error);
    }
  })

  socket.on("new-post", async (idCategory) => {
    try {
      console.log(idCategory, "id category geng")
      //untuk halaman home
      const allPost = await Post.findAll({ attributes: { exclude: ['UserId'] }, order: [['votes', 'DESC']], include: Category })
      socket.broadcast.emit("post-new", allPost)

      //untuk halaman home-following
      let followingId = []
      const token = socket.handshake.auth.access_token
      // console.log("ini token >>>>>>>>>>>>>>>>>>>", token);
      // console.log("sebelum verify jalan >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      // const payload = verifyToken(token)
      // console.log("sesudah verify jalan >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      // const {id} = payload
      // const user = await User.findByPk(id,{
      //     attributes: ['id', 'username'],
      //     include:[
      //         {
      //             model: Category,
      //             through: 'Follows',
      //             attributes: ['id', 'name']
      //         }
      //     ]
      // })
      // user.Categories.map(el => followingId.push(el.id))

      // const allFollowingPost = await Post.findAll({
      //     attributes: { exclude: ['UserId'] },
      //     where:{
      //         CategoryId:{
      //             [Op.in]: followingId
      //         }
      //     },
      //     order:[['votes', 'DESC']], include: Category
      // })

      // socket.broadcast.emit("post-following:new", allFollowingPost)
      socket.broadcast.emit("post-following:new")

      //untuk halaman PostPerCategory
        socket.broadcast.emit("post-perCategory:new")
    } catch (error) {
      console.log(error, 'lkjlkjlkjlkjlkjlkjlkjlk');
    }
  })

  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter(user => user != currentUser)
    io.emit("online:users", onlineUser)
  })
  console.log(onlineUser, "Nowwwwwwwwwwwwwww")
})

// io.use(async (socket, next) => {
//   if(!socket.handshake.auth.access_token) throw { name: "unauthenticated" }

//       const token = socket.handshake.auth.access_token

//       const payload = verifyToken(token)

//       const findUser = await User.findByPk(payload.id)
//       if(!findUser) throw { name: "unauthenticated" }

//       useridddd = payload.id
//     });
//     next();


// app.listen(port, () => {
//   console.log(`RUNNNNNNNNIIIINNNNGGGGGG on port ${port}`)
// })

httpServer.listen(port, () => console.log(`RUNNNNNNNNIIIINNNNGGGGGG on port ${port}`))

module.exports = app