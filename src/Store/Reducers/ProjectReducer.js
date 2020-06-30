import produce from 'immer';

let defaultState = {
    projectName: null
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'CHANGE_PROJECT':
            state.projectName = action.payload.projectName;
            return state;
        default:
            return state;
    }

}