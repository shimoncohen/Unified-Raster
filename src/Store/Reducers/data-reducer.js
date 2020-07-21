import produce from 'immer';
import cloneDeep from 'lodash/cloneDeep';
import { getLayerByName, addLayersToMap, getHoverLayer, setVisibleGroup } from '../../Map/MapUtil';
import Static from 'ol/source/ImageStatic';
import Config from '../../General/Config';
import { makeCoordinatesArrayFromString } from '../../General/Logic';
let defaultState = {
    data: null,
    selected: null,
    map: null,
}

export default (state = defaultState, action) => {
    switch (action.type) {

        // Fires when data arrived from server
        case 'INIT_STORE':
            return produce(state, draft => {
                console.log(state.map.getLayers());
                state.map.getLayers().clear();
                // TODO : Add open street map layer
                const resources = action.payload;
                const groups = {};
                const items = {};
                // convert data from the server for open layers and react dnd
                resources.forEach(resource => {
                    resource.uri = Config.urlThumbnail +
                        'name=' + resource.name + '&version=' + resource.version;
                    resource.checked = true;
                    resource.selected = false;
                    resource.opacity = 100;
                    resource.extent = makeCoordinatesArrayFromString(resource.extent);
                    items[resource.name] = resource;
                    if (!groups['level-' + resource.level]) {
                        groups['level-' + resource.level] = {
                            id: 'level-' + resource.level,
                            title: 'Level ' + resource.level,
                            checked: true,
                            level: resource.level,
                            itemsIds: [resource.name]
                        };
                    }
                    else {
                        groups[resource.level].itemIds.push(resource.name);
                    }
                });
                const groupsOrder = Object.keys(groups).sort((a, b) =>
                    groups[a].level > groups[b].level
                );
                draft.data = { items, groups, groupsOrder };
                addLayersToMap(state.map, draft.data);
            });

        // Fires when a user changes the order of items    
        case 'UPDATE_STORE':
            return produce(state, draft => {
                draft.data = action.payload;
            });

        // Fires when map object is ready
        case 'ADD_MAP':
            return produce(state, draft => {
                draft.map = action.payload.map;
            });

        //Fires when user click on group check 
        // (toogle group visibility)
        case 'TOOGLE_GROUP':
            const groupChecked = !state.data.groups[action.payload.id].checked;
            setVisibleGroup(state.map, action.payload.id, groupChecked);
            return produce(state, draft => {
                draft.data.groups[action.payload.id].checked = groupChecked;
            });

        // Fires when user select an item
        case 'SELECT_ITEM': {
            return produce(state, draft => {
                // clear selected of last selected item
                const lastSelectedItemId = Object.keys(draft.data.items).find(
                    itemId => { return draft.data.items[itemId].selected });
                if (lastSelectedItemId) {
                    draft.data.items[lastSelectedItemId].selected = false;
                }

                if (lastSelectedItemId !== action.payload.id) {
                    draft.data.items[action.payload.id].selected = true;
                    draft.selected = action.payload.id;
                }

            })
        }

        // Fires when user click on item check (make item visible or not)
        case 'TOOGLE_ITEM': {
            const layer = getLayerByName(state.map, action.payload.id);
            const cheked = !layer.getVisible();
            layer.setVisible(cheked);
            return produce(state, draft => {
                draft.data.items[action.payload.id].checked = cheked;
            });
        }

        case 'OPACITY_CHANGE': {
            const layer = getLayerByName(state.map, action.payload.id);
            layer.setOpacity(action.payload.opacity / 100);
            const hoveredLayer = getLayerByName(state.map, action.payload.id + 'hover');
            if (hoveredLayer) {
                hoveredLayer.setOpacity(action.payload.opacity / 100);
            }
            return produce(state, draft => {
                draft.data.items[action.payload.id].opacity = action.payload.opacity;
            });
        }

        case 'CROP_LAYER': {
            return produce(state, draft => {
                draft.data.items[action.payload.id].newUri = action.payload.newUri;
                draft.data.items[action.payload.id].newExtent = action.payload.newExtent;
                draft.data.items[action.payload.id].lastCrop = action.payload.crop;
                const layer = getLayerByName(state.map, action.payload.id);
                const newSource = new Static({
                    url: action.payload.newUri,
                    projection: 'EPSG:4326',
                    imageExtent: action.payload.newExtent,
                });
                layer.setSource(newSource);
            });
        }

        case 'ZOOM_TO_LAYER':{
            const layer = getLayerByName(state.map, action.payload.id);
            state.map.getView().fit(layer.getSource().getImageExtent(), { duration: 1000 });
            return state;
        }

        case 'UPDATE_MASK':{
            return produce(state,draft => {
                draft.data.items[action.payload.name].mask.feather = action.payload.feather;
                draft.data.items[action.payload.name].mask.hole_size = action.payload.holesize;
                // TODO: should betolerance
                draft.data.items[action.payload.name].mask.threshold = action.payload.tolerance;
                draft.data.items[action.payload.name].mask.band = parseInt(action.payload.band);
                draft.data.items[action.payload.name].mask.white_fill = ~~action.payload.whiteFill;
                draft.data.items[action.payload.name].takenAt = action.payload.sourceDate;
            });
        }

        default:
            return state;
    }
}


