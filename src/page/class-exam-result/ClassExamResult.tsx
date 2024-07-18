import { classApi } from '@/api/class.api'
import { IUserList, UserListConfig } from '@/interface/user'
import { useQuery } from '@tanstack/react-query'
import { Col, Row, Select, Space, TableColumnsType, TablePaginationConfig } from 'antd'
import { useState } from 'react'
import DataTable from '@/components/DataTable'
import Table, { ColumnsType } from 'antd/es/table'
import { AnyObject } from 'antd/es/_util/type'
import { columns } from './table-column'
import { ExpandedRowRender } from 'rc-table/lib/interface'
const { Option } = Select
export default function ClassExamResult() {
  const [currentPage, setCurrentPage] = useState(1)

  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState(1)
  const queryConfig: UserListConfig = {
    page_size: pageSize,
    page: currentPage,
    ...(searchTerm ? { keyword: searchTerm } : {})
  }

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
  const expandedRowRender = (record: IUserList) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: TableColumnsType<any> = [
      {
        title: 'Exam name',
        width: '300px',
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => <Space>{record.exam.name}</Space>
      },
      { title: 'Result', dataIndex: 'result', key: 'result' }
      //   {
      //     title: 'Action',
      //     key: 'operation',
      //     render: () => (
      //       <Space size="middle">
      //         <a>Pause</a>
      //         <a>Stop</a>
      //         <Dropdown menu={{ items }}>
      //           <a>
      //             More <DownOutlined />
      //           </a>
      //         </Dropdown>
      //       </Space>
      //     ),
      //   },
    ]

    return <Table rowKey={'id'} columns={columns} dataSource={record.examResults} pagination={false} />
  }

  return (
    <div>
      {/* <ClassEnrollmentModal open={openModal} setOpen={setOpenModal} /> */}
      <DataTable<IUserList>
        valueSearch={searchTerm}
        onChangeSearch={handleChange}
        onReset={handleReset}
        onSearch={handleSearch}
        columns={columns() as ColumnsType<AnyObject> | undefined}
        rowKey={'id'}
        dataSource={studentsData?.data?.data}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        total={studentsData?.data.total}
        showSizeChanger={true}
        pageSizeOptions={['6', '10', '20', '50']}
        onChange={handleTableChange}
        customSearchFrom={customSearchFrom}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expandable={{
          expandedRowRender: expandedRowRender as ExpandedRowRender<IUserList>
        }}
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
