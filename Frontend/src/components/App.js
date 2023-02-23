import React from 'react';
import ServersMain from './serversMainTry'
import '../components/App.css';
import logo from '../assets/mmtlogo.png';

function App() {
  return (
    <div>
      <div className="appheader">
        <img src={logo} />
        <u><h2>Holidays Servers Detail</h2></u>
      </div>
      <ServersMain />
    </div>
  );
}

export default App;
