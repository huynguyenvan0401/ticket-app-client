import { ActionType } from 'state/actions/action-types/types';
import { MessageAction } from 'state/actions';

const initialState = {
	message: '',
	status: '',
};

export default function (state = initialState, action: MessageAction) {
	const { type, payload } = action;

	switch (type) {
		case ActionType.SET_MESSAGE:
			return payload;

		case ActionType.CLEAR_MESSAGE:
			return {
				message: '',
				status: '',
			};
		default:
			return state;
	}
}
