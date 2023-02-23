import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { unregister } from './serviceWorker';

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// serviceWorker.unregister();
unregister();