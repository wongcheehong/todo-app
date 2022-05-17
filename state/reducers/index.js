import {combineReducers} from 'redux';
import todoReducer from './todoReducer';
import timerReducer from './timerReducer';

const reducers = combineReducers({
  todos: todoReducer,
  timers: timerReducer,
});

export default reducers;
