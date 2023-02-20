import axios from 'axios';
import { ActionType } from 'state/actions/action-types/types';
import authHeader from 'services/auth-header';
import { fetchPeopleCheckin, fetchPeopleCheckinDrive } from './peopleAction';
import keys from 'config/keys';

export const resetCheckin = () => async (dispatch: any) => {
	await axios.delete(keys.BASE_URL + '/api/checkin/drive', {
		headers: authHeader(),
	});
	dispatch(fetchPeopleCheckinDrive());
};

export const resetAllCheckin = () => async (dispatch: any) => {
	await axios.delete(keys.BASE_URL + '/api/checkin', {
		headers: authHeader(),
	});
	dispatch(fetchPeopleCheckin());
};

export const delCheckinByPeopleId = (id: number) => async (dispatch: any) => {
	await axios.delete(keys.BASE_URL + `/api/checkin/deleteByPeopleId/${id}`, {
		headers: authHeader(),
	});
	dispatch(fetchPeopleCheckin());
};

export const createCheckin =
	(peopleId: string, code: string, carId: string) => async (dispatch: any) => {
		try {
			const data = await axios.post(keys.BASE_URL + '/api/checkin', {
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
			dispatch(fetchPeopleCheckin());
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
