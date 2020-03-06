import OlLayerImage from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlLayerGroup from 'ol/layer/Group';
import { compareVersions } from 'ol/string';

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

// export function addLayersToMap(map, layers) {
//     const mapLayers = map.getLayers();

//     Object.keys(layers.items).forEach(key => {
//         const item = layers.items[key];
//         const layer = new OlLayerImage({
//             name: item.name,
//             source: new Static({
//                 url: item.uri,
//                 projection: 'EPSG:4326',
//                 imageExtent: item.extent
//             })
//         });
//         if (item.name !== 'OSM')
//             mapLayers.push(layer);
//     });
//     console.log(map.getLayerGroup().getLayersArray());
// }

export function addLayersToMap(map, layers) {
    const mapLayers = map.getLayers();

    layers.groupsOrder.forEach(groupId => {
        const itemsIds = layers.groups[groupId].itemsIds;
        const layerGroup = new OlLayerGroup({
            name: groupId,
            layers: []
        });
        const layerGroupLayers = layerGroup.getLayers();
        itemsIds.forEach(itemId => {
            const item = layers.items[itemId];
            let layer;
            if (groupId !== 'OSM') {
                
                layer = new OlLayerImage({
                    name: item.name,
                    // className: item.name,
                    source: new Static({
                        url: item.uri,
                        projection: 'EPSG:4326',
                        imageExtent: item.extent,
                    })
                });
            }
            else {
                layer = new OlLayerTile({
                    source: new OlSourceOsm(),
                    name: 'OSM'
                })
            }
            layerGroupLayers.insertAt(0,layer);
            // layerGroupLayers.push(layer);
        });
        mapLayers.insertAt(0,layerGroup);
        // mapLayers.push(layerGroup);
    });
    console.log(map.getLayers());

}

export function setZindexToLayers(map, order) {
    const mapLayers = map.getLayerGroup().getLayersArray();
    mapLayers.forEach(layer => {
        if (!layer.get('name').includes('hover')) {
            layer.setZIndex(order[layer.get('name')]);
        }
        else {
            layer.setZIndex(order[layer.get('name').split(' ')[0]] - 0.1);
        }
    });
}
