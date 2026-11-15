const express = require('express')
const router = express.Router()

//Import postgre
const pool = require('../../db')

//General GET Request
router.get('/', async (req, res) => {

    try {
        const result = await pool.query(
            //Displays available information
            'SELECT * FROM PokemonLvl'
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
        const {pokemonlvlid, pokemonid, level, nickname, notes  } = req.body

        //Invalid input handling for no pokemonlvlid in item creation
        if (pokemonlvlid === undefined || pokemonlvlid === null || pokemonlvlid === '') {
            return res.status(400).json({ error: 'pokemonlvlid is required'})
        }

        const result = await pool.query(
            'INSERT INTO PokemonLvl (pokemonlvlid, pokemonid, level, nickname, notes ) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [pokemonlvlid, pokemonid, level, nickname || null , notes || null]
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
        const {pokemonlvlid, pokemonid, level, nickname, notes } = req.body

        if (pokemonlvlid === undefined || pokemonlvlid === null || pokemonlvlid === '') {
            return res.status(400).json({error: 'pokemonlvlid is required'})
        }

        const result = await pool.query(
            'UPDATE PokemonLvl SET pokemonlvlid = $1, pokemonid = $2, level = $3, nickname = $4, notes = $5 WHERE id = $6 RETURNING *',
            [pokemonlvlid, pokemonid, level, nickname || null, notes || null , req.params.id]
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
            'DELETE  FROM PokemonLvl WHERE id = $1 RETURNING *',
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