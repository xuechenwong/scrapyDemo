var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');

var scrapt = {};
var baseUrl = 'http://bbs.hupu.com';
var url = 'http://bbs.hupu.com/bxj';
var pageArea = '';
scrapt.get = function(url,cb){
  http.get(url, function(res) {

    var size = 0;
    var chunks = [];
    var bufferHelper = new BufferHelper();
    res.on('data', function(chunk){
      bufferHelper.concat(chunk);
    });

    res.on('end', function(){
      var data = iconv.decode(bufferHelper.toBuffer(),'GBK');
      cb(null, data);
    });

  }).on('error', function(e) {
    cb(e, null);
  });
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '你关心的步行街头条'});
});
router.get('/page/init', function(req, res, next) {
	var items= [];
	scrapt.get(url,function(err,data){
	  var html = data.toString();
	  $ = cheerio.load(html);
	  $('#pl tbody').last().find('tr').each(function(){
	  	var item = {};
		item.title = $(this).find('.p_title >a').text();
		item.link = baseUrl + $(this).find('.p_title >a').attr('href');
		item.author = $(this).find('.p_author >a').text();
		item.authorLink = $(this).find('.p_author >a').attr('href');
		$(this).find('.p_author >a').remove();
		item.createTime = $(this).find('.p_author').text();
		item.lastReply = new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDay() + " " + $(this).find('.p_retime >a').text();

		var bigText = $(this).find('.p_re').text();
		item.reply = bigText.split('/')[0];
		item.read = bigText.split('/')[1];
	  	items.push(item);
	  })
	  var data = {
	  	data:items,
	  	message:"success",
	  	status:200
	  };
	  console.log('invoke get init page function');
	  res.json(data);
	})
});

router.get('/ajax/page',function(req,res){
  var ajaxTest={
    tips:"you are not alone"
  };
  var items = [];
  var item1 = {
  	user: "Todd",
  	id:1
  };
  var item2 = {
  	user: "Hanson",
  	id:2
  };
  var item3 = {
  	user: "Alex",
  	id:3
  };

  items.push(item1);
  items.push(item2);
  items.push(item3);
  var data = {
  	data:items,
  	message:"success",
  	status:200
  }
  console.log('invoke get next page function');
  res.json(data);
  // res.json({"message":"invoke API success","status":"0","data":[{"id":"1","author":"Hanson"},{"id":"2","user":"Todd"},{"id":"3","user":"Alex"}]});
});

module.exports = router;
