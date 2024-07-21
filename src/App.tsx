import { useContext, useEffect } from 'react'
import useRoutesElements from './hooks/useRouterElements'
import { AppContext } from './contexts/app.context'
import { LocalStorageEventTarget } from './utils/storage'
import messaging from './configs/firebase'
import { getToken, onMessage } from 'firebase/messaging'

function App() {
  const routerDom = useRoutesElements()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  // const onMessageListener = () =>
  //   new Promise((resolve) => {
  //     onMessage(messaging, (payload) => {
  //       resolve(payload)
  //     })
  //   })

  // useEffect(() => {
  //   getToken(messaging, {
  //     vapidKey: import.meta.env.VITE_FIREBASE_vapidKey || ''
  //   })
  //     .then((token) => {
  //       console.log(token)
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //     })
  //   onMessageListener()
  //     .then((payload) => {
  //       console.log('pl', payload)
  //     })
  //     .catch((err) => console.log('failed: ', err))
  // }, [])

  return <>{routerDom}</>
}

export default App
