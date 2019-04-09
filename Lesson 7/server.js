const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("./public"));
app.use(bodyParser.json());

app.get("/products", (req, res) => {
	fs.readFile("./db/products.json", "utf-8", (err, data) => {
    if(err){
    console.error(err);
    res.send("Произошла ошибка");
	}
	res.send(data);
	});
});	

app.get("/cart", (req, res) => {
	fs.readFile("./db/cart.json", "utf-8", (err, data) => {
    if(err){
    console.error(err);
    res.send("Произошла ошибка");
	}
	
	const cart = JSON.parse(data);	
		
	res.send({
	total:  cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
	items: cart,
		});
	});
});	

app.post("/cart", (req, res) => {
	fs.readFile("./db/cart.json", "utf-8", (err, data) => {
    if(err){
    console.error(err);
    res.send("Произошла ошибка");
	}
	const cart = JSON.parse(data);
	cart.push(req.body);
	fs.writeFile("./db/cart.json", JSON.stringify(cart), () => {
	res.send({item: req.body, total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)});
		});
	});	
});

app.patch("/cart/:id", (req, res) => {
	fs.readFile("./db/cart.json", "utf-8", (err, data) => {
    if(err){
    console.error(err);
    res.send("Произошла ошибка");
	}
	let cart = JSON.parse(data);
	cart = cart.map((item) => {
		if(+item.id === +req.params.id){
			item.quantity = req.body.quantity;
		}
		return item;
	});
	fs.writeFile("./db/cart.json", JSON.stringify(cart), () => {
	res.send({
		item: cart.find((item) => +item.id ===+req.params.id),
		total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)});
		});
	});	
})

app.listen(3000, () => {
	console.log("Server has been started");
});