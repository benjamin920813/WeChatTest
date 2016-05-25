var webpage = require('webpage')
  , page = webpage.create();
page.viewportSize = { width: 1024, height: 800 };
page.clipRect = { top: 0, left: 0, width: 1024, height: 800 };
page.settings = {
  javascriptEnabled: false,
  loadImages: true,
  userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) PhantomJS/19.0'
};
page.open('http://www.baidu.com', function (status) {
  var data;
  if (status === 'fail') {
    console.log('open page fail!');
  } else { 
    page.render('./snapshot/test.png');
  }
  // release the memory
  page.close();
});