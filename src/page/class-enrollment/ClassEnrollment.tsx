import DataTable from '@/components/DataTable'
import { useQuery } from '@tanstack/react-query'
import { Button, Col, Row, Select, TablePaginationConfig } from 'antd'
import React, { useState } from 'react'
import { columns } from './table-column'
import { ColumnsType } from 'antd/es/table'
import { AnyObject } from 'antd/es/_util/type'
import ClassEnrollmentModal from './modal'
import { classApi } from '@/api/class.api'
const { Option } = Select

export default function ClassEnrollment() {
  const [currentPage, setCurrentPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)

  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState(1)

  const {
    data: usersData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['class-detail'],
    queryFn: () => classApi.getClassDetail(selectedClass)
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

  const customSearchFrom = () => {
    return (
      <Row gutter={[16, 16]} className='items-center'>
        <Col span={3}>Lớp học:</Col>
        <Col span={10}>
          <Select
            // placeholder="Select a option and change input text above"
            onChange={(val) => {
              setSelectedClass(val)
              setTimeout(() => {
                refetch()
              }, 0)
            }}
            // allowClear
            className='w-full'
            defaultValue={1}
          >
            <Option value={1}>BI001</Option>
            <Option value={2}>BI002</Option>
            <Option value={4}>DS001</Option>
          </Select>
        </Col>
      </Row>
    )
  }
  return (
    <div>
      <ClassEnrollmentModal open={openModal} setOpen={setOpenModal} />
      <DataTable
        valueSearch={searchTerm}
        onChangeSearch={handleChange}
        onReset={handleReset}
        onSearch={handleSearch}
        columns={columns() as ColumnsType<AnyObject> | undefined}
        rowKey={'id'}
        dataSource={usersData?.data.classEnrollments}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        total={usersData?.data?.classEnrollments.length}
        showSizeChanger={true}
        pageSizeOptions={['6', '10', '20', '50']}
        onChange={handleTableChange}
        addButtonRender={() => {
          return (
            <Button
              onClick={() => {
                setOpenModal(true)
              }}
              type='primary'
            >
              Thêm mới
            </Button>
          )
        }}
        customSearchFrom={customSearchFrom}
      />
    </div>
  )
}
