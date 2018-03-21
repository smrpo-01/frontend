// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter } from 'react-router-dom';

// Main scss file
import '../scss/index.scss';

// Components
import { ApolloProvider } from 'react-apollo';

// Application component
import App from 'grommet/components/App';
import MainApp from './App';

// Define Apollo client
const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.example.com/graphql' }),
  cache: new InMemoryCache()
});

// Find element to render application
const element = document.getElementById('content');

// Render application
ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App centered={false} >
        <MainApp />
      </App>
    </BrowserRouter>
  </ApolloProvider>,
  element
);

// Remove loading screen
document.body.classList.remove('loading');
