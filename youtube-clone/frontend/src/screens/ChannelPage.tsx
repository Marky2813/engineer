import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";

const ChannelPage = () => {
  const { channelName } = useParams();
  const [channelDetails, setChannelDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    axios.get(`http://localhost:3000/channel/${channelName}`)
      .then(res => {
        setChannelDetails(res.data.channelDetails)
        setIsLoading(false);
        console.log(res.data.channelDetails)
      })
      .catch(err => console.error(err))
  }, [])
  if (isLoading) {
    return <div>Loading...</div>
  }
  const displayChannelName = channelName?.trim().replace(/-/g, " ");
  return (<>
  <div className="flex flex-col justify-center items-center">
    <h1>{displayChannelName}</h1>
    <img src={channelDetails.banner} alt="channelbanner" className="w-full block" />
    <div><img src={channelDetails.profilePicture} className="w-[50px] h-[50px] rounded-full" alt="profile" /></div>
    <div className="flex flex-col">
      <div className="break-words">{channelDetails.title}</div>
      <div className="text-xs text-gray-500">{displayChannelName}</div>
    </div>
    <div className="flex p-2 flex-wrap justify-center gap-2">
    {channelDetails.uploads.map((video: any) => (
            <VideoCard
              href={`/watch?id=${video.id}`}
              videoId={video.id}
              imageUrl={video.thumbnail}
              title={video.description}
              profilePicture={channelDetails.profilePicture}
              channelName={displayChannelName}
            />
          ))}
    </div>
  </div>
  </>
  );
}

export default ChannelPage; 