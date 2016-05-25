#服务器端API使用说明（nodejs)
*. 数据操作 this.shoots.collection;
*. 缓存 this.shoots.cache;
*. 会话 this.shoots.session;
*. 用户认证 this.shoots.auth;
*. 用户操作 this.shoots.user;
*. 工具 this.shoots.util;
*. 闪存 this.shoots.flash;
*. 应用相关信息 this.shoots.option;
*. 应用的配置信息 this.shoots.config;

##数据操作 this.shoots.collection
###插入一条记录
```js
  var doc = {
    name: 'go to office at 9:00 am',
    owner: 'wave',
    date: new Date(),
    year: 2015
  }
  var task = this.shoots.collection('task');
  var result = yield task.insert(doc);
```

###查找一条记录
```js
  var task = this.shoots.collection('task');
  var result = yield task.find({'owner':'wave'});
```

###更新一条记录
```js
    var task = this.shoots.collection('task');
    var result = yield task.update({owner: doc.owner}, {owner: 'jack'});
```

###删除一条记录
```js
  var task = this.shoots.collection('task');
  var result = yield task.remove({owner: 'wave'});
```

###统计记录条数
```js
  var task = this.shoots.collection('task');
  var result = yield task.count({'owner':'wave'});
```


##缓存 this.shoots.cache
###保存数据 this.shoots.cache.set(key,val,expireAfterSeconds)
###获取指定key的值 this.shoots.cache.get(key);
###删除指定key的值 this.shoots.cache.remove(key);


##会话 this.shoots.session
>this.shoots.session.set();
>this.shoots.session.get();
>this.shoots.session.remove(name);
>this.shoots.session.clear()

###保存信息 this.shoots.session.set(name, value, expireAfterSeconds)
**expireAfterSeconds**多少秒后过期
```js
  this.shoots.session.set('user',{userrole:'admin',userid:'1'},7*24*3600*1000);
```
###获取会话中的值 this.shoots.session.get(name)
  *如果name 为空， 返回会话值
  *如果name不为空，则返回会话中name对应的值

###删除会话中指定name的值 this.shoots.session.remove(name)

###清空会话 this.shoots.session.clear()

##用户操作
 *this.shoots.user.unique(name,value)
 *this.shoots.user.add(userid, username, password, userrole, userinfo),
 *this.shoots.user.update(userid, userinfo)
 *this.shoots.user.remove(userid, softremove)
##Auth操作



##应用相关信息 this.shoots.option;
{
    id: '应用ID',
    secret: '应用的私钥',
    name: '应用名称',
    server:'服务器地址',
    cookieid:'session cookie id' 
}
##应用的配置信息 this.shoots.config;
  这个对应的是应用目录下的config.js

#客户端API(javascript)

##数据操作

###插入一条记录
```js
  var doc = {
    name: 'go to office at 9:00 am',
    owner: 'wave',
    date: new Date(),
    year: 2015
  }
  var task=shoot.collection('task');
  task.insert(doc,function(err,data){
     console.log(err);
     console.log(data);
  })
```

###查找一条记录
```js
  var task = shoots.collection('task');
  yield task.find({'owner':'wave'},function(err,data){
    console.log(err);
    console.log(data);
  });
```

###更新一条记录
```js
    var task = this.shoots.collection('task');
    task.update({owner:'wae'}, {owner: 'jack'},function(err,doc){
      console.log(err);
      console.log(data);
    });
```

###统计记录
```js
  var task = shoots.collection('task');
  yield task.count({'owner':'wave'},function(err,data){
    console.log(err);
    console.log(data);
  });
```

##文件操作
```html
  <input type="file" name="file" id="file">
  <button id='upload'>upload</button>
```

```js
   document.getElementById('upload').onclick = function() {
        var data = document.getElementById('file');
        if (data.value != "") {
            var name = 'demo';
            var file = shoots.file(name, data);
            console.log(file);
            file.save(function(err, data) {
                console.log(err);
                console.log(data);
                console.log(file.url());//图片的src
            }, function(err) {
                console.log(err);
            });
        }
    }
```

##cookie 操作

###设置 shoots.cookie.set(name,value,opts);
opts 可以设置maxAge，path,domain,secure
```js
  var exp = new Date();    
  exp.setTime(exp.getTime() + 7*24*60*60*1000);//7day 
  var maxAge= exp.toGMTString();
  shoots.cookie.set('name','wave',{maxAge:maxAge});
```

###获取shoots.cookie.get(name);
```js  
  shoots.cookie.get('name');
```
###删除shoots.cookie.remove(name);
```js
 shoots.cookie.remove('name');
```
###清空shoots.cookie.clear();
```
 shoots.cookie.clear();
```

##auth操作
###获取当前用户信息 shoots.auth.getUser(callback)
```js
shoots.auth.getUser(function(doc){
    console.log(doc.errcode);
    console.log(doc.errmsg);
    console.log(doc.data);
})
```
###获取当前用户信息UserId shoots.auth.getUserId(callback)
```js
shoots.auth.getUserId(function(doc){
    console.log(doc.errcode);
    console.log(doc.errmsg);
    console.log(doc.data);
})
```
###登录shoots.auth.login(username, password, remember, callback)
```
 shoots.auth.login(username,password,remember,function(data){
      if (data.errcode == 0) {
            //login success
      }
  })
```
###登出shoots.auth.logout(callback)
```js
 shoots.auth.logout()
```



