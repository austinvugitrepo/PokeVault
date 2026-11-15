const express = require('express') 
const router = express.Router()


//Imports postgreSQL connection pool to reach db
const pool = require('../../db')

//GET request to get items from the database
router.get('/', async (req, res) => {
    try{
        const result = await pool.query(
            //Displays infomration results in descending order based on the time it was created
            'SELECT * FROM User'
        )
        //Response code and displays information sorted into rows
        res.status(200).json({data: result.rows})
    }
    //Error handling
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Could Not Retrieve Items form Database'})
    }
})

//POST to create a new item
router.post('/', async (req,res) => {
    try{
        const {userid, username, email, passwordhash, createdate } = req.body

        //Invalid input handling for no userid in item creation
        if (userid === undefined || userid === null || userid === '') {
            return res.status(400).json({ error: 'userid is required'})
        }

        const result = await pool.query(
            'INSERT INTO User (userid, username, email, passwordhash, createdate) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userid, username ?? null , email ?? null , passwordhash ?? null, createdate]
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
        const {userid, username, email, passwordhash, createdate} = req.body

        if (userid === undefined || userid === null || userid === '') {
            return res.status(400).json({error: 'userid is required'})
        }

        const result = await pool.query(
            'UPDATE User SET userid = $1, username = $2, email = $3, passwordhash = $4, createdate = $5 WHERE id = $6 RETURNING id, userid, username, email, createdate',
            [userid, username ?? null , email ?? null , passwordhash ?? null, createdate, req.params.id]
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
            'DELETE  FROM User WHERE id = $1 RETURNING *',
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