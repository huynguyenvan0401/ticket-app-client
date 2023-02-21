import axios from 'axios';
import { ActionType } from 'state/actions/action-types/types';
import authHeader from 'services/auth-header';
import keys from 'config/keys';

// Role ADMIN: get list people checkin details for admin
export const fetchPeopleCheckin = () => async (dispatch: any) => {
	dispatch({ type: ActionType.LOADING_PEOPLE_CHECKIN });

	const data = await axios.get(keys.BASE_URL + '/api/people', {
		headers: authHeader(),
	});

	dispatch({ type: ActionType.FETCH_PEOPLE_CHECKIN, payload: data.data });
};

// Role DRIVER: get list people checkin details for driver
export const fetchPeopleCheckinDrive = () => async (dispatch: any) => {
	dispatch({ type: ActionType.LOADING_PEOPLE_CHECKIN });

	const data = await axios.get(keys.BASE_URL + '/api/people/drive', {
		headers: authHeader(),
	});

	dispatch({ type: ActionType.FETCH_PEOPLE_CHECKIN_DRIVE, payload: data.data });
};

// Role ALL: get people accounts list
export const fetchPeopleAccount = () => async (dispatch: any) => {
	dispatch({ type: ActionType.LOADING_PEOPLE_ACCOUNT });
	const data = await axios.get(keys.BASE_URL + '/api/people/account');
	dispatch({ type: ActionType.FETCH_PEOPLE_ACCOUNT, payload: data.data });
};

export const fetchAccountByDriver = () => async (dispatch: any) => {
	dispatch({ type: ActionType.LOADING_PEOPLE_ACCOUNT });
	const data = await axios.get(keys.BASE_URL + '/api/people/account/drive', {
		headers: authHeader(),
	});
	dispatch({ type: ActionType.FETCH_PEOPLE_ACCOUNT, payload: data.data });
};

export const addPeople = (id: any) => async (dispatch: any) => {
	dispatch({ type: ActionType.ADDING_PEOPLE });

	await axios.post(
		keys.BASE_URL + '/api/people/updateCar',
		{ id },
		{
			headers: authHeader(),
		}
	);

	dispatch({ type: ActionType.PEOPLE_ADDED });
};

// Used by driver
export const updateNote =
	(id: any, note: any, carId: any, roomId: any) => async (dispatch: any) => {
		dispatch({ type: ActionType.UPDATING_PEOPLE });

		await axios.post(
			keys.BASE_URL + '/api/people/updateNoteByDriver',
			{ id, note, carId, roomId },
			{
				headers: authHeader(),
			}
		);

		dispatch({ type: ActionType.PEOPLE_UPDATED });
	};

// Used by admin
export const updatePeople =
	(id: any, note: any, carId: any, roomId: any) => async (dispatch: any) => {
		dispatch({ type: ActionType.UPDATING_PEOPLE });

		await axios.post(
			keys.BASE_URL + '/api/people/updatePeopleDrive',
			{ id, note, carId, roomId },
			{
				headers: authHeader(),
			}
		);

		dispatch({ type: ActionType.PEOPLE_UPDATED });
	};
