const express = require('express')
const router = express.Router()

//Imports postgreSQL connection pool


//General GET Request
router.get('/', async (req,res) => {

    try{
        const result = await pool.query(
            //Display information from the table
            'SELECT * FROM Pokemon_Ability_Map'
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

module.exports = router