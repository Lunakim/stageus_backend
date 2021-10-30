const express = require("express");
const router = express.Router(); 
const path = require("path"); 
const redis = require("redis");
const { Client } = require("pg");


const pgClient = new Client({
    user : 'ubuntu',
    password: '1234',
    host : 'localhost',
    database : 'week1',
    port : 5432
})

router.get("/", (req,res) => {
    const redisClient = redis.createClient();
    redisClient.hmget('pikachu', "power", "level", "exp", "gold", (err, info) => {
        if (info.length != 0) {
            let sql = "insert into stageus.petinfo (name, power, level, exp, gold) values ('pikachu', $1, $2, $3, $4);"
            pgClient.query(sql, info, (err2) => {
                console.log('포스트그레 들어가유')
                if (err2) {
                    console.log(err2)
                }
            })
        } else {
             console.log("redis 정보가 존재하지 않습니다.")
        }
    })
})


module.exports = router;
