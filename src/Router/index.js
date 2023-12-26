/* eslint-disable react/react-in-jsx-scope */
import { createBrowserRouter } from 'react-router-dom'
import DetailRecipe from '../Pages/DetailRecipe'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Register from '../Pages/Register'
import Profile from '../Pages/Profile'
import EditProfile from '../Pages/FormEdit'
import SearchRecipe from '../Pages/SearchRecipe'
import AddRecipe from '../Pages/AddRecipe'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/detail/:slug/:recipes_uid',
    element: <DetailRecipe />
  },
  {
    path: '/detail/:new_added/:slug/:recipes_uid',
    element: <DetailRecipe />
  },
  {
    path: '/user/login',
    element: <Login />
  },
  {
    path: '/user/register',
    element: <Register />

  },
  {
    path: '/profile',
    element: <Profile />

  },
  {
    path: '/form-edit',
    element: <EditProfile />

  },
  {
    path: '/search',
    element: <SearchRecipe />

  },
  {
    path: '/add-recipe',
    element: <AddRecipe />

  }
])

export default router
