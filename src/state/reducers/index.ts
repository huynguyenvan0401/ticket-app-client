import { combineReducers } from '@reduxjs/toolkit';
import ticket from 'state/reducers/ticket';
import auth from './auth';
import message from './message';
import people from 'state/reducers/people';
import checkin from 'state/reducers/checkin';

export const rootReducer = combineReducers({
	ticket,
	auth,
	message,
	people,
	checkin,
});
export type RootState = ReturnType<typeof rootReducer>;
