import { initialData } from '../../Data/initial-data';
import cloneDeep from 'lodash/cloneDeep';
import { isGroupChecked } from '../Logic';

let defaultState = {
    data: initialData
}

export default (state = defaultState, action) => {
    if (action.type === 'updateStore') {
        return isGroupChecked({ data: action.payload });
    }
    if (action.type === 'checkClickOnGroup') {
        let newState = cloneDeep(state);
        let groupChecked = !newState.data.groups[action.payload.id].checked;
        newState.data.groups[action.payload.id].checked = groupChecked;
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
        newState.data.items[action.payload.id].selected = !newState.data.items[action.payload.id].selected;
        return newState;
    }
    if (action.type === 'checkClickOnItem') {
        let newState = cloneDeep(state);
        newState.data.items[action.payload.id].checked = !newState.data.items[action.payload.id].checked;
        return isGroupChecked(newState);
    }
    return defaultState;
};