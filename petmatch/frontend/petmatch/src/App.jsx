import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import SignIn from './SignIn'
import SignUp from './SignUp'

function App() {

  return (
    <>
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/' element={<Home />} /> 
      </Routes>
    </>
  )
}

export default App
