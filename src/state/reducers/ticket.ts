import { ActionType } from 'state/actions/action-types/types';
import type { Reducer } from '@reduxjs/toolkit';
import { TicketAction } from 'state/actions';

const initialState: unknown[] = [];

const ticketReducer: Reducer = (
	state: unknown[] = initialState,
	action: TicketAction
) => {
	switch (action.type) {
		case ActionType.FETCH_TICKET:
			return action.payload;
		default:
			return state;
	}
};

export default ticketReducer;
