import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome5';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  required?: boolean;
}

export function Checkbox({ label, checked, onPress, required }: CheckboxProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <FontAwesome name="check" size={12} color="white" />}
      </View>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF', // Cinza escuro desmarcado
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'white',
  },
  checkboxChecked: {
    borderColor: '#34D399', // Verde Esmeralda (Tailwind emerald-400)
    backgroundColor: '#34D399',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  required: {
    color: '#DC2626',
  },
});