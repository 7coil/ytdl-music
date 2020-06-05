import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { ReduxProvider } from './components/ReduxProvider';

const div = document.getElementById('div');
ReactDOM.render(<ReduxProvider><App /></ReduxProvider>, div)
