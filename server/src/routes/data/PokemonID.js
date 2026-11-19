const express = require('express')
const router = express.Router()

//Import postgre
const pool = require('../../db')

//General GET Request function
router.get('/', async (req, res) => {

    try{
        const result = await pool.query(
            //Display Available data
            'SELECT * FROM "PokemonID"'
        )
        //Successful Response Code
        res.status(200).json({data: result.rows})
    }
    //Error Handling
    catch (error) {
        console.error(error)
        res.status(500).json({error: 'Could Not Display Data'})
    }   
})

//POST to create a new item
router.post('/', async (req,res) => {
    try{
        const {pokemonid, name, generationid, height, weight, health, attack, defence, special_attack, special_defence, speed  } = req.body

        //Invalid input handling for no pokemonid in item creation
        if (pokemonid === undefined || pokemonid === null || pokemonid === '') {
            return res.status(400).json({ error: 'pokemonid is required'})
        }

        const result = await pool.query(
            'INSERT INTO "PokemonID" (pokemonid, name, generationid, height, weight, health, attack, defence, special_attack, special_defence, speed ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [pokemonid, name ?? null , generationid, height ?? null, weight ?? null, health, attack, defence, special_attack, special_defence, speed]
        )

        res.status(201).json({data: result.rows[0]})
    }
    //Error Handling 
    catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to create requested item'})
    }
})


//PUT request to update an existing item in the database
router.put('/:id', async (req, res) => {
    try{    
        const {pokemonid, name, generationid, height, weight, health, attack, defence, special_attack, special_defence, speed } = req.body

        if (pokemonid === undefined || pokemonid === null || pokemonid === '') {
            return res.status(400).json({error: 'pokemonid is required'})
        }

        const result = await pool.query(
            'UPDATE "PokemonID" SET pokemonid = $1, name = $2, generationid = $3, height = $4, weight = $5, health = $6, attack = $7, defence = $8, special_attack = $9, special_defence = $10, speed = $11 WHERE id = $12 RETURNING *',
            [pokemonid, name ?? null, generationid, height ?? null , weight ?? null, health, attack, defence, special_attack, special_defence, speed, req.params.id]
        )

        //Checks to see if the item exists
        if (result.rows.length === 0){
            return res.status(404).json({error: 'Requested Item could not be found'})
        }

        res.status(200).json({data: result.rows[0]})
    }
    catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to update requested item'})
    }
})

//DELETE request to delete an item from the database by its ID
router.delete('/:id', async (req, res) => {
    try{
        const result = await pool.query(
            'DELETE  FROM "PokemonID" WHERE id = $1 RETURNING *',
            [req.params.id]
        )

        if (result.rows.length === 0){
            return res.status(404).json({ error: 'Requested Item could not be found'})
        }
        res.status(200).json({message: 'Requested Item Successfully Deleted'})
    }

    catch (error){
        console.error(error)
        res.status(500).json({error: 'Failed to delete requested item'})
    }
})

module.exports = router