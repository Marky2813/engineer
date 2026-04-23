import axios from 'axios'; 

const Upload = () => {
  async function submitFn() {
    try {
    const videoUrl = (document.getElementById('videoUrl') as HTMLInputElement).value;
    const userId = (document.getElementById('userId') as HTMLInputElement).value;
    const thumbnail = (document.getElementById('thumbnail') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLInputElement).value;
    //now we need to do an axios post request along with the authorization header. 
    const data = await axios.post("http://localhost:3000/upload", { videoUrl, userId, thumbnail, description }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
    <h1>Uploads page</h1>
    <input type='text' placeholder='VideoUrl' className='border p-2 w-full mb-4' id='videoUrl' />
    <input type='text' placeholder='UserId' className='border p-2 w-full mb-4' id='userId' />
    <input type='text' placeholder='thumbnail' className='border p-2 w-full mb-4' id='thumbnail' />
    <input type='text' placeholder='description' className='border p-2 w-full mb-4' id='description' />
  <button className='bg-blue-500 text-white p-2 rounded' onClick={submitFn}>Submit</button>
    </>
  );  
}
export default Upload; 