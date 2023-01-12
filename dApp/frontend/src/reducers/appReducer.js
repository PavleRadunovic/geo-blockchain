
import { SET_LOGGED_IN, SET_LOGGED_OUT, ADD_WEB3_STATE } from "../actions/appAction";

export default (state, action) => {
  switch (action.type) {
    case SET_LOGGED_IN:
      return {
        ...state,
        logged: action.payload
      };
      case SET_LOGGED_OUT:
        return {
          ...state,
          logged: action.payload
        };
        case ADD_WEB3_STATE:
          return {
            ...state,
            web3State: action.payload
          };
    default:
      return state;
  }
};