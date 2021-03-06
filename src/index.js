const ws = require('ws');
const randomatic = require('randomatic');
const port = process.env.SERVER_PORT || process.env.PORT || 8080;

const { readFileSync } = require('fs');
const server = require('http').createServer();
const wss = new ws.Server({
	server
});
server.listen(port, () => {
	console.log(`On port: ${port}`);
});

const gg = (name) => {
    return readFileSync(__dirname + '/public/' + name, 'utf-8');
}
server.on('request', (req, res) => {
    console.log(req.url)
    try {
        res.writeHead(200);
        res.end(gg(req.url.split('').slice(1).join('')));
    } catch (e) {
        res.writeHead(200);
        res.end(gg('index.html'));
    }
	
});

let connections = [];
wss.on('connection', socket => {
	socket.__id = randomatic('aA0', 25);
	connections.push(socket)
	socket.on('message', msg => {
		const { content, username } = JSON.parse(msg);
		console.log(content, username)
		connections.map(x => {
			if(x.__id == socket.__id) return;
			x.send(JSON.stringify({
				content, username 
			}));
		})
	});
	socket.once('close', () => {
		connections = connections.filter(x => x.__id != socket.__id);
	});
});