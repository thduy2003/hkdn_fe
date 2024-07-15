import { userApi } from '@/api/user.api'
import { User } from '@/interface/user'
import { useQuery } from '@tanstack/react-query'
import { Button, Input, Spin, Table, TablePaginationConfig, TableProps } from 'antd'
import {  useState } from 'react'

export default function Student() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['users', currentPage, pageSize],
    queryFn: () => userApi.getUsers({ page: currentPage, page_size: pageSize, keyword: searchTerm }),
    
  })
  const columns: TableProps<User>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    }
  ]
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1)
    setPageSize(pagination.pageSize || 6)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  const handleSearch = () => {
   setCurrentPage(1)
   refetch()
  }
  const handleReset = () => {
    setCurrentPage(1)
    setSearchTerm('')
    setTimeout(() => {
     refetch()
    }, 0)
  }

  return (
    <div>
      {/* <ul>
        {usersData?.data?.data?.map((user) => {
          return <li key={user.id}>{user.fullName}</li>
        })}
      </ul> */}
      <div className='flex items-center justify-center'>
      <Input value={searchTerm} placeholder='Search...' className='w-80' onChange={handleChange} />
      <Button onClick={handleReset} type='default'>Reset</Button>
      <Button onClick={handleSearch} type='primary'>Search</Button>
    
      </div>
      <Table columns={columns} rowKey={(record) => record.id} dataSource={usersData?.data.data} 
        loading={{
          indicator: (
            <div>
              <Spin size='large'>
                <div className='content' />
              </Spin>
            </div>
          ),
          spinning: isLoading
        }} 
        onChange={(pagination) => handleTableChange(pagination as TablePaginationConfig)} 
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: usersData?.data.total,
          showSizeChanger: true,
          pageSizeOptions: ['6', '10', '20', '50'],
          onChange: (page, size) => handleTableChange({ current: page, pageSize: size })
        }} />
    </div>
  )
}
