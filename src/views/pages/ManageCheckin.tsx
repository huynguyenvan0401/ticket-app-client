import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as peopleAction from 'state/actions/action-creators/peopleAction';
import * as checkinAction from 'state/actions/action-creators/checkinAction';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
	SearchOutlined,
	LockOutlined,
	EditOutlined,
	CloseCircleTwoTone,
	CheckCircleTwoTone,
} from '@ant-design/icons';
import type { InputRef } from 'antd';
import {
	Space,
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
import type { ColumnType, ColumnsType, TableProps } from 'antd/es/table';
import type {
	FilterConfirmProps,
	FilterValue,
	SorterResult,
} from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { RootState } from 'state/reducers';
import { People, Message } from 'state/actions';
import { ActionType } from 'state/actions/action-types/types';
const { Title } = Typography;
const { TextArea } = Input;

interface DataType {
	key: React.Key;
	account: string;
	checkin: string;
	phoneNumber: string;
	note: string;
	carId: string;
}

type DataIndex = keyof DataType;

const App: React.FC = () => {
	const dispatch = useDispatch();

	const { fetchPeopleDrive, updateNote } = bindActionCreators(
		peopleAction,
		useDispatch()
	);
	const { fetchCheckin, resetCheckin, delCheckinByPeopleId, createCheckin } =
		bindActionCreators(checkinAction, useDispatch());
	const message: Message = useSelector((state: RootState) => state.message);
	const peoples: any = useSelector((state: RootState) => state.people);
	const checkins = useSelector((state: RootState) => state.checkin);

	const [peopleCheckin, setPeopleCheckin] = useState([]);

	useEffect(() => {
		const checkList: any = [];
		peoples.map((people: any) => {
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
				carId: people.car.id.toString(),
			});
		});

		setPeopleCheckin(checkList);
	}, [checkins, peoples]);

	useEffect(() => {
		fetchPeopleDrive();
		fetchCheckin();
		dispatch({ type: ActionType.CLEAR_MESSAGE });
	}, []);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		fetchCheckin();
	// 	}, 5000);
	// 	return () => clearInterval(interval);
	// }, []);

	const [filteredInfo, setFilteredInfo] = useState<
		Record<string, FilterValue | null>
	>({});

	const clearTableFilters = () => {
		setFilteredInfo({});
	};

	const getData = (): DataType[] => {
		return peopleCheckin.map((people: any) => ({
			key: people.id,
			account: people.account,
			checkin: people.checkin,
			phoneNumber: people.phoneNumber,
			note: people.note,
			carId: people.carId,
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

	// Setting search column
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	const handleSearch = (
		selectedKeys: string[],
		confirm: (param?: FilterConfirmProps) => void,
		dataIndex: DataIndex
	) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setSearchText('');
	};

	const getColumnSearchProps = (
		dataIndex: DataIndex
	): ColumnType<DataType> => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys as string[], confirm, dataIndex)
					}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							handleSearch(selectedKeys as string[], confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({ closeDropdown: false });
							setSearchText((selectedKeys as string[])[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						Filter
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes((value as string).toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});
	// End setting search column

	const getColumns = (): ColumnsType<DataType> => {
		return [
			{
				title: 'Tên',
				dataIndex: 'account',
				filteredValue: filteredInfo.account || null,
				width: '15%',
				...getColumnSearchProps('account'),
			},
			{
				title: 'Trạng thái',
				dataIndex: 'checkin',
				filteredValue: filteredInfo.checkin || null,
				filters: [
					{
						text: 'Đã lên xe',
						value: 'true',
					},
					{
						text: 'Chưa lên xe',
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
				render: (_: any, record: any) => {
					return (
						<>
							<EditOutlined
								style={{ cursor: 'pointer' }}
								onClick={() => {
									setEditNote({ id: record.key, note: record.note });
									showModal();
								}}
							/>

							{record.checkin === 'true' ? (
								<CloseCircleTwoTone
									style={{ cursor: 'pointer', marginLeft: '20px' }}
									twoToneColor="#eb2f96"
									onClick={() => {
										delCheckinByPeopleId(record.key);
									}}
								/>
							) : (
								<CheckCircleTwoTone
									twoToneColor="#52c41a"
									style={{ cursor: 'pointer', marginLeft: '20px' }}
									onClick={() => {
										createCheckin(record.key, '', record.carId);
									}}
								/>
							)}
						</>
					);
				},
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
	};

	const handleCancelReset = () => {
		setIsModalResetOpen(false);
	};

	return (
		<>
			<Title level={2} style={{ textAlign: 'center' }}>
				Danh sách checkin xe: {peoples.length && peoples[0].car.licensePlate}
			</Title>
			<Button
				onClick={clearTableFilters}
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
