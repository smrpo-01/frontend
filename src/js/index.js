// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter } from 'react-router-dom';

// Main scss file
import '../scss/index.scss';

// Components
import { ApolloProvider } from 'react-apollo';

// Application component
import App from 'grommet/components/App';
import MainApp from './App';

const uri = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/graphiql' : '/graphiql';

const httpLink = createHttpLink({
  uri,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // eslint-disable-next-line no-undef
  const token = sessionStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : '',
    }
  };
});


// Define apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
