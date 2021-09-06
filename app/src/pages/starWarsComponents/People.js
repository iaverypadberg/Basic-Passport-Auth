import {useQuery} from 'react-query'
import axios from 'axios'
import Person from './Person'

const fetchPlanets = async()=>{
    const res = await axios.get('https://swapi.dev/api/people');
    const data = res.data;
    // console.log(dat)
    return data;

}

const People = () => {
    const {data, status} = useQuery('people',fetchPlanets);
    console.log(data)
    return (
        <div>
            <h2>Currently displaying: People</h2>

            {status === 'loading' && (
                <div>Loading Data...</div>
            )}

            {status === 'error' && (
                <div>Errer Fetching Data</div>
            )}
            {status === 'success' && (
                <div>
                    {data.results.map(person=><div><Person key={person.name} person={person}/></div>)}
                </div>
            )}
        </div>
    )
}

export default People
