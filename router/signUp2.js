//몽고 디비로 돌아가게 
const router = require("express").Router();
const mongoose = require("mongoose");
const userSchema = require("./schema/userSchema");


router.post("/", (req,res) => {

    const result = {
        success: false
    }
    mongoose.connect( //중간에 <>비번은 바꿔줘 
        "mongodb+srv://ubuntu:<1234>@cluster0.oi9qt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        {
            useNewUrlParser : true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
    .then(() => {
        const user = new userSchema({
            id: req.body.id,
            pw: req.body.pw
        });

        user.save((err, data) => {
            if (err) {
                console.log("에러 발생!");
            } else {
                console.log("성공");
                result.success = true;
            }
        })

        res.send(result); //비동기 에러 난다 또 
    })
    .catch((err) => {
        console.log("디비 연결 실패!");
    })

})