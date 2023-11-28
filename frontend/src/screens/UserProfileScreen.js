import React from 'react'
import { useSelector } from 'react-redux';


function UserProfileScreen() {

  const { userInfo } = useSelector(state => state.auth);

  return (
    <div>
        
        <h1>Hello, {userInfo.name} </h1>

        <p>Email: {userInfo.email}</p>

        <p>More coming soon...</p>

                
    </div>
  )
}

export default UserProfileScreen