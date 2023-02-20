import { ActionType } from 'state/actions/action-types/types';
import type { Reducer } from '@reduxjs/toolkit';
import { TicketAction } from 'state/actions';

const initialState: { isLoading: boolean; isUpdating: boolean; data: [] } = {
	isLoading: false,
	isUpdating: false,
	data: [],
};
const peopleReducer: Reducer = (
	state: { isLoading: boolean; data: [] } = initialState,
	action: any
) => {
	switch (action.type) {
		case ActionType.LOADING_PEOPLE_CHECKIN:
			return {
				...state,
				isLoading: true,
			};
		case ActionType.FETCH_PEOPLE_CHECKIN:
			return {
				isLoading: false,
				data: action.payload,
			};
		case ActionType.FETCH_PEOPLE_CHECKIN_DRIVE:
			return {
				isLoading: false,
				data: action.payload,
			};
		case ActionType.UPDATING_PEOPLE:
			return {
				...state,
				isUpdating: true,
			};
		case ActionType.PEOPLE_UPDATED:
			return {
				...state,
				isUpdating: false,
			};
		default:
			return state;
	}
};

export default peopleReducer;
