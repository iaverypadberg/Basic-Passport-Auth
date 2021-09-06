import Navbar from "./starWarsComponents/Navbar";
import People from "./starWarsComponents/People"
import Planets from "./starWarsComponents/Planets"
import {useState} from 'react'

function StarWars() {
  const[page,setPage] = useState('planets')

  return (

    <div className="starwars">
      <h1>Star Wars Info</h1>
      <Navbar setPage={setPage}/>
      <div className="content">
       {page === 'planets'? <Planets/> : <People/>}
      </div>
    </div>

  );
}

export default StarWars;
