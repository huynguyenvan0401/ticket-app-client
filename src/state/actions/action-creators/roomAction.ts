import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionType } from 'state/actions/action-types/types';
import { TicketAction } from 'state/actions';
import authHeader from 'services/auth-header';

export const fetchRoom = () => async (dispatch: any) => {
	const data = await axios.get('http://localhost:8080/api/room', {
		headers: authHeader(),
	});
	dispatch({ type: ActionType.FETCH_ROOM, payload: data.data });
};
