import axios from 'axios';
import { browserHistory } from 'react-router';
import { HOST_GAME, JOIN_GAME, START_GAME, SET_CURRENT_MOVE, SEND_CURRENT_GAME_STATE, START_NEXT_ROUND, ALERT_LEAVER} from '../constants/constants';

//API config
//default root
let ROOT_URL = 'http://localhost:3000';
//if heroku use heroku
if (window.location.hostname === 'shotgun-multiplayer.herokuapp.com') {
  ROOT_URL = 'https://shotgun-multiplayer.herokuapp.com';
}

export function hostGame(name){
	return {
		type: HOST_GAME,
		payload: name,
		meta: {remote: true}
	} 
}
//data is an object containing name of user and room id
export function joinGame(data){
	return {
		type: JOIN_GAME,
		payload: data,
		meta: {remote: true}
	}
}
//data is an object of game metadata including room id, host, players
export function startGame(data){
	return {
		type: START_GAME,
		payload: data,
		meta: {remote: true}
	}
}

//data is an object of {room: {}, player: {id: , name: }, moveInfo: {move: '', target: }}
export function setCurrentMove(data){
	console.log('SETTING CURRENT MOVE ON FRONTEND ', data)
	return {
		type: SET_CURRENT_MOVE,
		payload: data,
		
	}
}
//data is current game state { currentPlayer: {currentMove: {}}, game: {room: {}} }
export function sendCurrentGameState(data){
	console.log('SENDING CURRENT GAME STATE TO BACKEDND', data);
	return {
		type: SEND_CURRENT_GAME_STATE,
		payload: data,
		meta: {remote: true}
	}
}
//data is current game state { currentPlayer: {currentMove: {}}, game: {room: {}} }
export function startNextRound(data){
	console.log('SENDING STARTNEXTROUND TO BACKEND')
	return {
		type: START_NEXT_ROUND,
		payload: data,
		meta: {remote: true}
	}
}

export function alertLeaver(data){
	console.log('someone trying to leave the game')
	return {
		type: ALERT_LEAVER,
		payload: data,
		meta: {remote: true}
	}
}




























