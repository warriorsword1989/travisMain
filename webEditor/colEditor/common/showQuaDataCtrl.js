/**
 * Created by wangmingdong on 2017/5/26.
 */

angular.module('app').controller('showQuaDataCtrl', ['$scope', 'dsColumn',
    function ($scope, dsColumn) {
        // 18个字段 roadName + addrName
        var splitFields = {
            0: '省名',
            1: '市名',
            2: '区县名',
            3: '乡镇街道办',
            4: '小区名',
            5: '街巷名',
            6: '标志物名',
            7: '前缀',
            8: '门牌号',
            9: '类型名',
            10: '子号',
            11: '后缀',
            12: '附属设施名',
            13: '楼栋号',
            14: '楼门号',
            15: '楼层',
            16: '房间号',
            17: '附加信息'
        };

        // 对比18个字段的前后修改值中具体哪个字段值不同
      /**
       * @param {String} oldVal 旧值
       * @param {String} newVal 新值
       * @return {Array} errTypeArr
      */
        function compareSplitfileds(oldVal, newVal) {
            var errTypeArr = [];
            var oldValArr;
            var newValArr;
            var i;
            var n;
            if (oldVal && newVal) {
                oldValArr = oldVal.split('|');
                newValArr = newVal.split('|');
                for (i = 0, n = oldValArr.length; i < n; i++) {
                    if (oldValArr[i] != newValArr[i]) {
                        errTypeArr.push(splitFields[i]);
                    }
                }
            } else if (oldVal) {
                oldValArr = oldVal.split('|');
                for (i = 0, n = oldValArr.length; i < n; i++) {
                    if (oldValArr[i]) {
                        errTypeArr.push(splitFields[i]);
                    }
                }
            } else if (newVal) {
                newValArr = newVal.split('|');
                for (i = 0, n = newValArr.length; i < n; i++) {
                    if (newValArr[i]) {
                        errTypeArr.push(splitFields[i]);
                    }
                }
            }
            return errTypeArr;
        }

        var initPage = function (id) {
            var param = {
                pid: id,
                firstWorkItem: JSON.parse(sessionStorage.getItem('FM-Quality-one-level')).workType,
                secondWorkItem: $scope.main.workType,
                nameId: $scope.quaNameId
            };
            dsColumn.queryOcProblem(param).then(function (res) {
                if (res && res.length) {
                    $scope.quaData = res[0];
                    if ($scope.main.workType == 'addrSplit') {
                        $scope.quaData.problemDesc = compareSplitfileds($scope.quaData.oldValue, $scope.quaData.newValue);
                    } else {
                        $scope.quaData.problemDesc = res[0].problemDesc;
                    }
                    if (res[0].errorType) {
                        $scope.quaData.errorType = res[0].errorType.split(',');
                    }
                    $scope.quaData.errorLevel = $scope.quaData.errorLevel ? $scope.quaData.errorLevel : $scope.errorLevels[3];
                    $scope.quaData.errorType = $scope.quaData.errorType.length ? $scope.quaData.errorType : [$scope.quasArray[0]];
                }
            });
        };

        // 等级
        $scope.errorLevels = [
            'S',
            'A',
            'B',
            'C'
        ];

        // 保存质检问题
        $scope.doSaveQua = function () {
            // 如果错误等级、错误类型、问题描述没有值；不允许保存
            if (!$scope.quaData.errorType.length) {
                swal('提示', '错误类型不能为空', 'error');
                return;
            }
            if (!$scope.quaData.errorLevel) {
                swal('提示', '错误等级不能为空', 'error');
                return;
            }
            if (!$scope.quaData.problemDesc) {
                swal('提示', '问题描述不能为空', 'error');
                return;
            }
            var param = {
                pid: $scope.quaData.pid,
                firstWorkItem: JSON.parse(sessionStorage.getItem('FM-Quality-one-level')).workType,
                secondWorkItem: $scope.main.workType,
                errorType: $scope.quaData.errorType.join(','),
                errorLevel: $scope.quaData.errorLevel,
                problemDesc: $scope.quaData.problemDesc,
                techGuidance: $scope.quaData.techGuidance || '',
                techScheme: $scope.quaData.techScheme || '',
                nameId: $scope.quaNameId,
                id: $scope.quaData.id
            };
            $scope.showLoading.flag = true;
            dsColumn.saveOcProblem(param).then(function (res) {
                if (res) {
                    swal('提示', '保存成功，更新' + res.count + '行！', 'info');
                    $scope.$emit('closeQuaInfoModal', true);
                    $scope.$emit('refreshChildrenPage', { showErrMsg: 1, pid: $scope.quaData.pid, nameId: parseInt($scope.quaNameId, 10) });
                    $scope.showLoading.flag = false;
                }
            });
        };

        $scope.$on('refreshShowQua', function (event, data) {
            $scope.quasArray = [];
            $scope.quaData = {};
            $scope.quaData.errorType = '';
            $scope.quaNameId = data.nameId;
            initPage(data.id);
            var ruleArray = data.rule.split(',');
            if (ruleArray.length > 1) {
                for (var i = 0; i < ruleArray.length; i++) {
                    if (i == 0) {
                        $scope.quasArray = App.Config.Constant.poi.quaLevel[ruleArray[i]];
                    } else {
                        $scope.quasArray = $scope.quasArray.concat(App.Config.Constant.poi.quaLevel[ruleArray[i]]);
                    }
                }
            } else {
                $scope.quasArray = App.Config.Constant.poi.quaLevel[data.rule];
            }
            $scope.quasArray = Utils.distinctArr($scope.quasArray);
        });
    }
]);
