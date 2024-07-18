import DataTable from '@/components/DataTable'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Col, Row, Select, TablePaginationConfig } from 'antd'
import React, { useState } from 'react'
import { columns } from './table-column'
import { ColumnsType } from 'antd/es/table'
import { AnyObject } from 'antd/es/_util/type'
import ClassEnrollmentModal from './modal'
import { classApi } from '@/api/class.api'
import { UserListConfig } from '@/interface/user'
import { userApi } from '@/api/user.api'
import { toast } from 'sonner'
const { Option } = Select

export default function ClassEnrollment() {
  const [currentPage, setCurrentPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)

  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState(1)
  const queryConfig: UserListConfig = { page_size: pageSize, page: currentPage, ...(searchTerm ? { keyword: searchTerm } : {})}

  const {
    data: studentsData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['students-in-class', selectedClass],
    queryFn: () => classApi.getStudentsInClass(selectedClass, queryConfig)
  })
  const {
    data: classData,
  } = useQuery({
    queryKey: ['class-detail', selectedClass],
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
  const enrollClass = useMutation({
    mutationKey: ['unenroll-class'],
    mutationFn: (studentId: number) =>
      userApi.unenrollClass({ classId: selectedClass, studentId: studentId })
  })

  const onDelete = (studentId: number) => {
    enrollClass.mutate(studentId, {
      onSuccess: () => {
        toast.success('UnEnrolled class successfully')
        refetch()
      },
      onError: (error: unknown) => {
        console.log(error)
      }
    })
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
        columns={columns({onDelete}) as ColumnsType<AnyObject> | undefined}
        rowKey={'id'}
        dataSource={studentsData?.data?.data}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        total={studentsData?.data.total}
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
      <div>Teacher: <strong>{classData?.data?.teacher?.fullName}</strong></div>
      <div>Class Name: <strong>{classData?.data?.name}</strong></div>
    </div>
  )
}
