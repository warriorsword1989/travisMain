/**
 * Created by xujie3949 on 2017/1/6.
 */

fastmap.service.DataServiceEdit = L.Class.extend({
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);
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
                timeout: 100000,
                responseType: 'json',
                onSuccess: function (json) {
                    if (json.errcode === 0 || json.errcode === 999) { // 操作成功
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

    /**
     * 根据pid查询要素详细信息接口
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    editGetByPid: function (param) {
        param = param || {};
        param.dbId = param.dbId || App.Temp.dbId;

        return this.createAjaxPromise('get', 'edit/getByPid', param);
    },

    /**
     * 执行数据编辑操作接口（道路）
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    editRun: function (param) {
        param = param || {};
        param.dbId = param.dbId || App.Temp.dbId;
        param.subtaskId = param.subTaskId || App.Temp.subTaskId;

        return this.createAjaxPromise('post', 'edit/run/', param);
    },

    editIndexRun: function (param) {
        param = param || {};
        param.dbId = param.dbId || App.Temp.dbId;
        param.subtaskId = param.subTaskId || App.Temp.subTaskId;

        return this.createAjaxPromise('post', 'editrow/index/rowDataSave/', param);
    },

    /**
     * 执行数据编辑操作接口（POI）
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    editRowRun: function (param) {
        param = param || {};
        param.dbId = param.dbId || App.Temp.dbId;
        param.subtaskId = param.subTaskId || App.Temp.subTaskId;

        return this.createAjaxPromise('post', 'editrow/run/', param);
    },

    getByPid: function (pid, geoLiveType, dbId) {
        var params = {
            dbId: dbId || App.Temp.dbId,
            type: geoLiveType,
            pid: pid
        };

        return this.editGetByPid(params);
    },

    //  查询删除状态的要素，目前只有点限速有查询删除状态要素的需求；getByPid 不支持查询删除状态的要素
    getDelByPid: function (pid, geoLiveType, dbId) {
        var params = {
            dbId: dbId || App.Temp.dbId,
            type: geoLiveType,
            pid: pid
        };

        return this.createAjaxPromise('get', 'edit/getDelByPid', params);
    },

    getByPids: function (pids, geoLiveType) {
        var params = {
            dbId: App.Temp.dbId,
            type: geoLiveType,
            pids: pids
        };

        var url = 'edit/getByPids';

        return this.createAjaxPromise('get', url, params);
    },

    /**
     * 根据道路id获得分歧的详细属性(branchType = 0、1、2、3、4、6、8、9)
     * @param {Number} detailId     分歧的DetailId
     * @param {Object} branchType   分歧类型
     * @param {Number} dbId   要素id
     * @return {Object} editGetByPid
     */
    getBranchByDetailId: function (detailId, branchType, dbId) {
        var params = {
            dbId: dbId,
            type: 'RDBRANCH',
            detailId: detailId,
            rowId: '',
            branchType: branchType
        };

        return this.editGetByPid(params);
    },

    /**
     * 根据道路id获得分歧的详细属性(branchType = 5、7)
     * @param {Number} rowId     分歧的rowId
     * @param {Object} branchType   分歧类型
     * @param {Number} dbId   要素id
     * @return {Object} editGetByPid
     */
    getBranchByRowId: function (rowId, branchType, dbId) {
        var params = {
            dbId: dbId,
            type: 'RDBRANCH',
            detailId: 0,
            rowId: rowId,
            branchType: branchType
        };

        return this.editGetByPid(params);
    },

    getByCondition: function (params) {
        if (params) {
            params.dbId = params.dbId || App.Temp.dbId;
        }

        var url = 'edit/getByCondition';

        return this.createAjaxPromise('get', url, params);
    },

    create: function (geoLiveType, data) {
        var params = {
            command: 'CREATE',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    joinFaces: function (geoLiveType, data) {
        var params = {
            command: 'RELATION',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    upDownDepart: function (geoLiveType, data) {
        var params = {
            command: 'UPDOWNDEPART',
            type: geoLiveType,
            distance: data.distance,
            data: data.data
        };

        return this.editRun(params);
    },

    createSideRoad: function (geoLiveType, data) {
        var params = {
            command: 'CREATESIDEROAD',
            type: geoLiveType,
            distance: data.distance,
            sideType: data.sideType,
            sNodePid: data.sNodePid,
            data: data.data
        };

        return this.editRun(params);
    },

    addJoinBorder: function (geoLiveType, data) {
        var opDesc = '创建' + geoLiveType;
        var params = {
            user: App.Temp.userId,
            g_location: data.g_location,
            content: data.content,
            memo: data.memo
        };
        var url = 'fcc/tip/createEdgeMatch/';
        return this.createAjaxPromise('post', url, params);
    },

    update: function (geoLiveType, data) {
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    changeLinkDirect: function (pid, geoLiveType, data) {
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            objId: pid,
            data: data
        };

        return this.editRun(params);
    },

    adjustImage: function (url) {
        return this.createAjaxPromise('get', url, {});
    },
    
    repair: function (geoLiveType, id, data) {
        var params = {
            command: 'REPAIR',
            type: geoLiveType,
            objId: id,
            data: data
        };

        return this.editRun(params);
    },

    addPair: function (geoLiveType, data) {
        var params = {
            command: 'CREATE',
            type: 'RDELECEYEPAIR',
            data: data
        };

        return this.editRun(params);
    },

    move: function (geoLiveType, data) {
        var params = {
            command: 'MOVE',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    moveObj: function (geoLiveType, param) {
        var params = {
            command: 'MOVE',
            type: geoLiveType,
            data: {}
        };
        FM.extend(params, param);

        return this.editRun(params);
    },

    batch: function (geoLiveType, data) {
        var params = {
            command: 'BATCH',
            type: geoLiveType,
            data: data
        };

        return this.editRun(params);
    },

    /**
     * 由于参数不规范,临时对应
     * @param {Object} geoLiveType 分歧类型
     * @param {Number} pid 要素pid
     * @param {Object} data 数据
     * @returns {*} editRun
     */
    batchCross: function (geoLiveType, pid, data) {
        var params = {
            command: 'BATCH',
            type: geoLiveType,
            objId: pid,
            data: data
        };

        return this.editRun(params);
    },

    createPOI: function (geoLiveType, data) {
        var params = {
            command: 'CREATE',
            type: geoLiveType,
            data: data
        };

        return this.editRowRun(params);
    },

    /**
     * 索引要素接口
     * @param {Object} param 要素信息
     * @returns {*} createAjaxPromise
     */
    editRowIndexRun: function (param) {
        param = param || {};
        param.dbId = param.dbId || App.Temp.dbId;
        param.subtaskId = param.subTaskId || App.Temp.subTaskId;

        return this.createAjaxPromise('post', 'editrow/index/rowDataSave', param);
    },

    /**
     * 创建点门牌
     * @method
     * @param {Object} geoLiveType 要素类型
     * @param {Object} data 坐标信息对象
     * @returns {*} editRowIndexRun
     */
    createPointAddress: function (geoLiveType, data) {
        var params = {
            command: 'CREATE',
            type: geoLiveType,
            data: data
        };

        return this.editRowIndexRun(params);
    },

    movePointAddress: function (geoLiveType, param) {
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            data: {}
        };
        FM.extend(params, param);

        return this.editRowIndexRun(params);
    },

    /**
     * 查询3米范围内的点门牌
     * @param {Object} longitude 经度
     * @param {Object} latitude 纬度
     * @param {Object} param 经纬度
     * @returns {*} createAjaxPromise
     */
    queryPointAddress: function (longitude, latitude) {
        var params = {
            dbId: App.Temp.dbId,
            longitude: longitude,
            latitude: latitude
        };
        return this.createAjaxPromise('get', 'editrow/pointaddress/queryPointAddress', params);
    },

    movePOI: function (geoLiveType, param) {
        var params = {
            command: 'MOVE',
            type: geoLiveType,
            data: {}
        };
        FM.extend(params, param);

        return this.editRowRun(params);
    },

    batchMovePOI: function (data) {
        var params = {
            command: 'BATCHMOVE',
            type: 'IXPOI',
            data: data
        };

        return this.editRowRun(params);
    },
    batchMovePOINTADDRESS: function (data) {
        var params = {
            command: 'BATCHMOVE',
            type: 'IXPOINTADDRESS',
            data: data
        };

        return this.editIndexRun(params);
    },
    queryBySpatial: function (data) {
        var url = 'edit/getBySpatial';
        var params = {
            dbId: App.Temp.dbId,
            types: data.types,
            wkt: data.wkt
        };
        return this.createAjaxPromise('post', url, params);
    },
    /** *
     * poi要素创建父poi
     * @param {Object} param 获取要素
     * @return {Object} editRowRun
     */
    createParent: function (param) {
        var params = {
            command: 'CREATE',
            type: 'IXPOIPARENT',
            objId: param.pid,
            parentPid: param.parentPid
        };

        return this.editRowRun(params);
    },

    /** *
     * poi要素修改父poi
     * @param {Object} param 获取要素
     * @return {Object} editRowRun
     */
    updateParent: function (param) {
        var params = {
            command: 'UPDATE',
            type: 'IXPOIPARENT',
            objId: param.pid,
            parentPid: param.parentPid
        };

        return this.editRowRun(params);
    },

    /** *
     * poi要素删除父poi
     * @param {Object} param 获取要素
     * @return {Object} editRowRun
     */
    deleteParent: function (param) {
        var params = {
            command: 'DELETE',
            type: 'IXPOIPARENT',
            objId: param.pid
        };

        return this.editRowRun(params);
    },

    /** *
     * poi 同一关系
     * @param {Object} pids 创建同一关系的poiid数组
     * @param {Object} mainPid 主poiId
     * @return {Object} editRowRun
     */
    createSamePoi: function (pids, mainPid) {
        var params = {
            command: 'CREATE',
            type: 'IXSAMEPOI',
            poiPids: pids,
            data: {
                poiPids: pids,
                mainPid: mainPid
            }
        };
        return this.editRowRun(params);
    },

    updateObj: function (geoLiveType, param) {  // 临时这么写，等服务接口规范后再修改
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            data: {}
        };
        FM.extend(params, param);

        return this.editRun(params);
    },

    /**
     * 由于参数不规范,临时对应
     * @param {Object} geoLiveType geolivetype
     * @param {Number} linkPid 连接pid
     * @param {Object} data 临时数据
     * @returns {*} editRun
     */
    createNode: function (geoLiveType, linkPid, data) {
        var params = {
            command: 'CREATE',
            type: geoLiveType,
            objId: linkPid,
            data: data
        };

        return this.editRun(params);
    },

    /**
     * 由于参数不规范,临时对应
     * @param {Object} geoLiveType geolivetype
     * @param {Number} nodePid 点pid
     * @param {Object} data 临时数据
     * @returns {*} editRun
     */
    moveNode: function (geoLiveType, nodePid, data) {
        var params = {
            command: 'MOVE',
            type: geoLiveType,
            objId: nodePid,
            data: data
        };

        return this.editRun(params);
    },

    getObject: function (geoLiveType, pids, dbId) {
        var url = 'edit/getObject/';

        var params = {
            dbId: dbId || App.Temp.dbId,
            type: geoLiveType,
            pids: pids
        };

        return this.createAjaxPromise('post', url, params);
    },

    getDeleteConfirmInfo: function (pid, geoLiveType) {
        var params = {
            command: 'DELETE',
            type: geoLiveType,
            objId: pid,
            infect: 1
        };

        return this.editRun(params);
    },

    /**
     * 删除道路类要素接口
     * 子类可以重写此方法
     * @param {Number} pid 要素pid
     * @param {Object} geoLiveType 需要删除的对象
     * @return {*} editRun
     */
    delete: function (pid, geoLiveType) {
        var params = {
            command: 'DELETE',
            type: geoLiveType,
            objId: pid
        };

        return this.editRun(params);
    },

    /**
     * 删除index类要素接口
     * 子类可以重写此方法
     * @param {Number} pid 要素pid
     * @param {Object} geoLiveType 需要删除的对象
     * @return {*} editRun
     */
    deleteIndex: function (pid, geoLiveType) {
        var params = {
            command: 'DELETE',
            type: geoLiveType,
            objId: pid
        };

        return this.editIndexRun(params);
    },

    /**
     * 获取删除分歧的确认信息(branchType = 5、7)
     * @param {Number} rowId 信息pid
     * @param {Number} branchType 分支类型
     * @return {*} editRun
     */
    getDeleteBranchConfirmInfoByRowId: function (rowId, branchType) {
        var params = {
            command: 'DELETE',
            type: 'RDBRANCH',
            detailId: 0,
            rowId: rowId,
            branchType: branchType,
            infect: 1
        };

        return this.editRun(params);
    },

    /**
     * 根据rowId删除分歧(branchType = 5、7)
     * @param {Number} rowId 详细id
     * @param {Number} branchType 分支类型
     * @return {*} editRun
     */
    deleteBranchByRowId: function (rowId, branchType) {
        var params = {
            command: 'DELETE',
            type: 'RDBRANCH',
            detailId: 0,
            rowId: rowId,
            branchType: branchType
        };

        return this.editRun(params);
    },

    /**
     * 获取删除分歧的确认信息(branchType = 除了5、7)
     * @param {Number} detailId 内容详细id
     * @param {Number} branchType 分支类型
     * @return {*} editRun
     */
    getDeleteBranchConfirmInfoByDetailId: function (detailId, branchType) {
        var params = {
            command: 'DELETE',
            type: 'RDBRANCH',
            detailId: detailId,
            rowId: '',
            branchType: branchType,
            infect: 1
        };

        return this.editRun(params);
    },

    /**
     * 根据detailId删除分歧(branchType = 除了5、7)
     * @param {Number} detailId 内容详细id
     * @param {Number} branchType 分支类型
     * @return {*} editRun
     */
    deleteBranchByDetailId: function (detailId, branchType) {
        var params = {
            command: 'DELETE',
            type: 'RDBRANCH',
            detailId: detailId,
            rowId: '',
            branchType: branchType
        };

        return this.editRun(params);
    },

    updateChanges: function (pid, geoLiveType, changes) {
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            objId: pid,
            data: changes
        };

        return this.editRun(params);
    },
    /**
     * index要素属性修改方法
     * @param {Number} pid 要素pid
     * @param {Object} geoLiveType 类型
     * @param {Object} changes 变化属性
     * @returns {*|type[]} editIndexRun
     */
    updateIndexChanges: function (pid, geoLiveType, changes) {
        var params = {
            command: 'UPDATE',
            type: geoLiveType,
            objId: pid,
            data: changes
        };

        return this.editIndexRun(params);
    },
    breakLinks: function (geoLiveType, links, data) {
        var params = {
            command: 'TOPOBREAK',
            type: geoLiveType,
            objId: links,
            data: data
        };

        return this.editRun(params);
    },

    /**
     * 根据外包矩形查询所在的大区库
     * @param {function} bbox bbox
     * @returns {*} createAjaxPromise
     */
    queryDbIdByBbox: function (bbox) {
        return this.createAjaxPromise('post', 'edit/getDbIds/', bbox);
    },

    destroy: function () {
        fastmap.service.DataServiceEdit.instance = null;
    },

    statics: {
        instance: null,

        getInstance: function () {
            if (!fastmap.service.DataServiceEdit.instance) {
                fastmap.service.DataServiceEdit.instance =
                    new fastmap.service.DataServiceEdit();
            }
            return fastmap.service.DataServiceEdit.instance;
        }
    }

});
