import { userApi } from '@/api/user.api'
import ModalComponent from '@/components/Modal'
import { AppContext, AppContextType } from '@/contexts/app.context'
import { ModalProps } from '@/interface/app'
import { ICreateExamResultFeedback, IFeedback } from '@/interface/feedback'
import { UserRole } from '@/interface/user'
import socket from '@/socket'
import { useMutation } from '@tanstack/react-query'
import { Button, Divider } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import moment from 'moment'
import { useContext, useState } from 'react'
import { toast } from 'sonner'
interface IFeedbackProps {
  content: string
  createdAt: Date
}
export interface IDetailFeedbackData {
  examName?: string
  studentName?: string
  examResultId?: number
  className?: string
  deadlineFeedback?: Date
  examResultFeedbacks?: IFeedback[]
  teacherId?: number
}
export interface FeedbackModalProps {
  detailFeedbackData: IDetailFeedbackData
}
export default function FeedbackModal({ open, setOpen, detailFeedbackData }: ModalProps & FeedbackModalProps) {
  const { profile } = useContext<AppContextType>(AppContext)

  const [feedback, setFeedback] = useState<IFeedbackProps>({
    content: '',
    createdAt: new Date()
  })

  const submitFeedback = useMutation({
    mutationKey: ['submit-feedback'],
    mutationFn: (data: ICreateExamResultFeedback) => userApi.createExamResultFeedback(data)
  })
  const handleChangeFeedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback((prevFeedback) => {
      return {
        ...prevFeedback,
        content: e.target.value,
        createdAt: new Date()
      }
    })
  }
  const handleSubmitFeedback = () => {
    submitFeedback.mutate(
      {
        examResultId: detailFeedbackData?.examResultId as number,
        content: feedback?.content
      },
      {
        onSuccess: () => {
          toast.success('Submitted feedback successfully')
          socket.emit('send_notification', {
            receiver_id: detailFeedbackData.teacherId,
            content: `Student: ${profile?.fullName} has submitted a feedback for the exam: ${detailFeedbackData.examName}`
          })
          /**
           * By doing this, it will directly reference the feedback data of the exam result for which we are creating feedback within the entire ExamResultClasses data. This approach optimizes the number of API calls to ExamResultClasses. The new feedback data will immediately display in the modal and also in the feedback modals of other exam results.
           */
          detailFeedbackData?.examResultFeedbacks?.push({ ...feedback })
          setFeedback({
            content: '',
            createdAt: new Date()
          })
        },
        onError: (error: unknown) => {
          console.log(error)
        }
      }
    )
  }

  const formContentRender = () => {
    return (
      <div>
        {profile?.role === UserRole.Student ? (
          <div className='w-full bg-green-200 p-2 mb-2 rounded-lg text-justify'>
            You are entering feedback for exam: <strong>{detailFeedbackData?.examName}</strong> in the class:{' '}
            <strong>{detailFeedbackData?.className}</strong> <br />
            <strong className='text-red-400'>Note</strong>: You can only submit feedback before the feedback deadline on{' '}
            <strong>{moment(detailFeedbackData?.deadlineFeedback).format('DD/MM/YYYY hh:mma')}.</strong>
          </div>
        ) : (
          <div className='w-full bg-green-200 p-2 mb-2 rounded-lg text-justify'>
            You are viewing feedback for exam: <strong>{detailFeedbackData?.examName}</strong> of the student:{' '}
            <strong>{detailFeedbackData?.studentName}</strong>
          </div>
        )}
        <Divider />
        <div className='h-[200px] overflow-auto flex flex-col gap-3'>
          {detailFeedbackData?.examResultFeedbacks?.map((item) => {
            return (
              <div key={item.createdAt.toString()} className='flex flex-col gap-1'>
                <div className='w-[400px] bg-blue-500 text-white rounded-lg p-2'>{item.content}</div>
                <div className='text-sm text-gray-400'>
                  Created at: {moment(item.createdAt).format('DD/MM/YYYY hh:mma')}
                </div>
              </div>
            )
          })}
        </div>
        <Divider />
        <div className='flex items-center justify-center gap-x-3'>
          <TextArea
            value={feedback.content}
            onChange={handleChangeFeedback}
            autoSize={{ minRows: 3 }}
            className='flex-1'
            placeholder='Enter your feedback...'
          />
          <Button
            disabled={feedback.content.length === 0 || !detailFeedbackData.examResultId}
            onClick={handleSubmitFeedback}
            type='primary'
          >
            Send
          </Button>
        </div>
      </div>
    )
  }
  const customTitle = () => {
    return <p>Feedback</p>
  }
  const onCancel = () => {
    setOpen(false)
  }

  return (
    <ModalComponent
      customTitle={customTitle}
      formContentRender={formContentRender}
      open={open}
      setOpen={setOpen}
      onCancel={onCancel}
    />
  )
}
