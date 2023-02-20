import { ActionType } from 'state/actions/action-types/types';
import type { Reducer } from '@reduxjs/toolkit';
import { TicketAction } from 'state/actions';

const initialState: { isLoading: boolean; data: [] } = {
	isLoading: false,
	data: [],
};
const peopleReducer: Reducer = (
	state: { isLoading: boolean; data: [] } = initialState,
	action: any
) => {
	switch (action.type) {
		case ActionType.LOADING_PEOPLE_CHECKIN:
			return Object.assign(
				{},
				{
					...state,
					isLoading: false,
				}
			);
		case ActionType.FETCH_PEOPLE_CHECKIN:
			return Object.assign(
				{},
				{
					isLoading: false,
					data: action.payload,
				}
			);
		case ActionType.FETCH_PEOPLE_DRIVE:
			return action.payload;
		default:
			return state;
	}
};

export default peopleReducer;
