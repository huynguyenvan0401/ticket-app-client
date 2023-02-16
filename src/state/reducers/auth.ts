import { ActionType } from 'state/actions/action-types/types';
import { AuthAction } from 'state/actions';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const initialState =
	JSON.stringify(user) !== '{}'
		? { isLoggedIn: true, user }
		: { isLoggedIn: false, user: null };

export default function (state = initialState, action: AuthAction) {
	const { type, payload } = action;

	switch (type) {
		case ActionType.REGISTER_SUCCESS:
			return {
				...state,
				isLoggedIn: false,
			};
		case ActionType.REGISTER_FAIL:
			return {
				...state,
				isLoggedIn: false,
			};
		case ActionType.LOGIN_SUCCESS:
			return {
				...state,
				isLoggedIn: true,
				user: payload ? payload.user : {},
			};
		case ActionType.LOGIN_FAIL:
			return {
				...state,
				isLoggedIn: false,
				user: null,
			};
		case ActionType.LOGOUT:
			return {
				...state,
				isLoggedIn: false,
				user: null,
			};
		default:
			return state;
	}
}
