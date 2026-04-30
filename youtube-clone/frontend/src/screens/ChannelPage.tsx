import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { VideoCard } from "@/components/VideoCard";
const token = localStorage.getItem("token");

const ChannelPage = () => {
  const { channelName } = useParams();
  const [channelDetails, setChannelDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState("self");
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    axios.get(`http://localhost:3000/channel/${channelName}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setChannelDetails(res.data.channelDetails)
        setIsLoading(false);
        console.log(res.data.user.subscriptionStatus)
        setUserDetails(res.data.user)
        setSubscriptionStatus(res.data.user.subscriptionStatus)
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
      {subscriptionStatus === "self" ? 
      <div className="text-sm text-gray-500">This is your channel</div> 
      : 
      subscriptionStatus === "subscribe" ? 
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={async () => {
        //here check if the user is signed in, this can be checked using the localstorage. if not signed in then alert them to be signed in
        if(localStorage.getItem("token") === null) { 
          alert("Please sign in to subscribe to channels");
        } else {
          const response = await axios.post("http://localhost:3000/subscribe", {
          userId: userDetails.userId,
          channelId: channelDetails.id
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }) 
          console.log("subscribed successfully", response.data)
          setSubscriptionStatus("unsubscribe")
        }
        console.log("send subscribe query here", subscriptionStatus)
      }} >Subscribe</button>
      :
      <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={async () => {
         const response = await axios.delete("http://localhost:3000/unsubscribe", {
          data: {
            userId: userDetails.userId,
            channelId: channelDetails.id
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setSubscriptionStatus("subscribe");
        console.log("unsubscribed", response.data)
      }}>Unsubscribe</button> 
      }
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
//subscribe, unsubscribe and self 