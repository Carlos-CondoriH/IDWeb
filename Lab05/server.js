const http = require('http');
const port = 3000;
const server = http.createServer((req, res) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Servidor funcionando');
});
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});