import axios from "axios";

export function Signup() {
  async function submitFn() {
    try{
    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    const gender = (document.getElementById("gender") as HTMLInputElement).value;
    const channelName = (document.getElementById("channelName") as HTMLInputElement).value;
    const result = await axios.post("http://localhost:3000/signup", {
      username, password, gender, 
      channelName
    })
    console.log("user signed up", result.data.data.id)
  } catch (err) {
    console.error(err);
  }
  }
  return (
  <>
    <h1>Sign Up</h1>  
    <input type='text' placeholder='username' className='border p-2 w-full mb-4' id='username' />
    <input type='text' placeholder='password' className='border p-2 w-full mb-4' id='password' />
    <input type='text' placeholder='gender' className='border p-2 w-full mb-4' id='gender' />
    <input type='text' placeholder='channelName' className='border p-2 w-full mb-4' id='channelName' />
  <button className='bg-blue-500 text-white p-2 rounded' onClick={submitFn}>Submit</button>
  </>)
}