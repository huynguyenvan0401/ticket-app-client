import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
	Button,
	Form,
	Input,
	Alert,
	Space,
	Layout,
	Checkbox,
	Col,
	Row,
	Typography,
} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import * as authAction from 'state/actions/action-creators/authAction';
import { RootState } from 'state/reducers';
import { ActionType } from 'state/actions/action-types/types';
import { bindActionCreators } from '@reduxjs/toolkit';
import { Message } from 'state/actions';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

const { Header, Footer, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
	textAlign: 'center',
	color: '#fff',
	height: 64,
	paddingInline: 50,
	lineHeight: '64px',
	backgroundColor: '#7dbcea',
};

const contentStyle: React.CSSProperties = {
	minHeight: 120,
	lineHeight: '120px',
	padding: '50px 50px',
};

const siderStyle: React.CSSProperties = {
	textAlign: 'center',
	lineHeight: '120px',
	color: '#fff',
	backgroundColor: '#3ba0e9',
};

const footerStyle: React.CSSProperties = {
	textAlign: 'center',
	color: '#fff',
	backgroundColor: '#7dbcea',
};

const Login: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { login } = bindActionCreators(authAction, dispatch);

	const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
	const message: Message = useSelector((state: RootState) => state.message);

	useEffect(() => {
		if (isLoggedIn) {
			navigate('/checkin/view');
		}
		dispatch({ type: ActionType.CLEAR_MESSAGE });
	}, [isLoggedIn]);

	const [form, setForm] = useState({
		username: '',
		password: '',
	});

	const [validate, setValidate] = useState({});

	function validatePassword() {
		let isValid = false;
		const pattern = new RegExp(
			'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
		);
		if (pattern.test(form.password)) {
			isValid = true;
		}
		setValidate((prevValues) => {
			return {
				...prevValues,
				password: isValid,
			};
		});
	}

	function validUserName() {
		let isValid = false;
		const pattern = new RegExp('/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/');
		if (pattern.test(form.username)) {
			isValid = true;
		}
		setValidate((prevValues) => {
			return {
				...prevValues,
				username: isValid,
			};
		});
	}

	function handleFormChange(e: any) {
		const { name, value } = e.target;
		setForm((prevValues) => {
			return {
				...prevValues,
				[name]: value,
			};
		});
		if (name === 'username') {
			validUserName();
		} else if (name === 'password') {
			validatePassword();
		}
	}

	function handleLogin(e: any) {
		e.preventDefault();
		login(form.username, form.password);
	}

	return (
		<>
			<Row justify="center">
				<Title level={2} style={{ marginBottom: '40px' }}>
					Đăng nhập
				</Title>
			</Row>
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{ remember: true }}
			>
				<Row justify={{ lg: 'center' }}>
					<Col
						xs={{ span: 24 }}
						xl={{ span: 6 }}
						lg={{ span: 12 }}
						md={{ span: 12 }}
					>
						{message && message.message && (
							<Alert
								message={message.message}
								type={message.status}
								style={{ marginBottom: '15px' }}
							/>
						)}

						<Form.Item
							name="username"
							rules={[
								{
									required: true,
									message: 'Please input your Username!',
								},
							]}
						>
							<Input
								prefix={<UserOutlined className="site-form-item-icon" />}
								placeholder="Email"
								name="username"
								value={form.username}
								onChange={(e: any) => handleFormChange(e)}
								onBlur={() => validUserName()}
							/>
						</Form.Item>

						<Form.Item
							name="password"
							rules={[
								{
									required: true,
									message: 'Please input your Password!',
								},
							]}
						>
							<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="Mật khẩu"
								name="password"
								value={form.password}
								onChange={(e) => handleFormChange(e)}
								onBlur={() => validatePassword()}
							/>
						</Form.Item>

						<Form.Item style={{ width: '100%' }}>
							<Row justify="space-between">
								<Col>
									<Form.Item name="remember" valuePropName="checked" noStyle>
										<Checkbox>Lưu tài khoản</Checkbox>
									</Form.Item>
								</Col>
								<Col style={{ textAlign: 'right' }}>
									<Link to={'/404'} className="login-form-forgot">
										Quên mật khẩu
									</Link>
								</Col>
							</Row>
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								className="login-form-button"
								onClick={(e) => handleLogin(e)}
								block
							>
								Đăng nhập
							</Button>
							hoặc
							<Link to={'/404'} style={{ marginLeft: '5px' }}>
								Đăng ký!
							</Link>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default Login;
