import produce from 'immer';
import cloneDeep from 'lodash/cloneDeep';

let defaultState = {
    data: null,
    layersVisiblityChanged: null,
    groupLayerVisibilityChanged: null,
    selected: null,
    opacityChanged: null,
}

export default (state = defaultState, action) => {
    // Fires when data arrived from server
    // or user change order of items
    if (action.type === 'updateStore') {
        return { data: action.payload };
    }

    //Fires when user click on group check 
    // (make group visible or not)
    if (action.type === 'checkClickOnGroup') {
        return produce(state,draft => {
            let groupChecked = !draft.data.groups[action.payload.id].checked;
            draft.data.groups[action.payload.id].checked = groupChecked;    

                draft.groupLayerVisibilityChanged={
                    group: action.payload.id,
                    visibility: groupChecked
                }
        })

    }

    // Fires when user select an item
    if (action.type === 'selectItem') {
         return produce(state, draft => {

            // clear selected of last selected item
            const lastSelectedItemId = Object.keys(draft.data.items).find(
                itemId => { return draft.data.items[itemId].selected });
            if(lastSelectedItemId){
                draft.data.items[lastSelectedItemId].selected = false;
            }
    
             if (lastSelectedItemId !== action.payload.id){
                draft.data.items[action.payload.id].selected = true;
                draft.selected = action.payload.id;
             }
            
         })
    }
    // Fires when user click on item check (make item visible or not)
    if (action.type === 'checkClickOnItem') {
       return produce(state, draft => {
           draft.data.items[action.payload.id].checked = !draft.data
            .items[action.payload.id].checked;
           draft.layersVisiblityChanged = [action.payload.id];
       })
    }
    if (action.type === 'opacityChange') {
        
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
    if (action.type === 'clearGroupVisibility') {
        let newState = { ...state };
        newState.groupLayerVisibilityChanged = null;
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