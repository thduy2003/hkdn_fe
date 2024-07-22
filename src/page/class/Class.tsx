import { classApi } from '@/api/class.api'
import DataTable from '@/components/DataTable'
import { AppContext, AppContextType } from '@/contexts/app.context'
import { ClassListConfig } from '@/interface/class'
import { useQuery } from '@tanstack/react-query'
import { TablePaginationConfig } from 'antd'
import React, { useContext, useState } from 'react'
import { columns } from './table-column'
import { ColumnsType } from 'antd/es/table'
import { AnyObject } from 'antd/es/_util/type'

export default function Class() {
  const { profile } = useContext<AppContextType>(AppContext)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const classqueryConfig: ClassListConfig = {
    page_size: pageSize,
    page: currentPage,
    teacherId: profile?.id,
    ...(searchTerm ? { keyword: searchTerm } : {})
  }
  const {
    data: classesData,
    isLoading: isClassesLoading,
    refetch
  } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classApi.getClassesByTeacher(classqueryConfig)
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
    <DataTable
      valueSearch={searchTerm}
      onChangeSearch={handleChange}
      onReset={handleReset}
      onSearch={handleSearch}
      columns={columns() as ColumnsType<AnyObject> | undefined}
      rowKey={'id'}
      dataSource={classesData?.data?.data}
      isLoading={isClassesLoading}
      currentPage={currentPage}
      pageSize={pageSize}
      total={classesData?.data?.total}
      showSizeChanger={true}
      pageSizeOptions={['6', '10', '20', '50']}
      onChange={handleTableChange}
    />
  )
}
