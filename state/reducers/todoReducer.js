const reducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_TODOS':
      return action.payload;
    case 'ADD':
      return [...state, action.payload];
    case 'EDIT': {
      const newState = [...state];
      const selectedId = newState.findIndex(
        todo => todo.id === action.payload.id,
      );
      newState[selectedId] = action.payload;
      return newState;
    }
    case 'CHECK': {
      const newState = [...state];
      const selectedId = newState.findIndex(
        todo => todo.id === action.payload.id,
      );
      newState[selectedId] = action.payload;
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
