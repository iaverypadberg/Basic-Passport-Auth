import { useQuery, usePaginatedQuery } from 'react-query'
import { useState } from 'react'
import axios from 'axios'
import Planet from './Planet'

const fetchPlanets = async(page)=>{
    console.log(page)
    const res = await axios.get(`https://swapi.dev/api/planets/?page=${page}`);
    const data = await res.data;
    return data;

}

const Planets = () => {
    const[page,setPage] = useState(1)


    // First argument names the query, second argument is the fucntion to get the data
    const {data, status} = useQuery([ 'planets', page ], ()=>fetchPlanets(page),
    {
        staleTime:2000,
        retry:1,
        onSettled: ()=>{console.log("Settled")},
        onError:() =>{console.log("Some Error... IDK?")},
        onSuccess:()=>{console.log("Data fetched successfully!")}
    });
   

    console.log(data)
    return (
        <div>
            <h2>Currently displaying: Planets</h2>
            {status === 'loading' && (
                <div>Loading Data...</div>
            )}

            {status === 'error' && (
                <div>Errer Fetching Data</div>
            )}
            {status === 'success' && (
                
                <div>
                    {data.results.map(planet=><div><Planet key={planet.name} planet={planet}/></div>)}
                </div>
            )}
            {page < 6 &&  <button onClick={()=>setPage(page+1)}> Next </button>}
            {page > 1 &&  <button onClick={()=>setPage(page-1)}> Back </button>}
           
        </div>
    )
}

export default Planets
