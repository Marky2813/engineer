const AppHeader = () => {
  return (
    <div className="flex justify-between">
      <h1>
        Youtube
      </h1>
      <button onClick={() => window.location = '/upload'}>Upload</button>
    </div>
  );  
}
export default AppHeader; 