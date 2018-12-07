
var controllers = require("./Controllers.js").controllers;
var bodyParser  = require("body-parser");
var express     = require("express");
var server      = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));

server.get("/product/all", controllers.get_all_product);
server.get("/product/:id", controllers.get_product);
server.get("/sale/:id",    controllers.get_sale);
server.post("/sale/add",   controllers.add_sale);

server.listen(8000, function(){
    console.log("Server started");
});