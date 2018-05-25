App.Config.map.FeatureLayers = {
    AdAdmin: {
        name: '行政区划代表点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADADMIN',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    AdFace: {
        name: '行政区划面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADFACE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    AdLink: {
        name: '行政区划组成线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADLINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    AdNode: {
        name: '行政区划组成点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ADNODE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    IxPoi: {
        name: '兴趣点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'IXPOI',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    LcFace: {
        name: '土地覆盖面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LCFACE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    LcLink: {
        name: '土地覆盖线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LCLINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    LcNode: {
        name: '土地覆盖点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LCNODE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    LuFace: {
        name: '土地利用面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LUFACE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    LuLink: {
        name: '土地利用线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LULINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    LuNode: {
        name: '土地利用点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'LUNODE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    CmgBuilding: {
        name: '市街图feature',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'CMGBUILDING',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    CmgBuildFace: {
        name: '市街图面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'CMGBUILDFACE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    CmgBuildLink: {
        name: '市街图线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'CMGBUILDLINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    CmgBuildNode: {
        name: '市街图点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'CMGBUILDNODE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    RdHighSpeedBranch: {
        name: '高速分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDHIGHSPEEDBRANCH',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdAspectBranch: {
        name: '方面分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDASPECTBRANCH',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdICBranch: {
        name: 'IC分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDICBRANCH',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    Rd3DBranch: {
        name: '3d分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RD3DBRANCH',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdComplexSchema: {
        name: '复杂路口模式图',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDCOMPLEXSCHEMA',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdRealImage: {
        name: '实景图',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDREALIMAGE',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSignAsReal: {
        name: '实景看板',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSIGNASREAL',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSeriesBranch: {
        name: '连续分歧',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSERIESBRANCH',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSchematicBranch: {
        name: '交叉点大路口模式图',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSCHEMATICBRANCH',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSignBoardBranch: {
        name: '方向看板',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSIGNBOARD',
            serverFeatureType: 'RDBRANCH',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdCross: {
        name: '路口',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDCROSS',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdDirectRoute: {
        name: '顺行',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDDIRECTROUTE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdElectronicEye: {
        name: '电子眼',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDELECTRONICEYE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdGate: {
        name: '大门',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDGATE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdGsc: {
        name: '立交',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDGSC',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdHgwgLimit: {
        name: '限高限重',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDHGWGLIMIT',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdLane: {
        name: '详细车道',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLANE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdLaneConnexity: {
        name: '车信',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLANECONNEXITY',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdLink: {
        name: '道路线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 1
        }
    },
    RdLinkAnnotation: {
        name: '道路标注',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINK',
            visible: false,
            render: FM.mapApi.render.render.AnnotationRender,
            minZoom: 15
        }
    },
    RdLinkSpeedLimit: {
        name: '线限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINKSPEEDLIMIT',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdLinkSpeedLimitDependent: {
        name: '条件线限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINKSPEEDLIMIT_DEPENDENT',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15,
            editable: false
        }
    },
    RdLinkSpeedTruck: {
        name: '卡车线限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINKSPEEDTRUCK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdLinkSpeedTruckDependent: {
        name: '卡车条件线限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINKSPEEDTRUCK_DEPENDENT',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15,
            editable: false
        }
    },
    RdMileagePile: {
        name: '里程桩',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDMILEAGEPILE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdNode: {
        name: '道路点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDNODE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    RdRestriction: {
        name: '交限',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDRESTRICTION',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdRestrictionTruck: {
        name: '卡车交限',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDRESTRICTIONTRUCK',
            serverFeatureType: 'RDRESTRICTION',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSameLink: {
        name: '同一线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSAMELINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSameNode: {
        name: '同一点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSAMENODE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    RdSe: {
        name: '分叉口',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSlope: {
        name: '坡度',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSLOPE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSpeedBump: {
        name: '减速带',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSPEEDBUMP',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSpeedLimitTruck: {
        name: '卡车点限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSPEEDLIMITTRUCK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSpeedLimitTruckDependent: {
        name: '卡车条件点限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSPEEDLIMITTRUCK_DEPENDENT',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSpeedLimit: {
        name: '普通点限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSPEEDLIMIT',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdSpeedLimitDependent: {
        name: '条件点限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDSPEEDLIMIT_DEPENDENT',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdTollgate: {
        name: '收费站',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDTOLLGATE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdTrafficSignal: {
        name: '信号灯',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDTRAFFICSIGNAL',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdVariableSpeed: {
        name: '可变限速',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDVARIABLESPEED',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdVoiceGuide: {
        name: '语音引导',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDVOICEGUIDE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    // RdWarningInfo: {
    //     name: '警示信息',
    //     type: 'vector',
    //     options: {
    //         source: 'objSource',
    //         featureType: 'RDWARNINGINFO',
    //         render: FM.mapApi.render.render.FeatureRender,
    //         minZoom: 15
    //     }
    // },
    RdLinkWarning: {
        name: '警示信息',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDLINKWARNING',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RwLink: {
        name: '铁路线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RWLINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RwNode: {
        name: '铁路点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RWNODE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    ZoneFace: {
        name: 'ZONE面',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ZONEFACE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    ZoneLink: {
        name: 'ZONE线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ZONELINK',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    ZoneNode: {
        name: 'Zone点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'ZONENODE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    },
    RdObject: {
        name: 'CRF对象',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDOBJECT',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdInter: {
        name: 'CRF交叉点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDINTER',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    RdRoad: {
        name: 'CRF道路',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDROAD',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    TmcLocation: {
        name: 'TMCLocation',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'RDTMCLOCATION',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    TmcPoint: {
        name: 'TMC点',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'TMCPOINT',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    TmcLine: {
        name: 'TMC线',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'TMCLINE',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 15
        }
    },
    IxPointAddress: {
        name: '点门牌',
        type: 'vector',
        options: {
            source: 'objSource',
            featureType: 'IXPOINTADDRESS',
            render: FM.mapApi.render.render.FeatureRender,
            minZoom: 17
        }
    }
};
