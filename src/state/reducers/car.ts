import { ActionType } from 'state/actions/action-types/types';
import type { Reducer } from '@reduxjs/toolkit';
import { TicketAction } from 'state/actions';

const initialState: unknown[] = [];

const carReducer: Reducer = (state: unknown[] = initialState, action: any) => {
	switch (action.type) {
		case ActionType.FETCH_CAR:
			return action.payload;
		default:
			return state;
	}
};

export default carReducer;
