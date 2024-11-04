import { combineReducers } from 'redux';
import despesasReducer from './despesasReducer';
import faturasReducer from './faturasReducer';
import contasReducer from './contasReducer';

const rootReducer = combineReducers({
  despesas: despesasReducer,
  faturas: faturasReducer,
  contas: contasReducer,
});

export default rootReducer;
