const express = require('express')
const router = express.Router()

//Import postgre
const pool = require('../../db')

//General GET Request
router.get('/', async (req, res) => {

    try{
        const result = await pool.query(
            //Displays available data
            'SELECT * FROM Pokemon_Type_Map'
        )
        //Successful Response Code
        res.status(200).json({data: result.rows})
    }
    //Error Handling
    catch(error) {
        console.error(error)
        res.status(500).json({error: 'Could Not Display Data'})
    }
})

//POST to create a new item
router.post('/', async (req,res) => {
    try{
        const {pokemonid, typeid  } = req.body

        //Invalid input handling for no pokemonid in item creation
        if (pokemonid === undefined || pokemonid === null || pokemonid === '') {
            return res.status(400).json({ error: 'pokemonid is required'})
        }

        const result = await pool.query(
            'INSERT INTO Pokemon_Type_Map (pokemonid, typeid ) VALUES ($1, $2) RETURNING *',
            [pokemonid, typeid]
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
        const {pokemonid, typeid } = req.body

        if (pokemonid === undefined || pokemonid === null || pokemonid === '') {
            return res.status(400).json({error: 'pokemonid is required'})
        }

        const result = await pool.query(
            'UPDATE Pokemon_Type_Map SET pokemonid = $1, typeid = $2 WHERE id = $3 RETURNING *',
            [pokemonid, typeid, req.params.id]
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
            'DELETE  FROM Pokemon_Type_Map WHERE id = $1 RETURNING *',
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