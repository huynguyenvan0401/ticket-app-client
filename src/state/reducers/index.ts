import { combineReducers } from '@reduxjs/toolkit';
import ticket from 'state/reducers/ticket';
import auth from './auth';
import message from './message';
import people from 'state/reducers/people';
import checkin from 'state/reducers/checkin';
import car from 'state/reducers/car';
import room from 'state/reducers/room';

export const rootReducer = combineReducers({
	ticket,
	auth,
	message,
	people,
	checkin,
	car,
	room,
});
export type RootState = ReturnType<typeof rootReducer>;
