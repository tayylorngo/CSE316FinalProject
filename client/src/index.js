import './css/style.scss';
import './css/layout.scss';
import React 	from 'react';
import ReactDOM from 'react-dom';
import App 		from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
const cache = new InMemoryCache({

	/*
		The cache object ids are generated using the objectID(a string) instead
		of the number id so that objects are refered to consistently across the
		client and server
	*/
	dataIdFromObject: object => `${object.__typename}:${object._id}`,
	typePolicies: {
		Todolist: {
			fields: {
				items: {
					merge(existing, incoming){
						return incoming
					}
				},
			},
		},
		Query: {
			fields: {
				getAllTodos: {
					merge(existing, incoming){
						return incoming
					}
				}
			}
		}
	},
	addTypename: false
});

// bad hardcoding, localhost port should match port in the backend's .env file
const BACKEND_LOCATION = 'http://localhost:4000/graphql';

const client = new ApolloClient({
	uri: BACKEND_LOCATION,
	connectToDevTools: true,
	// Credentials: include is necessary to pass along the auth cookies with each server request
	credentials: 'include',
	cache: cache,
});





ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ApolloProvider>
  	</React.StrictMode>,
  	document.getElementById('root')
);