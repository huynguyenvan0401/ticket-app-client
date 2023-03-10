import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionType } from 'state/actions/action-types/types';
import { TicketAction } from 'state/actions';
import keys from 'config/keys';

export const fetchTicket = () => async (dispatch: Dispatch<TicketAction>) => {
	const data = await axios.get(keys.BASE_URL + '/api/ticket');
	dispatch({ type: ActionType.FETCH_TICKET, payload: data.data });
};

// export const saveRepoData = (data: {}) => async (dispatch: any) => {
//   dispatch({ type: SAVE_DATA, payload: data });
// };

// export const deleteRepoData = (data: {}) => async (dispatch: any) => {
//   dispatch({ type: DELETE_DATA, payload: data });
// };

// export const addRepoData = (data: {}) => async (dispatch: any) => {
//   dispatch({ type: ADD_DATA, payload: data });
// };
