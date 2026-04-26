const AppHeader = () => {
  return (
    <div className="flex justify-between">
      <h1 className="text-xl text-red-500 font-bold" onClick={() => window.location = '/'} style={{cursor: "pointer"}}>
        Youtube
      </h1>
      <button className="text-xl" onClick={() => window.location = '/upload'}>Upload</button>
    </div>
  );  
}
export default AppHeader; 