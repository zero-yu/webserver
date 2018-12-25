import * as express from 'express'
import { Product, ProductComment } from '../class/product';
import { Server } from 'ws'

const app = express();

app.get('/', (req, res) => {
    res.send("Hello Express");
});


const products: Product[] = [
    new Product(1, "Iphone5", 5, 5, "Iphone5手机不错不错不错不错", ["电子产品"], [new ProductComment(7, 1, "好空调好手机好冰箱", "2018-9-11", "test2", 2.5), new ProductComment(1, 1, "这件商品非常好1", "2018-9-11", "test2", 5)]),
    new Product(2, "Iphone6", 4, 3.5, "Iphone6手机", ["电子产品"], [new ProductComment(2, 2, "这件商品非常好2", "2018-9-11", "test2", 5)]),
    new Product(3, "Iphone7", 5, 2, "Iphone7手机", ["图书"], [new ProductComment(3, 3, "这件商品非常好3", "2018-9-11", "test2", 4)]),
    new Product(4, "Iphone8", 3.5, 1, "Iphone8手机", ["电子产品"], [new ProductComment(4, 4, "这件商品非常好4", "2018-9-11", "test2", 5)]),
    new Product(5, "Iphone9", 2.5, 3, "Iphone9手机", ["图书"], [new ProductComment(5, 5, "这件商品非常好5", "2018-9-11", "test2", 2)]),
    new Product(6, "IphoneX", 3.5, 2, "IphoneX手机", ["硬件设备"], [new ProductComment(6, 6, "这件商品非常好6", "2018-9-11", "test2", 3.5)])];

app.get('/products', (req, res) => {
    let result = products;

    let params = req.query;

    if (params.title) {
        result = result.filter(p => p.title.indexOf(params.title) !== -1);
    }

    if (params.price && result.length > 0) {
        result = result.filter(p => p.price <= parseInt(params.price));
    }

    if (params.categroy && params.categroy !== "-1" && result.length > 0) {
        result = result.filter(p => p.categroy.indexOf(params.categroy) !== -1);
    }

    res.json(result);
});

app.get('/products/:id', (req, res) => {
    res.json(products.find(product => product.id == req.params.id));
});

const server = app.listen(8000, 'localhost', () => {
    console.log('服务已经启动');
});

const subscription = new Map<any, number[]>();

const wsServer = new Server({ port: 8085 }).on("connection", websocket => {
    websocket.on('message', message => {
        let messageObj = JSON.parse(message.toString());
        let productId = subscription.get(websocket) || [];
        subscription.set(websocket, [...productId, messageObj.productID]);
    });
});;

const currentPrice = new Map<number, number>();

setInterval(() => {
    products.forEach(p => {
        let currentBid = currentPrice.get(p.id) || p.price;
        let newBid = currentBid + Math.random() * 5;
        currentPrice.set(p.id, newBid);
    });

    subscription.forEach((productIDs: number[], ws) => {
        if (ws.readyState === 1) {
            let newBids = productIDs.map(pid => ({ productId: pid, bid: currentPrice.get(pid) }));
            ws.send(JSON.stringify(newBids));
        } else {
            subscription.delete(ws);
        }
    });
}, 2000);
