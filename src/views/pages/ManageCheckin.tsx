import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as peopleAction from 'state/actions/action-creators/peopleAction';
import * as checkinAction from 'state/actions/action-creators/checkinAction';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
	Select,
	Row,
	Col,
	Typography,
	Alert,
	Button,
	Table,
	Tag,
	Modal,
	Input,
} from 'antd';
import { RootState } from 'state/reducers';
import { People, Message } from 'state/actions';
import { ActionType } from 'state/actions/action-types/types';
const { Title } = Typography;
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { LockOutlined, EditOutlined } from '@ant-design/icons';
const { TextArea } = Input;

interface DataType {
	key: React.Key;
	name: string;
	age: number;
	address: string;
}

const App: React.FC = () => {
	const dispatch = useDispatch();

	const { fetchPeopleDrive, updateNote } = bindActionCreators(
		peopleAction,
		useDispatch()
	);
	const { fetchCheckin, resetCheckin } = bindActionCreators(
		checkinAction,
		useDispatch()
	);
	const message: Message = useSelector((state: RootState) => state.message);
	const peoples: People[] = useSelector((state: RootState) => state.people);
	const checkins = useSelector((state: RootState) => state.checkin);

	const [peopleCheckin, setPeopleCheckin] = useState([]);

	useEffect(() => {
		const checkList: any = [];
		peoples.map((people) => {
			let checked = false;
			checkins.map((checkin: any) => {
				if (checkin.people.id === people.id) {
					checked = true;
					return;
				}
			});
			checkList.push({
				id: people.id,
				account: people.account,
				checkin: checked ? 'true' : 'false',
				phoneNumber: people.phoneNumber,
				note: people.note,
			});
		});

		setPeopleCheckin(checkList);
	}, [checkins, peoples]);

	useEffect(() => {
		fetchPeopleDrive();
		fetchCheckin();
		dispatch({ type: ActionType.CLEAR_MESSAGE });
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			fetchCheckin();
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	const [filteredInfo, setFilteredInfo] = useState<
		Record<string, FilterValue | null>
	>({});

	const clearFilters = () => {
		setFilteredInfo({});
	};

	const getData = () => {
		return peopleCheckin.map((people: any) => ({
			key: people.id,
			account: people.account,
			checkin: people.checkin,
			phoneNumber: people.phoneNumber,
			note: people.note,
		}));
	};

	const onChange: TableProps<DataType>['onChange'] = (
		pagination,
		filters,
		sorter,
		extra
	) => {
		console.log('params', pagination, filters, sorter, extra);
		setFilteredInfo(filters);
	};

	// Modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [editNote, setEditNote] = useState<{ id: any; note: any }>({
		id: '',
		note: '',
	});

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		updateNote(editNote.id, editNote.note);
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const getColumns = () => {
		return [
			{
				title: 'Tên',
				dataIndex: 'account',
				filteredValue: filteredInfo.account || null,
				filters:
					peopleCheckin &&
					peopleCheckin.map((people: any) => ({
						text: people.account,
						value: people.account,
					})),

				filterMode: 'tree',
				filterSearch: true,
				onFilter: (value: any, record: any) => record.account.startsWith(value),
				width: '15%',
			},
			{
				title: 'Trạng thái',
				dataIndex: 'checkin',
				filteredValue: filteredInfo.checkin || null,
				filters: [
					{
						text: 'Checked',
						value: 'true',
					},
					{
						text: 'Not Checked',
						value: 'false',
					},
				],
				onFilter: (value: any, record: any) => record.checkin.startsWith(value),
				filterMode: 'tree',
				width: '15%',
				render: (_: any, record: any) => {
					return (
						<>
							{record.checkin === 'true' ? (
								<Tag color="green" key={record.id}>
									Đã lên xe
								</Tag>
							) : (
								<Tag color="volcano" key={record.id}>
									Chưa lên xe
								</Tag>
							)}
						</>
					);
				},
			},
			{
				title: 'SĐT',
				dataIndex: 'phoneNumber',
				width: '15%',
			},
			{
				title: 'Ghi chú',
				dataIndex: 'note',
				width: '45%',
			},
			{
				title: 'Action',
				key: 'action',
				render: (_: any, record: any) => (
					<EditOutlined
						style={{ cursor: 'pointer' }}
						onClick={() => {
							setEditNote({ id: record.key, note: record.note });
							showModal();
						}}
					/>
				),
				width: '10%',
			},
		];
	};

	// Modal confirm reset checkin
	const [isModalResetOpen, setIsModalResetOpen] = useState(false);

	const showModalReset = () => {
		setIsModalResetOpen(true);
	};

	const handleOkReset = () => {
		resetCheckin();
		setIsModalResetOpen(false);
		fetchCheckin();
	};

	const handleCancelReset = () => {
		setIsModalResetOpen(false);
	};

	return (
		<>
			<Title level={2} style={{ textAlign: 'center' }}>
				Danh sách checkin
			</Title>
			<Button
				onClick={clearFilters}
				style={{ marginBottom: '20px', marginRight: '20px' }}
			>
				Xóa bộ lọc
			</Button>
			<Button danger onClick={showModalReset} style={{ marginBottom: '20px' }}>
				Xóa thông tin checkin
			</Button>
			<Modal
				title="Ghi chú"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<TextArea
					rows={4}
					value={editNote.note}
					onChange={(e) => {
						setEditNote((prev) => {
							return {
								...prev,
								note: e.target.value,
							};
						});
					}}
				/>
			</Modal>
			<Modal
				title="Xóa hết thông tin checkin"
				open={isModalResetOpen}
				onOk={handleOkReset}
				onCancel={handleCancelReset}
			>
				Cảnh báo: Bấm &quot;OK&quot; sẽ xóa hết thông tin checkin!
			</Modal>
			<div style={{ overflow: 'auto' }}>
				<Table
					columns={checkins && peoples && getColumns()}
					dataSource={checkins && peoples && getData()}
					onChange={onChange}
				/>
			</div>
		</>
	);
};

export default App;
