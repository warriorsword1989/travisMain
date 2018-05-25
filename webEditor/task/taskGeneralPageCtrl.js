/**
 * 左侧任务面板主Ctrl
 */

angular.module('app').controller('taskGeneralPageCtrl', ['$scope', 'ngDialog', '$ocLazyLoad',
    'appPath', 'dsManage', 'dsFcc', '$timeout',
    function ($scope, ngDialog, $ocLazyLoad, appPath, dsManage, dsFcc, $timeout) {
        $scope.loading = { flag: false }; // loading遮罩层
        dsManage.referenceLoadingSwitch($scope.loading);
        $scope.childMarchFlag = false; // 任务进展折叠flag;
        $scope.leftMenuStatus = true;   // 左侧列表展开状态

        /**
         * 打开历史数据面板
         * @return {undefined}
         */
        $scope.openChildMarch = function () {
            $scope.childMarchFlag = !$scope.childMarchFlag;
        };

        /**
         * 退出系统
         * @return {undefined}
         */
        $scope.logout = function () {
            window.location.href = '#/login';
            ngDialog.close();
        };

        // 菜单的高度
        $scope.menuListStyle = {
            height: (document.documentElement.clientHeight - 100) + 'px'
        };
        $scope.currentSelected = null;  // 当前选中

        // 任务类型定义
        $scope.taskTypes = {
            '-1': '总览',
            0: 'POI_采集',
            1: '道路_采集',
            2: '一体化_采集',
            3: '一体化_grid粗编_日编',
            4: '一体化_区域粗编_日编',
            5: 'POI粗编_日编',
            6: '代理店',
            7: 'POI专项_月编',
            8: '道路_grid精编',
            9: '道路_grid粗编',
            10: '道路区域专项',
            11: '预处理子任务',
            96: '众包任务',
            97: '外业采集',
            98: '多源任务',
            99: '精细化采集'
        };

        /**
         * 提取公共方法 加载任务表
         * @param {String} ctl table对应的ctl
         * @param {String} tpl table对应的tpl
         * @return {undefined}
         */
        let loadTaskTable = function (ctl, tpl) {
            $ocLazyLoad.load(ctl).then(function () {
                $scope.taskListUrl = tpl;
                $scope.taskHistoryHighLight = false;
                $timeout(function () {
                    $scope.$broadcast('queryTaskList', $scope.currentSelected);
                }, 500);
            });
            $ocLazyLoad.load('./task/taskGridPagerCtrl.js');
        };

        /**
         * 按显示方式显示当前任务列表
         * @return {String} null
         */
        let showTaskList = function () {
            if ($scope.currentSelected === 'taskHistory') {
                $ocLazyLoad.load('./task/taskList/taskHistoryCtrl.js').then(function () {
                    $scope.taskListUrl = './task/taskList/taskHistoryTemp.html';
                    $scope.taskHistoryHighLight = true;
                });
                return;
            }
            switch ($scope.currentSelected.type) {
                case 3:
                case 4:
                    loadTaskTable('./task/taskList/taskRoadTableCtrl.js',
                        './task/taskList/taskRoadTableTpl.html');
                    break;
                case 7:
                    loadTaskTable('./task/taskList/taskSpecialTableCtrl.js',
                        './task/taskList/taskSpecialTableTpl.html');
                    break;
                // 众包
                case 96:
                    loadTaskTable('./task/taskList/taskCollectTableCtrl.js',
                        './task/taskList/taskCollectTableTpl.html');
                    break;
                // 外业采集
                case 97:
                    loadTaskTable('./task/taskList/taskCollectTableCtrl.js',
                        './task/taskList/taskCollectTableTpl.html');
                    break;
                // 多源
                case 98:
                    loadTaskTable('./task/taskList/taskMutiSourceTableCtrl.js',
                        './task/taskList/taskMutiSourceTableTpl.html');
                    break;
                // 精细化采集
                case 99:
                    loadTaskTable('./task/taskList/taskRefineTableCtrl.js',
                        './task/taskList/taskRefineTableTpl.html');
                    break;
                default:
                    loadTaskTable('./task/taskList/taskTableCtrl.js',
                        './task/taskList/taskTableTpl.html');
                    break;
            }
        };


        /**
         * 切换左侧列表展开状态
         * @return {undefined}
         */
        $scope.changeLeftMenuStatus = function () {
            $scope.leftMenuStatus = !$scope.leftMenuStatus;
            if ($scope.leftMenuStatus) {
                $scope.leftMenuStyle = {
                    'padding-left': '240px'
                };
                $scope.leftMenuFoldStyle = {
                    left: '205px'
                };
            } else {
                $scope.leftMenuStyle = {
                    'padding-left': '0'
                };
                $scope.leftMenuFoldStyle = {
                    left: 0
                };
            }
        };

        /**
         * 点击父节点
         * @param {Object} data 该类型任务
         * @param {boolean} firstLoad 是否初次加载
         * @return {undefined}
         */
        $scope.selectTaskList = function (data, firstLoad) {
            if (!data) {
                return;
            }
            if (data.isParent) {
                data.isOpen = !data.isOpen;
                if (firstLoad) {
                    $scope.currentSelected = data.child[Object.keys(data.child)[0]];
                    showTaskList();
                }
            } else {
                data.select = true;
                $scope.currentSelected = data;
                showTaskList();
            }
        };

        /**
         * 选择任务类型
         * @param {Object} data 该类型任务
         * @return {undefined}
         */
        $scope.showTaskDetail = function (data) {
            if (!data.isParent) {
                for (let i = 0; i < $scope.finalResultArray.length; i++) {
                    let taskChildObject = $scope.finalResultArray[i].child;
                    $scope.finalResultArray[i].select = false;
                    if (Object.keys(taskChildObject).length) {
                        for (let key in taskChildObject) {
                            if (key) {
                                taskChildObject[key].select = false;
                            }
                        }
                    }
                }
            }
            $scope.selectTaskList(data);
        };

        /**
         * 初始化左侧列表默认active
         * @param {Object} oldTask 之前所选任务
         * @return {undefined}
         */
        let initTaskVisible = function (oldTask) {
            if (oldTask.isParent) {
                oldTask.isOpen = true;
                oldTask.child[Object.keys(oldTask.child)[0]].select = true;
            } else {
                oldTask.select = true;
            }
        };

        /**
         * 获取已经选中的
         * @return {undefined}
         */
        let getOldSelect = function () {
            let oldSelect = null;

            for (let i = 0, len = $scope.finalResultArray.length; i < len; i++) {
                let item = $scope.finalResultArray[i];

                // 如果有子集
                if (Object.keys(item.child).length) {
                    for (let key in item.child) {
                        if (item.child[key].datas) {
                            let childData = item.child[key].datas;
                            item.isOpen = true; // 每一个父节点默认展开
                            for (let j = 0; j < childData.length; j++) {
                                if (childData[j].subtaskId === App.Temp.subTaskId) {
                                    oldSelect = item.child[key];
                                }
                            }
                        }
                    }
                } else if (item.type === 7) {
                    if (item.type === App.Temp.taskType) {
                        oldSelect = item;
                    }
                } else {
                    for (let j = 0, len2 = item.datas.length; j < len2; j++) {
                        let card = item.datas[j];

                        if (card.subtaskId === App.Temp.subTaskId) {
                            oldSelect = item;
                        }
                    }
                }
            }

            if (!oldSelect && $scope.finalResultArray.length > 0) {
                oldSelect = $scope.finalResultArray[0];
                if (oldSelect.isParent) {
                    oldSelect.isOpen = true;
                    oldSelect.child[Object.keys(oldSelect.child)[0]].select = true;
                } else {
                    oldSelect.select = true;
                }
            } else if (oldSelect) {
                oldSelect.select = true;
            }

            return oldSelect;
        };

        /**
         * 月编专项任务控制
         * 由于项目管理那边的改动，不在返回type等于7（月编专项任务） ，但是页面需要显示所以前端自动维护。
         * @param {Array} taskList 任务列表
         * @return {undefined}
         */
        function specailProjectCtl(taskList) {
            var flag = false;
            taskList.forEach(function (task) {
                if (task.type == 7) {
                    flag = true;
                }
            });
            if (flag) {
                swal('注意', '接口返回了月编专项任务，请确认任务分配是否正确！', 'info');
            } else {
                taskList.push({
                    name: '这是前段程序维护的月编任务',
                    type: 7
                });
            }
        }

        /**
         * 搜索所有的子任务并组成数据模型;
         * @return {undefined}
         */
        $scope.getTaskTotal = function () {
            let param = {
                platForm: 1,
                snapshot: 1,
                status: 1,
                pageSize: 10000
            };
            $scope.finalResultObj = {};
            $scope.finalResultArray = [];
            dsManage.getSubtaskListByUser(param).then(function (data) {
                let results = data.data.result;

                specailProjectCtl(results); // 需求4572,前端维护月编专项任务

                results.forEach(function (item) {
                    let cond1 = [0, 2, 3, 4, 7].indexOf(item.type) > -1;
                    let cond2 = true;
                    let taskType = item.type;
                    let collectType = {
                        1: { name: '外业采集', type: 97 },
                        2: { name: '众包', type: 96 },
                        4: { name: '多源', type: 98 },
                        5: { name: '精细化采集', type: 99 }
                    };
                    if (item.descp) { cond2 = !/预处理/g.test(item.descp); }
                    if (cond1 && cond2) {
                        if (!$scope.finalResultObj[taskType]) {
                            $scope.finalResultObj[taskType] =
                            {
                                total: 0,
                                datas: [],
                                type: taskType,
                                child: {},
                                isParent: false,    // 父节点
                                isOpen: false   // 默认关闭
                            };
                        }
                        // 多源任务
                        if ((item.type === 0 || item.type === 2) &&
                            (item.workKind === 1 || item.workKind === 2 || item.workKind === 4 || item.workKind === 5)) {
                            if (!$scope.finalResultObj[taskType].child[item.workKind]) {
                                $scope.finalResultObj[taskType].child[item.workKind] = {
                                    total: 0,
                                    datas: [],
                                    name: collectType[item.workKind].name,
                                    type: collectType[item.workKind].type,
                                    select: false
                                };
                            }
                            $scope.finalResultObj[taskType].isParent = true;
                            $scope.finalResultObj[taskType].child[item.workKind].datas.push(item);
                            $scope.finalResultObj[taskType].child[item.workKind].total += 1;
                        } else if (item.type === 7) { // 月编专项不存在子任务，为了便于高亮，虚拟一个
                            $scope.finalResultObj[taskType] = {
                                total: 0,
                                datas: [],
                                child: {},
                                isOpen: false,
                                isParent: false,
                                select: false,
                                type: 7
                            };
                        } else {
                            $scope.finalResultObj[taskType].datas.push(item);
                        }
                        $scope.finalResultObj[taskType].total += 1;
                        $scope.finalResultObj[taskType].select = false;
                        $scope.finalResultObj[taskType].taskType = $scope.taskTypes[taskType];
                    }
                });
                // 解决总览总是在最后的问题;
                for (let key in $scope.finalResultObj) {
                    if (key) {
                        $scope.finalResultArray.push($scope.finalResultObj[key]);
                    }
                }
                // 更新当前选中值;
                if (!$scope.currentSelected) {
                    let oldItem = getOldSelect();
                    $scope.currentSelected = FM.Util.clone(oldItem);
                } else {
                    for (let m = 0; m < $scope.finalResultArray.length; m++) {
                        if ($scope.finalResultArray[m].type === $scope.currentSelected.type) {
                            $scope.currentSelected = FM.Util.clone($scope.finalResultArray[m]);
                            break;
                        }
                        if (m === $scope.finalResultArray.length - 1
                            && $scope.finalResultArray[m].type !== $scope.currentSelected.type) {
                            $scope.currentSelected = $scope.finalResultArray[0];
                        }
                    }
                }
                $scope.selectTaskList($scope.currentSelected, true);
            });
        };

        window.onresize = function () {
            $scope.menuListStyle = {
                height: (document.documentElement.clientHeight - 100) + 'px'
            };
            $scope.$broadcast('resizeTaskTable');
        };
        
        $scope.getTaskTotal();
        // 提交或关闭后触发;
        $scope.$on('pushTaskList', function () {
            $scope.getTaskTotal();
        });
    }
]);
