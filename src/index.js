/* global document */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './store';
import AppRoot from './AppRoot';

const store = configureStore();

ReactDOM.render(<AppRoot store={store} />, document.getElementById('app'));
