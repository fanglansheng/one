'use strict';
import { combineReducers } from 'redux';
import core from '../../core';
const {
	ActionTypes,
	ReducerFactory
} = core.constants;

const {
	createToggle,
	createCurrentIdWithName
} = ReducerFactory;

const directions = (state=null, action) => {

};

export default combineReducers({
	directions
});