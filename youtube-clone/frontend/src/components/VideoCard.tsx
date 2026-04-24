interface IVideoCard {
  id: string;
  imageUrl: string;
  title: string;
  profilePicture: string;
  channelName: string;
  href: string; 
}

export function VideoCard({ imageUrl, title, profilePicture, channelName, id, href }: IVideoCard) {
  //we need to display the thumbnail, channelname, profile picture, title as description. also add id. 
  return (
    <>
      <div className="flex  flex-col max-w-300 rounded-md mr-2" key={id} onClick={() => window.location = href}>
        <img src={imageUrl} alt="thumbnail" className="w-full object-cover block rounded-md" /> 
        <div className="flex gap-2 p-2">
          <div><img src={profilePicture} className="w-10 h-10 rounded-full" alt="profile" /></div>
          <div className="flex flex-col">
            <div className="break-words">{title}</div>
            <div className="text-xs text-gray-500">{channelName}</div>
          </div>
        </div>
      </div>
    </>
  )
}