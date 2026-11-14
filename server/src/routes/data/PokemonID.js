const express = require('express')
const router = express.Router()

//Import postgre
const pool = require('../../db')

//General GET Request function
router.get('/', async (req, res) => {

    try{
        const result = await pool.query(
            //Display Available data
            'SELECT * FROM PokemonID'
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

module.exports = router