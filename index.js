const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require('./modules/replaceTeamplate');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProd = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');



const server = http.createServer((req, res)=>{
    const {  query, pathname } = url.parse(req.url, true);

    
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type':'text/html'});
        const cardHtml = dataObj.map(el=> replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%TEMPLATE-CARD%}', cardHtml);
        res.end(output);
    }
    else if(pathname === '/product'){
        console.log(pathname);
        res.writeHead(200,{'Content-type':'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProd, product);
        res.end(output);
    }
    else if (pathname === '/api'){
        res.writeHead(200,{'Content-type':'application/json'});
        res.end(data);
    }
    else{
        console.log(pathname ,query);
        res.writeHead(404,{
            'Content-type': 'text/html'
        });
        res.end('<h1>Opps Page not found</h1>');
    }
});

server.listen('3000','127.0.0.1',()=>{
    console.log('Listening to request on port: 3000');
})

