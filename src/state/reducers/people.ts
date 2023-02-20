import { ActionType } from 'state/actions/action-types/types';
import type { Reducer } from '@reduxjs/toolkit';
import { TicketAction } from 'state/actions';

const initialState: unknown[] = [];

const peopleReducer: Reducer = (
	state: unknown[] = initialState,
	action: any
) => {
	switch (action.type) {
		case ActionType.FETCH_PEOPLE_CHECKIN:
			return action.payload;
		case ActionType.FETCH_PEOPLE_DRIVE:
			return action.payload;
		default:
			return state;
	}
};

export default peopleReducer;
