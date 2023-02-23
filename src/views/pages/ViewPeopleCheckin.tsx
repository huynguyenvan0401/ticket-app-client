import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as peopleAction from 'state/actions/action-creators/peopleAction';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from 'components/Spinner';
import {
	SearchOutlined,
	LockOutlined,
	EditOutlined,
	CheckCircleTwoTone,
	CloseCircleTwoTone,
} from '@ant-design/icons';
import type { InputRef } from 'antd';
import {
	Space,
	Select,
	Tooltip,
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

const ViewPeopleCheckin: React.FC = () => {
	// Bind actions
	const dispatch = useDispatch();

	const { fetchPeopleCheckin } = bindActionCreators(
		peopleAction,
		useDispatch()
	);

	// Call API to get data
	useEffect(() => {
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
	const checkinStore: any = useSelector((state: RootState) => state.checkin);

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
				title: 'Tên',
				dataIndex: 'account',
				filteredValue: filteredInfo.account || null,
				width: '10%',
				...getColumnSearchProps('account'),
			},
			{
				title: 'Checkin',
				dataIndex: 'checkin',
				filteredValue: filteredInfo.checkin || null,
				filters: [
					{
						text: 'Đã checkin',
						value: 'true',
					},
					{
						text: 'Chưa checkin',
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
									Đã checkin
								</Tag>
							) : (
								<Tag color="volcano" key={record.id}>
									Chưa checkin
								</Tag>
							)}
						</>
					);
				},
			},
			{
				title: 'Chủ phòng',
				dataIndex: 'isRoomMaster',
				filteredValue: filteredInfo.isRoomMaster || null,
				filters: [
					{
						text: 'Chủ phòng',
						value: 'true',
					},
					{
						text: 'Không là chủ phòng',
						value: 'false',
					},
				],
				onFilter: (value: any, record: any) =>
					record.isRoomMaster.startsWith(value),
				filterMode: 'tree',
				width: '10%',
				render: (_: any, record: any) => {
					return (
						<>
							{record.isRoomMaster === 'true' ? (
								<Tag color="green" key={'isRoomMaster' + record.id}>
									Chủ phòng
								</Tag>
							) : (
								<Tag color="volcano" key={'isRoomMaster' + record.id}>
									Không
								</Tag>
							)}
						</>
					);
				},
			},
			{
				title: 'Chìa khóa',
				dataIndex: 'isHoldRoomKey',
				filteredValue: filteredInfo.isHoldRoomKey || null,
				filters: [
					{
						text: 'Giữ chìa khóa',
						value: 'true',
					},
					{
						text: 'Không giữ chìa khóa',
						value: 'false',
					},
				],
				onFilter: (value: any, record: any) =>
					record.isHoldRoomKey.startsWith(value),
				filterMode: 'tree',
				width: '10%',
				render: (_: any, record: any) => {
					return (
						<>
							{record.isHoldRoomKey === 'true' ? (
								<Tag color="green" key={'roomKey' + record.id}>
									Giữ chìa khóa
								</Tag>
							) : (
								<Tag color="volcano" key={'roomKey' + record.id}>
									Không giữ
								</Tag>
							)}
						</>
					);
				},
			},
			{
				title: 'Xe',
				dataIndex: 'licensePlate',
				filteredValue: filteredInfo.licensePlate || null,
				width: '15%',
				...getColumnSearchProps('licensePlate'),
			},
			{
				title: 'Phòng',
				dataIndex: 'roomNumber',
				key: 'roomNumber',
				filteredValue: filteredInfo.roomNumber || null,
				width: '10%',
				...getColumnSearchProps('roomNumber'),
				defaultSortOrder: 'ascend',
				sorter: (a, b) => Number(a.roomNumber) - Number(b.roomNumber),
			},
			{
				title: 'Khu',
				dataIndex: 'roomType',
				filteredValue: filteredInfo.roomType || null,
				width: '13%',
				...getColumnSearchProps('roomType'),
			},
			{
				title: 'SĐT',
				dataIndex: 'phoneNumber',
				width: '10%',
			},
			{
				title: 'Ghi chú',
				dataIndex: 'note',
				width: '12%',
				ellipsis: {
					showTitle: false,
				},
				render: (note) => (
					<Tooltip placement="topLeft" title={note}>
						{note}
					</Tooltip>
				),
			},
		];
	};

	return (
		<>
			{peopleStore.isLoading && <Spinner />}
			<Title level={2} style={{ textAlign: 'center' }}>
				Danh sách checkin
			</Title>
			<Button
				onClick={clearTableFilters}
				style={{ marginBottom: '20px', marginRight: '20px' }}
			>
				Xóa bộ lọc
			</Button>

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

export default ViewPeopleCheckin;
