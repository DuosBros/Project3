import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './components/utils/app-routes';

const app = document.getElementById('main');
window.onload = () => {
    ReactDOM.render(<AppRoutes/>, app);
};