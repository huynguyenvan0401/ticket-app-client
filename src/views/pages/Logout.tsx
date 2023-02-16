import React from 'react';
import { useDispatch } from 'react-redux';
import * as authAction from 'state/actions/action-creators/authAction';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
	const navigate = useNavigate();
	const { logout } = bindActionCreators(authAction, useDispatch());

	React.useEffect(() => {
		logout();
		navigate('/login');
	}, []);

	return <></>;
};

export default Logout;
