import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [list, setList] = useState([])
  const [counter, setCounter] = useState(0);
  const [breedFilter, setBreedFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [cities, setCities] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [formData, setFormData] = useState({
    pet_name: "",
    breed: '',
    age: '',
    gender: '',
    city: '',
    owner_contact: '',
  })

  async function submitFn(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/pets",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

    setCounter(prev => prev + 1);
    setFormData({
      pet_name: "",
      breed: '',
      age: '',
      gender: '',
      city: '',
      owner_contact: '',
    })
    const data = response;
    //okay so this formData is having the correct information, now we gotta send this to the backend
  }

  async function getPets() {
    let dogs = await fetch(`http://localhost:3000/pets?city=${cityFilter}&breed=${breedFilter}`);
    const data = await dogs.json()
    setList(data)
  }

  useEffect(() => {
    fetch('http://localhost:3000/cities').then((r) => r.json()).then(setCities)
    fetch('http://localhost:3000/breeds').then((r) => r.json()).then(setBreeds)
  }, [counter])

  useEffect(() => {
    console.log("hi")
    getPets()
  }, [counter, cityFilter, breedFilter])

  return (
    <>
      <h1 className="font-bold text-white mt-5 text-3xl">Find a mate for your pet</h1>
      <div className="flex justify-center items-center gap-5">
        <form className="mt-5" onSubmit={submitFn}>
          <label htmlFor='name'>Pet Name: </label>
          <input
            type='text'
            id='name'
            name='pet_name'
            value={formData.pet_name}
            onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
            required></input>
          <br></br>
          <label htmlFor='breed'>Breed: </label>
          <input
            type='text'
            id='breed'
            name='breed'
            value={formData.breed}
            onChange={(e) => {
              setFormData({ ...formData, breed: e.target.value })
            }}
            required></input>
          <br></br>
          <label htmlFor='age'>Age: </label>
          <input
            type='number'
            id='age'
            name='age'
            value={formData.age}
            onChange={(e) => {
              setFormData({ ...formData, age: e.target.value })
            }}
            required></input>
          <br>
          </br>
          <label htmlFor='gender'> Gender: </label>
          <input
            type='text'
            id='gender'
            name='gender'
            value={formData.gender}
            onChange={(e) => {
              setFormData({ ...formData, gender: e.target.value })
            }}
            required></input>
          <br>
          </br>
          <label htmlFor='city'>City: </label>
          <input
            type='text'
            id='city'
            name='city'
            value={formData.city}
            onChange={(e) => {
              setFormData({ ...formData, city: e.target.value })
            }}
            required></input>
          <br>
          </br>
          <label htmlFor='contactInfo'>Mobile Number: </label>
          <input
            type='number'
            id='contactInfo'
            name='owner_contact'
            value={formData.owner_contact}
            onChange={(e) => {
              setFormData({ ...formData, owner_contact: e.target.value })
            }}
            required></input>
          <br>
          </br>
          <input type='submit' value="Submit" className='mt-2' required></input>
        </form>
      </div>
      <div className='mt-10'>
        <h1 className='text-xl font-bold'>Look for other pets</h1>
        {/* //the form is working, just gotta confirm once about the id. how do we display the list and apply filters.  */}
        <div>
          <span>City Filter:</span>
          <select name="city_value" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className='mr-8'>
            <option value="">none</option>
            {cities && cities.map((e) => {
              return (
                <option value={e}>{e}</option>
              )
            })}
          </select>
          <span>Breed Filter:</span>
          <select name="breed_value" value={breedFilter} onChange={(e) => setBreedFilter(e.target.value)}>
            <option value="">none</option>
            {breeds && breeds.map((e) => {
              return (
                <option value={e}>{e}</option>
              )
            })}
          </select>
        </div>
        {((list.length>0) && list.map((e) => {
          
          return (
            <>
              <h1>{e.pet_name}</h1>
            </>
          )
        }) || <h1>No pets found</h1>)
        }
      </div>
    </>
  )
}

export default App
