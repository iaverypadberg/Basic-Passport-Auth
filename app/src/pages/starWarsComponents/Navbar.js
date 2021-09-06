
const Navbar = ({setPage}) => {
    return (
        <div>
            <nav>
                <button className ="mr-2 border rounded-lg" onClick={()=>{setPage('planets')}}>Planets</button>
                <button className ="ml-2 border rounded-lg" onClick={()=>{setPage('people')}}>People</button>
            </nav>
        </div>
    )
}

export default Navbar
