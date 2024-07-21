import { IClass } from '@/interface/class'
import { Space, Table, TableProps } from 'antd'
import moment from 'moment'

export const columns = (): TableProps<IClass>['columns'] => {
  return [
    {
      title: 'Class Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Class Name',
      dataIndex: 'name',
      key: 'name'
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
    Table.EXPAND_COLUMN
  ]
}
