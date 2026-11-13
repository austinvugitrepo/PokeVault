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


//Pokemon Ability Map Router
const pokemon_ability_map_router = require('./components/Pokemon_Ability_Map')
//Calls the router for use
app.use('/api/Pokemon_Ability_Map', pokemon_ability_map_router)


//Pokemon Ability Router
const pokemon_ability_router = require('./components/Pokemon_Ability')
//Calls the router for use
app.use('/api/Pokemon_Ability', pokemon_ability_router)

//Start Server
app.listen(5000, () => {
    console.log("Server Successfully Started on Port 3000")
})

