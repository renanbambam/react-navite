import { AnyAction } from 'redux';

const initialState = {
  despesas: [],
};

const despesasReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FETCH_DESPESAS_SUCCESS':
      return {
        ...state,
        despesas: action.payload,
      };
    default:
      return state;
  }
};

export default despesasReducer;
