/**
 * Created by chenx on 2017-5-12
 */

/** 背景图层配置 **/
App.Config.map.Background = [];

/** 参考图层配置 **/
App.Config.map.Overlay = ['mesh', 'feedback', 'overlay'];

/** 场景图层配置 **/
App.Config.map.Scenes = {
    defaultScene: 'BaseInfoScene',
    scenes: {
        /** 常规场景配置 **/
        BaseInfoScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '基础信息',
            layers: ['RdLink', 'RdNode', 'IxPoi', 'AdLink', 'ZoneLink', 'LuLink', '[tip]', 'RdLinkAnnotation']
        },
        CrossRelationScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '路口关系',
            layers: ['RdLink', 'RdNode', 'RdCross', 'RdLaneConnexity', 'RdRestriction', 'RdHighSpeedBranch', 'RdAspectBranch', 'RdICBranch', 'Rd3DBranch', 'RdComplexSchema', 'RdRealImage', 'RdSignAsReal', 'RdSeriesBranch', 'RdSchematicBranch', 'RdSignBoardBranch', 'RdTrafficSignal', 'RdDirectRoute', 'RdSe', 'RdVoiceGuide', 'RdSlope', 'RdRestrictionTruck', '[tip]']
        },
        OverRoadRelationScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '路上关系',
            layers: ['RdLink', 'RdNode', 'RdTollgate', 'RdGate', 'RdLinkWarning', 'RdElectronicEye', 'RdMileagePile', 'RdSpeedBump', 'RdHgwgLimit', 'RdSpeedLimit', 'RdSpeedLimitDependent', 'RdVariableSpeed', 'RdLinkSpeedLimitDependent', 'RdGsc', '[tip]']
        },
        CrfScene: {
            type: 'feature',
            label: 'roadFeature',
            name: 'CRF',
            layers: ['RdLink', 'RdNode', 'RdCross', 'RdObject', 'RdRoad', 'RdInter', '[tip]']
        },
        NatureVoiceScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '自然语音',
            layers: ['RdLink', 'RdNode', 'IxPoi', '[tip]']
        },
        WalkGuideScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '行人导航',
            layers: ['RdLink', 'RdNode', 'RdCross', '[tip]']
        },
        ComplexLaneScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '复杂车道',
            layers: ['RdLink', 'RdNode', 'RdCross', 'RdLaneConnexity', 'RdRestriction', 'RdLane', 'RdCross', 'RdCross', 'RdCross', 'RdCross', 'RdCross', 'RdCross', 'RdCross', '[tip]']
        },
        SameRelationScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '同一关系',
            layers: ['RdLink', 'RdNode', 'AdLink', 'AdNode', 'ZoneLink', 'ZoneNode', 'LuLink', 'LuNode', 'RwLink', 'RwNode', 'RdSameLink', 'RdSameNode', '[tip]']
        },
        LinkSpeedLimitScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '线限速',
            layers: ['RdLink', 'RdNode', 'RdSpeedLimit', 'RdLinkSpeedLimit', '[tip]']
        },
        ConditionalLimitScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '条件限速',
            layers: ['RdLink', 'RdNode', 'RdSpeedLimitDependent', 'RdLinkSpeedLimitDependent', '[tip]']
        },
        TruckLaneScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '卡车线限速',
            layers: ['RdLink', 'RdNode', '[tip]']
        },
        InterNetRticScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '互联网RTIC',
            layers: ['RdLink', 'RdNode', 'RdCross', '[tip]']
        },
        CarFactoryRticScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '车厂RTIC',
            layers: ['RdLink', 'RdNode', 'RdCross', '[tip]']
        },
