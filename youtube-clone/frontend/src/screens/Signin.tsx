import axios from "axios";
//Sarthak2813
export function Signin() {
  async function submitFn() {
    try {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    const result = await axios.post("http://localhost:3000/Signin", {
      username, password
    })
    localStorage.setItem("token", result.data.token);
    window.location.href = "/";
    console.log("user signed in", result.data.token) 
  } catch (err) {
    console.error(err);
  }
  }
  return (
  <>
    <h1>Sign In</h1>  
    <input type='text' placeholder='username' className='border p-2 w-full mb-4' id='username' />
    <input type='text' placeholder='password' className='border p-2 w-full mb-4' id='password' />
  <button className='bg-blue-500 text-white p-2 rounded' onClick={submitFn}>Submit</button>
  </>)
}