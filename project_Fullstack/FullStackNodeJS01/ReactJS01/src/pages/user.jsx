import { notification, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getUserApi } from '../util/api';

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserApi();
            if (Array.isArray(res)) {
                setDataSource(res)
            } else {
                notification.error({
                    message: "Không thể tải dữ liệu",
                    description: res?.message ?? "Không thể tải danh sách người dùng"
                })
            }
        }

        fetchUser();
    }, [])

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
        }
    ];

    return (
        <div style={{ padding: 30 }}>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                rowKey={"_id"}
            />
        </div>
    )
}

export default UserPage;
