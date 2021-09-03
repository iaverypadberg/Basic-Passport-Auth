import React from 'react'
import { withRouter,Link  } from 'react-router-dom'
const Profile = () => {
    return (
        <div>
            <h1>My Private Profile!</h1>
            <div>
                <Link to="/">
                <button>Back to home</button>
                </Link>
            </div>
        </div>
    )
}

export default withRouter(Profile);
