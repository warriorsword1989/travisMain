App.Config.map.TrackLayers = {
    TrackLink: {
        name: '轨迹线',
        type: 'vector',
        options: {
            source: 'localSource',
            featureType: 'TRACKLINK',
            render: FM.mapApi.render.render.TrackInfoRender,
            minZoom: 15,
            editable: false
        }
    },
    TrackPoint: {
        name: '轨迹点',
        type: 'vector',
        options: {
            source: 'localSource',
            featureType: 'TRACKPOINT',
            render: FM.mapApi.render.render.TrackInfoRender,
            minZoom: 15
        }
    }
};
