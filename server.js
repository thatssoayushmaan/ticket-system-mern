require('dotenv').config()
const userRouter = require('./routers/user.router')
const ticketRouter = require('./routers/ticket.router')
const tokenRouter = require('./routers/token.router')
const handleError = require('./utils/errorHandler')

const express = require('express')
const app = express()

const morgan = require('morgan')
const helmet = require('helmet')

const connectDB = require('./config/db')
connectDB()

//Middlewares

app.use(express.json())
app.use(express.urlencoded({extended: false}))
//API Security
app.use(helmet())
//Logger
app.use(morgan('tiny'))

app.use('/user',userRouter)
app.use('/tickets', ticketRouter)
app.use('/tokens', tokenRouter)



//Root Route
app.get('/', (req,res) => {
    res.send("Backend Door to the Ticket Management System")
})


app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.use((error, req,res,next) => {
    handleError(error,res)
    next()
})



const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server Up and Running at ${port}`)
})