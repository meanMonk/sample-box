import React from 'react';
import logo from './logo.svg';
import './App.css';
import InputSearch from './inputSearch';

function App() {
  return (
    <div className="App">
      <header className="jumbotron d-flex">
        <InputSearch></InputSearch>
      </header>
    </div>
  );
}

export default App;
