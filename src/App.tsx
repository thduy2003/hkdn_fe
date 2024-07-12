import { useContext, useEffect } from "react";
import useRoutesElements from "./hooks/useRouterElements";
import { AppContext } from "./contexts/app.context";
import { LocalStorageEventTarget } from "./utils/storage";

function App() {

  const routerDom = useRoutesElements();
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return <>{routerDom}</>;
}

export default App
