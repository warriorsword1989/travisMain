/**
 * Created by zhaohang on 2017/4/9.
 */

fastmap.service.DataServiceTips = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    saveTips: function (tipsJson, command) {
        var params = {
            jsonInfo: tipsJson,
            user: App.Temp.userId,
            command: command
        };

        var url = 'fcc/tip/pretreatmen/saveOrUpdate/';

        return this.createAjaxPromise('post', url, params);
    },
    getTipsResult: function (rowkey) {
        var params = {
            rowkey: rowkey
        };
        var url = 'fcc/tip/getByRowkeyNew/';

        return this.createAjaxPromise('get', url, params);
    },
    createAjaxPromise: function (method, url, parameter) {
        var fullUrl;
        if (parameter.urlType == 'spec') {
            fullUrl = App.Util.getSpecUrl(url);
        } else {
            fullUrl = App.Util.getFullUrl(url);
        }

        var promise = new Promise(function (resolve, reject) {
            var options = {
                url: fullUrl,
                requestParameter: parameter,
                timeout: 10000,
                responseType: 'json',
                onSuccess: function (json) {
                    if (json.errcode == 0) { // 操作成功
                        resolve(json.data);
                    } else {
                        reject(json.errmsg);
                    }
                },
                onFail: function (errmsg) {
                    reject(errmsg);
                },
                onError: function (errmsg) {
                    reject(errmsg);
                },
                onTimeout: function (errmsg) {
                    reject(errmsg);
                }
            };
            FM.ajax[method](options);
        });

        return promise;
    },

    destroy: function () {
        fastmap.service.DataServiceTips.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.service.DataServiceTips.instance) {
                fastmap.service.DataServiceTips.instance =
                    new fastmap.service.DataServiceTips();
            }
            return fastmap.service.DataServiceTips.instance;
        }
    }
});
