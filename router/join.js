const express = require("express");
const router = express.Router(); 
const path = require("path"); 

router.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "./join.html"));
    //sendFile은 express 모듈에서만 쓰는거임 노드가 아님 
});  

module.exports = router;