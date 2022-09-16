const express=require('express');
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
const dburl = "mongodb://localhost:27017/";
// var popup = require('popups');
const app=express();
app.use(express.static('public'));
console.log("listening to requests");

app.listen(3000);//listening to requests
app.get('/',(req,res)=>{
    res.sendFile('./main_page.html',{root:__dirname});
})
//send file uses absolute path as argument
//to use relative path enter the extra argument {root:__dirname}


app.get('/about',(req,res)=>{
    res.sendFile('./react_about.htm',{root:__dirname});
});

//redirects
app.get('/about-us',(req,res)=>{
    res.redirect('/about');
});

app.get('/volunteer',(req,res)=>{
    res.sendFile('./p_react.htm',{root:__dirname});
});

app.get('/signin',(req,res)=>{
    res.sendFile('./p1_react.html',{root:__dirname});
});

app.get('/form',(req,res)=>{
    res.sendFile('./p2.html',{root:__dirname});
});

app.get('/signup',(req,res)=>{
    res.sendFile('./p3_react.html',{root:__dirname});
});
app.get("/volunteer",(req,res)=>{
    res.sendFile('./p_react.html',{root:__dirname});
});


app.get('/stories',(req,res)=>{
    console.log(res.body);
    res.sendFile('./p5.html',{root:__dirname});
    
});
// app.get('/contactus',(req,res)=>{
//     console.log(res.body);
//     res.sendFile('./contactus.html',{root:__dirname});
    
// });


 
var urlencodedParser= bodyParser.urlencoded({ extended: false })

app.post("/data_send", urlencodedParser,function(req,res){
    console.log(req.body);
    
    MongoClient.connect(dburl,(err,db)=>{
        var dbo=db.db('mydb');
        var myobj={username:req.body.username,password:req.body.password[0]
        ,email:req.body.email};
        console.log(myobj)
        dbo.collection('register').find({username:req.body.username}).toArray((err,result)=>
        {
            if(err)
            {throw err;}
            if(result.length!=0)
            {
                console.log("user already exists");
                db.close();


            }
            else
            {
                dbo.collection('register').insertOne(myobj,(err,res)=>{
                    if(err) throw err;
                    console.log("one record inserted");
                    
                    db.close()
                })
                
                res.sendFile('/p1_react.html',{root:__dirname});
            }
            
            
            

        }
        )

    
    })
        
    
})


app.post("/geodata", urlencodedParser,function(req, res) {
    
    console.log(req.body);
    if(req.body.signIn==='signin')
    {
        obj={username:req.body.username,password:req.body.password};
        // console.log(obj);
        MongoClient.connect(dburl,(err,db)=>{
            var dbo=db.db('mydb');
            dbo.collection('register').find(obj).toArray((err,result)=>
            {
                console.log(result);
                
                if(result.length===1)
                {
                    console.log("data present");
                    res.status(200).redirect('/form');
                    
                }
                else
                {
                    console.log("data not present");
                    
                    // res.sendFile('./p1_react.html',{root:__dirname});
                    res.status(200).redirect('/signin');
                    // alert("Username or password entered is wrong")
                }
                db.close();
                
            }
            )
            // 
    
        }
        )
    }
    else
    {
        res.sendFile('./p3_react.html',{root:__dirname}); 
    }
    
    


    



    })

//404


app.use(//only fires when control reaches this point, can be thought of as default condition of switch statement 
    (req,res)=>{
        // res.sendFile('./404.html',{root:__dirname}) this will not send status code 404
        res.status(404).sendFile('./404.htm',{root:__dirname})//setting staus for 404 eror
    }
)
//response ends whenever app.get or .use fires
