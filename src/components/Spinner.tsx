import React from 'react';
import { Spin } from 'antd';

const Spinner: React.FC = () => (
	<div className="my-spinner">
		<Spin size="large" />
	</div>
);

export default Spinner;
