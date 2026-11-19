const express = require('express')
const router = express.Router()

//Imports postgreSQL connection pool
const pool = require('../../db')


//General GET Request
router.get('/', async (req,res) => {

    try{
        const result = await pool.query(
            //Display information from the table
            'SELECT * FROM "Pokemon_Ability_Map"'
        )
        //Success response code
        res.status(200).json({data: result.rows})
    }
    //Error Handling
    catch(error){
        console.error(error)
        res.status(500).json({error: "Could Not Display Data"})
    }
})

//POST to create a new item
router.post('/', async (req,res) => {
    try{
        const {pokemonid, abilityid} = req.body

        //Invalid input handling for no pokemonid in item creation
        if (pokemonid === undefined || pokemonid === null || pokemonid === '') {
            return res.status(400).json({ error: 'pokemonid is required'})
        }

        const result = await pool.query(
            'INSERT INTO "Pokemon_Ability_Map" (pokemonid, abilityid) VALUES ($1, $2) RETURNING *',
            [pokemonid, abilityid ?? null]
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
        const {pokemonid, abilityid } = req.body

        if (pokemonid === undefined || pokemonid === null || pokemonid === '') {
            return res.status(400).json({error: 'pokemonid is required'})
        }

        const result = await pool.query(
            'UPDATE "Pokemon_Ability_Map" SET pokemonid = $1, abilityid = $2 WHERE id = $3 RETURNING *',
            [pokemonid, abilityid ?? null,  req.params.id]
        )

        //Checks to see if the item exists
        if (result.rows.length === 0){
            return res.status(404).json({error: 'Requested Item Not Found'})
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
            'DELETE  FROM "Pokemon_Ability_Map" WHERE id = $1 RETURNING *',
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