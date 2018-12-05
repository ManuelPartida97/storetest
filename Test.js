
var fs = require('fs');

var express = require("express"),
	bodyParser = require("body-parser"),
	server = express();

const {Client} = require("pg");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static('public'));

server.post('/product/add', async function (req, res) {
	var client = new Client({
		user: "postgres",
		host: "localhost",
		database: "storetest",
		password: "root",
		port: "5432"
	});
	await client.connect();

	var values = "";
	for(p in req.body.list_product){
		values += "(null, ";
		product_code = req.body.list_product[p];
		values += product_code+", name, 15";		// COLUMNAS Y VALORES NO COINCIDEN: Table 'Sale'
		values += "),";
	}
	values = values.slice(0, -2);

	var result = await client.query("INSERT INTO sale \
		(id, id_sale, id_product, total) VALUES "+values);

	client.end();
	if(result){
		res.end("SUCCESS with QUERY");
	}else{
		console.log(req.body);
		res.end("ERROR with QUERY");
	}
});

server.get('/product/:id', function (req, res) {
	res.json(req.body);
});

server.listen(8000, function () {
	console.log("Server running");
});