const express = require("express");
const router = express.Router(); 
const path = require("path");
const { Client } = require("pg");

const client = new Client({
    user : 'ubuntu',
    password: '1234',
    host : 'localhost',
    database : 'week1',
    port : 5432
}) //client 객체 생성

try {
    client.connect()
} catch (err) {
    console.log(err)
}


router.post("/", (req,res) => {
    const reqId = req.body.id;
    const reqPassword = req.body.pw;
    //요새 이렇게 안써, json으로 쓰거든, 한번에 떄려박는거 
    let result = {
        "success": false,
        "user": 'none'
    }; 

    const sql = "select * from stageus.member where id = '" + reqId + "';"

    client.query(sql, (err, res2) => {
        if (res2.rows.length != 0) {
            const member_info = res2.rows[0]
            if (member_info.id == reqId) {
                if (member_info.pw == reqPassword) {
                    result.success = true
                    result.user = reqId
                } else {
                    result.success = 'wrongpassword'
                }
            } 
        }
        res.send(result);
    })

});

// const body = {
//     "id" : "stageus",
//     "pw" : "1234"
// } 프론트에서는 이렇게 보냄, 바디 파써 쓰려면 이름을 꼭 바디로 써야해 

module.exports = router;