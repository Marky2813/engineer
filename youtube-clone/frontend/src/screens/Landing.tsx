import axios from "axios"
import { useEffect, useState } from "react"
import { VideoCard } from "@/components/VideoCard";

export function Landing() {
  //unauthenticated landing page, get all the videos. 
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/videos")
      .then(res => {
        res.data.forEach(async (e) => {
          if(e.thumbnail.split('.')[2] == "jpeg") {
            const getFileUrl = await axios.post("http://localhost:3000/getThumbnailUrl", { thumbnailPath:e.thumbnail});
            e.thumbnail = getFileUrl.data.getUrl;
          }
        })
        setVideos(res.data);
        console.log(res.data);
      })
      .catch(err => console.error(err))
  }, [])
  return (
    <>
    <div className="flex p-2">
      {videos.map((video: any) => (
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
    </>
  )
}

