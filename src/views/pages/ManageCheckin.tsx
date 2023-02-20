import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as peopleAction from 'state/actions/action-creators/peopleAction';
import * as checkinAction from 'state/actions/action-creators/checkinAction';
import * as carAction from 'state/actions/action-creators/carAction';
import * as roomAction from 'state/actions/action-creators/roomAction';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from 'components/Spinner';
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
	Spin,
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
	licensePlate: string;
	roomId: string;
	roomType: string;
	roomNumber: string;
}

type DataIndex = keyof DataType;

const App: React.FC = () => {
	// Bind actions
	const dispatch = useDispatch();

	const { fetchPeopleCheckinDrive, updateNote } = bindActionCreators(
		peopleAction,
		useDispatch()
	);
	const { resetCheckin, delCheckinByPeopleId, createCheckin } =
		bindActionCreators(checkinAction, useDispatch());
	const { fetchCar } = bindActionCreators(carAction, useDispatch());
	const { fetchRoom } = bindActionCreators(roomAction, useDispatch());

	// Retrieve data from store
	const message: Message = useSelector((state: RootState) => state.message);
	const peopleStore: any = useSelector((state: RootState) => state.people);
	const checkinStore = useSelector((state: RootState) => state.checkin);
	const cars: any = useSelector((state: RootState) => state.car);
	const rooms: any = useSelector((state: RootState) => state.room);

	useEffect(() => {
		fetchPeopleCheckinDrive();
		fetchCar();
		fetchRoom();
		dispatch({ type: ActionType.CLEAR_MESSAGE });
	}, []);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		fetchCheckin();
	// 	}, 5000);
	// 	return () => clearInterval(interval);
	// }, []);

	// Configure data table

	const [filteredInfo, setFilteredInfo] = useState<
		Record<string, FilterValue | null>
	>({});

	const clearTableFilters = () => {
		setFilteredInfo({});
	};

	const getData = (): DataType[] => {
		return (
			peopleStore.data &&
			peopleStore.data.map((people: any) => ({
				key: people.id,
				account: people.account,
				checkin: people.isCheckedIn ? 'true' : 'false',
				phoneNumber: people.phoneNumber,
				note: people.note,
				carId: people.carId.toString(),
				roomId: people.roomId.toString(),
				roomType: people.roomType,
				roomNumber: people.roomNumber,
				licensePlate: people.licensePlate,
			}))
		);
	};

	const onChange: TableProps<DataType>['onChange'] = (
		pagination,
		filters,
		sorter,
		extra
	) => {
		setFilteredInfo(filters);
	};

	// Modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [editNote, setEditNote] = useState<{
		id: any;
		note: any;
		carId: string;
		roomId: string;
	}>({
		id: '',
		note: '',
		carId: '',
		roomId: '',
	});

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		void (async () => {
			await Promise.all([
				updateNote(editNote.id, editNote.note, editNote.carId, editNote.roomId),
			]);
			fetchPeopleCheckinDrive();
			setIsModalOpen(false);
		})();
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
		render: (text) => text,
	});
	// End setting search column

	const getColumns = (): ColumnsType<DataType> => {
		return [
			{
				title: 'Action',
				key: 'action',
				render: (_: any, record: any) => {
					return (
						<>
							<EditOutlined
								style={{ cursor: 'pointer' }}
								onClick={() => {
									setEditNote({
										id: record.key,
										note: record.note,
										carId: record.carId,
										roomId: record.roomId,
									});
									showModal();
								}}
							/>

							{record.checkin === 'true' ? (
								<CloseCircleTwoTone
									style={{ cursor: 'pointer', marginLeft: '20px' }}
									twoToneColor="#eb2f96"
									onClick={() => {
										void (async () => {
											await Promise.all([delCheckinByPeopleId(record.key)]);
											fetchPeopleCheckinDrive();
										})();
									}}
								/>
							) : (
								<CheckCircleTwoTone
									twoToneColor="#52c41a"
									style={{ cursor: 'pointer', marginLeft: '20px' }}
									onClick={() => {
										void (async () => {
											await Promise.all([
												createCheckin(record.key, '', record.carId),
											]);
											fetchPeopleCheckinDrive();
										})();
									}}
								/>
							)}
						</>
					);
				},
				width: '10%',
			},
			{
				title: 'Tên',
				dataIndex: 'account',
				filteredValue: filteredInfo.account || null,
				width: '10%',
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
				width: '10%',
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
				title: 'Ghi chú',
				dataIndex: 'note',
				width: '30%',
			},
			{
				title: 'Xe',
				dataIndex: 'licensePlate',
				width: '10%',
			},
			{
				title: 'Số phòng',
				dataIndex: 'roomNumber',
				filteredValue: filteredInfo.roomNumber || null,
				width: '8%',
				...getColumnSearchProps('roomNumber'),
			},
			{
				title: 'Vị trí phòng',
				dataIndex: 'roomType',
				filteredValue: filteredInfo.roomType || null,
				width: '12%',
				...getColumnSearchProps('roomType'),
			},
			{
				title: 'SĐT',
				dataIndex: 'phoneNumber',
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
		void (async () => {
			await Promise.all([resetCheckin()]);
			fetchPeopleCheckinDrive();
			setIsModalResetOpen(false);
		})();
	};

	const handleCancelReset = () => {
		setIsModalResetOpen(false);
	};

	const onCarChange = (value: string) => {
		setEditNote((prev) => {
			return {
				...prev,
				carId: value,
			};
		});
	};

	const onSearchCar = (value: string) => {};

	const onRoomChange = (value: string) => {
		setEditNote((prev) => {
			return {
				...prev,
				roomId: value,
			};
		});
	};

	const onSearchRoom = (value: string) => {};

	return (
		<>
			{(peopleStore.isLoading ||
				peopleStore.isUpdating ||
				checkinStore.isRemoving ||
				checkinStore.isCreating ||
				checkinStore.isResetting) && <Spinner />}

			<Title level={2} style={{ textAlign: 'center' }}>
				Danh sách checkin xe:{' '}
				{peopleStore.data.length && peopleStore.data[0].licensePlate}
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
				<Select
					style={{ marginBottom: '20px', width: '240px' }}
					showSearch
					value={editNote.carId}
					placeholder="Chọn xe"
					optionFilterProp="children"
					onChange={onCarChange}
					onSearch={onSearchCar}
					filterOption={(input, option) =>
						(option?.label ?? '')
							.toString()
							.toLowerCase()
							.includes(input.toLowerCase())
					}
					options={
						cars.length &&
						cars.map((car: any) => ({
							label: car.licensePlate,
							value: car.id.toString(),
						}))
					}
				/>

				<Select
					style={{ marginBottom: '20px', width: '240px' }}
					showSearch
					value={editNote.roomId}
					placeholder="Chọn phòng"
					optionFilterProp="children"
					onChange={onRoomChange}
					onSearch={onSearchRoom}
					filterOption={(input, option) =>
						(option?.label ?? '')
							.toString()
							.toLowerCase()
							.includes(input.toLowerCase())
					}
					options={
						rooms.length &&
						rooms.map((room: any) => ({
							label: 'Phòng ' + room.number,
							value: room.id.toString(),
						}))
					}
				/>
				<TextArea
					rows={4}
					maxLength={230}
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
					columns={peopleStore.data && getColumns()}
					dataSource={peopleStore.data && getData()}
					onChange={onChange}
					style={{ minWidth: '1200px' }}
				/>
			</div>
		</>
	);
};

export default App;
