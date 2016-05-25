var config = {
    "page": [{
        url: ['/index.html', '/login.html'],
        allow: function(role, userid) {
            return true;
        },
        deny: function(role, userid) {
            return false;
        }
    }, {
        url: ['/admin.html'],
        allow: function(role, userid) {
            return role == 'admin';
        },
        deny: function(role, userid) {
            return false;
        }
    }, {
        url: ['*'],
        allow: function(role, userid) {
            return true;
        },
        deny: function(role, userid) {
            return false;
        }
    }],
    "safeUserid": true, //是否为安全uerid， 为false 除微信外使用随机ID
    "autoAuthByWechat": false,
    "authUrl": 'login.html',
    //数据库表规则配置
    "db": {
        "product": {
            "allow": {
                fetch: function(userId, userRole, fieldNames, product) {

                    return product.createdBy == userId;
                },
                insert: function(userId, userRole, product) {
                    // can only create product where you are the author
                    return product.createdBy === userId;
                },
                remove: function(userId, userRole, product) {
                    // can only delete your own products
                    return product.createdBy === userId;
                },
                update: function(userId, userRole, product, fieldNames, modifier) {
                    return true
                }
            },
            "deny": {
                fetch: function(userId, userRole, fieldNames, product) {
                    return product.createdBy != userId;
                },
                insert: function(userId, userRole, product) {
                    return product.createdBy != userId;
                },
                remove: function(userId, userRole, product) {
                    return product.createdBy != userId;
                },
                update: function(userId, userRole, product, fieldNames, modifier) {
                    return product.createdBy != userId;
                }
            }
        }
    }
};

module.exports = config;