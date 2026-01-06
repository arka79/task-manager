import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../config/config';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation, setToken, setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return false;
    }

    if (name.trim().length < 2) {
      Alert.alert('Validation Error', 'Name must be at least 2 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        const userId = String(data.user.id);
        await SecureStore.setItemAsync('userToken', userId);
        await SecureStore.setItemAsync('userName', data.user.name);
        await SecureStore.setItemAsync('userEmail', data.user.email);

        setUser({
          id: userId,
          name: data.user.name,
          email: data.user.email
        });
        setToken(userId);
      } else {
        Alert.alert('Registration Failed', data.message || 'Unable to register');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', 'Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.topSection}>
        <Text style={styles.brandLogo}>✓</Text>
        <Text style={styles.mainTitle}>Get Started</Text>
        <Text style={styles.subTitle}>Create your account to manage tasks</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formArea}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollPadding}
        >
          <View style={styles.card}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder="John Doe"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="words"
              editable={!loading}
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="name@example.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              editable={!loading}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#1E293B', '#0F172A']}
                style={[styles.button, loading && styles.buttonDisabled]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  topSection: {
    height: width * 0.7,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  brandLogo: {
    fontSize: 40,
    color: '#FFF',
    fontWeight: '900'
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 10
  },
  subTitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5
  },
  formArea: {
    flex: 1,
    marginTop: -50
  },
  scrollPadding: {
    paddingHorizontal: 25,
    paddingVertical: 20
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 }
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8
  },
  input: {
    height: 50,
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#1E293B',
    fontSize: 16
  },
  button: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700'
  },
  linkText: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14
  },
  linkBold: {
    color: '#6366F1',
    fontWeight: '700'
  }
});