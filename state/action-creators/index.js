import {
  storeTodos,
  editTodo as edit,
  checkTodo as check,
} from '../../utils/dbHelper';
import {updateTimer as updateTimerFunc} from '../../utils/timerDbHelper';

export const addTodo = title => (dispatch, getState) => {
  return () => {
    storeTodos(title).then(newTodo => {
      dispatch({
        type: 'ADD',
        payload: newTodo,
      });
    });
  };
};

export const editTodo = (id, title) => (dispatch, getState) => {
  return () => {
    edit(id, title).then(editedTodo => {
      dispatch({
        type: 'EDIT',
        payload: editedTodo,
      });
    });
  };
};

export const checkTodo = id => (dispatch, getState) => {
  return () => {
    check(id).then(editedTodo => {
      dispatch({
        type: 'CHECK',
        payload: editedTodo,
      });
    });
  };
};

export const setTodos = todos => {
  return dispatch => {
    dispatch({
      type: 'SET_TODOS',
      payload: todos,
    });
  };
};

export const setTimers = timers => {
  return dispatch => {
    dispatch({
      type: 'SET_TIMERS',
      payload: timers,
    });
  };
};

export const addTimer = timer => {
  return dispatch => {
    dispatch({
      type: 'ADD_TIMER',
      payload: timer,
    });
  };
};

export const updateTimer = (id, updateInfo) => (dispatch, getState) => {
  return () => {
    updateTimerFunc(id, updateInfo).then(updatedTimer => {
      dispatch({
        type: 'UPDATE_TIMER',
        payload: updatedTimer,
      });
    });
  };
};
