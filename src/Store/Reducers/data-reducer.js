import { initialData } from '../../Data/initial-data';
import cloneDeep from 'lodash/cloneDeep';

let defaultState = {
    data: initialData
}

export default (state = defaultState, action) => {
    if (action.type === 'updateStore') {
        return { data: action.payload };
    }
    if (action.type === 'checkClickOnItem') {
        let newState = cloneDeep(state);
        newState.data.items[action.payload.id].checked = !newState.data.items[action.payload.id].checked;
        return newState;
    }
    return defaultState;
};