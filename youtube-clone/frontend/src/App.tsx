import { Routes, Route } from "react-router";
import { Landing } from './screens/Landing'
import { Signup } from "./screens/Signup";
import { Signin } from "./screens/Signin";
import { VideoPage } from "./screens/VideoPage";
import Upload from "./screens/Upload";
export function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />  
      <Route path='/signup' element={<Signup />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/watch' element={<VideoPage />} />
      <Route path='/upload' element={<Upload />} />
    </Routes>  
  );
}

export default App;
