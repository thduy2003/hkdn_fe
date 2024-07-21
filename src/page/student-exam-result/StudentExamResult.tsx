import { userApi } from '@/api/user.api'
import DataTable from '@/components/DataTable'
import { AppContext, AppContextType } from '@/contexts/app.context'
import { ClassListConfig, IClass } from '@/interface/class'
import { useQuery } from '@tanstack/react-query'
import { Button, Space, TableColumnsType, TablePaginationConfig } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { columns } from './table-column'
import Table, { ColumnsType } from 'antd/es/table'
import { AnyObject } from 'antd/es/_util/type'
import { IExamResult } from '@/interface/exam-result'
import { ExpandedRowRender } from 'rc-table/lib/interface'
import moment from 'moment'
import FeedbackModal, { IDetailFeedbackData } from './modal/Feedback.modal'

export default function StudentExamResult() {
  const { profile } = useContext<AppContextType>(AppContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [examResultClasses, setExamResultClasses] = useState<IClass[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [detailFeedbackData, setDetailFeebackData] = useState<IDetailFeedbackData>({
    examName: '',
    examResultId: 1,
    className: '',
    deadlineFeedback: new Date(),
    examResultFeedbacks: []
  })

  const queryConfig: ClassListConfig = {
    page_size: pageSize,
    page: currentPage,
    ...(searchTerm ? { keyword: searchTerm } : {})
  }

  const {
    data: fetchExamResultClasses,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['student-exam-results', profile?.id],
    queryFn: () => userApi.getExamResults(queryConfig)
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

  /**
   * In this API, I retrieve all the data for all the exam results of the classes and also fetch all the feedback for each exam result. I get the feedback data here to optimize and reduce the number of API calls needed to get the list of feedback for each exam result when clicking the feedback button.
     
    At the same time, I want to load all the exam result data of the classes into the state to copy the original data returned from the API and add new feedback. It will reference this copied data and update the UI without needing to call the API fetchExamResultClasses again.
   */
  useEffect(() => {
    if (fetchExamResultClasses?.data?.data) {
      console.log('fetchExamResultClasses?.data?.data', fetchExamResultClasses?.data?.data)
      setExamResultClasses(fetchExamResultClasses?.data?.data)
    }
  }, [fetchExamResultClasses])

  const expandedRowRender = (examResultClasses: IClass) => {
    const columns: TableColumnsType<IExamResult> = [
      {
        title: 'Exam name',
        dataIndex: 'name',
        width: '40%',
        key: 'name',
        render: (_, record) => <Space>{record.exam.name}</Space>
      },
      {
        title: 'Result',
        dataIndex: 'result',
        width: '10%',
        key: 'result'
      },
      {
        title: 'Deadline Feedback',
        dataIndex: 'deadlineFeedback',
        width: '20%',
        key: 'deadlineFeedback',
        render: (_, record) => {
          return (
            <Space>
              {(record?.deadlineFeedback && moment(record?.deadlineFeedback).format('DD/MM/YYYY')) ?? 'No Date'}
            </Space>
          )
        }
      },
      {
        title: 'Feedback',
        dataIndex: 'feeback',
        key: 'feeback',
        render: (_, record) => {
          return (
            <Button
              onClick={() => {
                setOpenModal(true)
                //This state variable carries the necessary information for the feedback modal.
                setDetailFeebackData({
                  examName: record?.exam?.name,
                  examResultId: record?.id as number,
                  className: examResultClasses?.name,
                  deadlineFeedback: record?.deadlineFeedback,
                  examResultFeedbacks: record?.feedbacks,
                  teacherId: examResultClasses?.teacher?.id
                })
              }}
            >
              Feedback
            </Button>
          )
        }
      }
    ]

    return <Table rowKey={'id'} columns={columns} dataSource={examResultClasses.examResults} pagination={false} />
  }

  return (
    <div>
      <FeedbackModal open={openModal} setOpen={setOpenModal} detailFeedbackData={detailFeedbackData} />

      <DataTable
        valueSearch={searchTerm}
        onChangeSearch={handleChange}
        onReset={handleReset}
        onSearch={handleSearch}
        columns={columns() as ColumnsType<AnyObject> | undefined}
        rowKey={'id'}
        dataSource={examResultClasses}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        total={fetchExamResultClasses?.data?.total}
        showSizeChanger={true}
        pageSizeOptions={['6', '10', '20', '50']}
        onChange={handleTableChange}
        expandable={{
          expandedRowRender: expandedRowRender as ExpandedRowRender<IClass>,
          defaultExpandAllRows: true,
          // expandIcon: ({ onExpand, record }) => (
          //   <Space className='cursor-pointer' onClick={(e) => onExpand(record, e)}>
          //     View Exam Results
          //   </Space>
          // ),
          columnWidth: '150px',
          columnTitle: 'Results Detail'
        }}
      />
    </div>
  )
}
