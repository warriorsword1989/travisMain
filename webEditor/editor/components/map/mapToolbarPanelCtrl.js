/**
 * Created by zhaohang on 2016/11/22.
 */

angular.module('app').controller('MapAllToolbarPanelCtrl', ['$scope', '$rootScope', '$compile', '$timeout',
    function ($scope, $rootScope, $compile, $timeout) {
        // var layerCtrl = fastmap.uikit.LayerController();
        var shapeCtrl = fastmap.uikit.ShapeEditorController();

        $scope.groups = [
            {
                name: '辅助工具',
                tools: [{
                    text: '测量距离',
                    name: 'distance',
                    title: '测距离',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/distance.png',
                    fun: 'distance()'
                }, {
                    text: '测量角度',
                    name: 'angle',
                    title: '测角度',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/angle.png',
                    fun: 'angle()'
                }, {
                    text: '测量面积',
                    name: 'area',
                    title: '测面积',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/area.png',
                    fun: 'area()'
                }, {
                    text: '自动打断道路线',
                    isLong: true,
                    name: 'autoBreak',
                    title: 'RDLINK自动打断',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/auto-break.svg',
                    fun: 'autoBreak(\'RDLINK\')'
                }]
            },
            {
                name: 'POI批处理工具',
                tools: [{
                    text: '移动POI显示坐标',
                    isLong: true,
                    name: 'batchTranslateIXPOILocation',
                    title: '批量移动POI显示坐标',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/batch-translate-poi.svg',
                    fun: 'batchTranslateIndexLocation(\'IXPOI\')'
                }, {
                    text: '重合POI显示坐标',
                    isLong: true,
                    name: 'batchConvergeIXPOILocation',
                    title: '批量重合POI显示坐标',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/batch-converge-poi-location.svg',
                    fun: 'batchConvergeIndexLocation(\'IXPOI\')'
                }, {
                    text: '自动匹配POI引导坐标',
                    isLong: true,
                    name: 'batchIXPOIGuideAuto',
                    title: '批量自动匹配POI引导坐标',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/batch-poi-guide-auto.svg',
                    fun: 'batchIndexGuideAuto(\'IXPOI\')'
                }, {
                    text: '手动指定POI引导坐标',
                    isLong: true,
                    name: 'batchIXPOIGuideManual',
                    title: '批量手动指定POI引导坐标',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/batch-poi-guide-manual.svg',
                    fun: 'batchIndexGuideManual(\'IXPOI\')'
                }, {
                    text: '移动点门牌显示坐标',
                    isLong: true,
                    name: 'batchTranslateIXPOINTADDRESSLocation',
                    title: '批量移动点门牌显示坐标',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/batch-translate-address.svg',
                    fun: 'batchTranslateIndexLocation(\'IXPOINTADDRESS\')'
                }, {
                    text: '重合点门牌显示坐标',
                    isLong: true,
                    name: 'batchConvergeIXPOINTADDRESSLocation',
                    title: '批量重合点门牌显示坐标',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/batch-converge-address-location.svg',
                    fun: 'batchConvergeIndexLocation(\'IXPOINTADDRESS\')'
                }, {
                    text: '自动匹配点门牌引导坐标',
                    isLong: true,
                    name: 'batchIXPOINTADDRESSGuideAuto',
                    title: '批量自动匹配点门牌引导坐标',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/batch-address-guide-auto.svg',
                    fun: 'batchIndexGuideAuto(\'IXPOINTADDRESS\')'
                }, {
                    text: '手动指定点门牌引导坐标',
                    isLong: true,
                    name: 'batchIXPOINTADDRESSGuideManual',
                    title: '批量手动指定点门牌引导坐标',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/batch-address-guide-manual.svg',
                    fun: 'batchIndexGuideManual(\'IXPOINTADDRESS\')'
                }]
            },
            {
                name: 'POI创建工具',
                tools: [{
                    text: 'POI',
                    name: 'IXPOI',
                    title: '创建POI',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-poi.png',
                    fun: 'create($event, \'IXPOI\')'
                }, {
                    text: '点门牌',
                    name: 'IXPOINTADDRESS',
                    title: '创建点门牌',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-pointAddress.png',
                    fun: 'create($event, \'IXPOINTADDRESS\')'
                }]
            },
            {
                name: '道路批处理工具',
                tools: [{
                    text: '道路点批处理',
                    name: 'batch-RDNODE',
                    title: '框选rdNode',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/frame-select-point.png',
                    fun: 'batchSelect($event, \'RDNODE\', \'batch\')'
                }, {
                    text: '道路线批处理',
                    name: 'batch-RDLINK',
                    title: '框选线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/frame-select-line.png',
                    fun: 'batchSelect($event, \'RDLINK\', \'batch\')'
                }, {
                    text: 'Tips批处理',
                    name: 'batch-TIPS',
                    title: '框选tips',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/frame-select-tips.png',
                    fun: 'batchSelect($event, \'TIPS\', \'batch\')'
                }, {
                    text: '追踪选线',
                    name: 'track-RDLINK',
                    title: '追踪选线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/truck-line.png',
                    fun: 'batchSelect($event, \'RDLINK\', \'track\')'
                }]
            },
            {
                name: '道路要素 - 创建几何形状',
                tools: [{
                    text: '道路线',
                    name: 'RDLINK',
                    title: '制作道路线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-link.png',
                    fun: 'create($event, \'RDLINK\')'
                }, {
                    text: '道路点',
                    name: 'RDNODE',
                    title: '制作道路点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-node.png',
                    fun: 'create($event, \'RDNODE\')'
                }]
            },
            {
                name: '道路要素 - 创建路口关系',
                tools: [{
                    text: '路口',
                    name: 'RDCROSS',
                    title: '制作路口',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-crossing.png',
                    fun: 'create($event, \'RDCROSS\')'
                }, {
                    text: '车信',
                    name: 'RDLANECONNEXITY',
                    title: '制作车信',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-lane-information.png',
                    fun: 'create($event, \'RDLANECONNEXITY\')'
                }, {
                    text: '交限',
                    name: 'RDRESTRICTION',
                    title: '制作交限',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-traffic-limitation.png',
                    fun: 'create($event, \'RDRESTRICTION\')'
                }, {
                    text: '顺行',
                    name: 'RDDIRECTROUTE',
                    title: '制作顺行',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-anterograde.png',
                    fun: 'create($event, \'RDDIRECTROUTE\')'
                }, {
                    text: '分叉口',
                    name: 'RDSE',
                    title: '制作分叉口',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-fork.png',
                    fun: 'create($event, \'RDSE\')'
                }, {
                    text: '坡度',
                    name: 'RDSLOPE',
                    title: '制作坡度',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-gradient.png',
                    fun: 'create($event, \'RDSLOPE\')'
                }, {
                    text: '信号灯',
                    name: 'RDTRAFFICSIGNAL',
                    title: '制作信号灯',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-traffic-lights.png',
                    fun: 'create($event, \'RDTRAFFICSIGNAL\')'
                }]
            },
            {
                name: '道路要素 - 创建分歧',
                tools: [{
                    text: '高速分歧',
                    name: 'RDHIGHSPEEDBRANCH',
                    title: '制作高速分歧',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-road-branch.png',
                    fun: 'create($event, \'RDHIGHSPEEDBRANCH\')'
                }, {
                    text: '方面分歧',
                    name: 'RDASPECTBRANCH',
                    title: '制作方面分歧',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-aspect-branch.svg',
                    fun: 'create($event, \'RDASPECTBRANCH\')'
                }, {
                    text: 'IC分歧',
                    name: 'RDICBRANCH',
                    title: '制作IC分歧',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-ID-branch.svg',
                    fun: 'create($event, \'RDICBRANCH\')'
                }, {
                    text: '3D分歧',
                    name: 'RD3DBRANCH',
                    title: '制作3D分歧',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-3d-branch.svg',
                    fun: 'create($event, \'RD3DBRANCH\')'
                }, {
                    text: '连续分歧',
                    name: 'RDSERIESBRANCH',
                    title: '制作连续分歧',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-series-branch.svg',
                    fun: 'create($event, \'RDSERIESBRANCH\')'
                }, {
                    text: '实景图',
                    name: 'RDREALIMAGE',
                    title: '制作实景图',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-RdRealImage.png',
                    fun: 'create($event, \'RDREALIMAGE\')'
                }, {
                    text: '实景看板',
                    name: 'RDSIGNASREAL',
                    title: '制作实景看板',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-rdsignaseral.svg',
                    fun: 'create($event, \'RDSIGNASREAL\')'
                }, {
                    text: '方向看板',
                    name: 'RDSIGNBOARD',
                    title: '制作方向看板',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-direction-branch.svg',
                    fun: 'create($event, \'RDSIGNBOARD\')'
                }, {
                    text: '复杂路口模式图',
                    isLong: true,
                    name: 'RDCOMPLEXSCHEMA',
                    title: '制作复杂路口模式图',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-RdComplexSchema.png',
                    fun: 'create($event, \'RDCOMPLEXSCHEMA\')'
                }, {
                    text: '大路口交叉点模式图',
                    isLong: true,
                    name: 'RDSCHEMATICBRANCH',
                    title: '制作大路口交叉点模式图',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-cross-pattern-branch.svg',
                    fun: 'create($event, \'RDSCHEMATICBRANCH\')'
                }]
            },
            {
                name: '道路要素 - 创建路上关系',
                tools: [{
                    text: '立交',
                    name: 'RDGSC',
                    title: '制作立交',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-overpass.png',
                    fun: 'create($event, \'RDGSC\')'
                }, {
                    text: '收费站',
                    name: 'RDTOLLGATE',
                    title: '制作收费站',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-toll-station.png',
                    fun: 'create($event, \'RDTOLLGATE\')'
                }, {
                    text: '大门',
                    name: 'RDGATE',
                    title: '制作大门',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-gate.png',
                    fun: 'create($event, \'RDGATE\')'
                }, {
                    text: '电子眼',
                    name: 'RDELECTRONICEYE',
                    title: '制作电子眼',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-RdElectronicEye.png',
                    fun: 'create($event, \'RDELECTRONICEYE\')'
                }, {
                    text: '减速带',
                    name: 'RDSPEEDBUMP',
                    title: '制作减速带',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-RdSpeedBump.png',
                    fun: 'create($event, \'RDSPEEDBUMP\')'
                }, {
                    text: '点限速',
                    name: 'RDSPEEDLIMIT',
                    title: '制作点限速',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-speed-limitation.png',
                    fun: 'create($event, \'RDSPEEDLIMIT\')'
                }, {
                    text: '线限速',
                    name: 'RDLINKSPEEDLIMIT',
                    title: '制作线限速',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-link-speed-limit.svg',
                    fun: 'create($event, \'RDLINKSPEEDLIMIT\')'
                }, {
                    text: '条件线限速',
                    name: 'RDLINKSPEEDLIMIT_DEPENDENT',
                    title: '制作条件线限速',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-link-speed-limit-dependent.svg',
                    fun: 'create($event, \'RDLINKSPEEDLIMIT_DEPENDENT\')'
                }, {
                    text: '警示信息',
                    name: 'RDLINKWARNING',
                    title: '制作警示信息',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-warnning-information.png',
                    fun: 'create($event, \'RDLINKWARNING\')'
                }, {
                    text: '可变限速',
                    name: 'RDVARIABLESPEED',
                    title: '制作可变限速',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-changed-speed-limitation.png',
                    fun: 'create($event, \'RDVARIABLESPEED\')'
                }, {
                    text: '语音引导',
                    name: 'RDVOICEGUIDE',
                    title: '制作语音引导',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-audio-navigation.png',
                    fun: 'create($event, \'RDVOICEGUIDE\')'
                }, {
                    text: '限高限重',
                    name: 'RDHGWGLIMIT',
                    title: '制作限高限重',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-RdHgwgLimit.png',
                    fun: 'create($event, \'RDHGWGLIMIT\')'
                }, {
                    text: '卡车交限',
                    name: 'RDRESTRICTIONTRUCK',
                    title: '制作卡车交限',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-truck-limitation.svg',
                    fun: 'create($event, \'RDRESTRICTIONTRUCK\')'
                }, {
                    text: '里程桩',
                    name: 'RDMILEAGEPILE',
                    title: '制作里程桩',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-RdMileagePile.png',
                    fun: 'create($event, \'RDMILEAGEPILE\')'
                }, {
                    text: '卡车点限速',
                    name: 'RDSPEEDLIMITTRUCK',
                    title: '制作卡车点限速',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-speed-truck.svg',
                    fun: 'create($event, \'RDSPEEDLIMITTRUCK\')'
                }, {
                    text: '卡车线限速',
                    name: 'RDLINKSPEEDTRUCK',
                    title: '制作卡车线限速',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-link-speed-truck.svg',
                    fun: 'create($event, \'RDLINKSPEEDTRUCK\')'
                }, {
                    text: '卡车条件线限速',
                    isLong: true,
                    name: 'RDLINKSPEEDTRUCK_DEPENDENT',
                    title: '制作卡车条件线限速',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-link-speedDependent-truck.svg',
                    fun: 'create($event, \'RDLINKSPEEDTRUCK_DEPENDENT\')'
                }
                //     , {
                //     text: '详细车道',
                //     name: 'RDLANE',
                //     title: '制作详细车道',
                //     img: '../../images/newPoi/toolIcon/quickToolIcon/add-link-speedDependent-truck.svg',
                //     fun: 'create($event, \'RDLANE\')'
                // }
                ]
            },
            {
                name: '道路要素 - 创建组合关系',
                tools: [{
                    text: '同一点',
                    name: 'RDSAMENODE',
                    title: '制作同一点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-same-point.png',
                    fun: 'create($event, \'RDSAMENODE\')'
                }, {
                    text: '同一线',
                    name: 'RDSAMELINK',
                    title: '制作同一线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-same-line.png',
                    fun: 'create($event, \'RDSAMELINK\')'
                }, {
                    text: 'CRF交叉点',
                    name: 'RDINTER',
                    title: '制作CRF交叉点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-CRF-traffic.png',
                    fun: 'create($event, \'RDINTER\')'
                }, {
                    text: 'CRF道路',
                    name: 'RDROAD',
                    title: '制作CRF道路',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-CRF-road.png',
                    fun: 'create($event, \'RDROAD\')'
                }, {
                    text: 'CRF对象',
                    name: 'RDOBJECT',
                    title: '制作CRF对象',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-CRF-object.png',
                    fun: 'create($event, \'RDOBJECT\')'
                }, {
                    text: '辅路',
                    name: 'RDSIDEROAD',
                    title: '制作辅路',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-side-road.png',
                    fun: 'createUpDownAndSideRoad($event, \'RDSIDEROAD\')'
                }, {
                    text: '上下线分离',
                    name: 'RDMULTIDIGITIZED',
                    title: '制作上下线分离',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-multidigitized.png',
                    fun: 'createUpDownAndSideRoad($event, \'RDMULTIDIGITIZED\')'
                }]
            },
            {
                name: '背景要素 - 创建铁路背景',
                tools: [{
                    text: '铁路线',
                    name: 'RWLINK',
                    title: '制作铁路线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-rwLink.png',
                    fun: 'create($event, \'RWLINK\')'
                }, {
                    text: '铁路点',
                    name: 'RWNODE',
                    title: '制作铁路线节点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-rwNode.png',
                    fun: 'create($event, \'RWNODE\')'
                }]
            },
            {
                name: '背景要素 - 创建行政区划',
                tools: [{
                    text: '行政区划Link',
                    name: 'ADLINK',
                    title: '制作行政区划面的组成线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-adLink.png',
                    fun: 'create($event, \'ADLINK\')'
                }, {
                    text: '行政区划Node',
                    isLong: true,
                    name: 'ADNODE',
                    title: '制作行政区组成点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-adNode.png',
                    fun: 'create($event, \'ADNODE\')'
                }, {
                    text: '行政区划Face',
                    isLong: true,
                    name: 'ADFACE',
                    title: '制作行政区划面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-adFace.png',
                    fun: 'create($event, \'ADFACE\')'
                }, {
                    text: '选线构建行政区划面',
                    isLong: true,
                    name: 'BUILD-ADFACE',
                    title: '选线构建行政区划面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-buildFace.png',
                    fun: 'build($event, \'BUILD-ADFACE\')'
                }, {
                    text: '行政区划代表点',
                    isLong: true,
                    name: 'ADADMIN',
                    title: '创建行政区划代表点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-ad-admin.svg',
                    fun: 'create($event, \'ADADMIN\')'
                }, {
                    text: '行政区划点关联面',
                    isLong: true,
                    name: 'ADMINJOINFACES',
                    title: '行政区划点关联面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-adminJoinFace.png',
                    fun: 'createAdminJoinFaces($event, \'ADMINJOINFACES\')'
                }]
            },
            {
                name: '背景要素 - 创建Zone背景',
                tools: [{
                    text: 'ZoneLink',
                    name: 'ZONELINK',
                    title: '制作Zone组成线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-ZoneLink.png',
                    fun: 'create($event, \'ZONELINK\')'
                }, {
                    text: 'ZoneNode',
                    name: 'ZONENODE',
                    title: '制作Zone线节点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-ZoneNode.png',
                    fun: 'create($event, \'ZONENODE\')'
                }, {
                    text: 'ZoneFace',
                    name: 'ZONEFACE',
                    title: '制作Zone组成面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-ZoneFace.png',
                    fun: 'create($event, \'ZONEFACE\')'
                }, {
                    text: '选线构建Zone面',
                    isLong: true,
                    name: 'BUILD-ZONEFACE',
                    title: '选线构建Zone面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-buildZoneFace.png',
                    fun: 'build($event, \'BUILD-ZONEFACE\')'
                }]
            },
            {
                name: '背景要素 - 创建土地覆盖',
                tools: [{
                    text: '土地覆盖Link',
                    name: 'LCLINK',
                    title: '制作土地覆盖组成线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-lcLink.png',
                    fun: 'create($event, \'LCLINK\')'
                }, {
                    text: '土地覆盖Node',
                    isLong: true,
                    name: 'LCNODE',
                    title: '制作土地覆盖节点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-lcNode.png',
                    fun: 'create($event, \'LCNODE\')'
                }, {
                    text: '土地覆盖Face',
                    isLong: true,
                    name: 'LCFACE',
                    title: '制作土地覆盖面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-lcFace.png',
                    fun: 'create($event, \'LCFACE\')'
                }, {
                    text: '选线构建土地覆盖面',
                    isLong: true,
                    name: 'BUILD-LCFACE',
                    title: '选线构建土地覆盖面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-lcBuildFace.png',
                    fun: 'build($event, \'BUILD-LCFACE\')'
                }]
            },
            {
                name: '背景要素 - 创建土地利用',
                tools: [{
                    text: '土地利用Link',
                    name: 'LULINK',
                    title: '制作土地利用组成线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-luLink.png',
                    fun: 'create($event, \'LULINK\')'
                }, {
                    text: '土地利用Node',
                    isLong: true,
                    name: 'LUNODE',
                    title: '制作土地利用节点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-luNode.png',
                    fun: 'create($event, \'LUNODE\')'
                }, {
                    text: '土地利用Face',
                    isLong: true,
                    name: 'LUFACE',
                    title: '制作土地利用面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-luFace.png',
                    fun: 'create($event, \'LUFACE\')'
                }, {
                    text: '选线构建土地利用面',
                    isLong: true,
                    name: 'BUILD-LUFACE',
                    title: '选线构土地利用面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-luBuildFace.png',
                    fun: 'build($event, \'BUILD-LUFACE\')'
                }, {
                    text: '土地利用面关联POI',
                    isLong: true,
                    name: 'POIJOIN-LUFACE',
                    title: '土地利用面关联POI',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-luBuildFace.png',
                    fun: 'createPoiJoinOjbect($event, \'POIJOIN-LUFACE\')'
                }]
            },
            {
                name: '背景要素 - 创建市街图',
                tools: [{
                    text: '市街图Link',
                    name: 'CMGBUILDLINK',
                    title: '制作市街图组成线',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-cmgLink.png',
                    fun: 'create($event, \'CMGBUILDLINK\')'
                }, {
                    text: '市街图Node',
                    name: 'CMGBUILDNODE',
                    title: '制市街图节点',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-cmgNode.png',
                    fun: 'create($event, \'CMGBUILDNODE\')'
                }, {
                    text: '市街图Face',
                    name: 'CMGBUILDFACE',
                    title: '制作市街图面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-cmgFace.png',
                    fun: 'create($event, \'CMGBUILDFACE\')'
                }, {
                    text: '选线构建市街图面',
                    isLong: true,
                    name: 'BUILD-CMGBUILDFACE',
                    title: '选线构市街图面',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-cmgBuildFace.png',
                    fun: 'build($event, \'BUILD-CMGBUILDFACE\')'
                }, {
                    text: '市街图要素',
                    name: 'CMGBUILDING',
                    title: '制作市街图要素',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-cmgBuilding.svg',
                    fun: 'create($event, \'CMGBUILDING\')'
                }, {
                    text: '建筑物关联POI',
                    isLong: true,
                    name: 'POIJOIN-CMGBUILDING',
                    title: '市街图要素关联POI',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-cmgBuildFace.png',
                    fun: 'createPoiJoinOjbect($event, \'POIJOIN-CMGBUILDING\')'
                }]
            },
            {
                name: '创建Tips',
                tools: [{
                    text: '接边标识',
                    name: 'TIPBORDER',
                    title: '构建接边标识',
                    img: '../../images/newPoi/toolIcon/quickToolIcon/add-tips.png',
                    fun: 'create($event, \'TIPBORDER\')'
                }]
            }
        ];

        $scope.editable = false;

        var toggleEditable = function (event, data) {
            $scope.editable = data.editable;
        };

        $scope.toggleToRecent = function (e, tool) {
            if ($scope.editable) {
                var elem = angular.element(e.currentTarget);
                var p = elem.parent();
                if (p.hasClass('selected')) {
                    $scope.$emit('MapToolbar-removeTool', {
                        ngController: p.attr('ng-controller'),
                        ngClick: tool.fun
                    });
                    p.removeClass('selected');
                } else {
                    $scope.$emit('MapToolbar-addTool', {
                        title: p.attr('title'),
                        ngController: p.attr('ng-controller'),
                        ngClick: tool.fun,
                        ngClass: '{\'active\': selectTool.name===\'' + tool.name + '\'}',
                        icon: '<img src="' + tool.img + '">'
                    });
                    p.addClass('selected');
                }
                e.stopPropagation();
            }
        };

        var replaceTool = function (event, data) {
            var allTools = $('.map-toolbar-panel li.tool');
            var tool;
            for (var i = 0; i < allTools.length; i++) {
                tool = $(allTools[i]);
                if (tool.attr('ng-controller') === data.ngController && tool.attr('title') === data.title) {
                    tool.removeClass('selected');
                    break;
                }
            }
        };

        var test = function (data) {
            var recentTools = data.data;
            var allTools = $('.map-toolbar-panel li.tool');
            var i,
                j,
                t;
            for (i = 0; i < allTools.length; i++) {
                t = $(allTools[i]);
                for (j = 0; j < recentTools.length; j++) {
                    if (t.attr('ng-controller') === recentTools[j].ngController && t.attr('title') === recentTools[j].title) {
                        t.addClass('selected');
                        break;
                    }
                }
            }
        };

        // 初始化工具栏，判定哪些工具已被添加到常用工具栏，将其样式修改为selected
        var initTools = function (event, data) {
            // 由于页面中用了其他指令（tool-collapse）来生成html页面，因此当此html加载完成时，tool-collapse指令尚未加载完成
            // 此时如果用jquery的dom选择器，则选择不上tool-collapse指令中dom元素
            // 因此使用$timeout来等待页面全部渲染完成后，在获取dom元素
            $timeout(function () {
                test(data);
            }, 100);    //  调试过程中发现，没有延迟时间，会偶发jquery选择不上tool-collapse指令中dom元素，加上时间后问题未复现
        };

        $scope.$on('MapToolbarPanelReload', initTools);

        $scope.$on('MapToolbar-toggleEditable', toggleEditable);

        $scope.$on('MapToolbar-replaceTool', replaceTool);

        $scope.$on('$destroy', function (event, data) {
            $scope.$emit('MapToolbar-panelClosed');
        });
    }
]);
