var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Goods = new Schema({
    goodsName   : String,
    goodsNumber : String,
    goodsClass  : String,
    price        : String,
    goodsCount : String,
    create_date: { type: Date, default: Date.now }
});
// 创建model对象
var GoodsModel = mongoose.model('goods', Goods);
// 公开对象，暴露接口
module.exports = GoodsModel;