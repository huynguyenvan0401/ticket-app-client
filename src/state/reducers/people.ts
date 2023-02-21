import { ActionType } from 'state/actions/action-types/types';
import type { Reducer } from '@reduxjs/toolkit';
import { TicketAction } from 'state/actions';

const initialState: {
	isLoading: boolean;
	isUpdating: boolean;
	data: [];
	accounts: [];
	isLoadingAccount: boolean;
} = {
	isLoading: false,
	isUpdating: false,
	data: [],
	accounts: [],
	isLoadingAccount: false,
};
const peopleReducer: Reducer = (
	state: {
		isLoading: boolean;
		isUpdating: boolean;
		data: [];
		accounts: [];
		isLoadingAccount: boolean;
	} = initialState,
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
		case ActionType.LOADING_PEOPLE_ACCOUNT:
			return {
				...state,
				isLoadingAccount: true,
			};
		case ActionType.FETCH_PEOPLE_ACCOUNT:
			return {
				...state,
				accounts: action.payload,
				isLoadingAccount: false,
			};
		default:
			return state;
	}
};

export default peopleReducer;
