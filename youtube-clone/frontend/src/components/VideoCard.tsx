interface IVideoCard {
  videoId: string;
  imageUrl: string;
  title: string;
  profilePicture: string;
  channelName: string;
  href: string;
}

export function VideoCard({ imageUrl, title, profilePicture, videoId, href, channelName }: IVideoCard) {
  //we need to display the thumbnail, channelname, profile picture, title as description. also add id. 
  return (
    <>
      <div className="flex flex-col max-w-[600px] rounded-md mr-2 flex-wrap"  key={videoId} onClick={() => window.location = href}>
        <img src={imageUrl} alt="thumbnail" className="w-[600px] h-[360px] object-cover block rounded-md" /> 
        <div className="flex gap-2 p-2">
          <div><img src={profilePicture} className="w-10 h-10 rounded-full" alt="profile" onClick={(e) => {
            e.stopPropagation(); 
            window.location = `/channel/${channelName}`}}/></div>
          <div className="flex flex-col">
            <div className="break-words">{title}</div>
            <div className="text-xs text-gray-500" onClick={(e) => {
            e.stopPropagation(); 
            window.location = `/channel/${channelName}`}}>{channelName.replace(/-/g, " ")}</div>
          </div>
        </div>
      </div>
    </>
  )
}

//eventually these 2 onclicks should redirect to the channel page. 