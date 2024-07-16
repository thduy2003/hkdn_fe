import { userApi } from '@/api/user.api'
import { UserListConfig } from '@/interface/user'
import { useQuery } from '@tanstack/react-query'
import { TablePaginationConfig } from 'antd'
import {  useState } from 'react'
import { omitBy, isUndefined } from 'lodash'
import DataTable from '@/components/DataTable'
import { columns } from './table-column'
import { ColumnsType } from 'antd/es/table'
import { AnyObject } from 'antd/es/_util/type'
export default function Student() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const queryConfig: UserListConfig = { page_size: pageSize, page: currentPage, ...(searchTerm ? { keyword: searchTerm } : {})}

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['users', currentPage, pageSize],
    queryFn: () => userApi.getUsers(omitBy(queryConfig, isUndefined)),
  })

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
      <DataTable valueSearch={searchTerm} onChangeSearch={handleChange} onReset={handleReset} onSearch={handleSearch} columns={columns() as ColumnsType<AnyObject> | undefined} rowKey={'id'} dataSource={usersData?.data?.data} isLoading={isLoading} currentPage={currentPage} pageSize={pageSize} total={usersData?.data?.total} showSizeChanger={true} pageSizeOptions={['6', '10', '20', '50']} onChange={handleTableChange}/>
    </div>
  )
}
