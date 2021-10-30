const express = require('express');
const app = express();
const router = express.Router(); 
const client_id = '81JPGi2hk9FsIkkfXwL0';
const client_secret = '8py2OvZztq';
var state = "stageus";
var redirectURI = encodeURI("https://18.216.168.222:4000/index2");
var api_url = "";
var header = "Bearer " + token;
var token = "YOUR_ACCESS_TOKEN";

router.get('/naverlogin', function (req, res) { //url redirect, 네이버 아이디로 로그인 인증 요청
    api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
});

router.get('/callback', function (req, res) { //json format, 접근 토큰 발급/갱신/삭제 요청
    code = req.query.code;
    state = req.query.state;
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='+ client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + this.state;
    
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret }
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});


app.get('/member', function (req, res) {
   var api_url = 'https://openapi.naver.com/v1/nid/me';
   var request = require('request');
   token = req.headers.auth;
   var options = {
       url: api_url,
       headers: {'Authorization': header}
    };
   request.get(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
       res.end(body);
     } else {
       console.log('error');
       if(response != null) {
         res.status(response.statusCode).end();
         console.log('error = ' + response.statusCode);
       }
     }
   });
 });

app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/naverlogin app listening on port 3000!');
});

module.exports = router;