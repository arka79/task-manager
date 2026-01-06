import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('userToken');
      const storedName = await SecureStore.getItemAsync('userName');
      const storedEmail = await SecureStore.getItemAsync('userEmail');

      if (storedToken) {
        setToken(storedToken);
        setUser({
          id: storedToken,
          name: storedName,
          email: storedEmail
        });
      }
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator
        token={token}
        setToken={setToken}
        user={user}
        setUser={setUser}
      />
    </NavigationContainer>
  );
}