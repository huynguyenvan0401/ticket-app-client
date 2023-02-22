import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ActionType } from 'state/actions/action-types/types';
import {
	CheckCircleTwoTone,
	HeartTwoTone,
	SmileTwoTone,
} from '@ant-design/icons';
import { Col, Divider, Row, Typography } from 'antd';

const { Text, Link, Title } = Typography;

const CheckinComplete: React.FC = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch({ type: ActionType.INIT_CHECKIN });
	}, []);

	return (
		<>
			<div className="flex-center">
				<div>
					<CheckCircleTwoTone
						twoToneColor="#52c41a"
						style={{ fontSize: '60px', marginBottom: '20px' }}
					/>
				</div>
				<div>
					<Title level={2} type="success">
						Checkin thành công!
					</Title>
				</div>
			</div>
		</>
	);
};

export default CheckinComplete;
