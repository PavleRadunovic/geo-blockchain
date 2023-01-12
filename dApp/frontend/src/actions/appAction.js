export const SET_LOGGED_IN = 'SET_LOGGED';
export const SET_LOGGED_OUT = 'SET_LOGGED';
export const ADD_WEB3_STATE = 'ADD_WEB3_STATE';

export const setLoggedIn = {
    type: SET_LOGGED_IN,
    payload: true
  };

  export const setLoggedOut = {
    type: SET_LOGGED_OUT,
    payload: false
  };

  export const addWeb3State = (web3State)=>{
    return {
      type: ADD_WEB3_STATE,
      payload: web3State
    }  
  };