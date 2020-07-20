import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapConfig from './MapConfig';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerImage from 'ol/layer/Image';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileWMS from 'ol/source/TileWMS';
import OlLayerGroup from 'ol/layer/Group';
import Static from 'ol/source/ImageStatic';
import ProjectSelector from '../List/ProjectSelector';

import Groups from '../List/Groups';
import { getLayerByName, addLayersToMap, getHoverLayer, setVisibleGroup } from './MapUtil';

import { Drawer, IconButton, Paper } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import {
    SimpleButton,
    MapComponent,
    NominatimSearch,
    MeasureButton,
    LayerTree,
    DigitizeButton
} from '@terrestris/react-geo';

import 'ol/ol.css';
import 'antd/dist/antd.css';
import './react-geo.css';

const osm = new OlLayerTile({
    source: new OlSourceOsm(),
    name: 'OSM'
})
const layerGroupOsm = new OlLayerGroup({
    name: 'OSM',
    layers: [osm]
});

const map = new OlMap({
    view: new OlView({
        center: MapConfig.MAP_CENTER,
        projection: MapConfig.DEFAULT_PROJECTION,
        zoom: 5,
    }),
    layers: [layerGroupOsm]
});

function App() {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const [gotData, setGotData] = useState(false);
    const dataFromStore = useSelector(state => state.data);
    // TODO : move to store
    useEffect(() => {

        if (dataFromStore.selected) {
            const layer = getLayerByName(map, dataFromStore.selected);
            const layerToDelete = getHoverLayer(map);
            if (layerToDelete) {
                map.removeLayer(layerToDelete);
                if (layerToDelete.get('name') === dataFromStore.selected + ' hover') {
                    dispatch({ type: 'clearSelected' });

                    return;
                }
            }

            if (layer instanceof OlLayerTile) {
                dispatch({ type: 'clearSelected' });

                return;
            }
            else {
                const newLayerWithHover = new OlLayerImage({
                    name: layer.get('name') + ' hover',
                    opacity: 1,
                    className: 'layerHover',
                    source: new Static({
                        url: layer.getSource().getUrl(),
                        projection: MapConfig.DEFAULT_PROJECTION,
                        imageExtent: layer.getSource().getImageExtent()
                    })
                });
                map.getLayers().push(newLayerWithHover);
            }
            dispatch({ type: 'clearSelected' });

        }

    }, [dataFromStore]);

    useEffect(() => {
        dispatch({ type: 'ADD_MAP', payload: { map } });
        console.log(map.getLayers());
    }, [map])

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
                classes={{
                    paper: 'paperDrawer'
                }}
            >
                <div>
                    <IconButton onClick={toggleDrawer}><Close /> </IconButton>
                </div>
                <ProjectSelector />
                <Groups map={map} />
            </Drawer>

        </div >
    );
}

export default App;