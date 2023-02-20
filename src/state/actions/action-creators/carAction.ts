import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionType } from 'state/actions/action-types/types';
import { TicketAction } from 'state/actions';
import authHeader from 'services/auth-header';

export const fetchCar = () => async (dispatch: any) => {
	const data = await axios.get('http://localhost:8080/api/car', {
		headers: authHeader(),
	});
	dispatch({ type: ActionType.FETCH_CAR, payload: data.data });
};
