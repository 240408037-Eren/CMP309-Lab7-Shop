import { useReducer, useEffect, useRef } from 'react';

const initialState = {
  loading: true,
  error: null,
  data: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        loading: false,
        error: null,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        loading: false,
        error: action.payload,
        data: null,
      };
    default:
      return state;
  }
}

/**
 * Custom hook wrapping async fetch pattern with AbortController and useReducer.
 * Cancels pending requests on dependency change or unmount.
 */
export function useFetch(fetchFn, deps = []) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  useEffect(() => {
    const controller = new AbortController();

    async function executeFetch() {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await fetchFnRef.current(controller.signal);
        dispatch({ type: 'FETCH_SUCCESS', payload: result });
      } catch (err) {
        if (err.name === 'AbortError') {
          // Request was cancelled intentionally; ignore
          return;
        }
        dispatch({
          type: 'FETCH_FAILURE',
          payload: err.message || 'An unexpected error occurred',
        });
      }
    }

    executeFetch();

    return () => {
      controller.abort();
    };
  }, deps);

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
  };
}
