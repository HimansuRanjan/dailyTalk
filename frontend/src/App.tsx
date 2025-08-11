import './App.css'
import { Button } from './components/ui/button'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import AdminPage from './pages/AdminPage'
import Account from './pages/Account'
import CreatePost from './pages/CreatePost'
import UpdateProfile from './pages/UpdateProfile'
import UpdatePassword from './pages/UpdatePassword'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ViewPostComment from './pages/ViewPostComment'
import Profile from './pages/Profile';

function App() {
  return (
    <>
     <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<AdminPage/>}/>
        <Route path='/admin/profile' element={<Account/>}/>
        <Route path='/admin/post' element={<CreatePost/>}/>
        <Route path='/view/post/:id' element={<ViewPostComment/>}/>
        <Route path='/update/profile' element={<UpdateProfile/>}/>
        <Route path='/update/password' element={<UpdatePassword/>}/>
        <Route path='/password/forgot' element={<ForgotPassword/>}/>
        <Route path='/password/reset/:token' element={<ResetPassword/>}/>

      </Routes>
     </Router>

     <ToastContainer position='bottom-right' theme='dark'/>
    </>
  )
}

export default App
