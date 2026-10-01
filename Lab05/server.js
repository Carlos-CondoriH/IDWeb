const http = require('http');
const port = 3000;
const fs = require('fs');
const path = require('path');
const public_dir = path.join(__dirname, 'public');
const data_file = path.join(__dirname, 'data', 'estudiantes.json');
const tipos = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
};
function responderJSON(res, codigo, objeto) {
    res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(objeto));
}
function servirEstatico(url, res) {
    const nombre = url === '/' ? '/index.html' : url;
    const filePath = path.join(public_dir, nombre);
    if (!filePath.startsWith(public_dir)) {
        return responderJSON(res, 404, { message: 'recurso no encontrado' });
    }
const tipo = tipos[path.extname(filePath)] || 'text/plain';
    fs.readFile(filePath, (err, contenido) => {
        if (err) {
        return responderJSON(res, 404, { message: 'recurso no encontrado' });
        }
        res.writeHead(200, { 'Content-Type': tipo });
        res.end(contenido);
    });
}
const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0];
    console.log(`peticion recibida: ${req.method} ${url}`);
    if (url === '/api/estudiantes' && req.method === 'GET') {
        fs.readFile(data_file, 'utf-8', (err, texto) => {
        if (err) return responderJSON(res, 500, { message: 'error al leer datos' });
        responderJSON(res, 200, JSON.parse(texto));
        });
    } else if (url === '/api/estudiantes' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
        body += chunk;
        });
        req.on('end', () => {
        let nuevo;
        try {
            nuevo = JSON.parse(body);
        } catch {
            return responderJSON(res, 400, { message: 'JSON inválido' });
        }
        fs.readFile(data_file, 'utf-8', (err, texto) => {
            if (err) return responderJSON(res, 500, { message: 'error al leer datos' });
            const lista = JSON.parse(texto);
            nuevo.id = lista.length ? lista[lista.length - 1].id + 1 : 1;
            lista.push(nuevo);
            fs.writeFile(data_file, JSON.stringify(lista, null, 2), (err2) => {
            if (err2) return responderJSON(res, 500, { message: 'error al guardar' });
            responderJSON(res, 201, nuevo);
            });
        });
        });
    } else if (req.method === 'GET' && !url.startsWith('/api')) {
        servirEstatico(url, res);
    } else {
        responderJSON(res, 404, { message: 'recurso no encontrado' });
    }
});
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});