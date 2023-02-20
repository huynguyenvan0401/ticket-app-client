import { ActionType } from 'state/actions/action-types/types';
import type { Reducer } from '@reduxjs/toolkit';

const initialState: {
	isCreating: boolean;
	isCreated: boolean;
	isRemoving: boolean;
	isRemoved: boolean;
	isResetting: boolean;
	isResetted: boolean;
} = {
	isCreating: false,
	isCreated: false,
	isRemoving: false,
	isRemoved: false,
	isResetting: false,
	isResetted: false,
};

const checkinReducer: Reducer = (
	state: {
		isCreating: boolean;
		isCreated: boolean;
		isRemoving: boolean;
		isRemoved: boolean;
		isResetting: boolean;
		isResetted: boolean;
	} = initialState,
	action: any
) => {
	switch (action.type) {
		case ActionType.CREATING_CHECKIN:
			return {
				...state,
				isCreating: true,
				isCreated: false,
			};
		case ActionType.CHECKIN_CREATED:
			return {
				...state,
				isCreating: false,
				isCreated: true,
			};
		case ActionType.REMOVING_CHECKIN:
			return {
				...state,
				isRemoving: true,
				isRemoved: false,
			};
		case ActionType.CHECKIN_REMOVED:
			return {
				...state,
				isRemoving: false,
				isRemoved: true,
			};
		case ActionType.RESETTING_CHECKIN:
			return {
				...state,
				isResetting: true,
				isResetted: false,
			};
		case ActionType.CHECKIN_RESETTED:
			return {
				...state,
				isResetting: false,
				isResetted: true,
			};
		default:
			return state;
	}
};

export default checkinReducer;
