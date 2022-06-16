const http = require('http');
const cookie = require('cookie');
const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("qs");
const escape = require('escape-html');
const port = 4500;


const server = http.createServer((req, res) => {
    let route = url.parse(req.url, true).pathname;
    let method = req.method;
    switch (route) {
        case "/" :
            if (method === "GET") {
                let html = "";
                let cookies = cookie.parse(req.headers.cookie || '');

                res.writeHead(200, "utf-8", {"Content-Type": "text/html"});
                // khi đã có cookie
                if (cookies.form) {
                    try {
                        let form = JSON.parse(`${cookies.form}`);
                        html = fs.readFileSync(path.join(__dirname, "views", "form-remember.html"), "utf-8");
                        html = html.replace("{form-fName}", form.fName);
                        html = html.replace("{form-lName}", form.lName);
                        html = html.replace("{form-guest}", form.guest);
                        html = html.replace("{form-date}", form.date);
                        html = html.replace("{form-time}", form.time);
                        if (form.radio1 === "yes") {
                            html = html.replace(" {yes-checked}", "checked");
                        } else {
                            html = html.replace(" {no-checked}", "checked");
                        }
                    } catch (err) {
                        console.log(err.message)
                    }
                    // khi không có cookie
                } else {
                    try {
                        html = fs.readFileSync(path.join(__dirname, "views", "form.html"), "utf-8");
                    } catch (err) {
                        console.log(err.message);
                    }
                }
                res.write(html);
                res.end();
            } else if (method === "POST") {
                let data = "";
                req.on("data", chunk => {
                    data += chunk;
                })
                req.on("end", () => {
                    let form = qs.parse(data);
                    console.log("from data: " + JSON.stringify(form), form);
                    res.setHeader('Set-Cookie', cookie.serialize('form', JSON.stringify(form), {
                        httpOnly: true,
                        maxAge: 60 * 60 // 1 minute
                    }));
                    res.writeHead(200, "utf-8", {"Content-Type": "text/html"});
                    res.write(`<a href="/">Home page</a>`);
                    res.end("<p>form ok</p>");
                })
                req.on("error", () => {
                    res.end("error")
                })
            }
            break;
        default :
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>")
    }


});

server.listen(port, () => {
    console.log("you are listening on port:", port);
});


