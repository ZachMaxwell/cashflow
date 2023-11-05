import React from 'react'
import AlertMessage from '../components/AlertMessage';


function UserProfileScreen() {
  
  let currentUser = localStorage.getItem('userInfo')

  return (
    <div>
        <AlertMessage variant='success' message = {currentUser} />
                
    </div>
  )
}

export default UserProfileScreen