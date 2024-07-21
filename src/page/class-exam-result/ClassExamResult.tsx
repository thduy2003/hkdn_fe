import { classApi } from '@/api/class.api'
import { IUserList, UserListConfig } from '@/interface/user'
import { useQuery } from '@tanstack/react-query'
import { Button, Col, Input, Row, Select, Space, TableColumnsType, TablePaginationConfig } from 'antd'
import { useEffect, useState } from 'react'
import DataTable from '@/components/DataTable'
import Table, { ColumnsType } from 'antd/es/table'
import { AnyObject } from 'antd/es/_util/type'
import { columns } from './table-column'
import { ExpandedRowRender } from 'rc-table/lib/interface'
import EnterResultModal from './modal'
import { EnterResultModalProps } from './modal/EnterResult.modal'
import { toast } from 'sonner'
import FeedbackModal, { IDetailFeedbackData } from '../student-exam-result/modal/Feedback.modal'
import { IExamResult } from '@/interface/exam-result'
const { Option } = Select
export default function ClassExamResult() {
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsData, setStudentsData] = useState<IUserList[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalFeedback, setOpenModalFeedback] = useState<boolean>(false)
  const [dataUpdateResult, setDataUpdateResult] = useState<EnterResultModalProps>({
    studentId: undefined,
    className: '',
    studentName: ''
  })
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState(1)
  const [addedExamResult, setAddedExamResult] = useState<{
    examName: string
    result: number
    id: string
    studentId: number
  }>({
    examName: '',
    result: 0,
    id: '',
    studentId: 0
  })
  const [detailFeedbackData, setDetailFeebackData] = useState<IDetailFeedbackData>({
    examName: '',
    examResultId: 1,
    studentName: '',
    examResultFeedbacks: []
  })

  const [editingKey, setEditingKey] = useState<number | undefined>(undefined)
  const [editValue, setEditValue] = useState<string>('')
  const queryConfig: UserListConfig = {
    page_size: pageSize,
    page: currentPage,
    ...(searchTerm ? { keyword: searchTerm } : {})
  }

  const {
    data: fetchStudentsData,
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

  const onUpdate = (value: EnterResultModalProps) => {
    setOpenModal(true)
    setDataUpdateResult({
      ...dataUpdateResult,
      studentId: value.studentId,
      studentName: value.studentName,
      className: classData?.data?.name,
      classId: selectedClass
    })
  }

  //A function to retrieve the added data from the enter result modal, update the student data, and display the new data.

  const onHandleUpdateSuccess = (data: { examName: string; result: number; id: string; studentId: number }) => {
    setAddedExamResult(data)
  }

  //Handle updating the exam result after entering the result without re-calling the API to get the list.

  useEffect(() => {
    if (addedExamResult) {
      setStudentsData((prevStudents) =>
        prevStudents.map((student) => {
          if (student.id === addedExamResult.studentId) {
            return {
              ...student,
              examResults: [
                ...(student.examResults || []),
                {
                  exam: { name: addedExamResult.examName },
                  result: addedExamResult.result,
                  id: Number(addedExamResult.id)
                }
              ]
            }
          }
          return student
        })
      )
    }
  }, [addedExamResult])

  /*Load student data in class into a state to copy the original data and add the exam result, thus creating new student data.
   Directly modifying fetchStudentData with the exam result will not reference the original fetchStudentData, so React cannot recognize and update the UI.*/

  useEffect(() => {
    if (fetchStudentsData?.data?.data) {
      setStudentsData(fetchStudentsData?.data?.data)
    }
  }, [fetchStudentsData])
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
  const expandedRowRender = (userRecord: IUserList) => {
    const handleEdit = (key: number, result: string) => {
      setEditingKey(key)
      setEditValue(result)
    }

    const handleSave = (key: number) => {
      // Logic to save the edited result
      // You may want to update the record in state or make an API call here
      const checkNumber = Number(editValue)
      if (isNaN(checkNumber)) {
        toast.error('Invalid result. Please enter a valid result')
        return
      }
      setEditingKey(undefined)
    }

    const handleCancel = () => {
      setEditingKey(undefined)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const columns: TableColumnsType<IExamResult> = [
      {
        title: 'Exam name',
        width: '300px',
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => <Space>{record.exam.name}</Space>
      },
      {
        title: 'Result',
        dataIndex: 'result',
        width: '100px',
        key: 'result',
        render: (_, record) =>
          editingKey === record.id ? (
            <Input className='w-full' value={editValue} onChange={(e) => setEditValue(e.target.value)} />
          ) : (
            record.result
          )
      },
      {
        title: 'Action',
        width: '100px',
        key: 'action',
        render: (_, record) =>
          editingKey === record.id ? (
            <Space>
              <Button onClick={() => handleSave(record.id as number)}>Save</Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          ) : (
            <Button onClick={() => handleEdit(record.id as number, record.result.toString())}>Edit</Button>
          )
      },
      {
        title: 'Feedback',
        key: 'feedback',
        render: (_, record) => (
          <Button
            onClick={() => {
              setOpenModalFeedback(true)
              setDetailFeebackData({
                studentName: userRecord?.fullName,
                examName: record?.exam?.name,
                examResultFeedbacks: record?.feedbacks
              })
            }}
          >
            View ({record?.feedbacks?.length} feedbacks)
          </Button>
        )
      }
    ]

    return <Table rowKey={'id'} columns={columns} dataSource={userRecord.examResults} pagination={false} />
  }

  return (
    <div>
      <FeedbackModal open={openModalFeedback} setOpen={setOpenModalFeedback} detailFeedbackData={detailFeedbackData} />

      <EnterResultModal
        open={openModal}
        setOpen={setOpenModal}
        data={dataUpdateResult}
        onHandleUpdateSuccess={onHandleUpdateSuccess}
      />
      <DataTable<IUserList>
        valueSearch={searchTerm}
        onChangeSearch={handleChange}
        onReset={handleReset}
        onSearch={handleSearch}
        columns={columns({ onUpdate }) as ColumnsType<AnyObject> | undefined}
        rowKey={'id'}
        dataSource={studentsData}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        total={fetchStudentsData?.data?.total}
        showSizeChanger={true}
        pageSizeOptions={['6', '10', '20', '50']}
        onChange={handleTableChange}
        customSearchFrom={customSearchFrom}
        expandable={{
          expandedRowRender: expandedRowRender as ExpandedRowRender<IUserList>,
          defaultExpandAllRows: true
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
