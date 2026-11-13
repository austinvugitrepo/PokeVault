//File for server code

//Creation of express server
const express = require("express")
const app = express()

//View Engine
app.set('view engine', 'ejs')


//Allows for json parsing
app.use(express.json())

//Static display for home page
app.use(express.static("public"))

//Generations router
const generation_router = require('./components/Generation')

//Calls the router for use
app.use('/api/Generation', generation_router)


//Start Server
app.listen(5000, () => {
    console.log("Server Successfully Started on Port 3000")
})

