import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ActionType } from 'state/actions/action-types/types';

const CheckinComplete: React.FC = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch({ type: ActionType.INIT_CHECKIN });
	}, []);

	return <h1>Checkin completed!</h1>;
};

export default CheckinComplete;
