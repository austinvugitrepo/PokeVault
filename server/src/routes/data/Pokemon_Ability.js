const express = require('express')
const router = express.Router()

//Import postGre
const pool = require('../../db')

//General GET Request
router.get('/', async (req,res) => {

    try{
        const result = await pool.query(
            //Display Information
            'SELECT * FROM Pokemon_Ability'
        )
        //Success Response Code
        res.status(200).json({data: result.rows})
    }
    //Error Handling
    catch(error){
        console.error(error)
        res.status(500).json({error: 'Could Not Display Data'})
    }
})

//POST to create a new item
router.post('/', async (req,res) => {
    try{
        const {abilityid, name, description } = req.body

        //Invalid input handling for no abilityid in item creation
        if (abilityid === undefined || abilityid === null || abilityid === '') {
            return res.status(400).json({ error: 'abilityid is required'})
        }

        const result = await pool.query(
            'INSERT INTO Pokemon_Ability (abilityid, name, description) VALUES ($1, $2, $3) RETURNING *',
            [abilityid, name || null, description || null]
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
        const {abilityid, name, description} = req.body

        if (abilityid === undefined || abilityid === null || abilityid === '') {
            return res.status(400).json({error: 'abilityid is required'})
        }

        const result = await pool.query(
            'UPDATE Pokemon_Ability SET abilityid = $1, name = $2, description = $3 WHERE id = $4 RETURNING *',
            [abilityid, name || null, description || null, req.params.id]
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
            'DELETE  FROM Pokemon_Ability WHERE id = $1 RETURNING *',
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