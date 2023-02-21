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
	useEffect(() => {
		const interval = setInterval(() => {
			fetchPeopleCheckin();
		}, 15000);
		return () => clearInterval(interval);
	}, []);

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
				phoneNumber: people.phoneNumber,
				licensePlate: people.licensePlate,
				carId: people.carId.toString(),
				note: people.note,
				roomId: people.roomId.toString(),
				roomType: people.roomType,
				roomNumber: people.roomNumber,
				isRoomMaster: people.isRoomMaster ? 'true' : 'false',
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
				width: '12%',
				...getColumnSearchProps('account'),
			},
			{
				title: 'Status',
				dataIndex: 'checkin',
				filteredValue: filteredInfo.checkin || null,
				filters: [
					{
						text: 'OK',
						value: 'true',
					},
					{
						text: 'NONE',
						value: 'false',
					},
				],
				onFilter: (value: any, record: any) => record.checkin.startsWith(value),
				filterMode: 'tree',
				width: '8%',
				render: (_: any, record: any) => {
					return (
						<>
							{record.checkin === 'true' ? (
								<Tag color="green" key={record.id}>
									OK
								</Tag>
							) : (
								<Tag color="volcano" key={record.id}>
									NONE
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
				width: '13%',
				...getColumnSearchProps('licensePlate'),
			},
			{
				title: 'Phòng',
				dataIndex: 'roomNumber',
				filteredValue: filteredInfo.roomNumber || null,
				width: '8%',
				...getColumnSearchProps('roomNumber'),
			},
			{
				title: 'Khu',
				dataIndex: 'roomType',
				filteredValue: filteredInfo.roomType || null,
				width: '14%',
				...getColumnSearchProps('roomType'),
			},
			{
				title: 'SĐT',
				dataIndex: 'phoneNumber',
				width: '12%',
			},
			{
				title: 'Chủ phòng',
				dataIndex: 'isRoomMaster',
				filteredValue: filteredInfo.isRoomMaster || null,
				filters: [
					{
						text: 'YES',
						value: 'true',
					},
					{
						text: 'NO',
						value: 'false',
					},
				],
				onFilter: (value: any, record: any) =>
					record.isRoomMaster.startsWith(value),
				filterMode: 'tree',
				width: '6%',
				render: (_: any, record: any) => {
					return (
						<>
							{record.isRoomMaster === 'true' ? (
								<Tag color="green" key={'isRoomMaster' + record.id}>
									YES
								</Tag>
							) : (
								<Tag color="volcano" key={'isRoomMaster' + record.id}>
									NO
								</Tag>
							)}
						</>
					);
				},
			},
			{
				title: 'Ghi chú',
				dataIndex: 'note',
				width: '27%',
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
					style={{ minWidth: '1000px' }}
					pagination={false}
				/>
			</div>
		</>
	);
};

export default ViewPeopleCheckin;
