import React from 'react';
import { NavLink } from 'react-router-dom';

import { Page } from './base/Page';

export class Header extends Page {
  render() {
    return (
      <header>
        <ul>
          <li>
            <NavLink to="/home" activeClassName="selected">Home</NavLink>
          </li>
          <li>
            <NavLink to="/news" activeClassName="selected">News</NavLink>
          </li>
          <li>
            <NavLink to="/guidelines" activeClassName="selected">Guidelines</NavLink>
          </li>
          <li>
            <NavLink to="/documentation" activeClassName="selected">Documentation</NavLink>
          </li>
        </ul>
      </header>
    );
  }
}
