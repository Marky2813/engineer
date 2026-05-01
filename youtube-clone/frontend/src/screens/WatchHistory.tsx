import { useEffect, useState } from "react";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post("http://localhost:3000/watch-history", {
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")?.trim()}`
      }
    })
      .then(res => {
        setLoading(false);
        setVideos(res.data);
        console.log(res.data);
      })
      .catch(err => console.error(err.response.data))
  }, [])

  if (
    loading
  ) {
    return <div>Loading...</div>
  }
  return (
    <>
    <div className="flex p-2 flex-wrap justify-center gap-2">
          {videos.map((video: any) => (
            <VideoCard
              href={`/watch?id=${video.uploads.id}`}
              key={video.uploads.id}
              videoId={video.uploads.id}
              imageUrl={video.uploads.thumbnail}
              title={video.uploads.description}
              profilePicture={video.user.profilePicture}
              channelName={video.user.channelName}
            />
          ))}
          </div>
    </>
  );
}
export default WatchHistory; 