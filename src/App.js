// Import React stuff
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Import components
import { Page } from './components/base/Page';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';

// Import styles and assets
import './scss/app.scss';

class App extends Page {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <Main />
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
