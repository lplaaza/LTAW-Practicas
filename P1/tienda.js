//-- Modulos para crear servidor, leer archivos y enrutar archivos
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001; //-- Puerto que se utiliza

const error = fs.readFileSync('./Pages/error.html','utf8');


//-- Leer archivos
function readFich(fichero, callback){
    fs.readFile(fichero, (err,data) => {
        if (err) {
            console.error('No se puede leer el archivo:', fichero, err);
            callback(err, null);
        } else {
            console.log(`${fichero} leido correctamente`);
            callback(null, data);
        }
    });
}

const server = http.createServer((req, res) => {
    console.log('Peticion recibida:', req.url);

    let content_type;
    let recurso;

    if(req.url.endswith('.png')) {
        content_type = 'image/png';
        recurso = path.join(__dirname, 'Images', path.basename(req.url));

    } else if (req.url.endswith('.css')) {
        content_type = 'text/css';
        recurso = path.join(__dirname, 'Style', path.basename(req.url));

    } else if (req.url.endswith('.html')) {
        content_type = 'text/html';
        recurso = path.join(__dirname, 'Pages', path.basename(req.url));

    } else if (req.url.endswith('.js')) {
        content_type = 'application/javascript';
        recurso = path.join(__dirname, 'JS', path.basename(req.url));

    } else if (req.url.endswith('.jpeg')) {
        content_type = 'image/jpeg';
        recurso = path.join(__dirname, 'Images', path.basename(req.url));

    } else if (req.url.endswith('./')) {
        content_type = 'text/html';
        recurso = path.join(__dirname, 'Pages', 'tienda.html');

    } else {
        content_type = 'text.html';
        recurso = null
    }

    if (recurso) {
        readFich(recurso, (err,data) => {
            if (err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found'
                res.setHeader('Content-type', 'text/html');
                res.write(error);
                res.end();
            } else {
                res.statusCode = 200;
                res.statusMessage = 'OK';
                res.setHeader('Content-type', content_type);
                res.write(data);
                res.end();
            }
        });
    } else {
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        res.setHeader('Content-type', 'text/html');
        res.write(error);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log('Escuchando puerto' + PORT)
});