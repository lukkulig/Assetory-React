import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import {BrowserRouter} from 'react-router-dom'
import './index.scss';

ReactDOM.render((
        <BrowserRouter>
            <App/>
        </BrowserRouter>)
    , document.getElementById('root'));
