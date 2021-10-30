const express  = require("express");  
const app = express();
const fs = require("fs"); //file 임폴트용
const path = require("path");
const https = require("https");
const httpsPort = 4000;
const httpPort = 3001;


const options = {
    key: fs.readFileSync(path.join(__dirname, "private.pem")),
    cert: fs.readFileSync(path.join(__dirname, "public.pem"))
    //ca: , 업체 인증서 실제는 무조건 필요
}


app.use(express.json());




app.get("*", (req, res, next) => {
    const protocol = req.protocol; //http https 접속했는지 알수있
    if (protocol == "https") {
        next();
    } else {
        const newDestination = "https://" + req.hostname + ":4000" + req.url //url은 api
        res.redirect(newDestination)
    }
})





const main = require("./router/main.js")
app.use("/main", main);

// const login = require("./router/login.js")
// app.use("/login", login);

const join = require("./router/join.js")
app.use("/join", join);

const signUp = require("./router/signUp.js");
app.use("/signUp", signUp);

const token = require("./router/token.js");
app.use("/token", token);

const index2 = require("./router/index2.js");
app.use("/index2", index2);

const naverLogin = require("./router/naverLogin.js");
app.use("/naverLogin", naverLogin);

//const signUp2 = require("./router/signUp2.js")
//app.use("/signUp2", signUp); //몽고용

const numberSet = require("./router/numberSet.js");
app.use("/numberSet", numberSet);

const game = require("./router/game.js");
app.use("/game", game);

const gameFunction = require("./router/gameFunction.js");
app.use("/gameFunction", gameFunction);

const sync = require("./router/sync.js");
app.use("/sync", sync);




app.listen(httpPort, (req, res) => {
    console.log(httpPort + "번으로 서버가 실행됨");
});

//http https 다른거라서 따로 import 필요 
https.createServer(options, app).listen(httpsPort, (req, res) => {
    console.log(httpsPort + "번으로 서버가 실행됨");
})