import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Todo from "./components/Todo"
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/stateReducers/userReducer";
function App() {
  const dispatch = useDispatch()
  const auth = localStorage.getItem("auth")
  useEffect(() => {
    let localStorageUser = localStorage.getItem("user")
    try {
      if (localStorageUser && auth) {
        let user = JSON.parse(localStorageUser);
        dispatch(setUser(user))
      }
    } catch {

    }

  }, [])
  const route = createBrowserRouter([
    {
      path: "/",
      element: auth && auth === "true" ? <Todo /> : <Navigate to={"/login"} />
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
