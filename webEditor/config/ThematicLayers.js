App.Config.map.ThematicLayers = {
    rdLinkAppInfo: {
        name: '供用信息',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkAppInfo',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkDevelopState: {
        name: '开发状态',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkDevelopState',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkIsViaduct: {
        name: '高架',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkIsViaduct',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFunctionClass: {
        name: 'link功能等级',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFunctionClass',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLaneClass: {
        name: 'link车道等级',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLaneClass',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLaneNum: {
        name: '车道数（总数）',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLaneNum',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimit: {
        name: '普通限制信息个数和类型',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimit',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdlinkSpeedlimitSpeedClass: {
        name: '普通线限速限速等级',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdlinkSpeedlimitSpeedClass',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdlinkSpeedlimitSpeedClassWork: {
        name: '普通线限速限速等级赋值标识',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdlinkSpeedlimitSpeedClassWork',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdlinkSpeedlimitSpeedLimitSrc: {
        name: '普通线限速限速来源',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdlinkSpeedlimitSpeedLimitSrc',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkMultiDigitized: {
        name: '上下线分离',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkMultiDigitized',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkNameContent: {
        name: '道路名内容',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkNameContent',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkNameGroupid: {
        name: '道路名组数',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkNameGroupid',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkNameType: {
        name: '名称类型',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkNameType',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkPaveStatus: {
        name: '铺设状态',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkPaveStatus',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkForm50: {
        name: '交叉口内道路',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkForm50',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay10: {
        name: 'IC',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay10',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay11: {
        name: 'JCT',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay11',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay12: {
        name: 'SA',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay12',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay13: {
        name: 'PA',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay13',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay14: {
        name: '全封闭道路',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay14',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay15: {
        name: '匝道',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay15',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay16: {
        name: '跨线天桥',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay16',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay17: {
        name: '跨线地道',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay17',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay20: {
        name: '步行街',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay20',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay31: {
        name: '隧道',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay31',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay33: {
        name: '环岛',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay33',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay34: {
        name: '辅路',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay34',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay35: {
        name: '调头口',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay35',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay36: {
        name: 'POI连接路',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay36',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay37: {
        name: '提右',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay37',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay38: {
        name: '提左',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay38',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay39: {
        name: '主辅路出入口',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay39',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkIntRticRank: {
        name: 'IntRtic等级',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkIntRticRank',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType3: {
        name: '禁止穿行',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType3',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType0: {
        name: '道路维修中',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType0',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType1: {
        name: '单行限制',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType1',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType2: {
        name: '车辆限制',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType2',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType5: {
        name: '季节性关闭道路',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType5',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType6: {
        name: 'Usage fee required',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType6',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType7: {
        name: '超车限制',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType7',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType8: {
        name: '外地车限行',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType8',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType9: {
        name: '尾号限行',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType9',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitType10: {
        name: '在建',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitType10',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkRticRank: {
        name: 'RTIC 等级',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkRticRank',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkZoneCount: {
        name: 'ZONE个数',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkZoneCount',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkZoneSide: {
        name: 'link的左右ZONE号码',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkZoneSide',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkZoneTpye: {
        name: 'ZONE类型',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkZoneTpye',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkSpecialTraffic: {
        name: '特殊交通',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkSpecialTraffic',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdlinkSpeedlimitConditionCount: {
        name: '条件限速个数和条件',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdlinkSpeedlimitConditionCount',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkTollInfo: {
        name: '收费信息',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkTollInfo',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkLimitTruck: {
        name: '卡车限制信息',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkLimitTruck',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    TMRdLinkFcWork: {
        name: 'FC作业',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkProperty',
            render: FM.mapApi.render.render.FcWorkRender,
            minZoom: 10
        }
    },
    RdObstacle: {
        name: '障碍物',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDNODE',
            render: FM.mapApi.render.render.FcWorkRender,
            minZoom: 10
        }
    },
    TMRdLinkReceiveFree: {
        name: '收免费作业',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkProperty',
            render: FM.mapApi.render.render.ReceiveFreeRender,
            minZoom: 10
        }
    },
    TMRdLinkSpeedRank: {
        name: '速度等级跳跃调整',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkProperty',
            render: FM.mapApi.render.render.SpeedRankRender,
            minZoom: 10
        }
    },
    rdLinkIMI: {
        name: 'IMI',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkImiCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkWalkStair: {
        name: '人行阶梯',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkWalkstairFlag',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkSideWalk: {
        name: '人行便道',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkSidewalkFlag',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkWalk: {
        name: '行人步行',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkWalkFlag',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkUrban: {
        name: '城市道路',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkUrban',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormNum: {
        name: '道路形态个数',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormNum',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormOfWay: {
        name: '道路形态',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormOfWay',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkSides: {
        name: 'link左右行政区划号码',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkSides',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormPlus: {
        name: 'link形态叠加渲染',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormPlus',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormBridge: {
        name: '桥',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormBridge',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormRegionRoad: {
        name: '区域内道路',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormRegionRoad',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdNodeForm: {
        name: '道路Node形态',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDNODE',
            serverFeatureType: 'rdNodeForm',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    rdLinkFormUnderBuilding: {
        name: '施工中不开放',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDLINK',
            serverFeatureType: 'rdLinkFormUnderBuilding',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 10
        }
    },
    RdHighSpeedBranchTM: {
        name: '高速分歧',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDHIGHSPEEDBRANCH',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    },
    RdAspectBranchTM: {
        name: '方面分歧',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDASPECTBRANCH',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    },
    RdICBranchTM: {
        name: 'IC分歧',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDICBRANCH',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    },
    Rd3DBranchTM: {
        name: '3d分歧',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RD3DBRANCH',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    },
    RdComplexSchemaTM: {
        name: '复杂路口模式图',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDCOMPLEXSCHEMA',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    },
    RdRealImageTM: {
        name: '实景图',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDREALIMAGE',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    },
    RdSignAsRealTM: {
        name: '实景看板',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDSIGNASREAL',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    },
    RdSeriesBranchTM: {
        name: '连续分歧',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDSERIESBRANCH',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    },
    RdSchematicBranchTM: {
        name: '交叉点大路口模式图',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDSCHEMATICBRANCH',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    },
    RdSignBoardBranchTM: {
        name: '方向看板',
        type: 'vector',
        options: {
            source: 'thematicSource',
            featureType: 'RDSIGNBOARD',
            serverFeatureType: 'rdBranchPatternCode',
            render: FM.mapApi.render.render.ThematicRender,
            minZoom: 15
        }
    }
};
