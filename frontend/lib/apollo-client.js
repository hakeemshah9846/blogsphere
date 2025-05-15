'use client'

// frontend/lib/apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import fetch from 'isomorphic-unfetch'
import { useMemo } from 'react';

let apolloClient = null

function createIsomorphLink() {
  return new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'same-origin',
    // Remove isomorphic-unfetch and use native fetch
    fetch: (...args) => fetch(...args)
  });
}
function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()
  if (initialState) _apolloClient.cache.restore(initialState)
  if (typeof window === 'undefined') return _apolloClient
  apolloClient ??= _apolloClient
  return apolloClient
}

export function useApollo(initialState) {
  return useMemo(() => initializeApollo(initialState), [initialState])
}