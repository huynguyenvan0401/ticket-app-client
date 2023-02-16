import axios from 'axios';
import keys from 'config/keys';

const login = async (username: string, password: string) => {
	const res = await axios.post(keys.BASE_URL + '/api/auth/authenticate', {
		email: username,
		password,
	});

	if (res.data.accessToken) {
		localStorage.setItem('user', JSON.stringify(res.data));
	}

	return res.data;
};

const logout = () => {
	localStorage.removeItem('user');
};

const register = async (
	email: string,
	password: string,
	firstName: string,
	lastName: string
) => {
	const res = await axios.post(keys.BASE_URL + '/api/auth/register', {
		email,
		password,
		firstName,
		lastName,
	});
	return res;
};

export { login, logout, register };
