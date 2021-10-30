const express = require("express");
const router = express.Router(); 
const path = require("path");
const { Client } = require("pg");
const {body} = require("express-validator");

const client = new Client({
    user : 'ubuntu',
    password: '1234',
    host : 'localhost',
    database : 'week1',
    port : 5432
}) //client 객체 생성


router.post("/", (req,res) => {
   const reqId = req.body.id;
   const reqPassword = req.body.pw;
   const reqName = req.body.name;
   const reqCont = req.body.contact;
   const reqAdd = req.body.address;
   let result = {
       "success": false
   }

   try {
    client.connect()
    console.log("signUp 디비 연결 성공");
   } catch (err) {
       console.log(err)
   }
  

    let sql = "select * from stageus.member where id ='" + reqId + "';"

    client.query(sql, (err, res2) => {
        if (res2.rows.length == 0) {
            //sql = "insert into stageus.member (id, pw, name, contact, address) values ('" + reqId + "', '" + reqPassword +"', '"+ reqName +"', '"+ reqCont +"', '"+ reqAdd +"');"
            sql = "insert into stageus.member (id, pw, name, contact, address) values ($1, $2, $3, $4, $5);"
            const values = [reqId, reqPassword, reqName, reqCont, reqAdd];

            client.query(sql, values, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    result.success = true
                    console.log(result) 
                }
                res.send(result);
            })
        } 
    })

});

module.exports = router;