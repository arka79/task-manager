import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

export default function AppNavigator({ token, setToken, user, setUser }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        // Authorized Screens
        <Stack.Screen name="Dashboard">
          {(props) => <DashboardScreen {...props} setToken={setToken} user={user} />}
        </Stack.Screen>
      ) : (
        // Auth Screens
        <>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setToken={setToken} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => <RegisterScreen {...props} setToken={setToken} setUser={setUser} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}