/*        TmcScene: {
            type: 'feature',
            name: 'TMC',
            layers: ['RdLink', 'RdNode', 'RdCross', 'TmcPoint', 'TmcLine', 'TmcLocation']
        },*/
        ThirteenHWCScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '13cy-HW',
            layers: ['RdLink', 'RdNode', 'RdCross', 'RdHighSpeedBranch', 'RdAspectBranch', 'RdICBranch', 'Rd3DBranch', 'RdSeriesBranch', '[tip]']
        },
        NbtHighWayExitScene: {
            type: 'feature',
            label: 'roadFeature',
            name: 'NBT高速出入口',
            layers: ['RdLink', 'RdNode', 'RdCross', '[tip]']
        },
        FcScene: {
            type: 'feature',
            label: 'roadFeature',
            name: 'FC',
            layers: ['TMRdLinkFcWork', 'RdNode', 'RdGate', 'RdGsc', 'RdRestriction', 'RdCross', 'RdObstacle', 'TipLinks', '[tip]']
        },
        FreeChargeScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '收免费专题',
            layers: ['TMRdLinkReceiveFree', 'RdNode', 'RdTollgate', '[tip]']
        },
        SpeedClassJumpScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '速度等级跳跃调整',
            layers: ['TMRdLinkSpeedRank', 'LuLink', 'RdNode', 'RdSpeedLimit', 'RdSpeedLimitDependent', 'RdLinkSpeedLimit', 'RdLinkSpeedLimitDependent', 'TipRestriction', '[tip]']
        },
        LinkSpeedLimitTruckScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '卡车线限速',
            layers: ['RdLink', 'RdNode', 'RdSpeedLimitTruck', 'RdLinkSpeedTruck', '[tip]']
        },
        ConditionalLimitTruckScene: {
            type: 'feature',
            label: 'roadFeature',
            name: '卡车条件线限速',
            layers: ['RdLink', 'RdNode', 'RdSpeedLimitTruckDependent', 'RdLinkSpeedTruckDependent', '[tip]']
        },
        RwLinkScene: {
            type: 'feature',
            label: 'backFeature',
            name: '铁路线',
            layers: ['RdLink', 'RdNode', 'RwLink', 'RwNode', '[tip]']
        },
        AdadminScene: {
            type: 'feature',
            label: 'backFeature',
            name: '行政区划',
            layers: ['RdLink', 'RdNode', 'AdLink', 'AdNode', 'AdFace', 'AdAdmin', '[tip]']
        },
        ZoneScene: {
            type: 'feature',
            label: 'backFeature',
            name: 'zone',
            layers: ['RdLink', 'RdNode', 'ZoneLink', 'ZoneNode', 'ZoneFace', '[tip]']
        },
        LcScene: {
            type: 'feature',
            label: 'backFeature',
            name: '土地覆盖',
            layers: ['LcFace', 'LcLink', 'LcNode', 'RdLink', 'RdNode', '[tip]']
        },
        LuScene: {
            type: 'feature',
            label: 'backFeature',
            name: '土地利用',
            layers: ['LuFace', 'LuLink', 'LuNode', 'RdLink', 'RdNode', '[tip]']
        },
        CmgBuildScene: {
            type: 'feature',
            label: 'backFeature',
            name: '市街图',
            layers: ['RdLink', 'RdNode', 'CmgBuildLink', 'CmgBuildNode', 'CmgBuildFace', 'RdGsc', 'IxPoi', '[tip]']
        },

        /** 专题图场景配置 **/
        TMRDLINKAPPINFO: {
            type: 'thematic',
            name: '供用信息',
            layers: ['rdLinkAppInfo']
        },
        TMRDLINKDEVELOPSTATE: {
            type: 'thematic',
            name: '开发状态',
            layers: ['rdLinkDevelopState']
        },
        TMRDLINKISVIADUCT: {
            type: 'thematic',
            name: '高架',
            layers: ['rdLinkIsViaduct']
        },
        TMRDLINKFUNCTIONCLASS: {
            type: 'thematic',
            name: 'link功能等级',
            layers: ['rdLinkFunctionClass']
        },
        TMRDLINKLANECLASS: {
            type: 'thematic',
            name: 'link车道等级',
            layers: ['rdLinkLaneClass']
        },
        TMRDLINKLANENUM: {
            type: 'thematic',
            name: '车道数（总数）',
            layers: ['rdLinkLaneNum']
        },
        TMRDLINKLIMIT: {
            type: 'thematic',
            name: '普通限制信息个数和类型',
            layers: ['rdLinkLimit']
        },
        TMRDLINKSPEEDLIMITSPEEDCLASS: {
            type: 'thematic',
            name: '普通线限速限速等级',
            layers: ['rdlinkSpeedlimitSpeedClass']
        },
        TMRDLINKSPEEDLIMITSPEEDCLASSWORK: {
            type: 'thematic',
            name: '普通线限速限速等级赋值标识',
            layers: ['rdlinkSpeedlimitSpeedClassWork']
        },
        TMRDLINKSPEEDLIMITSPEEDLIMITSRC: {
            type: 'thematic',
            name: '普通线限速限速来源',
            layers: ['rdlinkSpeedlimitSpeedLimitSrc']
        },
        TMRDLINKMULTIDIGITIZED: {
            type: 'thematic',
            name: '上下线分离',
            layers: ['rdLinkMultiDigitized']
        },
        // TMRDLINKNAMECONTENT: {
        //     type: 'thematic',
        //     name: '道路名内容',
        //     layers: ['rdLinkNameContent']
        // },
        TMRDLINKNAMEGROUPID: {
            type: 'thematic',
            name: '道路名组数',
            layers: ['rdLinkNameGroupid']
        },
        TMRDLINKNAMETYPE: {
            type: 'thematic',
            name: '名称类型',
            layers: ['rdLinkNameType']
        },
        TMRDLINKPAVESTATUS: {
            type: 'thematic',
            name: '铺设状态',
            layers: ['rdLinkPaveStatus']
        },
        TMRDLINKFORM50: {
            type: 'thematic',
            name: '交叉口内道路',
            layers: ['rdLinkForm50']
        },
        TMRDLINKFORMOFWAY10: {
            type: 'thematic',
            name: 'IC',
            layers: ['rdLinkFormOfWay10']
        },
        TMRDLINKFORMOFWAY11: {
            type: 'thematic',
            name: 'JCT',
            layers: ['rdLinkFormOfWay11']
        },
        TMRDLINKFORMOFWAY12: {
            type: 'thematic',
            name: 'SA',
            layers: ['rdLinkFormOfWay12']
        },
        TMRDLINKFORMOFWAY13: {
            type: 'thematic',
            name: 'PA',
            layers: ['rdLinkFormOfWay13']
        },
        TMRDLINKFORMOFWAY14: {
            type: 'thematic',
            name: '全封闭道路',
            layers: ['rdLinkFormOfWay14']
        },
        TMRDLINKFORMOFWAY15: {
            type: 'thematic',
            name: '匝道',
            layers: ['rdLinkFormOfWay15']
        },
        TMRDLINKFORMOFWAY16: {
            type: 'thematic',
            name: '跨线天桥',
            layers: ['rdLinkFormOfWay16']
        },
        TMRDLINKFORMOFWAY17: {
            type: 'thematic',
            name: '跨线地道',
            layers: ['rdLinkFormOfWay17']
        },
        TMRDLINKFORMOFWAY20: {
            type: 'thematic',
            name: '步行街',
            layers: ['rdLinkFormOfWay20']
        },
        TMRDLINKFORMOFWAY31: {
            type: 'thematic',
            name: '隧道',
            layers: ['rdLinkFormOfWay31']
        },
        TMRDLINKFORMOFWAY33: {
            type: 'thematic',
            name: '环岛',
            layers: ['rdLinkFormOfWay33']
        },
        TMRDLINKFORMOFWAY34: {
            type: 'thematic',
            name: '辅路',
            layers: ['rdLinkFormOfWay34']
        },
        TMRDLINKFORMOFWAY35: {
            type: 'thematic',
            name: '调头口',
            layers: ['rdLinkFormOfWay35']
        },
        TMRDLINKFORMOFWAY36: {
            type: 'thematic',
            name: 'POI连接路',
            layers: ['rdLinkFormOfWay36']
        },
        TMRDLINKFORMOFWAY37: {
            type: 'thematic',
            name: '提右',
            layers: ['rdLinkFormOfWay37']
        },
        TMRDLINKFORMOFWAY38: {
            type: 'thematic',
            name: '提左',
            layers: ['rdLinkFormOfWay38']
        },
        TMRDLINKFORMOFWAY39: {
            type: 'thematic',
            name: '主辅路出入口',
            layers: ['rdLinkFormOfWay39']
        },
        TMRDLINKINTRTICRANK: {
            type: 'thematic',
            name: 'IntRtic等级',
            layers: ['rdLinkIntRticRank']
        },
        TMRDLINKLIMITTYPE3: {
            type: 'thematic',
            name: '禁止穿行',
            layers: ['rdLinkLimitType3']
        },
        TMRDLINKLIMITTYPE0: {
            type: 'thematic',
            name: '道路维修中',
            layers: ['rdLinkLimitType0']
        },
        TMRDLINKLIMITTYPE1: {
            type: 'thematic',
            name: '单行限制',
            layers: ['rdLinkLimitType1']
        },
        TMRDLINKLIMITTYPE2: {
            type: 'thematic',
            name: '车辆限制',
            layers: ['rdLinkLimitType2']
        },
        TMRDLINKLIMITTYPE5: {
            type: 'thematic',
            name: '季节性关闭道路',
            layers: ['rdLinkLimitType5']
        },
        TMRDLINKLIMITTYPE6: {
            type: 'thematic',
            name: 'Usage fee required',
            layers: ['rdLinkLimitType6']
        },
        TMRDLINKLIMITTYPE7: {
            type: 'thematic',
            name: '超车限制',
            layers: ['rdLinkLimitType7']
        },
        TMRDLINKLIMITTYPE8: {
            type: 'thematic',
            name: '外地车限行',
            layers: ['rdLinkLimitType8']
        },
        TMRDLINKLIMITTYPE9: {
            type: 'thematic',
            name: '尾号限行',
            layers: ['rdLinkLimitType9']
        },
        TMRDLINKLIMITTYPE10: {
            type: 'thematic',
            name: '在建',
            layers: ['rdLinkLimitType10']
        },
        TMRDLINKRTICRANK: {
            type: 'thematic',
            name: 'RTIC 等级',
            layers: ['rdLinkRticRank']
        },
        TMRDLINKZONECOUNT: {
            type: 'thematic',
            name: 'ZONE个数',
            layers: ['rdLinkZoneCount']
        },
        TMRDLINKZONESIDE: {
            type: 'thematic',
            name: 'link的左右ZONE号码',
            layers: ['rdLinkZoneSide']
        },
        TMRDLINKZONETPYE: {
            type: 'thematic',
            name: 'ZONE类型',
            layers: ['rdLinkZoneTpye']
        },
        TMRDLINKSPECIALTRAFFIC: {
            type: 'thematic',
            name: '特殊交通',
            layers: ['rdLinkSpecialTraffic']
        },
        TMRDLINKSPEEDLIMITCONDITIONCOUNT: {
            type: 'thematic',
            name: '条件限速个数和条件',
            layers: ['rdlinkSpeedlimitConditionCount']
        },
        TMRDLINKTOLLINFO: {
            type: 'thematic',
            name: '收费信息',
            layers: ['rdLinkTollInfo']
        },
        TMRDLINKLIMITTRUCK: {
            type: 'thematic',
            name: '卡车限制信息',
            layers: ['rdLinkLimitTruck']
        },
        TMRDLINKIMI: {
            type: 'thematic',
            name: 'IMI',
            layers: ['rdLinkIMI']
        },
        TMRDLINKWALKSTAIR: {
            type: 'thematic',
            name: '人行阶梯',
            layers: ['rdLinkWalkStair']
        },
        TMRDLINKSIDEWALK: {
            type: 'thematic',
            name: '人行便道',
            layers: ['rdLinkSideWalk']
        },
        TMRDLINKWALK: {
            type: 'thematic',
            name: '行人步行',
            layers: ['rdLinkWalk']
        },
        TMRDLINKURBAN: {
            type: 'thematic',
            name: '城市道路',
            layers: ['rdLinkUrban']
        },
        TMRDLINKFORMNUM: {
            type: 'thematic',
            name: '道路形态个数',
            layers: ['rdLinkFormNum']
        },
        TMRDLINKFORMOFWAY: {
            type: 'thematic',
            name: '道路形态',
            layers: ['rdLinkFormOfWay']
        },
        TMRDLINKSIDES: {
            type: 'thematic',
            name: 'link左右行政区划号码',
            layers: ['rdLinkSides']
        },
        TMRDLINKFORMPLUS: {
            type: 'thematic',
            name: 'link形态叠加渲染',
            layers: ['rdLinkFormPlus']
        },
        TMRDLINKFORMBRIDGE: {
            type: 'thematic',
            name: '桥',
            layers: ['rdLinkFormBridge']
        },
        TMRDLINKFORMREGIONROAD: {
            type: 'thematic',
            name: '区域内道路',
            layers: ['rdLinkFormRegionRoad']
        },
        TMRDNODEFORM: {
            type: 'thematic',
            name: '道路Node形态',
            layers: ['RdLink', 'rdNodeForm']
        },
        TMRDLINKFORMUNDERBUILDING: {
            type: 'thematic',
            name: '施工中不开放',
            layers: ['rdLinkFormUnderBuilding']
        },
        TMRDBRANCH: {
            type: 'thematic',
            name: '分歧',
            layers: ['RdLink', 'RdHighSpeedBranchTM', 'RdAspectBranchTM', 'RdICBranchTM', 'Rd3DBranchTM', 'RdComplexSchemaTM', 'RdRealImageTM', 'RdSignAsRealTM', 'RdSeriesBranchTM', 'RdSchematicBranchTM', 'RdSignBoardBranchTM']
        },

        /** 索引要素作业场景 **/
        POIWorkScene: {
            type: 'feature',
            label: 'POI',
            name: 'POI粗编作业',
            layers: ['RwLink', 'RdLink', 'RdGate', 'IxPoi', 'TipLinks', 'TipDeleteTag', 'TipGate']
        },
        PointAddressScene: {
            type: 'feature',
            label: 'POI',
            name: '点门牌作业',
            layers: ['CmgBuildFace', 'CmgBuilding', 'RwLink', 'RdLink', 'RdGate', 'CmgBuildLink', 'CmgBuildNode', 'IxPoi', 'IxPointAddress', 'TipLinks', 'TipDeleteTag', 'TipGate']
        },
        DeepInfoScene: {
            type: 'feature',
            label: 'deepInfo',
            name: '深度信息作业',
            layers: ['RdLink']
        }
    }
};
