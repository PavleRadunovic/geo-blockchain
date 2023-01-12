import { createStore } from "redux";
import appReducer from "./reducers/appReducer";

const initialState = {
    logged: false,
    web3State: {},
}

function configureStore(state = initialState) {
  return createStore(appReducer,state, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}

export default configureStore;