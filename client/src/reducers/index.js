import { combineReducers } from 'redux';
import GameReducer from './game_reducer';

const rootReducer = combineReducers({
  game: GameReducer
});

export default rootReducer;
