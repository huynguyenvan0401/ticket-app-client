import axios from 'axios';
import { ActionType } from 'state/actions/action-types/types';
import authHeader from 'services/auth-header';

export const resetCheckin = () => async (dispatch: any) => {
	await axios.delete('http://localhost:8080/api/checkin/drive', {
		headers: authHeader(),
	});
};

export const resetAllCheckin = () => async (dispatch: any) => {
	await axios.delete('http://localhost:8080/api/checkin', {
		headers: authHeader(),
	});
};

export const delCheckinByPeopleId = (id: number) => async (dispatch: any) => {
	await axios.delete(
		`http://localhost:8080/api/checkin/deleteByPeopleId/${id}`,
		{
			headers: authHeader(),
		}
	);
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
