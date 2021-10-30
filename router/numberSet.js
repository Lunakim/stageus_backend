const express = require("express");
const router = express.Router(); 
const redis = require("redis")

router.post("/increase", (req, res) => {
    const client = redis.createClient();

    client.on("error", (e) => {
        console.log("연결실패")
    })

    client.on("ready", (e) => {
        console.log("연결성공")

        const result = {
            "resultNum": 0
        } //보내줄 json
        //string collection 만들때 exists hash h list l set 
        //먼저 있는지 체크, 해당 키 값을 가진 컬렉션이 있다 없다. true ==1 false ==0 
        client.exists(req.body.key, (err,value) => {
            if (value == 1 ) {
                client.get(req.body.key, (err2, num) => {
                    client.set(req.body.key, parseInt(num) + 1);
                    result.resultNum = num + 1;
                    res.send(result);
                })
            } else if (value ==0){
                client.set(req.body.key, 1);
                result.resultNum = 1;
                res.send(result);
            } //이 내용은 redis에서 한거라서,,, 서버 끄면 날아감(putty가 아니라) 진짜 서버를 꺼야함
        })
    })


});

router.post("/decrease", (req, res) => {
    const client = redis.createClient();

    client.on("error", (e) => {
        console.log("연결실패")
    })

    client.on("ready", (e) => {
        console.log("연결성공")

        const result = {
            "resultNum": 0
        } 

        client.exists(req.body.key, (err,value) => {
            if (value == 1 ) {
                client.get(req.body.key, (err2, num) => {
                    client.set(req.body.key, parseInt(num) - 1);
                    result.resultNum = num - 1;
                    res.send(result);
                })
            } else if (value ==0){
                client.set(req.body.key, 1);
                result.resultNum = 1;
                res.send(result);
            } 
        })
    })
});

module.exports = router;