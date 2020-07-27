import produce from "immer";
import { CHANGE_PROJECT } from './actionTypes';

let defaultState = {
  projectName: null,
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case CHANGE_PROJECT:
      return produce(state, (draft) => {
        draft.projectName = action.payload.projectName;
      });
    default:
      return state;
  }
}
