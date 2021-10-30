const express = require("express");
const router = express.Router(); 
const path = require("path"); 
const request = require('request-promise')

try {
    router.get("/", (req,res) => {
        const token = req
        //오류: json.parse()
        console.log(token)
        res.sendFile(path.join(__dirname, "./index2.html"));
    });
}catch(err) {
    console.log(err)
}

module.exports = router;