import React from 'react';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';

import App from './modules/App/App';

import './styles/index.scss';

const AppRoot = ({ store }) => (
  <Provider store={store}>
    <div className="app-root">
      <Helmet
        defaultTitle="Ceditor"
        titleTemplate="%s | Ceditor"
      />
      <App />
    </div>
  </Provider>
);

AppRoot.propTypes = {
  store: React.PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default AppRoot;
