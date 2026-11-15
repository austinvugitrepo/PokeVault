const express = require('express')
const router = express.Router()

//Import postgreSQL connection pool
const pool = require('../../db')

//GET Request to get Generation from the database
router.get('/', async (req,res) => {

    try {
        const result = await pool.query(
            //Display information from the Generation Table
            'SELECT * FROM Generation'
        )
        //Response Code for Successful Query Request
        res.status(200).json({data: result.rows})
    }
    //Error Handling
    catch (error){
        console.error(error)
        res.status(500).json({error: 'Could Not Retrieve Data from Database'})
    }
})

//POST to create a new item
router.post('/', async (req,res) => {
    try{
        const {generationid, name, description } = req.body

        //Invalid input handling for no generationid in item creation
        if (generationid === undefined || generationid === null || generationid === '') {
            return res.status(400).json({ error: 'generationid is required'})
        }

        const result = await pool.query(
            'INSERT INTO Generation (generationid, name, description) VALUES ($1, $2, $3) RETURNING *',
            [generationid, name || null, description || null]
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
        const {generationid, name, description} = req.body

        if (generationid === undefined || generationid === null || generationid === '') {
            return res.status(400).json({error: 'generationid is required'})
        }

        const result = await pool.query(
            'UPDATE Generation SET generationid = $1, name = $2, description = $3 WHERE id = $4 RETURNING *',
            [generationid, name || null, description || null, req.params.id]
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
            'DELETE  FROM Generation WHERE id = $1 RETURNING *',
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

//Exports router for use in the server.js file
module.exports = router