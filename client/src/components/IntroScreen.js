import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';

import { hostGame, joinGame } from '../actions/';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';

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

// import io from 'socket.io-client';

import '../styles/IntroScreen.scss';

class IntroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: '',
      roomID: '',
      err_name: '',
      err_roomID: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('COMPONENT WILL REVCEIVE PROPS', nextProps);
    if (nextProps.game && nextProps.game.error) {
      this.setOpenDialogState();
    }
    if (nextProps.game && nextProps.game.room && nextProps.game.room.id) {
      browserHistory.push('/waitroom');
    }
  }
  //open the error dialog if an error exists
  setOpenDialogState() {
    let newState = Object.assign({}, this.state);
    newState['open'] = true;
    this.setState(newState);
  }

  handleTextChange = (inputElement, e) => {
    let newState = Object.assign({}, this.state);

    //update Error text fields (remove errorText when user enters a value)
    let errTextField = `err_${inputElement}`;

    if (e.target.value && newState[errTextField]) {
      newState[errTextField] = null;
    }

    newState[inputElement] = e.target.value;
    this.setState(newState);
  };

  checkIfEmpty = reqFieldsObj => {
    let errors = {};

    for (var keys in reqFieldsObj) {
      if (!reqFieldsObj[keys]) {
        errors[keys] = 'Required';
      }
    }

    return errors;
  };

  handleHostGame = e => {
    console.log('HI FROM HANDLE HOST', e);
    e.preventDefault();
    let { name } = this.state;
    let requiredFields = {
      name: name
    };
    let emptyFields = this.checkIfEmpty(requiredFields);

    if (Object.keys(emptyFields).length > 0) {
      console.log('Error', emptyFields);
      let newState = Object.assign({}, this.state);

      for (let keys in emptyFields) {
        if (emptyFields.hasOwnProperty(keys)) {
          //TO DO ADD ERROR TEXT
          var errField = `err_${keys}`;
          newState[errField] =
            'Enter your Name before Hosting or Joining a Game.';
        }
      }
      this.setState(newState);
      return false;
    }
    console.log('ACTUALLLY SUBMITTED HOST REQUEST');
    this.props.actions.hostGame({ name: name });
  };

  handleJoinGame = e => {
    console.log('HI FROM HANDLE JOIN', e);
    e.preventDefault();
    let { name, roomID } = this.state;
    let requiredFields = {
      name: name,
      roomID: roomID
    };
    let emptyFields = this.checkIfEmpty(requiredFields);

    if (Object.keys(emptyFields).length > 0) {
      console.log('Error', emptyFields);
      let newState = Object.assign({}, this.state);

      for (let keys in emptyFields) {
        if (emptyFields.hasOwnProperty(keys)) {
          //TO DO ADD ERROR TEXT
          var errField = `err_${keys}`;
          newState[errField] = 'Required';
        }
      }
      this.setState(newState);
      return false;
    }
    console.log('ACTUALLLY SUBMITTED JOIN REQUEST');
    this.props.actions.joinGame({ name: name, roomID: roomID });
  };

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
      label="Okay"
      primary={true}
      onTouchTap={this.handleCloseDialog}
    />
  ];

  render() {
    return (
      <div className="intro__container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <h1 className="text-center header__title">Shotgun Multiplayer</h1>

            {this.renderErrorDialog()}

            <List className="mainscreenbtns__container">
              <ListItem>
                <TextField
                  errorText={this.state.err_name}
                  fullWidth={true}
                  floatingLabelText="Enter Your Name"
                  floatingLabelStyle={{ color: '#fff' }}
                  inputStyle={{
                    color: '#fff',
                    'text-shadow': '1px 1px #000',
                    'font-size': '24'
                  }}
                  value={this.state.name}
                  onChange={this.handleTextChange.bind(this, 'name')}
                />
              </ListItem>
              <ListItem>
                <TextField
                  errorText={this.state.err_roomID}
                  fullWidth={true}
                  floatingLabelText="Enter Room ID ( Join Only )"
                  floatingLabelStyle={{ color: '#fff' }}
                  inputStyle={{
                    color: '#fff',
                    'text-shadow': '1px 1px #000',
                    'font-size': '24'
                  }}
                  value={this.state.roomID}
                  onChange={this.handleTextChange.bind(this, 'roomID')}
                />
              </ListItem>
              <ListItem>
                <RaisedButton
                  label="Host New Game"
                  primary={true}
                  fullWidth={true}
                  onTouchTap={this.handleHostGame.bind(this)} //dispatch action host game to server
                />
              </ListItem>
              <ListItem>
                <RaisedButton
                  label="Join Game"
                  primary={true}
                  fullWidth={true}
                  onTouchTap={this.handleJoinGame.bind(this)}
                />
              </ListItem>
            </List>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    game: state.game.gameRoom
    // currentUser: state.users.currentUser,
    // originalAll: state.recipeposts.originalAll,
    // redditAll: state.recipeposts.redditAll
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      // getRecipePosts: bindActionCreators(getRecipePosts, dispatch),
      // getRedditPosts: bindActionCreators(getRedditPosts, dispatch)
      hostGame: bindActionCreators(hostGame, dispatch),
      joinGame: bindActionCreators(joinGame, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);
