
var API = {};
var thunkify = require('thunkify');

API.getAccessToken = thunkify(function(api, callback) {
    api.getAccessToken(callback);
});

API.getLatestToken = thunkify(function(api, callback) {
    api.getLatestToken(callback);
});

API.getUser = thunkify(function(api, openid, callback) {
    api.getUser(openid, function(err, user) {
        callback(null, user);
    });
});

API.getMedia = thunkify(function(api, mediaId, callback) {
    api.getMedia(mediaId, function(err, data) {
        callback(null, data);
    });
});

API.createMenu = thunkify(function(api, menu, callback) {
    api.createMenu(menu, function(err, data) {
        callback(null, data);
    });
});

API.getTicket = thunkify(function(api, callback) {
    api.getTicket(function(err, data) {
        callback(null, data);
    });
});

API.getJsConfig = thunkify(function(api, param, callback) {
    api.getJsConfig(param, function(err, data) {
        callback(null, data);
    });
});

module.exports = API;
