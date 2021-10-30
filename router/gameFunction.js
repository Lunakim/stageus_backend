const express = require("express");
const router = express.Router(); 
const redis = require("redis")
// const test = {
//     "level": 0,
//     "exp": 0,
//     "power": 0,
//     "gold": 0
// }
router.post("/setting", (req, res) => {
    const result = {
        "gold": 0,
        "exp": 0,
        "level": 0,
        "power": 0
    } 
    const client = redis.createClient(); //port번호??

    client.on("error", (e) => {
        console.log("redis 연결 실패")
    })

    client.on("ready", (e) => {
        client.hmget(req.body.key, "gold", "exp", "level", "power", (err, info) => {
            result.gold = info[0];
            result.exp = info[1];
            result.level = info[2];
            result.power = info[3];
            res.send(result);
        })
    })
})

router.post("/attack", (req, res) => {
    const client = redis.createClient(); //port번호??

    client.on("error", (e) => {
        console.log("redis 연결 실패")
    })

    client.on("ready", (e) => {
        const result = {
            "gold": 0,
            "exp": 0,
            "levelChange": 0,
            "success": false
        } 

        client.exists(req.body.key, (err,value) => {
            if (value == 0 ) { //컬렉션이 없다면 먼저 기본 뼈대만 세팅
                client.hset(req.body.key, "power", 0, "level", 0, "exp", 0, "gold", 0);
            } 
            //console.log("이 키에 대한 redis 정보가 존재함")
            client.hmget(req.body.key, "exp", "gold", (err2, info) => {
                client.hset(req.body.key, "exp", parseInt(info[0]) + 12);
                client.hset(req.body.key, "gold", parseInt(info[1]) + 2);
                result.exp = parseInt(info[0]) + 12
                result.gold = parseInt(info[1]) + 2

                // test.exp = result.exp
                // test.gold = result.gold
                // console.log("공격버튼의 결과는", test)

                if (result.exp >= 100) {
                    client.hmget(req.body.key, "exp", "level", (err2, info2) => {
                        client.hset(req.body.key, "exp", parseInt(info2[0]) - 100);
                        client.hset(req.body.key, "level", parseInt(info2[1]) + 1);
                        result.exp = parseInt(info2[0]) - 100;
                        result.levelChange = 1;
                        result.success = true;

                        // test.exp = result.exp
                        // test.level = result.levelChange
                        // console.log("레벨업 실행의 결과는", test)

                        res.send(result);
                    })
                } else {
                    res.send(result);
                }
            })
        })
    })
});


router.post("/shop", (req, res) => {
    const client = redis.createClient(); 

    client.on("error", (e) => {
        console.log("redis 연결 실패")
    })
    client.on("ready", (e) => {

        const result = {
            "power": 0,
            "gold": 0,
            "success": false
        } 

        client.exists(req.body.key, (err,value) => {
            if (value == 0 ) { 
                client.hset(req.body.key, "power", 0, "level", 0, "exp", 0, "gold", 0);  
            } 
            client.hmget(req.body.key, "power", "gold", (err2, info) => {
                client.hset(req.body.key, "power", parseInt(info[0]) + 2);
                client.hset(req.body.key, "gold", parseInt(info[1]) - 10);
                result.power = parseInt(info[0]) + 2;
                result.gold = parseInt(info[1]) - 10;
                result.success = true;
                // test.power = result.power
                // test.gold = result.power
                // console.log("쇼핑버튼의 결과는", test)
                res.send(result);
            })
        })
    })
});



router.post("/petInfo", (req,res) => {
    const client = redis.createClient();
})



module.exports = router;