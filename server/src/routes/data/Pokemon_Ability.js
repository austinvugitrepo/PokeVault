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

module.exports = router