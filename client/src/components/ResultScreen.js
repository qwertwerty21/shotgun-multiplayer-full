import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';

import { startNextRound, alertLeaver } from '../actions/';

import { List, ListItem } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import '../styles/ResultScreen.scss';

class ResultScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nextRoundBtnClicked: false,
      open: false,
      startTime: Number(new Date()),
      timeLimit: 60,
      remainingTime: 60
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      'COMPONENT RESULTSCREEN WILL REVCEIVE PROPS CHECK ME',
      nextProps
    );
    if (nextProps.game && nextProps.game.error) {
      this.setOpenDialogState();
    } else if (nextProps.game.room.movesMadeThisRound === 0) {
      console.log('pushind to gamescreen for a new round');
      browserHistory.push('/game');
    }
  }

  componentDidMount() {
    console.log('GAMEROOM', this.props.game);
    console.log('CURRENTPLAYER', this.props.currentPlayer);
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

    let curPlayerID = this.props.currentPlayer.id;

    let playerIsDead = this.props.game.room.playersDead.find(function(curVal) {
      return curVal.id === curPlayerID;
    });

    if (!playerIsDead) {
      this.countdown = setInterval(this.timer, 300);
    }
  }

  //remove onbeforeupload event listener on unmount
  componentWillUnmount() {
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
      console.log('TIME UP IN RESULTSCREEN');
      clearInterval(this.countdown);
      if (this.props.game.room.playing) {
        this.handleNextRound();
      }
    }
  };

  //open the error dialog if an error exists
  setOpenDialogState() {
    let newState = Object.assign({}, this.state);
    newState['open'] = true;
    this.setState(newState);
  }

  handleNextRound = e => {
    // e.preventDefault();
    if (this.countdown) {
      clearInterval(this.countdown);
    }
    let newState = Object.assign({}, this.state);
    newState.nextRoundBtnClicked = true;
    this.setState(newState);
    let currentGameState = {
      game: this.props.game,
      currentPlayer: this.props.currentPlayer
    };
    this.props.actions.startNextRound(currentGameState);
  };

  handleReturnToHome = e => {
    e.preventDefault();
    browserHistory.push('/');
  };

  renderResults() {
    return this.props.game.room.results.map((result, index) => {
      return (
        <ListItem key={index} style={{ 'font-size': '20', color: '#fff' }}>
          {result}
        </ListItem>
      );
    });
  }

  renderNextRoundButton() {
    console.log('heres props host', this.props.currentPlayer.id);
    console.log('heres props playing', this.props.game.room.playersAlive);
    let curPlayerID = this.props.currentPlayer.id;

    let playerIsDead = this.props.game.room.playersDead.find(function(curVal) {
      return curVal.id === curPlayerID;
    });
    console.log('plaeryer is dead', playerIsDead);
    if (playerIsDead && this.props.game.room.playing) {
      return null;
    } else if (
      !playerIsDead &&
      this.props.game.room.playing &&
      !this.state.nextRoundBtnClicked
    ) {
      //if game is still playing
      return (
        <RaisedButton
          label="Next Round"
          primary={true}
          fullWidth={true}
          onTouchTap={this.handleNextRound.bind(this)}
        />
      );
    } else if (
      !playerIsDead &&
      this.props.game.room.playing &&
      this.state.nextRoundBtnClicked
    ) {
      return (
        <div className="nextround__waitingnotice">
          Waiting for Other Players to Begin Next Round...
        </div>
      );
    } else {
      //if playing set to false add a button which redirects to homescreen
      return (
        <RaisedButton
          label="Return to Homescreen"
          primary={true}
          fullWidth={true}
          onTouchTap={this.handleReturnToHome.bind(this)}
        />
      );
    }
  }

  renderErrorDialog() {
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

  dialogActions = [
    <RaisedButton
      label="Return to Homescreen"
      primary={true}
      onTouchTap={this.handleReturnToHome.bind(this)}
    />
  ];

  render() {
    return (
      <div className="resultscreen__container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3 text-center">
            {this.renderErrorDialog()}
            <h2 className="resultscreen__header">
              Round {this.props.game.room.round} Results
            </h2>

            <List style={{ 'margin-bottom': '5%' }}>
              {this.renderResults()}
            </List>
            {this.renderNextRoundButton()}
          </div>
        </div>
      </div>
    );
  }
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
      startNextRound: bindActionCreators(startNextRound, dispatch),
      alertLeaver: bindActionCreators(alertLeaver, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultScreen);
