import React from 'react';
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import HomePage from './components/home';
import PageComponent from './components/list';
function App() {
  return (
  <div className="App">
    <BrowserRouter>
    <Route path="/" exact={true} component={HomePage} />
    <Route path="/stats" exact={true} component={PageComponent} />
     </BrowserRouter>
  </div>

  );
}

export default App;
