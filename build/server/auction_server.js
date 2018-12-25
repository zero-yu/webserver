"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var product_1 = require("../class/product");
var ws_1 = require("ws");
var app = express();
app.get('/', function (req, res) {
    res.send("Hello Express");
});
var products = [
    new product_1.Product(1, "Iphone5", 5, 5, "Iphone5手机不错不错不错不错", ["电子产品"], [new product_1.ProductComment(7, 1, "好空调好手机好冰箱", "2018-9-11", "test2", 2.5), new product_1.ProductComment(1, 1, "这件商品非常好1", "2018-9-11", "test2", 5)]),
    new product_1.Product(2, "Iphone6", 4, 3.5, "Iphone6手机", ["电子产品"], [new product_1.ProductComment(2, 2, "这件商品非常好2", "2018-9-11", "test2", 5)]),
    new product_1.Product(3, "Iphone7", 5, 2, "Iphone7手机", ["图书"], [new product_1.ProductComment(3, 3, "这件商品非常好3", "2018-9-11", "test2", 4)]),
    new product_1.Product(4, "Iphone8", 3.5, 1, "Iphone8手机", ["电子产品"], [new product_1.ProductComment(4, 4, "这件商品非常好4", "2018-9-11", "test2", 5)]),
    new product_1.Product(5, "Iphone9", 2.5, 3, "Iphone9手机", ["图书"], [new product_1.ProductComment(5, 5, "这件商品非常好5", "2018-9-11", "test2", 2)]),
    new product_1.Product(6, "IphoneX", 3.5, 2, "IphoneX手机", ["硬件设备"], [new product_1.ProductComment(6, 6, "这件商品非常好6", "2018-9-11", "test2", 3.5)])
];
app.get('/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.categroy && params.categroy !== "-1" && result.length > 0) {
        result = result.filter(function (p) { return p.categroy.indexOf(params.categroy) !== -1; });
    }
    res.json(result);
});
app.get('/products/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
var server = app.listen(8000, 'localhost', function () {
    console.log('服务已经启动');
});
var subscription = new Map();
var wsServer = new ws_1.Server({ port: 8085 }).on("connection", function (websocket) {
    websocket.on('message', function (message) {
        var messageObj = JSON.parse(message.toString());
        var productId = subscription.get(websocket) || [];
        subscription.set(websocket, productId.concat([messageObj.productID]));
    });
});
;
var currentPrice = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentPrice.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentPrice.set(p.id, newBid);
    });
    subscription.forEach(function (productIDs, ws) {
        if (ws.readyState === 1) {
            var newBids = productIDs.map(function (pid) { return ({ productId: pid, bid: currentPrice.get(pid) }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscription.delete(ws);
        }
    });
}, 2000);
