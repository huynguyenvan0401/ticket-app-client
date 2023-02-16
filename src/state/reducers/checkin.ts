import { ActionType } from 'state/actions/action-types/types';
import type { Reducer } from '@reduxjs/toolkit';

const initialState: unknown[] = [];

const checkinReducer: Reducer = (
	state: unknown[] = initialState,
	action: any
) => {
	switch (action.type) {
		case ActionType.FETCH_CHECKIN:
			return action.payload;
		default:
			return state;
	}
};

export default checkinReducer;
