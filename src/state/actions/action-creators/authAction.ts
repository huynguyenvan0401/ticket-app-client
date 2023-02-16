import { ActionType } from 'state/actions/action-types/types';
import { Dispatch } from 'redux';
import * as authService from 'services/auth-service';
import { AuthAction, MessageAction } from 'state/actions';

export const register =
	(email: string, password: string, firstName: string, lastName: string) =>
	async (dispatch: any) => {
		try {
			const res = await authService.register(
				email,
				password,
				firstName,
				lastName
			);
			dispatch({
				type: ActionType.REGISTER_SUCCESS,
			});

			dispatch({
				type: ActionType.SET_MESSAGE,
				payload: res.data.message,
			});

			return true;
		} catch (error: any) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: ActionType.REGISTER_FAIL,
			});

			dispatch({
				type: ActionType.SET_MESSAGE,
				payload: message,
			});

			return false;
		}
	};

export const login =
	(username: string, password: string) => async (dispatch: any) => {
		try {
			const data = await authService.login(username, password);
			dispatch({
				type: ActionType.LOGIN_SUCCESS,
				payload: { user: data },
			});

			return true;
		} catch (error: any) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: ActionType.LOGIN_FAIL,
			});

			dispatch({
				type: ActionType.SET_MESSAGE,
				payload: {
					message,
					status: 'error',
				},
			});

			return false;
		}
	};

export const logout = () => (dispatch: Dispatch<AuthAction>) => {
	authService.logout();

	dispatch({
		type: ActionType.LOGOUT,
	});
};
