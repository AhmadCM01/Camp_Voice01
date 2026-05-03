import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import api from '../../lib/api';
import { COLORS, SPACING } from '../../constants/Theme';

type DirectoryEntry = { faculty: string; departments: string[] };

export default function RegisterScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [dirLoading, setDirLoading] = useState(true);
  const [directory, setDirectory] = useState<DirectoryEntry[]>([]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [matricNo, setMatricNo] = useState('');
  const [level, setLevel] = useState('');
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const Picker = useMemo(() => {
    if (Platform.OS === 'web') return null;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@react-native-picker/picker').Picker as any;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/meta/abu-directory');
        if (!cancelled) setDirectory(res.data.items || []);
      } catch {
      } finally {
        if (!cancelled) setDirLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const departments = useMemo(() => {
    const entry = directory.find((d) => d.faculty === faculty);
    return entry?.departments || [];
  }, [directory, faculty]);

  const submit = async () => {
    if (!fullName || !email || !matricNo || !level || !faculty || !department || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        full_name: fullName,
        email,
        matric_no: matricNo,
        level,
        faculty,
        department,
        password,
      });
      Alert.alert('Success', 'Registration successful. Please log in.');
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Registration Failed', err?.message || 'Please check your details and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register to submit and track complaints</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Matric Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="U21CO1234"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            value={matricNo}
            onChangeText={setMatricNo}
          />

          <Text style={styles.label}>Level *</Text>
          {Picker ? (
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={level}
                onValueChange={(v: string) => setLevel(v)}
                style={styles.picker}
              >
                <Picker.Item label="Select level" value="" />
                <Picker.Item label="100" value="100" />
                <Picker.Item label="200" value="200" />
                <Picker.Item label="300" value="300" />
                <Picker.Item label="400" value="400" />
                <Picker.Item label="500" value="500" />
              </Picker>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="100 / 200 / 300..."
              placeholderTextColor="#9CA3AF"
              value={level}
              onChangeText={setLevel}
            />
          )}

          <Text style={styles.label}>Faculty *</Text>
          {dirLoading ? (
            <View style={styles.inlineLoading}>
              <ActivityIndicator color={COLORS.primary} />
              <Text style={styles.inlineLoadingText}>Loading faculties…</Text>
            </View>
          ) : Picker && directory.length > 0 ? (
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={faculty}
                onValueChange={(v: string) => {
                  setFaculty(v);
                  setDepartment('');
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select faculty" value="" />
                {directory.map((d) => (
                  <Picker.Item key={d.faculty} label={d.faculty} value={d.faculty} />
                ))}
              </Picker>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Faculty"
              placeholderTextColor="#9CA3AF"
              value={faculty}
              onChangeText={setFaculty}
            />
          )}

          <Text style={styles.label}>Department *</Text>
          {Picker && departments.length > 0 ? (
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={department}
                onValueChange={(v: string) => setDepartment(v)}
                style={styles.picker}
                enabled={!!faculty}
              >
                <Picker.Item label={faculty ? 'Select department' : 'Select faculty first'} value="" />
                {departments.map((dep) => (
                  <Picker.Item key={dep} label={dep} value={dep} />
                ))}
              </Picker>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Department"
              placeholderTextColor="#9CA3AF"
              value={department}
              onChangeText={setDepartment}
            />
          )}

          <Text style={styles.label}>Password *</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.passwordToggle} activeOpacity={0.7}>
              {showPassword ? <EyeOff color={COLORS.textSecondary} size={20} /> : <Eye color={COLORS.textSecondary} size={20} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password *</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)} style={styles.passwordToggle} activeOpacity={0.7}>
              {showConfirmPassword ? <EyeOff color={COLORS.textSecondary} size={20} /> : <Eye color={COLORS.textSecondary} size={20} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={submit} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color={COLORS.textOnPrimary} /> : <Text style={styles.buttonText}>Create Account</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkBtn} activeOpacity={0.85}>
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 18,
    backgroundColor: COLORS.background,
    color: COLORS.textPrimary,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    marginBottom: 18,
  },
  picker: {
    height: 48,
  },
  inlineLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  inlineLoadingText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  passwordRow: {
    position: 'relative',
    marginBottom: 18,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 46,
  },
  passwordToggle: {
    position: 'absolute',
    right: 14,
    top: 14,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  linkBtn: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

