/**
 * 元数据相关的数据接口配置
 */

angular.module('dataService').service('dsMeta', ['$http', '$q', 'ajax', function ($http, $q, ajax) {
    var showLoading; // 主页面控制Loading的开关的引用
    /**
     * 用于注册loading遮罩层
     * @param  {Object} loadingSwitch 对象
     * @return {undefined}
     */
    this.referenceLoadingSwitch = function (loadingSwitch) {
        showLoading = loadingSwitch;
    };

    /**
     * 内部函数
     * 修改loadingbar开关的状态
     * @param  {boolean} flag true/false
     * @return {undefined}
     */
    var toggleLoading = function (flag) {
        if (showLoading) {
            showLoading.flag = flag;
        }
    };

    /**
     * 获取大分类
     * @return {Promise} Promise对象
     */
    this.getTopKind = function () {
        var defer = $q.defer();
        ajax.get('metadata/queryTopKind/', {}).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve(0);
            }
        });
        return defer.promise;
    };

    /**
     * 获取中分类
     * @return {Promise} Promise对象
     */
    this.getMediumKind = function () {
        var defer = $q.defer();
        ajax.get('metadata/queryMediumKind/', {
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve(-1);
            }
        });
        return defer.promise;
    };

    /**
     * 获取小分类
     * @param {Object} param 参数
     * @return {Promise} Promise对象
     */
    this.getKindList = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryKind/', {
            parameter: JSON.stringify({
                region: param.region,
                mediumId: param.mediumId
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取分类出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };

    /**
     * 获取品牌
     * @param {Object} param 参数
     * @return {Promise} Promise对象
     */
    this.getChainList = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryChain/', {
            parameter: JSON.stringify({
                kindCode: param.kindCode
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取分类出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };

    /**
     * 获取充电桩品牌
     * @param {Object} param 参数
     * @return {Promise} Promise对象
     */
    this.getChargingChainList = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryChargingChain/', {
            parameter: JSON.stringify({
                kindCode: param.kindCode
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取品牌出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };

    /**
     * 获取卡车信息
     * @param {Object} param 参数
     * @return {Promise} Promise对象
     */
    this.queryTruck = function (param) {
        toggleLoading(true);
        var defer = $q.defer();
        ajax.get('metadata/queryTruck/', {
            parameter: JSON.stringify({
                kindCode: param.kindCode,
                chain: param.chain,
                fuelType: param.fuelType
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取卡车信息出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };

    /**
     * 获取等级
     * @param {Object} param 参数
     * @return {Promise} Promise对象
     */
    this.queryLevel = function (param) {
        toggleLoading(true);
        var defer = $q.defer();
        ajax.get('metadata/queryLevel/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取等级信息出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };

    /**
     * 根据分类和品牌获取等级
     * @param {String} kindCode 分类
     * @param {String} chainCode 品牌
     * @return {Promise} Promise对象
     */
    this.getChainLevel = function (kindCode, chainCode) {
        var defer = $q.defer();
        ajax.get('metadata/chainLevel/', {
            parameter: JSON.stringify({
                kindCode: kindCode,
                chainCode: chainCode
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取等级出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };

    /**
     * 根据区号查询电话号码长度
     * @param {String} code 分类
     * @return {Promise} Promise对象
     */
    this.queryTelLength = function (code) {
        var defer = $q.defer();
        ajax.get('metadata/queryTelLength/', {
            parameter: JSON.stringify({
                code: code
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('获取电话长度出错：' + data.errmsg);
            }
        });
        return defer.promise;
    };

    /**
     * 根据区号查询电话号码长度
     * @return {Promise} Promise对象
     */
    this.getFocus = function () {
        var defer = $q.defer();
        ajax.get('metadata/queryFocus/', {}).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询可以为父的POI失败：', data.errmsg, 'error');
                defer.resolve(0);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 获取餐饮类型
     *  @param {String} kindCode 分类
     * @return {Promise} Promise对象
     */
    this.queryFoodType = function (kindCode) {
        toggleLoading(true);
        var defer = $q.defer();
        ajax.get('metadata/queryFoodType', {
            parameter: JSON.stringify({
                kindId: kindCode
            })
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve('加载菜品风味出错：' + data.errmsg);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        }).finally(function () {
            toggleLoading(false);
        });
        return defer.promise;
    };
    /** ***************-------------------------------道路相关----------------------------************************/
    /**
     *  获取箭头图图片组
     * @param {Object} param 获取参数
     * @param {function} func 执行函数
     * @return {Promise} defer.promise
     */
    this.getArrowImgGroup = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/patternImage/search', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     *  获取箭头图图片
     * @param {Object} param 获取参数
     * @param {function} func 执行函数
     * @return {Promise} defer.promise
     */
    this.getArrowImg = function (param) {
        return App.Config.serviceUrl + '/metadata/patternImage/getById?access_token=' + (App.Temp.accessToken || '') + '&parameter=' + param; // 接口改动需要增加access_token参数
    };
    /**
     *  获取SVG图片
     * @param {Object} param 获取参数
     * @param {function} func 执行函数
     * @return {Promise} defer.promise
     */
    this.getSvgImg = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/svgImage/getById', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     *  获取SVG图片组
     * @param {Object} param 获取参数
     * @param {function} func 执行函数
     * @return {Promise} defer.promise
     */
    this.getSVGImgGroup = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/svgImage/search', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /**
     *  高速分歧 名称发音和语音
     * @param {Object} param 获取参数
     * @param {function} func 执行函数
     * @return {Promise} defer.promise
     */
    this.getNamePronunciation = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/pinyin/convert', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                if (data.data.phonetic.indexOf('ERROR') > -1) {
                    defer.resolve(-1);
                } else {
                    defer.resolve(data);
                }
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 转拼音接口，同时返回多音字
     * @param {Object} param 参数
     * @return {Promise} Promise对象
     */
    this.getPyPolyphoneConvert = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/pinyin/pyPolyphoneConvert', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                if (data.data.phonetic.indexOf('ERROR') > -1) {
                    defer.resolve(-1);
                } else {
                    defer.resolve(data);
                }
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 语音转换
     * @param {Object} param 参数
     * @return {Promise} Promise对象
     */
    this.getVoiceConvert = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/pinyin/voiceConvert/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(0);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 根据输入的道路名模糊查询所有道路名
     * @param {Object} param 参数
     * @return {Promise} Promise对象
     */
    this.getNamesbyName = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/search', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /** *
     * 获取道路名数据列表
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.roadNameList = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/websearch', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询道路名列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /** *
     * 获取道路名数据列表
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.columnDataList = function (params) {
        var defer = $q.defer();
        ajax.getLocalJson('../colEditor/test.json', {}).success(function (data) {
            defer.resolve(data);
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 道路名称类型查询
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.nametypeList = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/nametype', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询道路名类型列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 道路名行政区划查询
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.adminareaList = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/adminarea', { parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询道路名行政区划列表出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 中文转拼音
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.convert = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/pinyin/convert', { parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('中文转拼音出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 中文转外文
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.nameTranslate = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/eng/convert', { parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                if (data.data.eng.indexOf('ERROR') > -1) {
                    defer.resolve(-1);
                } else {
                    defer.resolve(data);
                }
            } else {
                swal('查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 道路名称保存
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.roadNameSave = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/websave', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('道路名称保存出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 道路名组下英文/葡文检查
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.rdnameGroup = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/group', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('道路名组下英文/葡文检查出错：', data.errmsg, 'error');
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 道路名中前中后缀值域
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.searchFix = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/searchFix', {
            parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('查询前中后缀值域出错：', data.errmsg, 'error');
                defer.resolve({});
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 道路名拆分
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.rdnameSplit = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/rdname/webteilen', { parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                data = 1;
                defer.resolve(data);
            } else {
                data = 0;
                swal('道路名拆分出错：', data.errmsg, 'error');
                defer.resolve(data);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /** ***************************** TMC相关  *********************************/
    /** *
     * 框选TMCPOINT查询TMC关系树
     * @param {Object} param 获取参数
     * @return {Promise} defer.promise
     */
    this.queryTmcTree = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryTmcTreeByIds', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data);
            } else {
                swal('根据条件查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
    /** *
     * 根据TMCID查TMCPOINT 和 TMCLINE
     * @param {Object} param 获取参数
     * @return {Promise} defer.promise
     */
    this.queryTmcData = function (param) {
        var defer = $q.defer();
        ajax.get('metadata/queryTmcById', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('根据条件查询数据出错：', data.errmsg, 'error');
                defer.resolve(-1);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 根据Name_id查询道路名
     * @param {String} nameId nameId
     * @return {Promise} Promise对象
     */
    this.queryRdNByNameID = function (nameId) {
        var defer = $q.defer();
        var param = {
            nameId: nameId
        };
        ajax.get('metadata/rdname/getByNameId/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('根据NameId查询道路名出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     * 根据RegionId查询AreaCode
     * @param {String} regionId regionId
     * @param {String} taskId taskId
     * @return {Promise} Promise对象
     */
    this.queryAreaCodeByRegionId = function (regionId, taskId) {
        var defer = $q.defer();
        var param = {
            regionId: regionId,
            taskId: taskId
        };
        ajax.get('metadata/queryAreaCodeByRegionId/', {
            parameter: JSON.stringify(param)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                swal('根据RegionId查询AreaCode出错：', data.errmsg, 'error');
                defer.resolve(null);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /** *
     * 生成名称语音
     * @param {Object} params 获取参数
     * @return {Promise} defer.promise
     */
    this.autoConvert = function (params) {
        var defer = $q.defer();
        ajax.get('metadata/pinyin/autoConvert', { parameter: JSON.stringify(params)
        }).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                console.log('名称语音生成出错：' + data.errmsg);
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };

    /**
     *  查询允许输入的手机号码前缀
     * @return {Promise} defer.promise
     */
    this.getAllowContacts = function () {
        var defer = $q.defer();
        ajax.get('metadata/scPointContactList', {}).success(function (data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                console.log('查询手机号码前缀出错：' + data.errmsg);
                defer.resolve([]);
            }
        }).error(function (rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);
