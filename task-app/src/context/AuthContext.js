import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

const initialState = {
  isLoading: true,
  isSignout: false,
  user: null,
  token: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        isLoading: false,
        isSignout: false,
        user: action.payload?.user || null,
        token: action.payload?.token || null
      };
    case 'SIGN_IN':
      return {
        isLoading: false,
        isSignout: false,
        user: action.payload.user,
        token: action.payload.token
      };
    case 'SIGN_OUT':
      return {
        isLoading: false,
        isSignout: true,
        user: null,
        token: null
      };
    default:
      return state;
  }
}

export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const bootstrap = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const name = await SecureStore.getItemAsync('userName');
      const email = await SecureStore.getItemAsync('userEmail');

      if (token) {
        dispatch({
          type: 'RESTORE_TOKEN',
          payload: {
            token,
            user: { id: token, name, email }
          }
        });
      } else {
        dispatch({
          type: 'RESTORE_TOKEN'
        });
      }
    } catch (error) {
      console.error('Bootstrap error:', error);
      dispatch({
        type: 'RESTORE_TOKEN'
      });
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const sign_in = useCallback(async (credentials) => {
    try {
      const response = await fetch(`${process.env.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const userId = String(data.user.id);

      await SecureStore.setItemAsync('userToken', userId);
      await SecureStore.setItemAsync('userName', data.user.name);
      await SecureStore.setItemAsync('userEmail', data.user.email);

      dispatch({
        type: 'SIGN_IN',
        payload: {
          token: userId,
          user: data.user
        }
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const sign_up = useCallback(async (userData) => {
    try {
      const response = await fetch(`${process.env.API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      const userId = String(data.user.id);

      await SecureStore.setItemAsync('userToken', userId);
      await SecureStore.setItemAsync('userName', data.user.name);
      await SecureStore.setItemAsync('userEmail', data.user.email);

      dispatch({
        type: 'SIGN_IN',
        payload: {
          token: userId,
          user: data.user
        }
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const sign_out = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userName');
      await SecureStore.deleteItemAsync('userEmail');

      dispatch({
        type: 'SIGN_OUT'
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        sign_in,
        sign_up,
        sign_out,
        bootstrap
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
