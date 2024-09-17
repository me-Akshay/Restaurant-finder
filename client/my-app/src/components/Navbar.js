

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <BootstrapNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      className={`mb-4 ${scrolled ? 'scrolled' : ''}`}
    >
      <Container>
        <BootstrapNavbar.Brand as={NavLink} to="/" className="fs-3 fw-bold">
          Restaurant Finder
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end className="nav-link-custom">
              Restaurant List
            </Nav.Link>
            <Nav.Link as={NavLink} to="/location-search" className="nav-link-custom">
              Location Search
            </Nav.Link>
            <Nav.Link as={NavLink} to="/image-search" className="nav-link-custom">
              Image Search
            </Nav.Link>
            <Nav.Link as={NavLink} to="/advanced-search" className="nav-link-custom">
              Advanced Search
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
