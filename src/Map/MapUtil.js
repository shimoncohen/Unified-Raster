import OlLayerImage from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlLayerGroup from 'ol/layer/Group';
import MapConfig from './MapConfig';

export function getLayerByName(map, name) {
    const mapLayers = map.getLayerGroup().getLayersArray();
    return mapLayers.filter(layer =>
        layer.get('name') === name
    )[0];
}

export function getLayerGroupByName(map, name) {
    const mapLayersGroup = map.getLayers().getArray();
    return mapLayersGroup.filter(layer =>
        layer.get('name') === name
    )[0];
}

export function getHoverLayer(map) {
    const mapLayers = map.getLayerGroup().getLayersArray();
    return mapLayers.filter(layer =>
        layer.get('name').includes('hover')
    )[0];
}

export function addHoverLayer(map,name){
    const layer = getLayerByName(map,name);
    const newLayerWithHover = new OlLayerImage({
        name: layer.get('name') + ' hover',
        opacity: layer.getOpacity(),
        className: 'layerHover',
        source: new Static({
            url: layer.getSource().getUrl(),
            projection: MapConfig.DEFAULT_PROJECTION,
            imageExtent: layer.getSource().getImageExtent()
        })
    });
    map.getLayers().push(newLayerWithHover);
}

// set a visibility to a layer group
export function setVisibleGroup(map, groupName, visibility) {
    map.getLayers().getArray().find(group =>
        group.get('name') === groupName
    ).setVisible(visibility);

}

export function clearMap(map) {
    map.getLayers().clear();
}

export function addBaseLayer(map) {
    const mapLayers = map.getLayers();

    const osm = new OlLayerTile({
        source: new OlSourceOsm(),
        name: 'OSM'
    })
    const layerGroupOsm = new OlLayerGroup({
        name: 'OSM',
        layers: [osm]
    });

    mapLayers.push(layerGroupOsm);
}

function addResourceToLayerGroup(layer, resource) {

}

// export function addResourceToMap(map, resource) {
//     const mapLayers = map.getLayers();
//     const groupId = 'level-' + resource.level;
//     const layer = mapLayers.getArray().filter(
//         (layer) => {
//             debugger;
//             return layer.getLayers() == groupId;
//         }
//     );
//     console.log(layer);
// }

// add layers to map in the initial state
export function addLayersToMap(map, layers) {
    const mapLayers = map.getLayers();

    layers.groupsOrder.forEach(groupId => {
        const itemsIds = layers.groups[groupId].itemsIds;
        const layerGroup = new OlLayerGroup({
            name: groupId,
            layers: []
        });
        const layerGroupLayers = layerGroup.getLayers();
        let layer;
        itemsIds.forEach(itemId => {
           
            const item = layers.items[itemId];
            layer = new OlLayerImage({
                name: item.name,
                source: new Static({
                    url: item.uri,
                    projection: MapConfig.DEFAULT_PROJECTION,
                    imageExtent: item.extent,
                    crossOrigin: "Anonymous"
                })
            });
            // layerGroupLayers.insertAt(0, layer);
            layerGroupLayers.push(layer);
        });
        // mapLayers.insertAt(0, layerGroup);
        mapLayers.push(layerGroup);
    });
    console.log(map.getLayers());
}

