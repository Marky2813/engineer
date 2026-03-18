import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function signIn() {
  const navigate = useNavigate(); 
  const [signIn, setsignIn] = useState({
    "username": "",
    "password": ""
  })

  async function submitFn(e) {
    e.preventDefault()
    let response = await axios.post("http://localhost:3000/signin", signIn); 
    const token = response.data.token
    localStorage.setItem("token", token);
    navigate("/")
  }
  return (
    <>
      <h1 className="font-bold text-white mt-5 text-3xl">Sign in to Petmatch</h1>
      <form onSubmit={submitFn}>
        <label
         htmlFor='username'
        >Enter username:</label>
        <input
          type='text'
          id='username'
          value={signIn.username}
          onChange={(e) => setsignIn({ ...signIn, username: e.target.value })}
          required
          className='mt-5'></input><br></br>
        <label htmlFor='password'>Enter password:</label>
        <input
          type='password'
          id='password'
          value={signIn.password}
          onChange={(e) => setsignIn({ ...signIn, password: e.target.value })}
          required
          className='mt-1'></input><br></br>
        <input type='submit' value="Sign In" className='mt-5'></input>
      </form>
    </>
  )
}

export default signIn; 

//the change here which we need to make is that all the post requests now we are sending needs to send a header with the token as well. 