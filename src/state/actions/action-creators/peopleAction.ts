import axios from 'axios';
import { ActionType } from 'state/actions/action-types/types';
import authHeader from 'services/auth-header';
import { fetchCheckin, fetchCheckinAdmin } from './checkinAction';

export const fetchPeople = () => async (dispatch: any) => {
	const data = await axios.get('http://localhost:8080/api/people');
	dispatch({ type: ActionType.FETCH_PEOPLE, payload: data.data });
};

export const fetchPeopleDrive = () => async (dispatch: any) => {
	const data = await axios.get('http://localhost:8080/api/people/drive', {
		headers: authHeader(),
	});
	dispatch({ type: ActionType.FETCH_PEOPLE_DRIVE, payload: data.data });
};

export const updateNote = (id: any, note: any) => async (dispatch: any) => {
	await axios.post(
		'http://localhost:8080/api/people/updateNoteByDriver',
		{ id, note },
		{
			headers: authHeader(),
		}
	);
	dispatch(fetchPeopleDrive()).then(dispatch(fetchCheckin()));
};

export const updatePeople =
	(id: any, note: any, carId: any, roomId: any) => async (dispatch: any) => {
		await axios.post(
			'http://localhost:8080/api/people/updatePeopleDrive',
			{ id, note, carId, roomId },
			{
				headers: authHeader(),
			}
		);
		dispatch(fetchPeople());
		dispatch(fetchCheckinAdmin());
	};
