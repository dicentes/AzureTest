import React from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { useAuth } from './Login';

export const NavMenu = () => {
  const { authenticated, username } = useAuth();
  const [collapsed, setCollapsed] = React.useState(true);

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3 my-custom-navbar-color" container light>
        <NavbarBrand tag={Link} to="/">Brocountability</NavbarBrand>
        {authenticated && <div className="ml-auto mr-2 text-white">Hi, {username}!</div>}
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
          <ul className="navbar-nav flex-grow">
            <NavItem>
            <NavLink tag={Link} className="btn btn-primary" to="/">Home</NavLink>
              
            </NavItem>
            <NavItem>
            <NavLink tag={Link} className="btn btn-primary" to="/dashboard">Dashboard</NavLink>
            </NavItem>
            {!authenticated ? (
              <>
                <NavItem>
                  <NavLink tag={Link} className="btn btn-primary" to="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="btn btn-primary" to="/register">Register</NavLink>
                </NavItem>
              </>
            ) : null}
            {authenticated ? (
              <>
                <NavItem>
                  
                  <NavLink tag={Link} className="btn btn-primary" to="/addgoals">Add Goal</NavLink>
                </NavItem>
                <NavItem>
                <NavLink tag={Link} className="btn btn-primary" to="/logout">Logout</NavLink>
                </NavItem>
              </>
            ) : null}
          </ul>
        </Collapse>
      </Navbar>
    </header>
  );
};
