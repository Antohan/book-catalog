import * as React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

import AuthContext from '../../context/auth-context';

const mainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>EasyEvent</h1>
          </div>
          <div className="main-navigation__items">
            <ul>
              {!context.token &&
                (<li><NavLink to="/auth">Authenticate</NavLink></li>)
              }
              <li><NavLink to="/events">Events</NavLink></li>
              {context.token &&
                (<li><NavLink to="/bookings">Bookings</NavLink></li>)
              }
            </ul>
          </div>
        </header>
      );
    }}
  </AuthContext.Consumer>
);


export default mainNavigation;