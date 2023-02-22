import React from 'react';
import notFound from 'assets/png/404-error.png';

const NotFound: React.FC = () => {
	return (
		<>
			<div className="flex-center">
				<img
					src={notFound}
					style={{ width: '200px', height: '200px' }}
					alt="Not found"
				/>
			</div>
		</>
	);
};

export default NotFound;
