const express=require("express");
const request=require("request");
const ejs=require("ejs");
const axios=require("axios");
var session=require('express-session');
const bodyParser = require("body-parser");
const app=express();
app.use(express.static(__dirname + '/views'));
var path = require('path'); 
app.set('view engine','ejs');
app.use(session({secret:"gokul"}));
app.use(bodyParser.urlencoded({extended:true}));
let array=[];
app.get("/",function(req,res){
 res.sendFile(path.join(__dirname +"/views/home.html"));
});
var href="";
var answer="";
var score="score";
var questionarray=[];
var answerarray=[];
var name="",mobile="";
var attended="attended";
app.get("/GkQuiz",function(req,res){
    if(req.session[attended]==10)
    { 
        var a1=req.session[attended];
        var a2=req.session[score];
        req.session[attended]=0;
        req.session[score]=0;
        var out="";
        for(var i=0;i<10;i++)
        {
            out+=i+1+"."+questionarray[i]+"<br><br> Answer:"+answerarray[i]+"<br><br>";
        }
        out+="Your score is "+(a2)+"/"+a1+"<form action=\"/Details\" method=\"get\"><button type=\"submit\" value=\"submit\">BACK TO HOME</button></form>";
        res.send(out);
        const requestOptions = {
            "Name":name,
            "Phone_Number":mobile,
            "Total_Score":a2,
      };
        
      axios.post('https://satisfying-splendid-printer.glitch.me/api/details', requestOptions)
      .then((res) => {
          console.log(`Status: ${res.status}`);
          console.log('Body: ', res.data);
      }).catch((err) => {
          console.error(err);
      });
    }
    else{
    req.session[attended]=req.session[attended] || 0;
    req.session[score]=req.session[score] || 0;
    array=[];
    req.session[attended]++;
    try{
    if(req.session[attended]==1)
    {
        name=req.query.name;
        mobile=req.query.PhoneNumber;
        console.log(name,mobile);
    }}
    catch(e)
    {

    }
    request("https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple",function(error,response){
    var data=JSON.parse(response.body);
    var random=Math.floor(Math.random()*4)+1;
    data.results.forEach(quest => {
        questionarray.push(quest.question);
        answerarray.push(quest.correct_answer);
        var incorrect=quest.incorrect_answers;
        answer=quest.correct_answer;
        array.push(random);
        res.render("questions",{number:req.session[attended],dataout : quest,correct:random,incorrect:incorrect});
    });
})
    }
});
app.get("/Details",function(req,res){
    res.sendFile(path.join(__dirname +"/views/details.html"));
})
app.post("/answers",function(req,res){
    var out=array[0];
    var out1=req.body.opt;
    console.log(out,out1);
    if(out==out1)
    {
    req.session[score]++;
    res.render("correctanswer",{href:href,answer:answer});
    }
    else
    {
    res.render("wronganswer",{href:href,answer:answer});
}
})
var PORT=process.env.PORT || 4200;
app.listen(PORT,function(req,res){
    console.log("Running on port "+PORT);
});

