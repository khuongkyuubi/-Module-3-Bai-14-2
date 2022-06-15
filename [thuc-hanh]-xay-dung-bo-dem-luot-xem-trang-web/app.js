const cookie = require('cookie');
const http = require('http');
const fs = require('fs');

function getViews(req ){
    // Parse the cookies on the request
    let cookies = cookie.parse(req.headers.cookie || '');
// Get the visitor views set in the cookie
    let views = cookies.views;
    if(views){
        return Number(views) + 1; // return views number
    }
    else{
        return 0;
    }
}

function creatServer(req, res) {
    if(req.method !== "GET") return res.end("nothings");
    let views = getViews(req);
    res.setHeader('Set-Cookie', cookie.serialize('views', views, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week
    }));
    console.log(views);

    fs.readFile('./view/home.html', 'utf8', function (err, datahtml) {
        if (err) {
            console.log(err);
        }
        datahtml = datahtml.replace('{views}', views);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(datahtml);
        return res.end();
    });
}


http.createServer(creatServer)
    .listen(8080, ()=> {
    console.log("listening on port 8080")
});
