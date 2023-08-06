import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'; 

function Header() {
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
                            <Nav.Link><i className="fas fa-solid fa-chart-simple"></i>Trends</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/networth">
                            <Nav.Link><i className="fas fa-solid fa-file-invoice-dollar"></i>Net Worth</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/budget">
                            <Nav.Link><i className="fas fa-solid fa-table-cells"></i>Budget</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/login">
                            <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>
                        </LinkContainer>

                        

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>    
    </header>
  );
}

export default Header