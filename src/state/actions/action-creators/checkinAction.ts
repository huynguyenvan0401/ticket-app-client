import axios from 'axios';
import { ActionType } from 'state/actions/action-types/types';
import authHeader from 'services/auth-header';

export const fetchCheckin = () => async (dispatch: any) => {
	const data = await axios.get('http://localhost:8080/api/checkin', {
		headers: authHeader(),
	});

	dispatch({ type: ActionType.FETCH_CHECKIN, payload: data.data });
};

export const resetCheckin = () => async (dispatch: any) => {
	await axios.delete('http://localhost:8080/api/checkin/drive', {
		headers: authHeader(),
	});

	dispatch(fetchCheckin());
};

export const createCheckin =
	(peopleId: string, code: string, carId: string) => async (dispatch: any) => {
		try {
			const data = await axios.post('http://localhost:8080/api/checkin', {
				peopleId,
				code,
				carId,
			});
			dispatch({
				type: ActionType.SET_MESSAGE,
				payload: {
					message: 'Checked in!',
					status: 'success',
				},
			});
		} catch (error: any) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: ActionType.SET_MESSAGE,
				payload: {
					message,
					status: 'error',
				},
			});
		}
	};
