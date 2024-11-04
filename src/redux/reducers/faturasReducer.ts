import { AnyAction } from 'redux';

const initialState = {
  faturas: [],
};

const faturasReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FETCH_FATURAS_SUCCESS':
      return {
        ...state,
        faturas: action.payload,
      };
    default:
      return state;
  }
};

export default faturasReducer;
