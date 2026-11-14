const express = require('express')
const router = express.Router()

//Import postgreSQL connection pool
const pool = require('../../db')

//GET Request to get items from the database
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

//Exports router for use in the server.js file
module.exports = router