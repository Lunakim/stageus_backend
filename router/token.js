const express = require("express");
const router = express.Router(); 
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey')
const { Client } = require("pg");

const client = new Client({
    user : 'ubuntu',
    password: '1234',
    host : 'localhost',
    database : 'week1',
    port : 5432
})

try {
    client.connect()
    console.log("login용으로 DB 연결 성공");
} catch (err) {
    console.log(err)
}

router.post("/", (req,res) => {
    const reqId = req.body.id;
    const reqPassword = req.body.pw;
    const result = {
        "success": false,
        "message": "",
        "token": null
    }

    try { 
        const sql = "select * from stageus.member where id = '" + reqId + "';"

        client.query(sql, (err, res2) => {
            if (res2.rows.length != 0) {
                const fromDbId = res2.rows[0].id;
                const fromDbPw = res2.rows[0].pw;
                const fromDbContact = res2.rows[0].contact;
                const fromDbName = res2.rows[0].name;

                if (fromDbId == reqId) { //아이디, 비번이 정확할 때 
                    if (fromDbPw == reqPassword) {
                        const signedJwt = jwt.sign(
                            {
                                id: fromDbId,
                                name: fromDbName,
                                contact: fromDbContact,
                            },
                            secretKey, //시크릿 키, 서버가 저장해야 하니까 파일로 저장   
                            {
                                expiresIn : "20m", //특정 날짜에 비우기도 가능
                                issuer: "stageus"
                            }
                        ) 
                        result.success = true
                        result.token = signedJwt;
                        result.message = "아이디 비번 다 맞고, 토큰 발급됨";
                        res.send(result);
                    } else {
                        result.message = '비밀번호가 틀렸음'
                        res.send(result);
                    }
                } 
            } else {
                result.message = "존재하지 않는 사용자입니다."
            }
        })
    }catch(error) {
        result.message = "DB 서버 오류";
        res.send(result); // 서버 문제로 토큰 발급이 안됨 , 에러 퉁침
    }
})

router.post("/verify", (req,res) => {
    const result = {
        "success": false,
        "message": ""
    }
    try { 

        req.decoded = jwt.verify(req.headers.auth, secretKey); //토큰, 시크릿키 
        result.success = true;
        result.message = "인증성공"
        res.send(result);
    } catch (error) {
        if (error.name == "TokenExpiredError") {
            result.message = "만료된 토큰, 다시 로그인해주세요"
        } else {
            result.message = "유효하지 않은 토큰"
        }
        res.send(result)
    }
})

router.post("/showInfo", (req,res) => {
    const token = req.headers.auth
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64');
    const result = JSON.parse(payload.toString())
    res.send(result)
})

module.exports = router;