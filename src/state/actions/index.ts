import { ActionType } from 'state/actions/action-types/types';

interface FetchTicketAction {
	type: ActionType.FETCH_TICKET;
	payload?: unknown[];
}

interface CreateTicketAction {
	type: ActionType.CREATE_TICKET;
	payload?: {};
}

export type TicketAction = FetchTicketAction | CreateTicketAction;

// auth
export type AuthAction = {
	type: string;
	payload?: { user?: {} };
};

export interface Message {
	message?: string;
	status?: 'success' | 'info' | 'warning' | 'error';
}

export type MessageAction = {
	type: string;
	payload?: Message;
};

export interface People {
	id: number;
	account: string;
	phoneNumber: string;
	note: string;
}
