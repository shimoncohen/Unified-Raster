import { initialData } from '../../Data/initial-data';
import cloneDeep from 'lodash/cloneDeep';
import { isGroupChecked } from '../Logic';

let defaultState = {
    data: null,
    layersVisiblityChanged:null,
    order:null,
    selected:null,
    opacityChanged:null,
}

export default (state = defaultState, action) => {
    if (action.type === 'updateStore') {
        let order ={};
        let counter=0;
        action.payload.groupsOrder.reverse().map(groupId => {
            const group = action.payload.groups[groupId];
            group.itemsIds.reverse().map(itemId =>{
                 order[itemId]=counter;
                 counter++;
            });
            group.itemsIds.reverse();
        });
        action.payload.groupsOrder.reverse();
        console.log(order);
        return isGroupChecked({ data: action.payload, order });
    }
    if (action.type === 'checkClickOnGroup') {
        let newState = cloneDeep(state);
        let groupChecked = !newState.data.groups[action.payload.id].checked;
        newState.data.groups[action.payload.id].checked = groupChecked;
        newState.layersVisiblityChanged = newState.data.groups[action.payload.id].itemsIds.filter(itemId => 
            newState.data.items[itemId].checked!==groupChecked);

        newState.data.groups[action.payload.id].itemsIds.map(itemId =>
            newState.data.items[itemId].checked = groupChecked);
        
        
        return newState;
    }
    if (action.type === 'selectItem') {
        let newState = cloneDeep(state);
        Object.keys(newState.data.items).map(itemId => {
            if (itemId !== action.payload.id) {
                newState.data.items[itemId].selected = false
            }
        });
        //if selected make it unselected
        newState.data.items[action.payload.id].selected = !newState.data.items[action.payload.id].selected;
        newState.selected = newState.data.items[action.payload.id].selected ? action.payload.id : null;
        return newState;
    }
    if (action.type === 'checkClickOnItem') {
        let newState = cloneDeep(state);
        newState.data.items[action.payload.id].checked = !newState.data.items[action.payload.id].checked;
        newState.layersVisiblityChanged = [action.payload.id];
        return newState;
    }
    if (action.type === 'opacityChange') {
        console.log(action.payload.opacity);
        let newState = cloneDeep(state);
        newState.data.items[action.payload.id].opacity = action.payload.opacity;
        newState.opacityChanged = { id: action.payload.id, opacity: action.payload.opacity };
        return newState;
    }
    if(action.type === 'clearLayersSettings')
    {
        let newState = cloneDeep(state);
        newState.layersVisiblityChanged = null;
        return newState;
    }
    if(action.type === 'clearOrder')
    {
        let newState = cloneDeep(state);
        newState.order = null;
        return newState;
    }
    if(action.type === 'clearSelected')
    {
        let newState = cloneDeep(state);
        newState.selected = null;
        return newState;
    }

    if(action.type === 'clearOpacityChanged')
    {
        let newState = cloneDeep(state);
        newState.opacityChanged = null;
        return newState;
    }
    return defaultState;
};