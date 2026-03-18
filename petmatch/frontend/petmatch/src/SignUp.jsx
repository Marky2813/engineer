import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate(); 
  const [signUp, setsignUp] = useState({
    "username": "",
    "password": ""
  })

  async function submitFn(e) {
    e.preventDefault()
    let response = await axios.post("http://localhost:3000/signup", signUp); 
    console.log(response);
    navigate("/signin")
  }
  return (
    <>
      <h1 className="font-bold text-white mt-5 text-3xl">Welcome to Petmatch!</h1>
      <form onSubmit={submitFn}>
        <label
         htmlFor='username'
        >Enter username:</label>
        <input
          type='text'
          id='username'
          value={signUp.username}
          onChange={(e) => setsignUp({ ...signUp, username: e.target.value })}
          required
          className='mt-5'></input><br></br>
        <label htmlFor='password'>Enter password:</label>
        <input
          type='password'
          id='password'
          value={signUp.password}
          onChange={(e) => setsignUp({ ...signUp, password: e.target.value })}
          required
          className='mt-1'></input><br></br>
        <input type='submit' value="Sign Up" className='mt-5'></input>
      </form>
    </>
  )
}

export default SignUp; 