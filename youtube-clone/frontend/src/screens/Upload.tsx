import axios from 'axios'; 
import { useState } from 'react';

//now the real stuff starts, for the thumbnail and the video url. we actually need to set up an object store and put it there but this needs to happen in the backend and not in the frontend.  

const Upload = () => {
  const [thumbnailKey, setThumbnailKey] = useState();
  const [videoKey, setVideoKey] = useState();
  async function submitFn() {
    try {
    console.log(thumbnailKey, videoKey)
    const videoUrl = videoKey;
    const userId = (document.getElementById('userId') as HTMLInputElement).value;
    const thumbnail = thumbnailKey;
    const description = (document.getElementById('description') as HTMLInputElement).value;
    //now we need to do an axios post request along with the authorization header. 
    const data = await axios.post("http://localhost:3000/upload", { videoUrl, userId, thumbnail, description }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    console.log("video uploaded", data.data);
    window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
    <h1>Uploads page</h1>
    <input type='file' placeholder='Add video file'  id='videoUrl' onChange={async (e) => {
      const file = e.target.files[0]; //this is giving us the file object with all the details about the file.
      const res = await axios.post("http://localhost:3000/getPresignedUrlVideo");
      //res.putUrl has our presigned url. now we need to upload our video to a presigned url. 
      setVideoKey(res.data.key);
      const uploaded = await axios.put(res.data.putUrl,file, {
        headers: {
        'Content-Type': file.type, // Required: Must match the ContentType used to generate the URL
      }
      } )
      alert("Video uploaded");
      //the video is rightly being uploaded to the object storage and we are getting the right access url. 
      //now we need to complete the form, add one end point for image as well. store the keys in image key and video key state. send it over to the db. and jab video dikhegi then bring it back from the db. 
      const getFileUrl = await axios.post("http://localhost:3000/getVideoUrl", { videoPath:res.data.key})
      console.log(getFileUrl.data.getUrl)
    }}/>
    <input type='text' placeholder='UserId' className='border p-2 w-full mb-4' id='userId' />
    <input type='file' placeholder='Add Thumbnail File' id='thumbnail' onChange={async (e) => {
      const file = e.target.files[0]; //this is giving us the file object with all the details about the file.
      const res = await axios.post("http://localhost:3000/getPresignedUrlThumbnail");
      //res.putUrl has our presigned url. now we need to upload our video to a presigned url. 
      setThumbnailKey(res.data.key);
      const uploaded = await axios.put(res.data.putUrl,file, {
        headers: {
        'Content-Type': file.type, // Required: Must match the ContentType used to generate the URL
      }
      } )
      alert("Thumbnail uploaded");
      //the video is rightly being uploaded to the object storage and we are getting the right access url. 
      //now we need to complete the form, add one end point for image as well. store the keys in image key and video key state. send it over to the db. and jab video dikhegi then bring it back from the db. 
      const getFileUrl = await axios.post("http://localhost:3000/getThumbnailUrl", { thumbnailPath:res.data.key})
      console.log(getFileUrl.data.getUrl)
    }}/>
    <input type='text' placeholder='description' className='border p-2 w-full mb-4' id='description' />
  <button className='bg-blue-500 text-white p-2 rounded' onClick={submitFn}>Submit</button>
    </>
  );  
}
export default Upload; 