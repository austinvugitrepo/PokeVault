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


//Pokemon Type Map Router\
const pokemon_type_map_router = require('./components/Pokemon_Type_Map')
//Calls the router
app.use('/api/Pokemon_Type_Map', pokemon_type_map_router)


//PokemonID Router
const pokemonID_router = require('./components/PokemonID')
//Calls the router
app.use('/api/PokemonID', pokemonID_router)


//PokemonLvl router
const pokemonLvl_router = require('./components/PokemonLvl')
//Calls the router
app.use('/api/PokemonLvl', pokemonLvl_router)


//PokemonType router
const pokemonType_router = require('./components/PokemonType')
//Calls the router
app.use('/api/PokemonType', pokemonType_router)


//TeamConfiguration router
const teamConfiguration_router = require('./components/TeamConfiguration')
//Calls the router
app.use('/api/TeamConfiguration', teamConfiguration_router)


//TeamMember router
const teamMember_router = require('./components/TeamMember')
//Calls the router
app.use('/api/TeamMember', teamMember_router)


//Uses Router
const user_router = require('./components/User')
//Calls the router
app.use('/api/User', user_router)

//Start Server
app.listen(5000, () => {
    console.log("Server Successfully Started on Port 5000")
})

