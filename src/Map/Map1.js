import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlLayerGroup from 'ol/layer/Group';
import Static from 'ol/source/ImageStatic';

import Groups from '../List/Groups';
import { getLayerByName, addLayersToMap, setZindexToLayers, getHoverLayer } from './MapUtil';

import { Drawer, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import {
    SimpleButton,
    MapComponent,
    NominatimSearch,
    MeasureButton,
    LayerTree
} from '@terrestris/react-geo';

import 'ol/ol.css';
import 'antd/dist/antd.css';
import './react-geo.css';

const layerGroup = new OlLayerGroup({
    name: 'Layergroup',
    layers: [
        new OlLayerTile({
            source: new OlSourceOsm(),
            name: 'OSM'
        }),
        // new OlLayerImage({
        //     name: 'try',
        //     source: new Static({
        //         url: 'http://localhost:3000/Rasters/preview.png',
        //         projection: 'EPSG:4326',
        //         imageExtent: [-180, -90, 180, 90]
        //     })
        // })
    ]
});

const center = [34.78, 32.07];

const map = new OlMap({
    view: new OlView({
        center: center,
        projection: 'EPSG:4326',
        zoom: 5,
    }),
    layers: [layerGroup]
});

function App() {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const [gotData, setGotData] = useState(false);
    const dataFromStore = useSelector(state => state.data);


    useEffect(() => {
        if (!gotData && dataFromStore.data) {
            addLayersToMap(map, dataFromStore.data);
            setGotData(true);
        }

        if (dataFromStore.layersVisiblityChanged) {
            dataFromStore.layersVisiblityChanged.map(name => {
                const layer = getLayerByName(map, name);
                layer.setVisible(!layer.getVisible());
            });
            dispatch({ type: 'clearLayersSettings' });
        }

        if (dataFromStore.order) {
            setZindexToLayers(map, dataFromStore.order);
            dispatch({ type: 'clearOrder' });
        }

        if (dataFromStore.selected) {
            const layer = getLayerByName(map, dataFromStore.selected);
            const layerToDelete = getHoverLayer(map);
            map.removeLayer(layerToDelete);
            if (typeof (layer) === 'TileLayer')
                return;
            else {
        
                const newLayerWithHover = new OlLayerImage({
                    name: layer.get('name')+' hover',
                    zIndex: layer.getZIndex()-0.1,
                    className: 'layerHover',
                    // opacity:0.5,
                    source: new Static({
                        url: layer.getSource().getUrl(),
                        projection: 'EPSG:4326',
                        imageExtent: layer.getSource().getImageExtent()
                    })
                });
                map.getLayers().push(newLayerWithHover);
            }
        }

    }, [dataFromStore])

    const toggleDrawer = () => {
        setVisible(!visible);
    }

    return (
        <div className="App">
            <MapComponent
                map={map}
            />
            <SimpleButton
                style={{ position: 'fixed', top: '30px', right: '30px' }}
                onClick={toggleDrawer}
                icon="bars"
            />
            <Drawer
                anchor="right"
                onClose={toggleDrawer}
                open={visible}
                variant="persistent"
            >
                <div>
                    <IconButton onClick={toggleDrawer}><Close /> </IconButton>
                </div>
                <Groups map={map} />
            </Drawer>
        </div>
    );
}

export default App;