import { IClassEnrollment } from "@/interface/class-enrollment"
import { Space, TableProps } from "antd"
import moment from "moment"


export const columns = (): TableProps<IClassEnrollment>['columns'] => {
    return [
        {
          title: 'Class Name',
          dataIndex: 'classId',
          key: 'classId',
          render: (_,record) => {
            return <Space>{record.class.name}</Space>
          },
        },
        {
          title: 'Student Name',
          dataIndex: 'studentId',
          key: 'studentId',
          render: (_,record) => {
            return <Space>{record.user.fullName}</Space>
          },
        },
        {
          title: 'Enrollment Date',
          dataIndex: 'enrollmentDate',
          key: 'enrollmentDate',
          render: (_,record) => {
            return <Space>{moment(record.enrollmentDate).format('DD/MM/YYYY')}</Space>
          },
        },
        {
          title: 'Start Date',
          dataIndex: 'startDate',
          render: (_,record) => {
            return <Space>{moment(record.class.startDate).format('DD/MM/YYYY')}</Space>
          },
        },
        {
          title: 'End Date',
          dataIndex: 'endDate',
          render: (_,record) => {
            return <Space>{moment(record.class.endDate).format('DD/MM/YYYY')}</Space>
          },
        },
      ]
}