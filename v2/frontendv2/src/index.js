import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRoutes from '../src/utils/appRoutes';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AppRoutes />, document.getElementById('root'));
registerServiceWorker();
