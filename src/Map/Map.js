import React from 'react';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';

// import './App.css';
import 'ol/ol.css';
import 'antd/dist/antd.css';
import './react-geo.css';

import {
    MapComponent
} from '@terrestris/react-geo';

const layer = new OlLayerTile({
    source: new OlSourceOsm()
});

const center = [34.78,32.07 ];

const map = new OlMap({
    view: new OlView({
        center: center,
        projection:'EPSG:4326',
        zoom: 16,
    }),
    layers: [layer]
});

export default function Map() {
    return (
        <div className="App">
            <MapComponent
                map={map}
            />
        </div>
    );
}