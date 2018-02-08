import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';

import { setCurrentMove, sendCurrentGameState, alertLeaver } from '../actions/';

import { List, ListItem } from 'material-ui/List';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import Dialog from 'material-ui/Dialog';

import RaisedButton from 'material-ui/RaisedButton';

import gamescreenBG from '../images/gamescreenbg.mp4';

import '../styles/GameScreen.scss';

class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: false,
      open: false,
      startTime: Number(new Date()),
      timeLimit: 30,
      remainingTime: 30,
      moveBtnClicked: false
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('COMPONENT WILL REVCEIVE PROPS CHECK ME', nextProps);
    if (nextProps.game && nextProps.game.error) {
      this.setOpenDialogState();
    } else if (nextProps.game.room.results.length > 0) {
      console.log('pushind to resultsscren');
      browserHistory.push('/result');
    } else if (
      nextProps.currentPlayer &&
      nextProps.currentPlayer.currentMove &&
      !nextProps.currentPlayer.currentMoveReceived &&
      nextProps.game.room.results.length < 1
    ) {
      console.log('IM SENDING THE STATE TO THE BACKEND NOW', nextProps);
      let currentGameState = {
        game: nextProps.game,
        currentPlayer: nextProps.currentPlayer
      };
      this.props.actions.sendCurrentGameState(currentGameState);
    }
  }

  componentDidMount() {
    let leaverData = {
      game: this.props.game,
      currentPlayer: this.props.currentPlayer
    };
    let closing = () => {
      //send leaver alert
      this.props.actions.alertLeaver(leaverData);
      return 'Leaver';
    };

    window.onunload = closing;
    console.log('this', this);

    let curPlayerID = this.props.currentPlayer.id;

    let playerIsDead = this.props.game.room.playersDead.find(function(curVal) {
      return curVal.id === curPlayerID;
    });

    document.getElementById('gamescreenVideo').addEventListener(
      'loadedmetadata',
      function() {
        this.currentTime = Math.random() * this.duration;
      },
      false
    );
    document.getElementById('gamescreenVideo').play();

    if (!playerIsDead) {
      this.countdown = setInterval(this.timer, 300);
    }
  }
  //remove onbeforeupload event listener on unmount
  componentWillUnmount() {
    document.getElementById('gamescreenVideo').pause();
    window.onunload = () => {};

    if (this.countdown) {
      clearInterval(this.countdown);
    }
  }

  timer = () => {
    let nowTime = Number(new Date());
    //calculate then difference between then and now and subtract the DIFFERENCE from time to get a more accurate timer
    let differenceTime = Math.floor((nowTime - this.state.startTime) / 1000);
    console.log('difftime', differenceTime);
    let updatedCountdownTime = this.state.timeLimit - differenceTime;
    let newState = Object.assign({}, this.state);
    newState['remainingTime'] = updatedCountdownTime;
    this.setState(newState);
    console.log('cdtime', updatedCountdownTime);
    if (this.state.remainingTime < 1) {
      console.log('TIME UP ');
      let data = {
        moveInfo: {
          move: 'nothing',
          target: null
        }
      };
      clearInterval(this.countdown);
      this.props.actions.setCurrentMove(data);
    }
  };

  //open the error dialog if an error exists
  setOpenDialogState() {
    let newState = Object.assign({}, this.state);
    newState['open'] = true;
    this.setState(newState);
  }

  dialogActions = [
    <RaisedButton
      label="Try Again"
      primary={true}
      onTouchTap={() => {
        window.location.reload();
      }} //refresh page
    />
  ];

  checkIfEmpty = reqFieldsObj => {
    let errors = {};

    for (var keys in reqFieldsObj) {
      if (!reqFieldsObj[keys]) {
        errors[keys] = 'Required';
      }
    }

    return errors;
  };

  renderPlayersAlive() {
    if (
      this.props.game.room.playersAlive &&
      this.props.game.room.results.length < 1
    ) {
      return this.props.game.room.playersAlive.map((player, index) => {
        return (
          <ListItem key={index} style={{ 'font-size': '20', color: '#fff' }}>
            {player.name}
          </ListItem>
        );
      });
    } else if (this.props.game.room.results > 0) {
      return null;
    }
  }

  renderShootMenuItems() {
    if (
      this.props.game.room.playersAlive &&
      this.props.game.room.results.length < 1
    ) {
      let allPlayersAliveExceptCurrent = this.props.game.room.playersAlive.filter(
        (player, index) => {
          return player.id !== this.props.currentPlayer.id;
        }
      );
      return allPlayersAliveExceptCurrent.map((player, index) => {
        return (
          <MenuItem
            primaryText={`Shoot ${player.name}`}
            value={player.id}
            key={index}
            onTouchTap={this.handleCurrentMove.bind(this, {
              move: 'shoot',
              target: player.id
            })}
          />
        );
      });
    } else if (this.props.game.room.results.length > 0) {
      return null;
    }
  }

  renderPlayerMoveBtns() {
    let curPlayerID = this.props.currentPlayer.id;

    let playerIsDead = this.props.game.room.playersDead.find(function(curVal) {
      return curVal.id === curPlayerID;
    });
    console.log(
      'HI THIS THIS THE CURRENT PLAYER WHEN RENDERING PLAYER MOVE BTNS',
      this.props.currentPlayer
    );
    if (playerIsDead) {
      return <h3 className="playermove__deadnotice">You're Dead, buddy...</h3>;
    } else if (
      (!playerIsDead && this.props.currentPlayer.currentMoveReceived) ||
      this.state.moveBtnClicked
    ) {
      return (
        <h3 className="playermove__waitingnotice">
          Waiting for other players to make their moves...
        </h3>
      );
    } else {
      return (
        <List>
          <ListItem>
            <RaisedButton
              label="Shoot"
              primary={true}
              fullWidth={true}
              onTouchTap={this.handlePopoverOpen} //dispatch action init game to server
            />
            <Popover
              open={this.state.popoverOpen}
              anchorEl={this.state.popoverAnchorEl}
              onRequestClose={this.handlePopoverRequestClose}
              autoCloseWhenOffScreen={true}
              style={{ padding: 30 }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
              <Menu>{this.renderShootMenuItems()}</Menu>
            </Popover>
          </ListItem>
          <ListItem>
            <RaisedButton
              label="Reload"
              primary={true}
              fullWidth={true}
              onTouchTap={this.handleCurrentMove.bind(this, {
                move: 'reload',
                target: null
              })} //dispatch action init game to server
            />
          </ListItem>
          <ListItem>
            <RaisedButton
              label="Block"
              primary={true}
              fullWidth={true}
              onTouchTap={this.handleCurrentMove.bind(this, {
                move: 'block',
                target: null
              })} //dispatch action init game to server
            />
          </ListItem>
        </List>
      );
    }
  }

  renderHUD() {
    let curPlayerID = this.props.currentPlayer.id;

    let playerIsDead = this.props.game.room.playersDead.find(function(curVal) {
      return curVal.id === curPlayerID;
    });

    if (playerIsDead) {
      return null;
    } else {
      return (
        <div className="hud__container">
          <div>
            <span className="hud__label">Player:</span>
            <span>{this.props.currentPlayer.name}</span>
          </div>
          <div>
            <span className="hud__label">Bullets:</span>
            <span>{this.props.currentPlayer.bullets}</span>
          </div>
          <div>
            <span className="hud__label">Time:</span>
            <span>{this.state.remainingTime}</span>
          </div>
        </div>
      );
    }
  }

  renderErrorDialog() {
    console.log('rendinerg error dialog');
    if (this.props.game && this.props.game.error) {
      return (
        <Dialog
          title="Oops!"
          open={this.state.open}
          actions={this.dialogActions}
          onRequestClose={this.handleCloseDialog}
        >
          <p>{this.props.game.error}</p>
        </Dialog>
      );
    } else {
      return null;
    }
  }

  handleCloseDialog = () => {
    let newState = Object.assign({}, this.state);
    newState['open'] = false;
    this.setState(newState);
  };

  handleReturnToHome = e => {
    e.preventDefault();
    browserHistory.push('/');
  };

  dialogActions = [
    <RaisedButton
      label="Return To Homescreen"
      primary={true}
      onTouchTap={this.handleReturnToHome.bind(this)}
    />
  ];

  handleTextChange = (inputElement, e) => {
    let newState = Object.assign({}, this.state);

    //update Error text fields (remove errorText when user enters a value)
    let errTextField = `err_${inputElement}`;

    if (e.target.value && newState[errTextField] !== null) {
      newState[errTextField] = null;
    }

    newState[inputElement] = e.target.value;
    this.setState(newState);
  };

  handleCurrentMove = (inputElement, e) => {
    console.log(inputElement);
    console.log(e);
    console.log(`HANDLEING CURRENT MOVE INPUTELEMENT`);
    e.preventDefault();
    if (this.countdown) {
      clearInterval(this.countdown);
    }

    //HIDE BTNS HERE
    let newState = Object.assign({}, this.state);
    newState['moveBtnClicked'] = true;
    this.setState(newState);

    let data = {
      moveInfo: inputElement
    };
    this.props.actions.setCurrentMove(data);
  };

  handlePopoverOpen = e => {
    e.preventDefault();

    let newState = Object.assign({}, this.state);

    newState['popoverOpen'] = true;
    newState['popoverAnchorEl'] = e.currentTarget;

    this.setState(newState);
  };

  handlePopoverRequestClose = () => {
    let newState = Object.assign({}, this.state);
    newState['popoverOpen'] = false;
    this.setState(newState);
  };

  handleStartGame = e => {
    e.preventDefault();
    this.props.actions.startGame(this.props.game);
  };

  render() {
    return (
      <div className="gamescreen__container">
        <video
          playsinline
          autoplay
          muted
          loop
          className="gamescreen__video"
          id="gamescreenVideo"
        >
          <source src={gamescreenBG} type="video/mp4" />
        </video>

        <div className="row">
          <div className="col-md-6 col-md-offset-3 text-center">
            <div className="gamescreen__header">
              <h2 className="gamescreen__roundtitle">
                Round {this.props.game.room.round}
              </h2>
              {this.renderHUD()}
            </div>
            {this.renderErrorDialog()}
            <h3 className="playersremain__header">Players Remaining:</h3>
            <List style={{ 'margin-bottom': '5%' }}>
              {this.renderPlayersAlive()}
            </List>
            {this.renderPlayerMoveBtns()}
          </div>
        </div>
      </div>
    );
  } //end render
}

function mapStateToProps(state) {
  return {
    game: state.game.gameRoom,
    currentPlayer: state.game.currentPlayer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      setCurrentMove: bindActionCreators(setCurrentMove, dispatch),
      sendCurrentGameState: bindActionCreators(sendCurrentGameState, dispatch),
      alertLeaver: bindActionCreators(alertLeaver, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen);
