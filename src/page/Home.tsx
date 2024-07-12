import { userApi } from '@/api/user.api'
import { useQuery } from '@tanstack/react-query'

export default function Home() {
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers({ page: 1, page_size: 10 })
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <ul>
        {usersData?.data?.data?.data.map((user) => {
          return <li key={user.id}>{user.fullName}</li>
        })}
      </ul>
    </div>
  )
}
