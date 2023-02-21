import axios from 'axios';
import { ActionType } from 'state/actions/action-types/types';
import authHeader from 'services/auth-header';
import keys from 'config/keys';

export const resetCheckin = () => async (dispatch: any) => {
	dispatch({ type: ActionType.RESETTING_CHECKIN });

	await axios.delete(keys.BASE_URL + '/api/checkin/drive', {
		headers: authHeader(),
	});

	dispatch({ type: ActionType.CHECKIN_RESETTED });
};

export const resetAllCheckin = () => async (dispatch: any) => {
	dispatch({ type: ActionType.RESETTING_CHECKIN });

	await axios.delete(keys.BASE_URL + '/api/checkin', {
		headers: authHeader(),
	});

	dispatch({ type: ActionType.CHECKIN_RESETTED });
};

export const delCheckinByPeopleId = (id: number) => async (dispatch: any) => {
	dispatch({ type: ActionType.REMOVING_CHECKIN });

	await axios.delete(keys.BASE_URL + `/api/checkin/deleteByPeopleId/${id}`, {
		headers: authHeader(),
	});

	dispatch({ type: ActionType.CHECKIN_REMOVED });
};

export const createCheckin =
	(peopleId: string, code: string, carId: string) => async (dispatch: any) => {
		try {
			dispatch({ type: ActionType.CREATING_CHECKIN });

			const data = await axios.post(keys.BASE_URL + '/api/checkin', {
				peopleId,
				code,
				carId,
			});

			dispatch({ type: ActionType.CHECKIN_CREATED });
		} catch (error: any) {
			console.log(error);

			dispatch({ type: ActionType.CHECKIN_FAILED });
			const message =
				(error.response && error.response.data) ||
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
