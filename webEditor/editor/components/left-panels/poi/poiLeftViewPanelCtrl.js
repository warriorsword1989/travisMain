/**
 * 主编辑面板POI左侧照片页面对应的Ctrl
 */

angular.module('app').controller('poiLeftViewPanelCtrl', ['$scope', '$rootScope', 'FileUploader', 'NgTableParams',
    'dsFcc', 'dsEdit',
    function ($scope, $rootScope, FileUploader, NgTableParams, dsFcc, dsEdit) {
        var objCtrl = fastmap.uikit.ObjectEditController();
        var topoEditFactory = fastmap.uikit.topoEdit.TopoEditFactory.getInstance();
        var topoEditor = topoEditFactory.createTopoEditor('IXPOI', null);
        var poiType = '';
        $scope.seasonsPhoto = {}; // 当前作业季

        /**
         * 获取当前页的照片
         * @param {Number} currentPage 正确的页面
         * @param {Number} type 照片时间类型 0-当前作业季 1-历史作业季
         * @return {undefined}
         */
        $scope.currentPhotoList = [];
        var getCurrentPagePhotos = function (currentPage, type) {
            var i = 0;
            var startIndex = (currentPage - 1) * 5;
            $scope.currentPhotoList = [];
            // if ($scope.seasonsPhoto.type === 0) { // 当前作业季
            //     $scope.poi.photos.forEach(function (item) {
            //         if (item.version == 1) {
            //             $scope.currentPhotoList.push(item);
            //         }
            //     });
            // } else {
            //     $scope.currentPhotoList = $scope.poi.photos;
            // }
            if ($scope.seasonsPhoto.type === 0) { // 当前作业季
                $scope.currentPhotoList = $scope.poi.photos;
            } else {
                $scope.currentPhotoList = $scope.historyPhotos;
            }
            var arr = [];
            if (!$scope.deepInfoFlag) {
                arr = $scope.currentPhotoList.slice(startIndex, startIndex + 5);
            } else { // 深度信息 ,深度信息不显示tag等于7的照片
                var tempArr = [];
                var allSencePhoto = null;
                for (i = 0; i < $scope.currentPhotoList.length; i++) {
                    if ($scope.currentPhotoList[i].tag === 7) {
                        allSencePhoto = $scope.currentPhotoList[i];
                        break;
                    }
                }

                for (i = 0; i < $scope.currentPhotoList.length; i++) {
                    if ($scope.currentPhotoList[i].tag !== 7) {
                        var photo = $scope.currentPhotoList[i];
                        photo.tagFlag = false;
                        if (allSencePhoto && photo.fccPid === allSencePhoto.memo) {
                            photo.tagFlag = true;
                        }
                        tempArr.push($scope.currentPhotoList[i]);
                    }
                }
                arr = tempArr.slice(startIndex, startIndex + 5);
            }
            if (type == 0) {
                arr.forEach(function (item) {
                    item.originUrl = App.Util.getPhotoUrl(item.fccPid, 'origin');
                    item.thumbnailUrl = App.Util.getPhotoUrl(item.fccPid, 'thumbnail');
                });
            } else {
                arr.forEach(function (item) {
                    item.originUrl = App.Util.getMassivePhotoUrl(item.fccPid, 'origin');
                    item.thumbnailUrl = App.Util.getMassivePhotoUrl(item.fccPid, 'thumbnail');
                });
            }

            $scope.tempPhotos = arr;
            if (arr.length > 0) {
                $scope.nowActiveImg = arr[0];
                var timestamp = Date.parse(new Date());
                $scope.nowActiveImg.originUrl = $scope.nowActiveImg.originUrl + '&_time="' + timestamp + '"';  // wheelzoom组件有个问题，相同的scr再次加载时图片不显示，解决办法路径增加时间戳
                $scope.nowActiveIndex = 1;
            } else {
                $scope.nowActiveImg = {};
                $scope.nowActiveIndex = 0;
            }
            if ($scope.tempPhotos.length < 5) {
                var len = $scope.tempPhotos.length;
                for (i = 0; i < 5 - len; i++) {
                    $scope.tempPhotos.push({
                        originUrl: '',
                        thumbnailUrl: '',
                        noimg: true
                    });
                }
            }
        };

        var afterUpload = function (fccPid) {
            var img = new FM.dataApi.IxPoiPhoto({
                fccPid: fccPid
            });

            img.version = 1; // 当前上传的都属于当前作业季

            $scope.poi.photos.unshift(img);

            $scope.seasonsPhoto.type = 0;// 图片上传成功后需要设置为当前作业季
            getCurrentPagePhotos(1, $scope.seasonsPhoto.type);
        };

        var uploader = $scope.uploader = new FileUploader({
            url: App.Util.getFullUrl('dropbox/upload/resource'),
            formData: [{
                parameter: JSON.stringify({
                    filetype: 'photo',
                    dbId: App.Temp.dbId,
                    pid: objCtrl.data.pid
                })
            }]
        });
        uploader.filters.push({
            name: 'fileFilter',
            fn: function (item, options) {
                var type = item.type.slice(item.type.lastIndexOf('/') + 1);
                return ['jpg', 'png', 'jpeg', 'bmp', 'gif'].indexOf(type) !== -1;
            }
        });
        /* 添加完所有文件*/
        uploader.onAfterAddingFile = function (fileItem) {
            uploader.uploadAll();
        };
        uploader.onBeforeUploadItem = function (item) {
            $scope.showProgress = true;
        };
        
        uploader.onCompleteAll = function () {
            if ($scope.uploader.progress == 100) {
                $scope.showProgress = false;
            }
        };
        /* 添加上传文件失败*/
        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            swal('文件格式不符', '只能上传格式为jpg|png|jpeg|bmp|gif的图片', 'warning');
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.errcode == 0) {
                afterUpload(response.data.PID);
            }
        };

        $scope.bigImgStyle = {
            width: 'auto',
            height: 'auto',
            'max-height': '100%',
            'max-width': '100%',
            cursor: 'move'
        };
        /**
         * 初始化照片
         * @param {number} type 照片时间 0-当前作业季 1历史
         * @return {undefined}
        */
        function initPhotos(type) {
            $scope.currentPage = 1;
            getCurrentPagePhotos(1, type);
        }
      /**
       * initDeepPhotos
       * @return {undefined}
       */
        function initDeepPhotos() {
            var i;
            $scope.tempPhotos = [];
            var memos = [];
            var photo;
            for (i = 0; i < $scope.poi.photos.length; i++) {
                photo = $scope.poi.photos[i];
                if (photo.tag === 7) {
                    memos.push(photo.memo);
                } else { // 深度信息显示的是tag不等于7的照片
                    photo.originUrl = App.Util.getPhotoUrl(photo.fccPid, 'origin');
                    photo.thumbnailUrl = App.Util.getPhotoUrl(photo.fccPid, 'thumbnail');
                    $scope.tempPhotos.push(photo);
                }
            }
            $scope.tempPhotos.forEach(function (item) {
                item.tagFlag = memos.indexOf(item.fccPid) >= 0;
            });

            $scope.currentPage = 1;
            /* 当前选中图片*/
            $scope.nowActiveImg = $scope.tempPhotos[0] || '';
            $scope.nowActiveIndex = 0;
            if ($scope.tempPhotos.length) {
                for (i = 0; i < $scope.tempPhotos.length; i++) {
                    if ($scope.tempPhotos[i].originUrl) {
                        $scope.nowActiveIndex = 1;
                    }
                }
            }
        }
      /**
       * initCheckResult
       * @param {Boolean} flag 条件判断
       * @return {Array} ret
       */
        function initCheckResult(flag) {
            var checkType;
            if (flag === 2) {
                checkType = 'DEEP';
            } else {
                checkType = 'POI_ROW_COMMIT';
            }
            $scope.checkResultTableParam = new NgTableParams({}, {
                counts: [],
                getData: function (params) {
                    return dsEdit.getPoiCheckData($scope.poi.pid, checkType).then(function (data) {
                        var ret = [];
                        if (data !== -1) {
                            // params.total(data.total);
                            for (var i = 0, len = data.data.length; i < len; i++) {
                                ret.push(new FM.dataApi.IxCheckResult(data.data[i]));
                            }
                        }
                        return ret;
                    });
                }
            });
        }

        $scope.doIgnoreCheckResult = function (row) {
            dsEdit.updateCheckStatus(row.pid, 0, 2).then(function (data) {
                if (data !== -1) {
                    $scope.checkResultTableParam.reload();
                }
            });
        };

        var initTools = function () {
            // 图片放大缩小
            var poiImage = document.getElementById('poiImage');
            if (poiImage) {
                poiImage.dispatchEvent(new CustomEvent('wheelzoom.destroy'));
                wheelzoom(poiImage);
            }

            if (App.Temp.monthTaskType) { // 月编深度信息
                poiType = 'deepPids';
            } else {
                poiType = 'poiPids';
            }
            // 当前编辑条数
            var poiPids = sessionStorage.getItem(poiType) ? sessionStorage.getItem(poiType).split(',') : [];
            $scope.poiPidList = poiPids;
            $scope.poiListTotal = poiPids.length;
            var listSelectedPid = sessionStorage.getItem('listSelectedPid');
            var index = poiPids.indexOf(listSelectedPid);
            $scope.poiIndexPage = index + 1;

            // 由于poi列表替换为前端分页，所以如下代码暂时屏蔽以免后面再换成前端分页
            // var poiSession = sessionStorage.getItem('poiDataListParam') ? sessionStorage.getItem('poiDataListParam').split(',') : [];
            // if (poiSession.length) {
            //     var pageNum = parseInt(poiSession[1], 10) - 1;
            //     var pageSize = parseInt(poiSession[2], 10);
            //     $scope.poiListTotal = poiSession[3];
            //     $scope.poiIndexPage = (poiPids.indexOf($scope.poi.pid.toString()) + 1) + pageNum * pageSize;
            // }
        };

        //  dateString格式为：yyyymmddhhmmss,例如, 20171025183000
        var formatDate = function (dateString) {
            var year = dateString.slice(0, 4);
            var month = dateString.slice(4, 6);
            var day = dateString.slice(6, 8);
            var hour = dateString.slice(8, 10);
            var minute = dateString.slice(10, 12);
            var second = dateString.slice(12);

            return year + '.' + month + '.' + day + ' ' + hour + ':' + minute + ':' + second;
        };

        var sortPhotos = function (pids) {
            var photos = $scope.poi.photos;

            return dsFcc.getPhotosByRowkey({ rowkeys: pids }).then(function (data) {
                if (data !== -1) {
                    //  这里和服务确认好了，返回来的对象数组顺序，和传过去的pids顺序是一致的,不需要两层for循环
                    for (var j = 0, len = data.length; j < len; j++) {
                        photos[j].uploadDate = parseInt(data[j].uploadDate, 10);
                        photos[j].timeString = formatDate(data[j].uploadDate);
                        photos[j].version = data[j].version; // 照片的版本
                    }

                    photos.sort(function (a, b) {
                        return a.uploadDate < b.uploadDate;
                    });
                }
            });
        };

        var getFccPids = function () {
            var pids = [];

            $scope.poi.photos.forEach(function (photo) {
                if (photo.fccPid.length > 0) {
                    pids.push(photo.fccPid);
                }
            });

            return pids;
        };

        $scope.historyPhotos = []; // 存储历史照片

        /**
         * 查询历史照片
         * @param {number} poiPid  poiPid
         * @return {undefined}
         */
        function queryHistoryPhoto(poiPid) {
            dsFcc.queryPhotoByPid(poiPid).then(function (data) {
                if (data) {
                    $scope.historyPhotos = data;
                }
            });
        }

      /**
       * 页面初始化方法
       * @return {undefined}
       */
        function initData() {
            $scope.poi = objCtrl.data;
            $scope.fmFormEditable = $rootScope.Editable && topoEditor.canEdit($scope.poi) && topoEditor.canDelete($scope.poi);

            $scope.seasonsPhoto.type = 0; // 默认是当前作业季

            $scope.showProgress = false;
            $scope.deepInfoFlag = false;
            if (App.Temp.monthTaskType) {
                $scope.deepInfoFlag = true;
                if (App.Temp.monthTaskType == 'deepDetail') { // 当为‘通用’时需要显示全景照片的功能
                    $scope.showWholeScene = true;
                } else {
                    $scope.showWholeScene = false;
                }
            }

            var param = JSON.parse(uploader.formData[0].parameter); // 由于上传组件只在第一次加载的时候初始化，所以需要动态改变参数
            param.pid = $scope.poi.pid;
            uploader.formData[0].parameter = JSON.stringify(param);
            if ($scope.poi.uDate) {
                $scope.poiDate = Utils.dateFormat($scope.poi.uDate);
            } else {
                $scope.poiDate = '';
            }

            if (App.Temp.monthTaskType) {
                initCheckResult(2);
            } else {
                initCheckResult(1);
            }

            var fccPids = getFccPids();
            var photoLength = $scope.poi.photos.length;
            var fccLength = fccPids.length;

            if (photoLength > 0 && photoLength != fccLength) {
                swal('提示', '照片缺失fccPid。', 'info');
            }

            // 由于当前作业季的照片和历史照片是分开查询的，所以屏蔽掉下面的代码
            // if (photoLength > 0 && fccLength === photoLength) {
            //     sortPhotos(fccPids).then(function () {
            //         initPhotos();
            //     });
            // } else {
            //     if (fccLength !== photoLength) {
            //         swal('提示', '照片缺失fccPid。', 'info');
            //     }
            //
            //     initPhotos();
            // }
            queryHistoryPhoto($scope.poi.pid);
            initPhotos($scope.seasonsPhoto.type);
            initTools();
        }

        /* 数据状态*/
        $scope.recordObject = {
            0: '无',
            1: '新增',
            2: '删除',
            3: '修改'
        };
        /* 鲜度验证*/
        $scope.freshObject = {
            0: '否',
            1: '是'
        };
        /* 审核状态*/
        $scope.statusObject = {
            1: '待作业',
            2: '待提交',
            3: '已提交'
        };
        /* 照片标识*/
        $scope.photoTypeOptions = [{
            type: 0,
            label: '当前作业季照片'
        }, {
            type: 1,
            label: '历史照片'
        }];
        /* 照片标识*/
        $scope.photoTagOptions = [{
            id: 7,
            label: '产品全貌'
        }, {
            id: 3,
            label: '名称'
        }, {
            id: 4,
            label: '名片'
        }, {
            id: 5,
            label: '英文名'
        }, {
            id: 1,
            label: '3DLandmark'
        }];
        // 增加变量的目的是为了用于直接通过键获取值
        $scope.photoTagOptionsObj = {
            1: '3DLandmark',
            3: '名称',
            4: '名片',
            5: '英文名',
            7: '产品全貌'
        };
        $scope.photoTagType = 1;

        /* 预览active图片的缩略图*/
        $scope.showPreviewImg = function (img, index) {
            if (!img.originUrl) {
                return;
            }
            if ($scope.nowActiveIndex === index + 1) { // 解决双击照片后不显示的bug
                return;
            }
            $scope.nowActiveImg = img;
            $scope.nowActiveIndex = index + 1;
        };

        $scope.changePage = function (type) {
            if (type == 1) { // 上一页
                if ($scope.currentPage > 1) {
                    $scope.currentPage--;
                    getCurrentPagePhotos($scope.currentPage, $scope.seasonsPhoto.type);
                }
            } else { // 下一页
                if ($scope.currentPage < Math.ceil($scope.currentPhotoList.length / 5)) { // 下一页
                    $scope.currentPage++;
                    getCurrentPagePhotos($scope.currentPage, $scope.seasonsPhoto.type);
                }
            }
        };
        /* 删除照片*/
        $scope.deletePhoto = function (activePhoto) {
            if (!activePhoto.thumbnailUrl) {
                return;
            }

            for (var i = 0; i < $scope.poi.photos.length; i++) { // 从$scope.poi的photo中删除
                var photo = $scope.poi.photos[i];
                if (photo.fccPid == activePhoto.fccPid) {
                    $scope.poi.photos.splice(i, 1);
                    break;
                }
            }

            var countPages = Math.ceil($scope.poi.photos.length / 5);
            $scope.currentPage = countPages;
            getCurrentPagePhotos(countPages, $scope.seasonsPhoto.type);
        };

        // 切换显示全部和当前作业季
        $scope.changePhotoType = function () {
            initPhotos($scope.seasonsPhoto.type);
        };

        $scope.creatPNG = function (image) {
            $scope.cancelAll(); // 先把已有的删掉
            if (image && image.fccPid) {
                var param = {
                    newFccPid: image.fccPid,
                    oldFccPid: '',
                    flag: 1
                };
                dsFcc.setPhoto(param).then(function (data) {
                    if (data.PID) {
                        var img = new FM.dataApi.IxPoiPhoto({
                            fccPid: data.PID,
                            poiPid: $scope.poi.pid,
                            rowId: '',
                            memo: image.fccPid,
                            tag: 7
                        });
                        image.tagFlag = true;
                        $scope.poi.photos.push(img);
                    }
                });
            }
        };
        $scope.cancelAll = function () {
            for (var i = 0; i < $scope.poi.photos.length; i++) {
                if ($scope.poi.photos[i].tag === 7) {
                    for (var j = 0; j < $scope.tempPhotos.length; j++) {
                        if ($scope.tempPhotos[j].fccPid === $scope.poi.photos[i].memo) {
                            $scope.tempPhotos[j].tagFlag = false;
                            $scope.poi.photos.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        };

        /**
         * 旋转图片
         * @param {Object} item 当前图片
         * @param {Number} flag 0--表示左旋转 1-表示右旋转
         * @return {undefined}
         */
        $scope.rotateBigImg = function (item, flag) {
            if (item && item.fccPid) {
                var param = {
                    fccPid: item.fccPid,
                    flag: flag
                };
                $scope.showProgress = true;
                dsFcc.rotatePhoto(param).then(function (data) {
                    $scope.showProgress = false;
                    if (data && data.data) {
                        if (data.data.message === '旋转成功') {
                            var timestamp = new Date().getTime();
                            var thumbUrl = item.thumbnailUrl.split('&_time=')[0];
                            var originUrl = item.originUrl.split('&_time=')[0];
                            item.thumbnailUrl = thumbUrl + '&_time="' + timestamp + '"';
                            item.originUrl = originUrl + '&_time="' + timestamp + '"';
                        }
                    }
                });
            }
        };
        
        $scope.getPreInfo = function () {
            if (!sessionStorage.getItem(poiType)) {
                swal('注意', '没有找到上一条数据！', 'info');
                return;
            }
            var poiPids = sessionStorage.getItem(poiType).split(',');
            var pid = sessionStorage.getItem('listSelectedPid');
            var index = poiPids.indexOf(pid);
            if (index > 0) {
                var feature = {
                    pid: parseInt(poiPids[index - 1], 0),
                    geoLiveType: 'IXPOI'
                };
                sessionStorage.setItem('listSelectedPid', feature.pid); // 用于判断当前编辑的是地图上选择的还是列表中的
                $scope.$emit('ObjectSelected', {
                    feature: feature
                });
            } else if (index === 0) {
                swal('注意', '已经是第一条数据了！', 'info');
            } else {
                swal('注意', '没有找到上一条数据！', 'info');
            }
        };
        $scope.getNextInfo = function () {
            if (!sessionStorage.getItem(poiType)) {
                swal('注意', '没有找到下一条数据！', 'info');
                return;
            }
            var poiPids = sessionStorage.getItem(poiType).split(',');
            var pid = sessionStorage.getItem('listSelectedPid');
            var index = poiPids.indexOf(pid);
            if (index > -1 && index !== (poiPids.length - 1)) {
                var feature = {
                    pid: parseInt(poiPids[index + 1], 0),
                    geoLiveType: 'IXPOI'
                };
                sessionStorage.setItem('listSelectedPid', feature.pid); // 用于判断当前编辑的是地图上选择的还是列表中的
                $scope.$emit('ObjectSelected', {
                    feature: feature
                });
            } else if (index === (poiPids.length - 1)) {
                swal('注意', '已经是最后一条数据了！', 'info');
            } else {
                swal('注意', '没有找到下一条数据！', 'info');
            }
        };

        $scope.showPoi = function (item) {
            $scope.$emit('ObjectSelected', {
                feature: {
                    pid: item.pid,
                    geoLiveType: 'IXPOI'
                }
            });
        };

        $scope.confirm = function () {
            $scope.showProgress = true;
            $scope.$emit('Photo-Link-POI');
        };

        $scope.$on('Photo-Link-POI-Upload', function (event, data) {
            var param = {
                accessToken: App.Temp.accessToken,
                dbId: App.Temp.dbId,
                objectPid: objCtrl.data.pid,
                dirIndex: data.dirIndex,
                image: data.image
            };

            dsEdit.uploadPhoto(param).then(function (res) {
                afterUpload(res.PID);
                $scope.showProgress = false;
            });
        });

        $scope.$on('PoiLeftViewPanelReload', initData);
    }
]);
