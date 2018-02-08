import React from 'react';
import ReactDOM from 'react-dom';

//theme colors
import {
  teal500,
  teal700,
  tealA200,
  grey100,
  grey300,
  grey400,
  grey500,
  white,
  darkBlack,
  fullBlack
} from 'material-ui/styles/colors';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';

//client side socket ui redux
import socketIO from 'socket.io-client';
import socketIOMiddleware from 'redux-socket.io-middleware';

import routes from './routes';
import rootReducer from './reducers';

//import App from './components/App';
import './styles/reset.scss';

import promise from 'redux-promise';
//import thunk from 'redux-thunk';

//import { saveState } from './snippets/helpers';

//google analystics config
// import ReactGA from 'react-ga';
// ReactGA.initialize('UA-93249304-1');

// function logPageView(){
//   ReactGA.set({page: window.location.pathname});
//   ReactGA.pageview(window.location.pathname);
// }

//Needed from onTOuchTap overrides ios 300ms tap delay
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

//customize muitheme
const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: teal500,
    primary2Color: teal700,
    primary3Color: grey400,
    accent1Color: teal500,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    pickerHeaderColor: teal500,
    shadowColor: fullBlack
  }
});

let ROOT_URL = 'http://localhost:3000';
//if heroku use heroku
if (window.location.hostname === 'shotgun-multiplayer.herokuapp.com') {
  ROOT_URL = 'https://shotgun-multiplayer.herokuapp.com';
}

//redux socket io client side config connect to the server
let io = socketIO.connect(ROOT_URL);
//Temporary alert if sockets dont connect
io.on('connect_error', function() {
  alert(
    'Sorry, there seems to be a problem connecting to our servers right now. Refresh the page and try again.'
  );
});

const createStoreWithMiddleWare = applyMiddleware(
  promise,
  socketIOMiddleware(io)
)(createStore);

const store = createStoreWithMiddleWare(
  rootReducer,
  {} //initial state
  //  +  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// //save currentUser state to localStorage, prevetns having to relogin on page refresh
// store.subscribe(()=>{
//   saveState({
//     currentUser: store.getState().users.currentUser
//   });//end saveState()
// });//end subscribe

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={browserHistory} routes={routes} />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
