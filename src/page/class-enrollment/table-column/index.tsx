import { ColumnProps } from '@/interface/app'
import { IUserList } from '@/interface/user'
import { Button, Popconfirm, Space, TableProps } from 'antd'
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
      key: 'id'
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
        return (
          <Space>
            {(record?.classEnrollments && moment(record?.classEnrollments[0]?.enrollmentDate).format('DD/MM/YYYY')) ??
              'No Date'}
          </Space>
        )
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Popconfirm
            title='Unenroll'
            description='Are you sure to unenroll this student?'
            onConfirm={() => onDelete && onDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button danger>Unenroll</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]
}
