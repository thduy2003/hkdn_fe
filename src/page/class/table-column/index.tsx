import { IClass } from '@/interface/class'
import { Button, TableProps } from 'antd'
import { Link } from 'react-router-dom'

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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Link to={`${record.id}`}>
          <Button>Detail</Button>
        </Link>
      )
    }
  ]
}
