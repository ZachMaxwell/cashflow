import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'; 
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice'
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function Header() {
    const { userInfo, userToken } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (userToken) {
            console.log('place holder for auto authenticate user', userInfo)
            //dispatch(getUserDetails())
        }

    }, [userToken, userInfo, dispatch])

    return (
      <header>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <LinkContainer to="/">
              <Navbar.Brand>cashflow</Navbar.Brand>
            </LinkContainer>
  
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
                <LinkContainer to="/trends">
                  <Nav.Link>
                    <span role="img" aria-label="Chart">📈</span>Trends
                  </Nav.Link>
                </LinkContainer>
  
                <LinkContainer to="/networth">
                  <Nav.Link>
                    <span role="img" aria-label="Dollar">💵</span>Net Worth
                  </Nav.Link>
                </LinkContainer>
  
                <LinkContainer to="/budget">
                  <Nav.Link>
                    <span role="img" aria-label="Table">📊</span>Budget
                  </Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
  
            {userInfo ? (
              <div>
                <span>Logged in as {userInfo.username}</span>
                <Button variant="link" size="sm" className='button' onClick={() => dispatch(logout())}>
                  <span role="img" aria-label="Rocket">🚀</span>Logout
                </Button>
              </div>
            ) : (
              <NavLink className='button' to='/login'>
                <span role="img" aria-label="User">👤</span>Login
              </NavLink>
            )}
          </Container>
        </Navbar>
      </header>
    );
  }

export default Header