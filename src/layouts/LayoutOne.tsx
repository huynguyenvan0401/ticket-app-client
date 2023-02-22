import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as Logo } from 'assets/svg/logo.svg';
import {
	Link,
	Routes,
	Route,
	Navigate,
	Outlet,
	useNavigate,
} from 'react-router-dom';
import {
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	RightOutlined,
	CloseOutlined,
	MenuOutlined,
	LogoutOutlined,
	CarOutlined,
	QrcodeOutlined,
	DingtalkOutlined,
	UnorderedListOutlined,
	LoginOutlined,
} from '@ant-design/icons';
import {
	Layout,
	Menu,
	theme,
	Row,
	Col,
	Switch,
	Divider,
	Typography,
	ConfigProvider,
} from 'antd';
import type { MenuProps, MenuTheme } from 'antd/es/menu';
import { RootState } from 'state/reducers';

const RepoTwo: React.FC = () => {
	const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
	const user = useSelector((state: RootState) => state.auth.user);
	const [collapsed, setCollapsed] = useState(true);
	const closeSidemenu = () => {
		setCollapsed(true);
	};
	const navigate = useNavigate();
	const { Title } = Typography;
	const { Header, Content, Footer, Sider } = Layout;

	type MenuItem = Required<MenuProps>['items'][number];

	function getItem(
		label: React.ReactNode,
		key: React.Key,
		icon?: React.ReactNode,
		children?: MenuItem[],
		onClick?: MenuProps['onClick']
	): MenuItem {
		return {
			key,
			icon,
			children,
			label,
			onClick,
		} as MenuItem;
	}

	const items: MenuItem[] = [
		!isLoggedIn &&
			getItem('Đăng nhập', '4', <LoginOutlined />, undefined, () => {
				navigate('/login');
				setCollapsed(true);
			}),
		getItem('View Checkin', '5', <UnorderedListOutlined />, undefined, () => {
			navigate('/checkin/view');
			setCollapsed(true);
		}),
		isLoggedIn &&
			getItem('Tài khoản', 'subUser', <UserOutlined />, [
				getItem('Đăng xuất', '1', <LogoutOutlined />, undefined, () => {
					navigate('/logout');
					setCollapsed(true);
				}),
			]),
		user &&
			user.roles.includes('DRIVER') &&
			getItem('Lái xe', 'subDriver', <CarOutlined />, [
				getItem('Hành khách', '2', <QrcodeOutlined />, undefined, () => {
					navigate('/checkin/manage');
					setCollapsed(true);
				}),
			]),
		user &&
			user.roles.includes('ADMIN') &&
			getItem('ADMIN', 'subAdmin', <DingtalkOutlined />, [
				getItem('Thành viên', '3', <UserOutlined />, undefined, () => {
					navigate('/admin/peoples');
					setCollapsed(true);
				}),
			]),
	];

	const [mode, setMode] = useState<'vertical' | 'inline'>('inline');
	const [menuTheme, setMenuTheme] = useState<MenuTheme>('light');

	const [current, setCurrent] = useState('');
	const onClick: MenuProps['onClick'] = (e) => {
		setCurrent(e.key);
	};

	const changeTheme = (value: boolean) => {
		setMenuTheme(value ? 'dark' : 'light');
	};

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	useEffect(() => {
		document.body.addEventListener('click', closeSidemenu);

		return function cleanup() {
			window.removeEventListener('click', closeSidemenu);
		};
	}, []);

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#00b96b',
				},
			}}
		>
			<Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
				<Header
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						zIndex: 1000,
						width: '100%',
						background: colorBgContainer,
						padding: '0px',
					}}
				>
					<Row
						justify="space-between"
						style={{
							height: '100%',
						}}
					>
						<Col>
							<>
								{React.createElement(MenuOutlined, {
									className: 'trigger',
									style: { padding: '15px', fontSize: '20px' },
									onClick: (e) => {
										e.stopPropagation();
										setCollapsed(!collapsed);
									},
								})}
							</>
						</Col>
						<Col
							style={{
								display: 'inline-flex',
								alignItems: 'center',
							}}
						>
							<Link
								to={'/home'}
								style={{
									margin: '0px 15px 0px 10px',
									padding: '0px',
									height: '50px',
								}}
							>
								<Logo style={{ width: '50px', height: '50px' }} />
							</Link>
						</Col>
					</Row>
				</Header>
				<Layout>
					<Sider
						onClick={(e) => e.stopPropagation()}
						theme={menuTheme}
						trigger={null}
						collapsible
						collapsed={collapsed}
						collapsedWidth="0"
						style={{
							position: 'fixed',
							top: '60px',
							left: '0',
							bottom: '0',
							zIndex: '99',
						}}
					>
						<div className="logo" />
						<Switch
							checkedChildren="Dark"
							unCheckedChildren="Light"
							onChange={changeTheme}
							style={{ margin: '10px' }}
						/>
						<Menu theme={menuTheme} mode="inline" items={items} />
					</Sider>
					<Content style={{ padding: '50px 0px 0px 0px', height: '100%' }}>
						<div
							style={{
								padding: '30px 5px 5px 5px',
								background: colorBgContainer,
								minHeight: '95vh',
							}}
						>
							<Outlet />
						</div>
					</Content>
				</Layout>
				<Footer style={{ textAlign: 'center' }}>
					FE Team ©2023 Created by Heart
				</Footer>
			</Layout>
		</ConfigProvider>
	);
};

export default RepoTwo;
