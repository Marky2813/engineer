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
  const [likeCount, setLikeCount] = useState(0);
  const [likeStatus, setLikeStatus] = useState(false);

  const id = searchParams.get('id');
  const token = localStorage.getItem("token")

  async function submitComment() {
  //what we will post will be returned by the request. then we need to update the video details comment array. hopiong this doesn't cause a  rerender
    if(!localStorage.getItem("token")) {
      return alert("please sign in to post comment!")
    }
    const response = await axios.post("http://localhost:3000/comment", {
      uploadId:id, 
      comment
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
    setComment(""); 
    setVideoDetails(prev => ({...prev, comment: [...prev.comment, response.data]}))
  }

  useEffect(() => {
    //react only expects the callback to either return undefined or a cleanup function 
    //if not signed in, the likeStatus will be null and it needs to alert the user to signin 
    setIsLoading(true);
    axios.get("http://localhost:3000/videos/" + id)
    .then((res) => {
      console.log(res.data.video.likes.length)
      setVideoDetails(res.data.video);
      setLikeCount(res.data.video.likes.length); 
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
  <div className="flex justify-center gap-2 p-5">
    <div>
    <video controls><source src={videoDetails.videoUrl} type="video/mp4" /></video>
    <br />
    <div className="flex justify-between">
    <div>
      <div>{videoDetails.description}</div> 
      <div>{videoDetails.user.channelName}</div>
    </div>
    <div>
    <div>likeCount: {likeCount}</div>
    <button className={`px-4 py-2 rounded ${likeStatus ? "bg-gray-500 text-white" : "bg-blue-500 text-white"}`} onClick={async () => {
      if(!localStorage.getItem("token")) {
        return alert("please sign in to like videos!")
      }
      if(likeStatus) {
        try {
        //send request to the like endpoint to unlike the video
        setLikeCount(prev => prev - 1);
        setLikeStatus(false);
        } catch(err) {
          setLikeCount(prev => prev + 1);
          setLikeStatus(true);
          console.error(err);
          return alert("Unable to unlike the video. Please try again.")
        } 
      } else {
        try {
          //send request to the like endpoint to like the video
          setLikeCount(prev => prev + 1);
          setLikeStatus(true);
    } catch(err) {
      setLikeCount(prev => prev - 1);
      setLikeStatus(false);
      console.error(err);
      return alert("Unable to like the video. Please try again.")
    }
      }
    }}>
      {likeStatus ? "Unlike" : "Like"} </button>
    </div>
    </div>
    <div className="rounded-full"><img src={videoDetails.user.profilePicture} className="rounded-full w-10 h-10"/></div>
    {/* include the comments here */} 
    <input type='text' placeholder="Enter comment" className="border-black border-black" value={comment} onChange={e => setComment(e.target.value)}/>
    <button className="bg-black text-white px-4 py-2 rounded" onClick={submitComment} disabled={comment===""}>Post Comment</button>
    {
      videoDetails.comment.length ?
      videoDetails.comment.map((comment: any) => (
        <div key={comment.id} className="border-1 border-black p-5 gap-2">
          <p>{comment.comment}</p>
          <p className="text-gray-500">By: {comment.userId}</p>
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