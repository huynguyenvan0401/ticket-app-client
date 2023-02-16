import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'antd';
import type { MenuProps, MenuTheme } from 'antd/es/menu';

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem;
}

const items: MenuItem[] = [
	getItem('Option 1', '1', <PieChartOutlined />),
	getItem('Option 2', '2', <DesktopOutlined />),
	getItem('User', 'sub1', <UserOutlined />, [
		getItem('Tom', '3'),
		getItem('Bill', '4'),
		getItem('Alex', '5'),
	]),
	getItem('Team', 'sub2', <TeamOutlined />, [
		getItem('Team 1', '6'),
		getItem('Team 2', '8'),
	]),
	getItem('Files', '9', <FileOutlined />),
];

const RepoTwo: React.FC = () => {
	const [mode, setMode] = useState<'vertical' | 'inline'>('inline');
	const [menuTheme, setMenuTheme] = useState<MenuTheme>('light');

	const changeMode = (value: boolean) => {
		setMode(value ? 'vertical' : 'inline');
	};

	const changeTheme = (value: boolean) => {
		setMenuTheme(value ? 'dark' : 'light');
	};
	const [collapsed, setCollapsed] = useState(true);
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const closeSidemenu = () => {
		setCollapsed(true);
	};
	useEffect(() => {
		document.body.addEventListener('click', closeSidemenu);

		return function cleanup() {
			window.removeEventListener('click', closeSidemenu);
		};
	}, []);

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Layout>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<Row justify="space-between">
						<Col
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								padding: '5px 10px 10px 20px',
							}}
						>
							<Link to={'/home'}>
								<Title
									level={3}
									style={{
										marginBottom: '0px',
										lineHeight: '1',
										cursor: 'pointer',
									}}
								>
									Home
								</Title>
							</Link>
						</Col>
						<Col>
							{React.createElement(MenuOutlined, {
								className: 'trigger',
								style: { padding: '15px', fontSize: '20px' },
								onClick: (e) => {
									e.stopPropagation();
									setCollapsed(!collapsed);
								},
							})}
						</Col>
					</Row>
				</Header>
				<Content style={{ margin: '24px 16px 0' }}>
					<div
						style={{
							padding: 24,
							minHeight: 360,
							background: colorBgContainer,
						}}
					>
						content
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					Ant Design ©2023 Created by Ant UED
				</Footer>
			</Layout>
			<Sider
				onClick={(e) => e.stopPropagation()}
				defaultCollapsed
				trigger={null}
				collapsible={true}
				collapsed={collapsed}
				breakpoint="xxl"
				collapsedWidth="0"
				style={{
					overflow: 'auto',
					height: '100vh',
					position: 'fixed',
					right: 0,
					top: 0,
					bottom: 0,
				}}
				theme={menuTheme}
			>
				<Row justify="space-between">
					<Col>
						<Switch
							checkedChildren="Dark"
							unCheckedChildren="Light"
							onChange={changeTheme}
							style={{ margin: '10px' }}
						/>
					</Col>
					<Col style={{ display: 'inline-flex', alignItems: 'center' }}>
						<CloseOutlined
							style={{ padding: '10px', cursor: 'pointer', fontSize: '20px' }}
							onClick={(e) => {
								e.stopPropagation();
								setCollapsed(!collapsed);
							}}
						/>
					</Col>
				</Row>
				<Menu
					defaultSelectedKeys={['1']}
					mode={mode}
					theme={menuTheme}
					items={items}
				/>
			</Sider>
		</Layout>
	);
};

export default RepoTwo;
