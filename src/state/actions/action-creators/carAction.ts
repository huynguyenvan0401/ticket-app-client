import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionType } from 'state/actions/action-types/types';
import { TicketAction } from 'state/actions';
import authHeader from 'services/auth-header';
import keys from 'config/keys';

export const fetchCar = () => async (dispatch: any) => {
	const data = await axios.get(keys.BASE_URL + '/api/car', {
		headers: authHeader(),
	});
	dispatch({ type: ActionType.FETCH_CAR, payload: data.data });
};

export const fetchCarById = (id: string) => async (dispatch: any) => {
	const data = await axios.get(keys.BASE_URL + `/api/car/${id}`);
	console.log(data.data);

	dispatch({ type: ActionType.FETCH_CAR_INFO, payload: data.data });
};
