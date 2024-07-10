import useRoutesElements from "./hooks/useRouterElements";

function App() {

  const routerDom = useRoutesElements();
  return <>{routerDom}</>;
}

export default App
