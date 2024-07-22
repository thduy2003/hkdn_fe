import { notificationApi } from '@/api/notification.api'
import { AppContext, AppContextType } from '@/contexts/app.context'
import { INotification, NotificationListConfig } from '@/interface/notification'
import socket from '@/socket'
import { useQuery } from '@tanstack/react-query'
import { Divider, Popover } from 'antd'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { IoClose, IoNotificationsOutline } from 'react-icons/io5'
import { MdMessage } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Notification() {
  const { profile } = useContext<AppContextType>(AppContext)
  const [notificationData, setNotificationData] = useState<INotification[]>([])
  const [open, setOpen] = useState(false)

  const hide = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }
  const queryConfig: NotificationListConfig = {
    page_size: 10,
    page: 1,
    userId: profile?.id
  }
  const navigate = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addQueryParams = (params: any) => {
    const searchParams = new URLSearchParams(location.search);

    // Add or update query parameters
    Object.keys(params).forEach(key => {
      searchParams.set(key, params[key]);
    });

    // Use navigate to change the URL
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };

  const handleOpenNotification = (data: INotification) => {
    console.log('data', data)
    addQueryParams(data.metadata)
  }
  const { data: fetchNotificationData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(queryConfig)
  })
  useEffect(() => {
    if (fetchNotificationData?.data?.data) {
      setNotificationData(fetchNotificationData?.data?.data)
    }
  }, [fetchNotificationData])
  useEffect(() => {
    // client-side

    //This place is being triggered twice so we have to search to see if it already exists before adding it to the array
    socket.on('receive_notification', (payload) => {
      if (payload) {
        setNotificationData((prevData) => {
          const found = prevData.find((data) => data.id === payload.id)
          if (found) {
            return prevData
          }
          return [
            {
              ...payload
            },
            ...prevData
          ]
        })
      }
    })
  }, [])
  return (
    <Popover
      rootClassName='p-0'
      className='p-0'
      content={
        <div className='w-[300px] h-[300px] overflow-auto'>
          {notificationData && notificationData?.length > 0 ? (
            notificationData?.map((item) => {
              return (
                <div key={item.id} className='flex gap-2 p-2 hover:bg-gray-100 cursor-pointer' onClick={() => handleOpenNotification(item)}>
                  <div className='flex-shrink-0 flex items-center'>
                    <MdMessage className='size-10' />
                  </div>
                  <div className='flex-1'>
                    <div>
                      <h1 className='text-[18px] font-bold'>SYSTEM</h1>
                    </div>
                    <div className='text-justify line-clamp-3 font-semibold'>{item.content}</div>
                    <div className='flex justify-end font-bold text-sm text-gray-400 mt-1'>
                      Created at: {moment(item.createdAt).format('DD/MM/YYYY hh:mma')}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className='text-xl text-center'>No notifications!</div>
          )}
        </div>
      }
      title={
        <div className='relative'>
          Notifications
          <div onClick={hide} className='absolute top-0 right-0'>
            <IoClose className='size-5 cursor-pointer hover:text-blue-500' />
          </div>
          <Divider className='my-2 bg-blue-500' />
        </div>
      }
      placement='bottomRight'
      trigger='click'
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className='relative'>
        <IoNotificationsOutline className='size-[30px] pt-1 cursor-pointer hover:text-blue-500' />
        {notificationData && notificationData?.length > 0 && (
          <div className='absolute top-[3px] right-1 size-[10px] rounded-full bg-blue-500'></div>
        )}
      </div>
    </Popover>
  )
}
