var express = require('express');
var router = express.Router();
var GoodsModel = require("../model/Goods");
var multiparty = require("multiparty");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/addGoods', function(req, res, next) {
  res.render('addGoods', { title: '添加商品' });
});
router.get('/listGoods', function(req, res, next) {
    
  res.render('listGoods', { title: '商品列表' });
});

//登陆功能
router.get('/login', function(req, res, next) {
  res.render('login', { title: '管理中心' });
});
router.all('/loginAjax', function(req, res, next) {
  var userName=req.body.userName;
  var psw=req.body.psw
  var result={
    code:1,
    message:'登陆成功'
   }
   if(userName=="admin"&&psw=="f5f5f5f5"){
      req.session.userName=userName;
      res.json(result);
   }else{
    result.code=404;
    result.message="用户名或者密码错误"
    res.json(result)
   }
})
//列表页面
router.get('/list', function(req, res, next) {
  if(req.session==null||req.session.userName==null){
      res.redirect('/login')
      return;
  }
    res.render('list',{title:"列表页面"})
});

//保存商品
router.post('/api/goods_upload', function(req, res, next) {
	var form = new multiparty.Form({
		uploadDir: "public/images"
	});
	var result = {
		code: 1,
		message: "商品信息保存成功"
	};
	form.parse(req, function(err, body, files){
		if(err) {
			console.log(err);
		}
		console.log(body);
    var goodsName = body.goodsName[0];
    var goodsNumber = body.goodsNumber[0];
    var goodsCount = body.goodsCount[0];
		var price = body.price[0];
		var gm = new GoodsModel();
    gm.goodsName = goodsName;
    gm.goodsNumber = goodsNumber;
    gm.goodsCount = goodsCount;
		gm.price = price;
		gm.save(function(err){
			if(err) {
				result.code = -99;
				result.message = "商品保存失败";
			}
			res.json(result);
		})
	})
})

//查询商品分页效果
router.get('/goods', function(req, res, next) {
  var condition = parseInt(req.query.condition);
    var pageNO = req.query.pageNO || 1;
    pageNO = parseInt(pageNO);
    var perPageCnt = req.query.perPageCnt || 10;
    perPageCnt = parseInt(perPageCnt);
  
    GoodsModel.count({goodsNumber: {$regex: condition}}, function(err, count){
      console.log("数量:" + count);
      var query = GoodsModel.find({goodsNumber: {$regex: condition}})
      .skip((pageNO-1)*perPageCnt).limit(perPageCnt);
      query.exec(function(err, docs){
        console.log(docs);
        var result = {
          total: count,
          data: docs,
          pageNO: pageNO
        }
        res.json(result);
      });
    })
})

router.post('/removedata', function(req, res, next) {
  var goodsNumber=req.body.goodsNumber;
  console.log(goodsNumber)
  GoodsModel.update({goodsNumber:goodsNumber},{$set:{flag:0}},function(err){
    if(err){
      console.log(err)
    }else{
      res.send("删除成功")
    }
  })
});



module.exports = router;
