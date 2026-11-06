import { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext(null);

const initialAuthState = {
  user: null, // null or { username: string }
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGGED_IN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGGED_OUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const loginUser = (user) => {
    dispatch({ type: 'LOGGED_IN', payload: user });
  };

  const logoutUser = () => {
    dispatch({ type: 'LOGGED_OUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loginUser,
        logoutUser,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
