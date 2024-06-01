import React from 'react'
import {Link} from 'react-router-dom'

const Otherpage = () => {
    return (
        <div>
            <p>Im some other page</p>
            <Link to='/'>Go back home</Link>
        </div>
    )
}

export default Otherpage