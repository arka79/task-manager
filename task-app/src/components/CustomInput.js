import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  multiline = false,
  numberOfLines = 1,
  showLabel = false,
  label = '',
  error = null,
  onFocus = null,
  onBlur = null
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {showLabel && label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused, error && styles.inputWrapperError]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput
          ]}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => {
            setIsFocused(true);
            if (onFocus) onFocus();
          }}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur();
          }}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 15,
    justifyContent: 'center',
    minHeight: 50
  },
  inputWrapperFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#FFF'
  },
  inputWrapperError: {
    borderColor: '#E63946',
    backgroundColor: 'rgba(230, 57, 70, 0.05)'
  },
  input: {
    color: '#1E293B',
    fontSize: 16,
    padding: 0
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingVertical: 12
  },
  errorText: {
    color: '#E63946',
    fontSize: 12,
    marginTop: 6
  }
});
