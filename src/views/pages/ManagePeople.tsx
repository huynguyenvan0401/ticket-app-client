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
	CheckCircleTwoTone,
	KeyOutlined,
	CloseOutlined,
	CloseCircleTwoTone,
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
	Tooltip,
	Tag,
	Modal,
	Input,
	Switch,
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
	phoneNumber: string;
	licensePlate: string;
	carId: string;
	note: string;
	roomId: string;
	roomType: string;
	roomNumber: string;
	checkin: string;
	isRoomMaster: string;
	isHoldRoomKey: string;
}

type DataIndex = keyof DataType;

const App: React.FC = () => {
	// Bind actions
	const dispatch = useDispatch();

	const { fetchPeopleCheckin, updatePeople, updateHoldRoomKey } =
		bindActionCreators(peopleAction, useDispatch());

	const { fetchCar } = bindActionCreators(carAction, useDispatch());
	const { fetchRoom } = bindActionCreators(roomAction, useDispatch());
	const { createCheckin, delCheckinByPeopleId, resetAllCheckin } =
		bindActionCreators(checkinAction, useDispatch());

	// Call API to get data
	useEffect(() => {
		fetchCar();
		fetchRoom();
		fetchPeopleCheckin();
	}, []);

	// auto refresh data
	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		fetchPeopleCheckin();
	// 	}, 15000);
	// 	return () => clearInterval(interval);
	// }, []);

	// Retrieve data from store
	const message: Message = useSelector((state: RootState) => state.message);
	const peopleStore: any = useSelector((state: RootState) => state.people);
	const cars: any = useSelector((state: RootState) => state.car);
	const rooms: any = useSelector((state: RootState) => state.room);
	const checkinStore: any = useSelector((state: RootState) => state.checkin);

	// Configure data table
	const [filteredInfo, setFilteredInfo] = useState<
		Record<string, FilterValue | null>
	>({});
	const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});

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
				phoneNumber: people.phoneNumber ? people.phoneNumber : 'N/A',
				licensePlate: people.licensePlate ? people.licensePlate : 'N/A',
				carId: people.carId ? people.carId.toString() : 'null',
				note: people.note ? people.note : '',
				roomId: people.roomId ? people.roomId.toString() : 'null',
				roomType: people.roomType ? people.roomType : 'N/A',
				roomNumber: people.roomNumber ? people.roomNumber : 'N/A',
				isRoomMaster: people.isRoomMaster ? 'true' : 'false',
				isHoldRoomKey: people.isHoldRoomKey ? 'true' : 'false',
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
		setSortedInfo(sorter as SorterResult<DataType>);
	};

	// Sort room number
	const setRoomNumberSort = () => {
		setSortedInfo({
			order: 'ascend',
			columnKey: 'roomNumber',
		});
	};

	// Modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [editNote, setEditNote] = useState<{
		id: any;
		note: any;
		carId: any;
		roomId: any;
		isRoomMaster: any;
	}>({
		id: '',
		note: '',
		carId: '',
		roomId: '',
		isRoomMaster: '',
	});

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		void (async () => {
			await Promise.all([
				updatePeople(
					editNote.id,
					editNote.note,
					editNote.carId,
					editNote.roomId,
					editNote.isRoomMaster
				),
			]);
			fetchPeopleCheckin();
			setIsModalOpen(false);
		})();
	};

	const handleCancel = () => {
		setIsModalOpen(false);
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

	const onRoomMasterChange = (value: string) => {
		setEditNote((prev) => {
			return {
				...prev,
				isRoomMaster: value,
			};
		});
	};

	// Modal confirm reset checkin
	const [isModalResetOpen, setIsModalResetOpen] = useState(false);

	const showModalReset = () => {
		setIsModalResetOpen(true);
	};

	const handleOkReset = () => {
		void (async () => {
			await Promise.all([resetAllCheckin()]);
			fetchPeopleCheckin();
			setIsModalResetOpen(false);
		})();
	};

	const handleCancelReset = () => {
		setIsModalResetOpen(false);
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

	// Get table column
	const getColumns = (): ColumnsType<DataType> => {
		return [
			{
				title: 'Thao t??c',
				key: 'action',
				render: (_: any, record: any) => {
					return (
						<>
							<EditOutlined
								style={{ cursor: 'pointer', fontSize: '24px' }}
								onClick={() => {
									setEditNote({
										id: record.key,
										note: record.note,
										carId: record.carId,
										roomId: record.roomId,
										isRoomMaster: record.isRoomMaster,
									});
									showModal();
								}}
							/>
							{record.checkin === 'true' ? (
								<CloseCircleTwoTone
									style={{
										cursor: 'pointer',
										marginLeft: '20px',
										fontSize: '24px',
									}}
									twoToneColor="#eb2f96"
									onClick={() => {
										void (async () => {
											await Promise.all([delCheckinByPeopleId(record.key)]);
											fetchPeopleCheckin();
										})();
									}}
								/>
							) : (
								<CheckCircleTwoTone
									twoToneColor="#52c41a"
									style={{
										cursor: 'pointer',
										marginLeft: '20px',
										fontSize: '24px',
									}}
									onClick={() => {
										void (async () => {
											await Promise.all([
												createCheckin(record.key, '', record.carId),
											]);
											fetchPeopleCheckin();
										})();
									}}
								/>
							)}
						</>
					);
				},
				width: '8%',
			},
			{
				title: 'Ch??a kh??a',
				dataIndex: 'isHoldRoomKey',
				filteredValue: filteredInfo.isHoldRoomKey || null,
				filters: [
					{
						text: 'Gi??? ch??a kh??a',
						value: 'true',
					},
					{
						text: 'Kh??ng gi??? ch??a kh??a',
						value: 'false',
					},
				],
				onFilter: (value: any, record: any) =>
					record.isHoldRoomKey.startsWith(value),
				filterMode: 'tree',
				width: '6%',
				render: (_: any, record: any) => {
					return (
						<>
							{record.isHoldRoomKey === 'true' ? (
								<Switch
									checkedChildren={<KeyOutlined />}
									unCheckedChildren={<CloseOutlined />}
									defaultChecked
									onChange={() => {
										void (async () => {
											await Promise.all([
												updateHoldRoomKey(record.key, 'false'),
											]);
											fetchPeopleCheckin();
										})();
									}}
								/>
							) : (
								<Switch
									checkedChildren={<KeyOutlined />}
									unCheckedChildren={<CloseOutlined />}
									defaultChecked={false}
									onChange={() => {
										void (async () => {
											await Promise.all([
												updateHoldRoomKey(record.key, 'true'),
											]);
											fetchPeopleCheckin();
										})();
									}}
								/>
							)}
						</>
					);
				},
			},
			{
				title: 'T??n',
				dataIndex: 'account',
				filteredValue: filteredInfo.account || null,
				width: '11%',
				...getColumnSearchProps('account'),
			},
			{
				title: 'Checkin',
				dataIndex: 'checkin',
				filteredValue: filteredInfo.checkin || null,
				filters: [
					{
						text: '???? checkin',
						value: 'true',
					},
					{
						text: 'Ch??a checkin',
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
									???? checkin
								</Tag>
							) : (
								<Tag color="volcano" key={record.id}>
									Ch??a checkin
								</Tag>
							)}
						</>
					);
				},
			},
			{
				title: 'Ph??ng',
				dataIndex: 'roomNumber',
				key: 'roomNumber',
				filteredValue: filteredInfo.roomNumber || null,
				width: '8%',
				...getColumnSearchProps('roomNumber'),
				sorter: (a, b) => Number(a.roomNumber) - Number(b.roomNumber),
				sortOrder:
					sortedInfo.columnKey === 'roomNumber' ? sortedInfo.order : 'ascend',
			},
			{
				title: 'Ch??? ph??ng',
				dataIndex: 'isRoomMaster',
				filteredValue: filteredInfo.isRoomMaster || null,
				filters: [
					{
						text: 'Ch??? ph??ng',
						value: 'true',
					},
					{
						text: 'Kh??ng l?? ch??? ph??ng',
						value: 'false',
					},
				],
				onFilter: (value: any, record: any) =>
					record.isRoomMaster.startsWith(value),
				filterMode: 'tree',
				width: '8%',
				render: (_: any, record: any) => {
					return (
						<>
							{record.isRoomMaster === 'true' ? (
								<Tag color="green" key={'isRoomMaster' + record.id}>
									Ch??? ph??ng
								</Tag>
							) : (
								<Tag color="volcano" key={'isRoomMaster' + record.id}>
									NONE
								</Tag>
							)}
						</>
					);
				},
			},
			{
				title: 'Ghi ch??',
				dataIndex: 'note',
				width: '10%',
				ellipsis: {
					showTitle: false,
				},
				render: (note) => (
					<Tooltip placement="topLeft" title={note}>
						{note}
					</Tooltip>
				),
			},
			{
				title: 'Xe',
				dataIndex: 'licensePlate',
				filteredValue: filteredInfo.licensePlate || null,
				width: '14%',
				...getColumnSearchProps('licensePlate'),
			},

			{
				title: 'Khu',
				dataIndex: 'roomType',
				filteredValue: filteredInfo.roomType || null,
				width: '13%',
				...getColumnSearchProps('roomType'),
			},
			{
				title: 'S??T',
				dataIndex: 'phoneNumber',
				width: '12%',
			},
		];
	};

	// Select room
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
				Danh s??ch checkin
			</Title>
			<Button
				onClick={setRoomNumberSort}
				style={{ marginBottom: '20px', marginRight: '20px' }}
			>
				Group by Room
			</Button>
			<Button
				onClick={clearTableFilters}
				style={{ marginBottom: '20px', marginRight: '20px' }}
			>
				X??a b??? l???c
			</Button>
			<Button danger onClick={showModalReset} style={{ marginBottom: '20px' }}>
				Reset all checkin
			</Button>
			<Modal
				title="Ch???nh s???a th??ng tin"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Select
					style={{ marginBottom: '20px', width: '240px' }}
					showSearch
					value={editNote.carId}
					placeholder="Ch???n xe"
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
					value={editNote.isRoomMaster}
					placeholder="Vai tr??..."
					optionFilterProp="children"
					onChange={onRoomMasterChange}
					filterOption={(input, option) =>
						(option?.label ?? '')
							.toString()
							.toLowerCase()
							.includes(input.toLowerCase())
					}
					options={[
						{
							label: 'Tr?????ng ph??ng',
							value: 'true',
						},
						{
							label: 'Kh??ng l?? tr?????ng ph??ng',
							value: 'false',
						},
					]}
				/>

				<Select
					style={{ marginBottom: '20px', width: '240px' }}
					showSearch
					value={editNote.roomId}
					placeholder="Ch???n ph??ng"
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
							label: 'Ph??ng ' + room.number,
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
				title="X??a h???t th??ng tin checkin"
				open={isModalResetOpen}
				onOk={handleOkReset}
				onCancel={handleCancelReset}
			>
				C???nh b??o: B???m &quot;OK&quot; s??? x??a h???t th??ng tin checkin!
			</Modal>
			<div style={{ overflow: 'auto' }}>
				<Table
					columns={peopleStore.data && getColumns()}
					dataSource={peopleStore.data && getData()}
					onChange={onChange}
					style={{ minWidth: '1200px' }}
					pagination={false}
				/>
			</div>
		</>
	);
};

export default App;
