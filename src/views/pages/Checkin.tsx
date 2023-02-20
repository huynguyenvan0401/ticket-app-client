import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as peopleAction from 'state/actions/action-creators/peopleAction';
import * as checkinAction from 'state/actions/action-creators/checkinAction';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Select, Row, Col, Typography, Alert, Button } from 'antd';
import { RootState } from 'state/reducers';
import { People, Message } from 'state/actions';
import { ActionType } from 'state/actions/action-types/types';
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
	const peoples: People[] = useSelector((state: RootState) => state.people);
	const message: Message = useSelector((state: RootState) => state.message);

	useEffect(() => {
		fetchPeopleAccount();
		dispatch({ type: ActionType.CLEAR_MESSAGE });
	}, []);

	const [selectedVal, setSelectedVal] = useState('0');

	const handleChange = (value: string) => {
		setSelectedVal(value);
	};
	function handleCheckin(e: any) {
		e.preventDefault();
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`id: ${selectedVal}, code: ${code}`);

		createCheckin(selectedVal, code || '-1', carId || '-1');
	}

	return (
		<>
			<Row justify="center">
				<Title level={2} style={{ marginBottom: '20px' }}>
					Check in
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
						showSearch
						style={{ width: '100%' }}
						placeholder="Search to Select"
						onChange={handleChange}
						optionFilterProp="children"
						filterOption={(input, option) =>
							(option?.label ?? '').includes(input)
						}
						filterSort={(optionA, optionB) =>
							(optionA?.label ?? '')
								.toLowerCase()
								.localeCompare((optionB?.label ?? '').toLowerCase())
						}
						options={
							peoples.length
								? peoples.map((people: People, index: number) => ({
										value: people.id.toString(),
										label: people.account.toLowerCase(),
								  }))
								: undefined
						}
					/>
				</Col>
			</Row>
			<Row justify={{ lg: 'center' }}>
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
