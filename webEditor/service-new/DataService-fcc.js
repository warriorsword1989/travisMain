/**
 * Created by xujie3949 on 2017/1/6.
 */

fastmap.service.DataServiceFcc = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);
    },

    /* 新增接边tips*/
    addJoinBorder: function (data) {
        var params = {
            user: App.Temp.userId,
            g_location: data.g_location,
            content: data.content,
            memo: data.memo,
            qSubTaskId: App.Temp.subTaskId
        };
        var url = 'fcc/tip/createEdgeMatch/';
        return this.createAjaxPromise('post', url, params);
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
        fastmap.service.DataServiceFcc.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.service.DataServiceFcc.instance) {
                fastmap.service.DataServiceFcc.instance =
                    new fastmap.service.DataServiceFcc();
            }
            return fastmap.service.DataServiceFcc.instance;
        }
    }
});
