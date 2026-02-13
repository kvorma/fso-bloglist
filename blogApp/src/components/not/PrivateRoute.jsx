import { useParams, useNavigate } from 'react-router-dom'
const PrivateRoute = ({ children }) => {
  const location = useLocation()
  const loggedIn = useAuth().state

  return loggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />
}

const Example = () => {
  return (
    <>
      <Route
        path="/blogs"
        element={
          <PrivateRoute>
            <Blogs />
          </PrivateRoute>
        }
      />
      <Route
        path="/users/*"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />
    </>
  )
}
