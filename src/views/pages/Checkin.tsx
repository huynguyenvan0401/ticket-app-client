import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as peopleAction from 'state/actions/action-creators/peopleAction';
import * as checkinAction from 'state/actions/action-creators/checkinAction';
import * as carAction from 'state/actions/action-creators/carAction';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Select, Row, Col, Typography, Alert, Button } from 'antd';
import { RootState } from 'state/reducers';
import { People, Message } from 'state/actions';
import { ActionType } from 'state/actions/action-types/types';
import { info } from 'console';
const { Title } = Typography;

const Checkin: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get('code');
	const carId = searchParams.get('carId');
	const { fetchPeopleAccount } = bindActionCreators(
		peopleAction,
		useDispatch()
	);
	const { createCheckin } = bindActionCreators(checkinAction, useDispatch());
	const { fetchCarById } = bindActionCreators(carAction, useDispatch());

	const peopleStore = useSelector((state: RootState) => state.people);
	const message: Message = useSelector((state: RootState) => state.message);
	const checkinStore = useSelector((state: RootState) => state.checkin);
	const infoStore = useSelector((state: RootState) => state.info);

	useEffect(() => {
		fetchPeopleAccount();
		fetchCarById(carId || '-1');
		dispatch({ type: ActionType.INIT_CHECKIN });
		dispatch({ type: ActionType.CLEAR_MESSAGE });
	}, []);

	const [selectedVal, setSelectedVal] = useState('');

	const onAccountChange = (value: string) => {
		setSelectedVal(value);
	};

	const onSearchAccount = (value: string) => {};
	function handleCheckin(e: any) {
		e.preventDefault();

		createCheckin(selectedVal, code || '-1', carId || '-1');
	}

	useEffect(() => {
		if (checkinStore.isCreated) {
			navigate('/checkin/complete');
		}
	}, [checkinStore]);

	return (
		<>
			<Row justify="center">
				<Title level={2} style={{ marginBottom: '20px' }}>
					Checkin xe: {` `}
					{infoStore.car && infoStore.car.id
						? infoStore.car.licensePlate
						: 'Null'}
				</Title>
			</Row>

			<Row justify="center">
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
				</Col>
			</Row>
			<Row justify="center" style={{ paddingBottom: '30px' }}>
				<Col
					xs={{ span: 24 }}
					xl={{ span: 6 }}
					lg={{ span: 12 }}
					md={{ span: 12 }}
				>
					<Select
						style={{ marginBottom: '10px', width: '100%' }}
						showSearch
						value={selectedVal}
						placeholder="Chọn xe"
						optionFilterProp="children"
						onChange={onAccountChange}
						onSearch={onSearchAccount}
						filterOption={(input, option) =>
							(option?.label ?? '')
								.toString()
								.toLowerCase()
								.includes(input.toLowerCase())
						}
						options={
							peopleStore.accounts.length &&
							peopleStore.accounts.map((peopleAccount: any) => ({
								label: peopleAccount.account,
								value: peopleAccount.id.toString(),
							}))
						}
					/>
				</Col>
			</Row>
			<Row justify={{ lg: 'center' }} style={{ marginBottom: '50px' }}>
				<Col
					xs={{ span: 24 }}
					xl={{ span: 6 }}
					lg={{ span: 12 }}
					md={{ span: 12 }}
				>
					<Button
						type="primary"
						htmlType="submit"
						className="login-form-button"
						onClick={(e) => handleCheckin(e)}
						block
					>
						Checkin
					</Button>
				</Col>
			</Row>
		</>
	);
};

export default Checkin;
