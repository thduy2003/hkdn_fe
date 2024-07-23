import DataTable from '@/components/DataTable'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Col, Row, Select, TablePaginationConfig } from 'antd'
import React, { useEffect, useState } from 'react'
import { columns } from './table-column'
import { ColumnsType } from 'antd/es/table'
import { AnyObject } from 'antd/es/_util/type'
import ClassEnrollmentModal from './modal'
import { classApi } from '@/api/class.api'
import { UserListConfig, UserRole } from '@/interface/user'
import { userApi } from '@/api/user.api'
import { toast } from 'sonner'
import { ClassListConfig } from '@/interface/class'
import useDebounceState from '@/hooks/useDebounce'

export default function ClassEnrollment() {
  const [currentPage, setCurrentPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, debouncedSearchTerm, setSearchTerm] = useDebounceState('', 300)
  const [pageSize, setPageSize] = useState(10)
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState(1)
  const queryConfig: UserListConfig = {
    page_size: pageSize,
    page: currentPage,
    ...(searchValue ? { keyword: searchValue } : {})
  }

  const queryStudentConfig: UserListConfig = {
    page_size: 1000,
    page: 1,
    role: UserRole.Student,
    ...(debouncedSearchTerm ? { keyword: debouncedSearchTerm } : {})
  }

  const { data: usersData } = useQuery({
    queryKey: ['users', debouncedSearchTerm],
    queryFn: () => userApi.getUsers(queryStudentConfig)
  })
  const {
    data: studentsData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['students-in-class', selectedClass],
    queryFn: () => classApi.getStudentsInClass(selectedClass, queryConfig)
  })
  const { data: classData } = useQuery({
    queryKey: ['class-detail', selectedClass],
    queryFn: () => classApi.getClassDetail(selectedClass)
  })
  const classqueryConfig: ClassListConfig = {
    page_size: pageSize,
    page: currentPage,
    ...(searchValue ? { keyword: searchValue } : {})
  }
  const { data: classesData, isLoading: isClassesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classApi.getClassesByTeacher(classqueryConfig)
  })

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1)
    setPageSize(pagination.pageSize || 6)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }
  const handleSearch = () => {
    setCurrentPage(1)
    refetch()
  }
  const handleReset = () => {
    setCurrentPage(1)
    setSearchValue('')
    setTimeout(() => {
      refetch()
    }, 0)
  }
  const enrollClass = useMutation({
    mutationKey: ['unenroll-class'],
    mutationFn: (studentId: number) => userApi.unenrollClass({ classId: selectedClass, studentId: studentId })
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
            value={selectedClass}
            loading={isClassesLoading}
            options={(classesData?.data?.data || []).map((d) => ({
              value: d.id,
              label: d.name
            }))}
          ></Select>
        </Col>
      </Row>
    )
  }
  useEffect(() => {
    if (classesData?.data?.data) {
      setSelectedClass(classesData?.data?.data[0]?.id)
    }
  }, [classesData?.data?.data])
  return (
    <div>
      <ClassEnrollmentModal
        setSearchTerm={setSearchTerm}
        usersData={usersData?.data?.data || []}
        classId={selectedClass}
        open={openModal}
        setOpen={setOpenModal}
      />
      <DataTable
        valueSearch={searchValue}
        onChangeSearch={handleChange}
        onReset={handleReset}
        onSearch={handleSearch}
        columns={columns({ onDelete }) as ColumnsType<AnyObject> | undefined}
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
      <div>
        Teacher: <strong>{classData?.data?.teacher?.fullName}</strong>
      </div>
      <div>
        Class Name: <strong>{classData?.data?.name}</strong>
      </div>
    </div>
  )
}
