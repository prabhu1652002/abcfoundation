var http = require('http');
const fs = require('fs');

const server=http.createServer((req, res)=>
    {
        if (req.url === '/favicon.ico') //short circuit favicon requests
        {
            res.writeHead(200, {'Content-Type': 'image/x-icon'} );
            res.end();
            console.log('favicon requested');
            return;
        }
        console.log(req.url);
        res.setHeader('Content-Type', 'text-html');
        let path='./';
        switch(req.url)
        {
            case '/':
                path+='./main_page.html';
                res.statusCode=200;
                break;
            case '/about-us':
                path+='react_about.htm';
                res.statusCode=200;
                break;
            case '/Facebook-logo.png':
                path+='./6.jpg';
                res.statusCode=200;
                break;
            default:
                path+='404.htm';
                res.statusCode=404;
                break;

        }
        fs.readFile(path,(err,data)=>
        {
            if(err)
            {
                console.log(err);
                res.end();
            }
            else
            {
                res.write(data);
                res.end();
            }
        }
        )
         

    }
    )
server.listen(5000,'localhost',()=>{//keeps running
    console.log("Server listening")
});