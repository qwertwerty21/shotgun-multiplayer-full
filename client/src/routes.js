import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import IntroScreen from './components/IntroScreen';
import WaitRoom from './components/WaitRoom';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

//IntroScreen is main title screen that appears when page loads for first time--can create or join a game
//player info is screen in which you enter your name, use props to determine if host, show create game button, if player show enter game id and join button
//waiting room show game id and players joined, if host, show start game button
//game screen
//game end

{
  /*<Route path='playerinfo' component={Playerinfo}/>
        <Route path='waitroom/:id' component={Waitroom}></Route>
        <Route path='gamescreen' component={GameScreen}></Route>
        <Route path='gameover' component={GameOver}></Route>*/
}

export default (
  <Route path="/" component={App}>
    <IndexRoute component={IntroScreen} />
    <Route path="waitroom" component={WaitRoom} />
    <Route path="game" component={GameScreen} />
    <Route path="result" component={ResultScreen} />
  </Route>
);
