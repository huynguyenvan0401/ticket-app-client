import { ActionType } from 'state/actions/action-types/types';
import type { Reducer } from '@reduxjs/toolkit';
import { TicketAction } from 'state/actions';

const initialState: { car: any } = { car: {} };

const infoReducer: Reducer = (
	state: { car: any } = initialState,
	action: any
) => {
	switch (action.type) {
		case ActionType.FETCH_CAR_INFO:
			return {
				...state,
				car: {
					...action.payload,
				},
			};
		default:
			return state;
	}
};

export default infoReducer;
