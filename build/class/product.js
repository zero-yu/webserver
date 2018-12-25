"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categroy, comments) {
        this.categroy = categroy;
        this.desc = desc;
        this.id = id;
        this.price = price;
        this.rating = rating;
        this.title = title,
            this.comments = comments;
    }
    return Product;
}());
exports.Product = Product;
var ProductComment = /** @class */ (function () {
    function ProductComment(id, productID, content, timestamp, user, rating) {
        this.id = id;
        this.productID = productID;
        this.content = content;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
    }
    return ProductComment;
}());
exports.ProductComment = ProductComment;
