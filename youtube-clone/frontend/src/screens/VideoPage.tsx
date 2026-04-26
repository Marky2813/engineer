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
  const [isAccessUrl, setAccessUrl] = useState(false); 

  const id = searchParams.get('id');
  useEffect(() => {
    if(isAccessUrl) {
      const getFileUrl = axios.post("http://localhost:3000/getVideoUrl", { videoPath:videoDetails.videoUrl});
      getFileUrl
      .then((res) => {

        console.log("it is loading", res.data.getUrl)
        setVideoDetails(prev => ({...prev,videoUrl:res.data.getUrl}));
        setIsLoading(false);
      }) .catch(err => console.error(err)) 
      
    }
  }, [isAccessUrl])

  useEffect(() => {
    //react only expects the callback to either return undefined or a cleanup function 
    axios.get("http://localhost:3000/videos/" + id)
    .then((res) => {
      if(res.data.videoUrl.split('.')[2] == "mp4") {
       setVideoDetails(res.data);
       setAccessUrl(true);
       return  
      }
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
    </div>
    <div>
      {recommendedVideos.map((video: any) => (
        <VideoCard
          href={`/watch?id=${video.id}`}
          key={video.id}
          id={video.id}
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