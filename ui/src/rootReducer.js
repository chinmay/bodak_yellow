import { combineReducers } from 'redux';
import appReducer, { initialState as appState } from './containers/App/reducer';

export const initialState = {
  app: appState
};

const rootReducer = combineReducers({
  app: appReducer
});

export default rootReducer;
