import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {browserHistory} from 'react-router';

import {startGame, alertLeaver} from '../actions/';


import { List, ListItem } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import '../styles/WaitRoom.scss';


class WaitRoom extends Component{

	constructor(props){
		super(props)

		this.state = {
			open: false
		
		}


	}

	componentWillReceiveProps(nextProps){
		console.log('COMPONENT WILL REVCEIVE PROPS', nextProps)
		if(nextProps.game && nextProps.game.error){
			this.setOpenDialogState();
		}
		else if(nextProps.game && nextProps.game.room && nextProps.game.room.playing){
			browserHistory.push('/game');
		}
		
	}

	componentDidMount() {

		let leaverData = {
			game: this.props.game,
			currentPlayer: this.props.currentPlayer
		}
		let closing = () => {
			//send leaver alert
			this.props.actions.alertLeaver(leaverData);
       		return 'Leaver'
       }

		window.onunload = closing;


	
	}
	//remove onbeforeupload event listener on unmount
	componentWillUnmount(){
		window.onunload = () => {}
	}

	//open the error dialog if an error exists
	setOpenDialogState(){
		let newState = Object.assign({}, this.state);
		newState['open'] = true;
		this.setState(newState);
	}



	handleTextChange = (inputElement, e)=>{
		let newState = Object.assign({}, this.state);

		//update Error text fields (remove errorText when user enters a value)
		let errTextField = `err_${inputElement}`;

		if(e.target.value && newState[errTextField] !== null){
			newState[errTextField] = null;
		}

		newState[inputElement] = e.target.value;
		this.setState(newState);
	}

	checkIfEmpty = (reqFieldsObj) => {
		let errors = {};

		for(var keys in reqFieldsObj){
			if(!reqFieldsObj[keys]){
				errors[keys] = 'Required';
			}
		}

		return errors;
	}

	renderPlayers(){
		return this.props.game.room.players.map((player, index)=>{
			return(

				<ListItem key={index} style={{'color': '#fff', 'font-size': '20'}}>
					{player.name}
				</ListItem>	
			)
		});
	}

	handleStartGame = (e) => {
		e.preventDefault();
		this.props.actions.startGame(this.props.game);
	}

	renderErrorDialog(){
		console.log('rendinerg error dialog')
		if(this.props.game && this.props.game.error){

			return(
				<Dialog
					title='Oops!'
					open = {this.state.open}
					actions = {this.dialogActions}
			
				>
					<p>{this.props.game.error}</p>
				</Dialog>
			)
		}
		else{
	
			return null
		}
	}

	handleCloseDialog = () => {
		let newState = Object.assign({}, this.state);
		newState['open'] = false;
		this.setState(newState);
	};

	handleReturnToHome = (e) => {
        e.preventDefault()
        browserHistory.push('/');
    }

	dialogActions = [
		<RaisedButton
				label='Return To Homescreen'
				primary={true}
				onTouchTap={this.handleReturnToHome.bind(this)}
		/>
	];


	render(){

		return(

			<div className="waitroom__container">
				<div className='row'>
					<div className="col-md-6 col-md-offset-3 text-center">
						{this.renderErrorDialog()}
						<h2 className="waitroom__header">
							Game Room ID: <br/>
							<span className="header__room-id">
								{this.props.game.room.id}
							</span>
                        </h2>
						<h3 className="players-list__header">
							Players Joined:	
						</h3>
						<List style={{'margin-bottom': '5%'}}>
							{this.renderPlayers()}
						</List>
						
						{ this.props.currentPlayer.host ?
							<RaisedButton		
								label='Start Game'
								primary={true}
								fullWidth={true}
								onTouchTap={this.handleStartGame.bind(this)} //dispatch action init game to server
							>		
							</RaisedButton>	:
							<div className="waitroom__waiting-text">
								Waiting for {this.props.game.room.host.name} (Host) to Start the Game...
							</div>
						}
					
						
						
					</div>

				</div>
			</div>
		)
		
	

	}//end render
}

function mapStateToProps(state){
	return {
		game: state.game.gameRoom,
		currentPlayer: state.game.currentPlayer
	}
}

function mapDispatchToProps(dispatch){
	return {
		actions:{
			startGame: bindActionCreators( startGame, dispatch ),
			alertLeaver: bindActionCreators( alertLeaver, dispatch)
		}
	}
}

export default connect( mapStateToProps, mapDispatchToProps )( WaitRoom );