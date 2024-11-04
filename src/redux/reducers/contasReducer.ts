import { AnyAction } from 'redux';

const initialState = {
  contas: [],
};

const contasReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FETCH_CONTAS_SUCCESS':
      return {
        ...state,
        contas: action.payload,
      };
    default:
      return state;
  }
};

export default contasReducer;
