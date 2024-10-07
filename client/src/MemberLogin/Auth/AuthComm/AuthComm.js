import React from 'react'
import { Link, Outlet } from 'react-router-dom'
// import * as API from "../../../../Endpoint/endpoint";

const AuthComm = () => {
    return (
        <>
            <div>
                <Link to=""></Link>
                <Link to="register" ></Link>
            </div>
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default AuthComm
