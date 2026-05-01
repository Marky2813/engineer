import { Routes, Route } from "react-router";
import { Landing } from './screens/Landing'
import { Signup } from "./screens/Signup";
import { Signin } from "./screens/Signin";
import { VideoPage } from "./screens/VideoPage";
import Upload from "./screens/Upload";
import ChannelPage from "./screens/ChannelPage";
import WatchHistory from "./screens/WatchHistory";
export function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />  
      <Route path='/signup' element={<Signup />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/watch' element={<VideoPage />} />
      <Route path='/upload' element={<Upload />} />
      <Route path='/watch-history' element={<WatchHistory />} />
      <Route path='/channel/:channelName' element={<ChannelPage  />} /> //this is a dynamic route, we will get the channel id in the channel page and then fetch the channel details and videos uploaded by that channel.
    </Routes>  
  );
}

export default App;
