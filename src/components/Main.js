import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Page } from './base/Page';
import { Home } from './Home';

export class Main extends Page {
  render() {
    return (
        <main>
          <Redirect exact from="/" to="/home" />
          <Route path="/home" component={Home} />
        </main>
    );
  }
}
