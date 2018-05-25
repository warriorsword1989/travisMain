FM.ColumnUtils = FM.ColumnUtils || {};
FM.extend(FM.ColumnUtils, {
    config: {
        workBatch: { // 月编的批次
            11: '快速-M1',
            12: '策略-M1',
            21: '快速-M2',
            22: '策略-M2',
            23: '常规-M2',
            31: '快速-M3',
            32: '策略-M3',
            33: '常规-M3'
        }
    },
    getUserAndTaskInfo: function (scope, cookies) {
        var userCookie = App.Util.getSessionStorage('User');
        if (userCookie && userCookie.userRealName) {
            scope.userName = userCookie.userRealName;
        } else {
            swal({
                title: '提示',
                text: '未登录，请先登录！',
                type: 'warning'
            }, function () {
                scope.loginOut();
            });
            return false;
        }
        var taskCookie = cookies.getObject('FM-EDITOR-SubTask');
        if (taskCookie) {
            App.Temp.dbId = taskCookie.dbId;
            App.Temp.subTaskId = taskCookie.subTaskId;
            App.Temp.taskType = taskCookie.taskType;
        }
        return true;
    },
    // 根据实际的行高设置每行的height属性，主要处理grid高度改变后，canvas的高度没有自动变化的问题
    uiGridAutoHight: function (rows, columns) {
        if (rows.length > 0) {
            setTimeout(function () {
                var rowElems = rows[0].grid.element.find('.ui-grid-canvas').children();
                rows.forEach(function (item, i) {
                    var t = angular.element(rowElems[i]);
                    if (t.height()) { // 大数据量时，数据加载不全问题
                        item.height = t.height();
                    }
                });
            });
        }
        return rows;
    }
});
