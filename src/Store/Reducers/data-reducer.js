import { initialData } from '../../Data/initial-data';
import cloneDeep from 'lodash/cloneDeep';
import { isGroupChecked } from '../Logic';

let defaultState = {
    data: null,
    layersVisiblityChanged: null,
    selected: null,
    opacityChanged: null,
}

export default (state = defaultState, action) => {
    if (action.type === 'updateStore') {
        return isGroupChecked({ data: action.payload });
    }
    if (action.type === 'checkClickOnGroup') {
        let newState = cloneDeep(state);
        let groupChecked = !newState.data.groups[action.payload.id].checked;
        newState.data.groups[action.payload.id].checked = groupChecked;
        newState.layersVisiblityChanged = newState.data.groups[action.payload.id].itemsIds.filter(itemId =>
            newState.data.items[itemId].checked !== groupChecked);

        newState.data.groups[action.payload.id].itemsIds.map(itemId =>
            newState.data.items[itemId].checked = groupChecked);


        return newState;
    }
    if (action.type === 'selectItem') {
         let newState = cloneDeep(state);
        // let newState = { ...state };
        Object.keys(newState.data.items).forEach(itemId => {
            if (itemId !== action.payload.id) {
                newState.data.items[itemId].selected = false
            }
        });
        //if selected make it unselected
        newState.data.items[action.payload.id].selected = !newState.data.items[action.payload.id].selected;
        newState.selected = state.select !== action.payload.id ? action.payload.id : null;
        return newState;
    }
    // Fires when user click on item check (make item visible or not)
    if (action.type === 'checkClickOnItem') {
        return isGroupChecked({
            ...state,
            data: {
                ...state.data,
                items: {
                    ...state.data.items,
                    [action.payload.id]: {
                        ...state.data.items[action.payload.id],
                        checked: !state.data.items[action.payload.id].checked
                    }
                }
            },
            layersVisiblityChanged : [action.payload.id]
        });
    }
    if (action.type === 'opacityChange') {
        console.log(action.payload.opacity);
        let newState = cloneDeep(state);
        newState.data.items[action.payload.id].opacity = action.payload.opacity;
        newState.opacityChanged = { id: action.payload.id, opacity: action.payload.opacity };
        return newState;
    }
    if (action.type === 'clearLayersSettings') {
        let newState = { ...state };
        newState.layersVisiblityChanged = null;
        return newState;
    }
    if (action.type === 'clearSelected') {
        let newState = cloneDeep(state);
        newState.selected = null;
        return newState;
    }

    if (action.type === 'clearOpacityChanged') {
        let newState = cloneDeep(state);
        newState.opacityChanged = null;
        return newState;
    }
    return defaultState;
};