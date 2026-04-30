import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router"
import { VideoCard } from "@/components/VideoCard";

export function VideoPage() {
  //get the query params. this is another hook in react and then display the video
  const [searchParams, setSearchParams] = useSearchParams();
  const [videoDetails, setVideoDetails] = useState();
  const [isLoading, setIsLoading] = useState(true); 
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [comment, setComment] = useState(""); 

  const id = searchParams.get('id');

  async function submitComment() {
  //what we will post will be returned by the request. then we need to update the video details comment array. hopiong this doesn't cause a  rerender
    if(!localStorage.getItem("token")) {
      return alert("please sign in to post comment!")
    }
    
  }

  useEffect(() => {
    //react only expects the callback to either return undefined or a cleanup function 
    setIsLoading(true);
    axios.get("http://localhost:3000/videos/" + id)
    .then((res) => {
      setVideoDetails(res.data);
      setIsLoading(false)})
    .catch(err => console.error(err))
  }, [id])

  useEffect(() => {   
  axios.get("http://localhost:3000/videos")
      .then(res => {
        setRecommendedVideos(res.data);
      })
      .catch(err => console.error(err))
}, [])

  if(isLoading) {
    return (
      <h1>Loading....</h1>
    )
  }
  return (
  <>
  <div className="flex justify-center gap-2">
    <div>
    <video controls><source src={videoDetails.videoUrl} type="video/mp4" /></video>
    <br />
    <div>{videoDetails.description}
    </div> 
    <div>{videoDetails.user.channelName}</div>
    <div className="rounded-full"><img src={videoDetails.user.profilePicture} className="rounded-full w-10 h-10"/></div>
    {/* include the comments here */} 
    <input type='text' placeholder="Enter comment" className="border-black border-black" value={comment} onChange={e => setComment(e.target.value)}/>
    <button className="bg-black text-white px-4 py-2 rounded" onClick={submitComment} disabled={comment===""}>Post Comment</button>
    {
      videoDetails.comment.length ?
      videoDetails.comment.map((comment: any) => (
        <div key={comment.id}>
          <p>{comment.text}</p>
          <p className="text-gray-500">By: {comment.user.channelName}</p>
        </div>
      ))
      : <p>No comments yet</p>
    }
    </div>
    <div>
      {recommendedVideos.map((video: any) => (
        <VideoCard
          href={`/watch?id=${video.id}`}
          videoId={video.id}
          imageUrl={video.thumbnail}
          title={video.description}
          profilePicture={video.user.profilePicture}
          channelName={video.user.channelName}
          
        />
      ))}
    </div>
  </div>
  </>)
}