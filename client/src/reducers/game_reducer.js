import {
  HOST_GAME_SERVER,
  JOIN_GAME_SERVER,
  JOIN_GAME_FAIL_SERVER,
  SET_CURRENT_PLAYER_SERVER,
  START_GAME_SERVER,
  SET_CURRENT_MOVE,
  SEND_CURRENT_GAME_STATE_SERVER,
  SHOW_ROUND_RESULTS_SERVER,
  RESET_NEXT_ROUND_CURRENT_PLAYER_SERVER,
  START_NEXT_ROUND_SERVER,
  ALERT_LEAVER_SERVER
} from '../constants/constants';

const INITIAL_STATE = {
  gameRoom: { room: null, error: null, loading: false },
  currentPlayer: { id: null, name: null, host: false }
};

export default function(state = INITIAL_STATE, action) {
  console.log('got a game action', action);
  let error;

  switch (action.type) {
    case HOST_GAME_SERVER:
      console.log('GOT HOST_GAME_SERVER IN GAME REDUCER', action);

      return Object.assign({}, state, {
        gameRoom: {
          room: action.payload,
          error: null,
          loading: false
        },
        currentPlayer: {
          id: action.payload.host.id,
          name: action.payload.host.name,
          host: true
        }
      });

    case SET_CURRENT_PLAYER_SERVER:
      console.log('SETTING CURRENT PLAYER IN GAME REDUCER', action);

      return Object.assign({}, state, {
        currentPlayer: {
          id: action.payload.id,
          name: action.payload.name,
          host: false
        }
      });

    case JOIN_GAME_SERVER:
      console.log('GOT JOIN_GAME_SERVER IN GAME REDUCER', action);

      return Object.assign({}, state, {
        gameRoom: {
          room: action.payload,
          error: null,
          loading: false
        }
      });

    case JOIN_GAME_FAIL_SERVER:
      error = action.payload;
      return Object.assign({}, state, {
        gameRoom: {
          room: null,
          error: error,
          loading: false
        }
      });

    case START_GAME_SERVER:
      console.log('GOT JOIN_GAME_SERVER IN GAME REDUCER', action);

      return Object.assign({}, state, {
        currentPlayer: {
          ...state.currentPlayer,
          bullets: 0,
          blocked: false,
          alive: true,
          currentMove: null,
          currentMoveReceived: false
        },
        gameRoom: {
          room: action.payload,
          error: null,
          loading: false
        }
      });

    case SET_CURRENT_MOVE:
      console.log('GOT SET_CURRENT_MOVE IN GAME REDUCER', action);
      return Object.assign({}, state, {
        currentPlayer: {
          ...state.currentPlayer,
          currentMove: action.payload.moveInfo
        }
      });

    case SEND_CURRENT_GAME_STATE_SERVER:
      console.log(
        'GOT SEND_CURRENT_GAME_STATE_SERVER IN GAME REDUCER',
        action.payload
      );
      return Object.assign({}, state, {
        currentPlayer: {
          ...action.payload.currentPlayer
        },
        gameRoom: {
          ...action.payload.gameRoom
        }
      });

    case SHOW_ROUND_RESULTS_SERVER:
      console.log('GOT SHOW_ROUND_REULSTS', action);
      return Object.assign({}, state, {
        gameRoom: {
          room: action.payload
        }
      });

    case RESET_NEXT_ROUND_CURRENT_PLAYER_SERVER:
      console.log('GOT RESET_NEXT_ROUND_CURRENT_PLAYER_SERVER', action);
      return Object.assign({}, state, {
        gameRoom: {
          ...action.payload.gameRoom
        },
        currentPlayer: {
          ...action.payload.currentPlayer
        }
      });

    case START_NEXT_ROUND_SERVER:
      console.log('GOT START_NEXT_ROUND_SERVER', action);
      return Object.assign({}, state, {
        gameRoom: {
          room: action.payload,
          error: null,
          loading: false
        }
      });

    case ALERT_LEAVER_SERVER:
      console.log('ALERT LEAVER SERVER', action);
      error = action.payload;
      return Object.assign({}, state, {
        gameRoom: {
          room: state.gameRoom.room,
          error: error,
          loading: false
        }
      });

    default:
      return state;
  }
}
