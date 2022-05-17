const reducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_TIMERS':
      return action.payload;
    case 'ADD_TIMER':
      return [...state, action.payload];
    case 'UPDATE_TIMER':
      const newState = [...state];
      const selectedId = newState.findIndex(
        timer => timer.id === action.payload.id,
      );
      newState[selectedId] = action.payload;
      return newState;
    default:
      return state;
  }
};

export default reducer;
