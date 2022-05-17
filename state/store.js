import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers/index';
import thunkMiddleware from 'redux-thunk';

export const store = createStore(
  reducers,
  {},
  applyMiddleware(thunkMiddleware),
);
