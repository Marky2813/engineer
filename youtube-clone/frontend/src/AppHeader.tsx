const AppHeader = () => {
  const token = localStorage.getItem("token");
  return (
    <div className="flex justify-between">
      <h1 className="text-xl text-red-500 font-bold" onClick={() => window.location = "/"} style={{cursor: "pointer"}}>
        Youtube
      </h1>
      {token && (
        <>
          <button className="text-xl" onClick={() => (window.location =  "/watch-history")}>Watch History</button>
          <button className="text-xl" onClick={() => (window.location = "/upload")}>Upload</button>
        </>
      )}
    </div>
  );  
}
export default AppHeader; 