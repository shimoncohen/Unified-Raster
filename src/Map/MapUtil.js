import OlLayerImage from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';

export function getLayerByName(map, name) {
    const mapLayers = map.getLayerGroup().getLayersArray();
    return mapLayers.filter(layer =>
        layer.get('name') === name
    )[0];
}

export function addLayersToMap(map, layers) {
    const mapLayers = map.getLayers();
    mapLayers.push( new OlLayerTile({
        source: new OlSourceOsm(),
        name: 'OSM'
    }));

    Object.keys(layers.items).map(key => {
        const item = layers.items[key];
        const layer = new OlLayerImage({
            name: item.name,
            source: new Static({
                url: item.uri,
                projection: 'EPSG:4326',
                imageExtent: item.extent
            })
        });
        if(item.name!=='OSM')
        mapLayers.push(layer);
    });
    console.log(map.getLayerGroup().getLayersArray());
}

export function setZindexToLayers(map,order){
    const mapLayers = map.getLayerGroup().getLayersArray();
    mapLayers.map(layer => {
        layer.setZIndex(order[layer.get('name')]);
    });
}
