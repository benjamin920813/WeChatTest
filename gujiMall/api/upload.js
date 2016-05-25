var Router = require('koa-router');
var parse = require("co-busboy");
var path = require("path");
var fs = require("fs");
var phpjs = require('phpjs');
var comongo = require("co-mongo");
var thunkify = require('thunkify');
var router = new Router();
fs.readFile = thunkify(fs.readFile);
fs.writeFile = thunkify(fs.writeFile);
router.post('/upload', function *() {

    var filetype = this.query.filetype || '';
    var parts = parse(this);
    var part;
    var type,name,stream_path='';
    while (part = yield parts) {
        if (part.pipe === undefined) {
            continue;
        }
    	name = phpjs.uniqid()+"."+part.mimeType.split("/")[1];
        var oldpath = __dirname.trim().split("\\");
        oldpath.pop();
        var newpath = oldpath.join("\\");
        console.log(newpath);
        console.log(newpath+"\\upload");
           
        var dirs = fs.readdirSync(newpath);

         if(dirs.indexOf("upload")===-1){
            fs.mkdirSync(newpath+"\\upload");
         }else{
         }
        var fname = path.join(newpath+"\\upload", name);
        var stream = fs.createWriteStream(fname);
        part.pipe(stream);
        type = part.mimeType;
        stream_path = stream.path;
    }

	var mongo_addr = "mongodb://"+this.request.header.host.trim().split(":")[0]+":27017/plugins";
	var db = yield comongo.connect(mongo_addr);
	var collection_ = yield db.collection("guji");
	var insertData = {
		"flag":"upload",
		"contentType":type,
		"filename" : name,
		"path":"http://192.168.2.111:3000/qyplugins/plugins/guji_client1/upload/"
	}
	yield collection_.insert(insertData);
	this.response.contentType =false;
	this.body = {url:insertData.path + insertData.filename,type:insertData.contentType};
    this.response.status = 200;
    return;
});
module.exports = router;