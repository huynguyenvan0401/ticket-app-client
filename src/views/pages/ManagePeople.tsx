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
	account: string;
	phoneNumber: string;
	note: string;
}

const App: React.FC = () => {
	const dispatch = useDispatch();

	const { fetchPeople, updateNote } = bindActionCreators(
		peopleAction,
		useDispatch()
	);

	useEffect(() => {
		fetchPeople();
	});

	const message: Message = useSelector((state: RootState) => state.message);
	const peoples: People[] = useSelector((state: RootState) => state.people);

	const [filteredInfo, setFilteredInfo] = useState<
		Record<string, FilterValue | null>
	>({});

	const clearFilters = () => {
		setFilteredInfo({});
	};

	const getData = (): DataType[] => {
		return peoples.map((people: any) => ({
			key: people.id,
			account: people.account,
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

	const getColumns = (): ColumnsType<DataType> => {
		return [
			{
				title: 'Tên',
				dataIndex: 'account',
				filteredValue: filteredInfo.account || null,
				filters:
					peoples &&
					peoples.map((people: any) => ({
						text: people.account,
						value: people.account,
					})),

				filterMode: 'tree',
				filterSearch: true,
				onFilter: (value: any, record: any) => record.account.startsWith(value),
				width: '15%',
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
			<div style={{ overflow: 'auto' }}>
				<Table
					columns={peoples && getColumns()}
					dataSource={peoples && getData()}
					onChange={onChange}
				/>
			</div>
		</>
	);
};

export default App;
