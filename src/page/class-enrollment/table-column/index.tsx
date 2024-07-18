import { ColumnProps } from '@/interface/app'
import { IUserList } from '@/interface/user'
import { Space, TableProps } from 'antd'
import moment from 'moment'

export const columns = ({onDelete}: ColumnProps): TableProps<IUserList>['columns'] => {
  return [
    // {
    //   title: 'Class Name',
    //   dataIndex: 'classId',
    //   key: 'classId',
    //   render: (_, record) => {
    //     return <Space>{record?.class?.name ?? 'BI001'}</Space>
    //   }
    // },
    {
      title: 'Student Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Student Name',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (_, record) => {
        return <Space>{record?.fullName ?? 'Duy'}</Space>
      }
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      render: (_, record) => {
        return <Space>{(record?.classEnrollments && moment(record?.classEnrollments[0]?.enrollmentDate).format('DD/MM/YYYY')) ?? 'No Date'}</Space>
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size='middle'>
          <button onClick={() => onDelete && onDelete(record.id)}>Hủy đăng ký</button>
        </Space>
      ),
    },
  ]
}
