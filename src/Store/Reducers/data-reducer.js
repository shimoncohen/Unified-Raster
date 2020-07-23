import produce from 'immer';
import cloneDeep from 'lodash/cloneDeep';
import { clearMap, addBaseLayer, getLayerByName, addHoverLayer, addLayersToMap, getHoverLayer, setVisibleGroup } from '../../Map/MapUtil';
import Static from 'ol/source/ImageStatic';
import { addToGroups, removeFromGroups, prepareResourceForDisplay, setDraftData } from '../../util/mapDataUtil';
import { setDraftMap, addResourceToMap, removeResourceFromMap } from '../../Map/MapUtil';
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
                const resources = action.payload;
                const groups = {};
                const items = {};
                // convert data from the server for open layers and react dnd
                resources.forEach(resource => {
                    prepareResourceForDisplay(resource);
                    items[resource.name] = resource;
                    addToGroups(groups, resource);
                });

                // set changes
                setDraftData(draft, items, groups);
                setDraftMap(draft);
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
                const lastSelectedItemId = Object.keys(draft.data.items).find(
                    itemId => { return draft.data.items[itemId].selected });
                if (lastSelectedItemId) {
                    const layerToDelete = getHoverLayer(state.map);
                    state.map.removeLayer(layerToDelete);
                    draft.data.items[lastSelectedItemId].selected = false;
                }

                if (lastSelectedItemId !== action.payload.id) {
                    addHoverLayer(state.map,action.payload.id);
                    draft.data.items[action.payload.id].selected = true;
                }
            });
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
            const hoveredLayer = getLayerByName(state.map, action.payload.id + ' hover');

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

        case 'ZOOM_TO_LAYER': {
            const layer = getLayerByName(state.map, action.payload.id);
            state.map.getView().fit(layer.getSource().getImageExtent(), { duration: 1000 });
            return state;
        }

        case 'UPDATE_MASK': {
            return produce(state, draft => {
                draft.data.items[action.payload.name].mask.feather = action.payload.feather;
                draft.data.items[action.payload.name].mask.hole_size = action.payload.holesize;
                // TODO: should betolerance
                draft.data.items[action.payload.name].mask.threshold = action.payload.tolerance;
                draft.data.items[action.payload.name].mask.band = parseInt(action.payload.band);
                draft.data.items[action.payload.name].mask.white_fill = ~~action.payload.whiteFill;
                draft.data.items[action.payload.name].takenAt = action.payload.sourceDate;
            });
        }

        case 'ADD_RESOURCE':
            return produce(state, draft => {
                const resource = action.payload;
                const groups = state.data['groups'];
                const items = state.data.items;

                prepareResourceForDisplay(resource);
                items[resource.name] = resource;
                addToGroups(groups, resource);

                setDraftData(draft, items, groups);

                addResourceToMap(state.map, resource);
                // setDraftMap(draft);
            });
        
        case 'REMOVE_RESOURCE':
            return produce(state, draft => {
                const resource = action.payload.item;
                const groups = draft.data['groups'];
                const items = draft.data.items;

                // remove from items
                delete items[resource.name];
                // remove from groups
                removeFromGroups(groups, resource);
                // remove from map
                removeResourceFromMap(state.map, resource);

                // save data changes
                setDraftData(draft, items, groups);
            });

        default:
            return state;
    }
}


