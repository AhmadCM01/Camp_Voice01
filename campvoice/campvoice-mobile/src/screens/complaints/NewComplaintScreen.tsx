import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import api from '../../lib/api';
import { useNavigation } from '@react-navigation/native';

import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

const CATEGORY_OPTIONS = [
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Academic', value: 'Academic' },
  { label: 'Hostel/Accommodation', value: 'Hostel' },
  { label: 'Security', value: 'Security' },
  { label: 'Other', value: 'Other' },
] as const;

export default function NewComplaintScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleSubmit = async () => {
    if (!title || !description || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/complaints/', {
        title,
        description,
        category,
        location,
      });
      Alert.alert('Success', 'Complaint submitted successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
    } catch (err: any) {
      Alert.alert('Submission Failed', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Submit an Issue</Text>
          <Text style={styles.subtitle}>Help us improve campus utility and life.</Text>

          <Text style={styles.label}>Issue Title *</Text>
          <TextInput 
            style={styles.input}
            placeholder="E.g., Broken pipe in Block A"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Category *</Text>
          {Platform.OS === 'web' ? (
            <View style={styles.webCategoryGrid}>
              {CATEGORY_OPTIONS.map((opt) => {
                const active = category === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.webCategoryChip, active && styles.webCategoryChipActive]}
                    onPress={() => setCategory(opt.value)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.webCategoryChipText, active && styles.webCategoryChipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              {(() => {
                const { Picker } = require('@react-native-picker/picker');
                return (
                  <Picker
                    selectedValue={category}
                    onValueChange={(itemValue: string) => setCategory(itemValue)}
                    style={styles.picker}
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                    ))}
                  </Picker>
                );
              })()}
            </View>
          )}

          <Text style={styles.label}>Location (Optional)</Text>
          <TextInput 
            style={styles.input}
            placeholder="E.g., Ribadu Hostel, Room 102"
            placeholderTextColor={COLORS.textSecondary}
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Detailed Description *</Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="Explain the issue in detail..."
            placeholderTextColor={COLORS.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit} 
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textOnPrimary} />
            ) : (
              <Text style={styles.buttonText}>Submit Complaint</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
    marginTop: 4,
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: COLORS.background,
    color: COLORS.textPrimary,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  picker: {
    color: COLORS.textPrimary,
  },
  webCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  webCategoryChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  webCategoryChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  webCategoryChipText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  webCategoryChipTextActive: {
    color: COLORS.primary,
  },
  textArea: {
    height: 150,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: COLORS.textOnPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
