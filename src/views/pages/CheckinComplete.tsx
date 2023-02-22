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
			<div className="js-container container"></div>

			<div
				style={{
					textAlign: 'center',
					position: 'fixed',
					width: '100%',
					height: '100%',
					top: '150px',
					left: '0px',
				}}
			>
				<div className="checkmark-circle">
					<div className="background"></div>
					<div className="checkmark draw"></div>
				</div>
				<h1 style={{ marginTop: '30px' }}>Congratulations!</h1>
				<p>Bạn đã checkin thành công!</p>
			</div>
		</>
	);
};

export default CheckinComplete;
