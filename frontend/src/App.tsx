import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Todo from "./components/Todo"
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/stateReducers/userReducer";
function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    let localStorageUser = localStorage.getItem("user")
    try {
      if (localStorageUser) {
        let user = JSON.parse(localStorageUser);
        dispatch(setUser(user))
      }
    } catch {

    }

  }, [])
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Todo />
    },
    {
      path: "/register",
      element: <Register />
    }
    ,
    {
      path: "/login",
      element: <Login />
    }
  ])
  return (
    <RouterProvider router={route} />
  )
}

export default App;
