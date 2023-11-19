import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo) { 
        return (
            <div className='unauthorized text-center mt-3'>
                <h1>Unauthorized 🙁</h1>
                <h1>Please login or sign up for an account to continue...</h1>
                <span>
                    <NavLink to='/login'>Login</NavLink> or 
                    <NavLink to='/register'> Register</NavLink>
                </span>
            </div>
        )
    }
    return <Outlet />
}

export default ProtectedRoute

