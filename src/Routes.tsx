import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from 'views/pages/Login';
import RepoTwo from 'views/pages/RepoTwo';
import NotFound from 'views/errorPage/NotFound';
import Logout from 'views/pages/Logout';
import Home from 'views/pages/Home';
import Checkin from 'views/pages/Checkin';
import ManageCheckin from 'views/pages/ManageCheckin';
import ManagePeople from 'views/pages/ManagePeople';
import ViewPeopleCheckin from 'views/pages/ViewPeopleCheckin';

import LayoutOne from 'layouts/LayoutOne';

export default function RoutePage() {
	return (
		<Routes>
			<Route path="/" element={<LayoutOne />}>
				<Route path="/home" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/admin/peoples" element={<ManagePeople />} />
				<Route path="/checkin/view" element={<ViewPeopleCheckin />} />
				<Route path="/checkin" element={<Checkin />} />
				<Route path="/checkin/manage" element={<ManageCheckin />} />
				<Route path="/repos2" element={<RepoTwo />} />
			</Route>

			<Route path="/" element={<Navigate replace to="/home" />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
