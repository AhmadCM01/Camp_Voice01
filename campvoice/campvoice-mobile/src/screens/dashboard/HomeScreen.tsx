import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import { format } from 'date-fns';
import { Clock, CheckCircle, AlertCircle, FileText, PlusCircle } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/Theme';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Resolved'>('All');
  const navigation = useNavigation<any>();

  const fetchComplaints = async () => {
    try {
      setError(null);
      const res = await api.get('/complaints/');
      setComplaints(res.data.items || []);
    } catch (err) {
      setError('Failed to load complaints. Pull to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => (c.status || '').toLowerCase() === 'pending').length;
    const resolved = complaints.filter((c) => (c.status || '').toLowerCase() === 'resolved').length;
    return { total, pending, resolved };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    if (filter === 'All') return complaints;
    const target = filter.toLowerCase();
    return complaints.filter((c) => (c.status || '').toLowerCase() === target);
  }, [complaints, filter]);

  const renderStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <View style={[styles.badge, styles.badgeSuccess]}><Text style={styles.badgeTextSuccess}>Resolved</Text></View>;
      case 'rejected':
        return <View style={[styles.badge, styles.badgeDanger]}><Text style={styles.badgeTextDanger}>Rejected</Text></View>;
      case 'in_progress':
        return <View style={[styles.badge, styles.badgeInfo]}><Text style={styles.badgeTextInfo}>In Progress</Text></View>;
      default:
        return <View style={[styles.badge, styles.badgeWarning]}><Text style={styles.badgeTextWarning}>Pending</Text></View>;
    }
  };

  const renderIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return <CheckCircle color={COLORS.success} size={20} />;
      case 'rejected': return <AlertCircle color={COLORS.danger} size={20} />;
      default: return <Clock color={COLORS.warning} size={20} />;
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          ListHeaderComponent={
            <View style={styles.top}>
              <View style={styles.hero}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.greeting}>Welcome, {user?.full_name?.split(' ')[0] || 'Student'}</Text>
                  <Text style={styles.subtitle}>Here’s an overview of your submitted complaints.</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigation.navigate('NewComplaint')}
                  style={({ pressed }) => [styles.newButton, pressed ? styles.newButtonPressed : null]}
                >
                  <PlusCircle size={16} color={COLORS.textOnPrimary} />
                  <Text style={styles.newButtonText}>New</Text>
                </Pressable>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>Total</Text>
                    <FileText size={16} color={COLORS.textSecondary} />
                  </View>
                  <Text style={styles.statValue}>{stats.total}</Text>
                </View>
                <View style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>Pending</Text>
                    <Clock size={16} color={COLORS.textSecondary} />
                  </View>
                  <Text style={[styles.statValue, { color: COLORS.warning }]}>{stats.pending}</Text>
                </View>
                <View style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>Resolved</Text>
                    <CheckCircle size={16} color={COLORS.textSecondary} />
                  </View>
                  <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.resolved}</Text>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Recent Complaints</Text>
                  <Text style={styles.sectionSubtitle}>View and track status of your complaints.</Text>
                </View>
              </View>

              <View style={styles.filters}>
                {(['All', 'Pending', 'Resolved'] as const).map((key) => {
                  const active = filter === key;
                  return (
                    <Pressable
                      key={key}
                      accessibilityRole="button"
                      onPress={() => setFilter(key)}
                      style={[styles.filterPill, active ? styles.filterPillActive : null]}
                    >
                      <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>{key}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <AlertCircle size={18} color={COLORS.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FileText size={44} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>No complaints yet</Text>
              <Text style={styles.emptyText}>Submit your first complaint and track it here.</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('NewComplaint')}
                style={({ pressed }) => [styles.emptyCta, pressed ? styles.emptyCtaPressed : null]}
              >
                <Text style={styles.emptyCtaText}>Submit a complaint</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  {renderIcon(item.status)}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaChip} numberOfLines={1}>
                        {item.category}
                      </Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.metaText}>{format(new Date(item.created_at), 'MMM d, yyyy')}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rightCol}>
                  {renderStatus(item.status)}
                  <Text style={styles.ticket}>#{String(item.id).substring(0, 6)}</Text>
                </View>
              </View>

              {item.description ? (
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    paddingBottom: SPACING.md,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  greeting: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  newButtonPressed: {
    opacity: 0.9,
  },
  newButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  list: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  statValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  sectionHeader: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.textOnPrimary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: SPACING.md,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.md,
  },
  errorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    marginTop: SPACING.md,
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyCta: {
    marginTop: SPACING.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  emptyCtaPressed: {
    opacity: 0.9,
  },
  emptyCtaText: {
    color: COLORS.textOnPrimary,
    fontSize: 13,
    fontWeight: '900',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 10,
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  metaChip: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
    maxWidth: 140,
  },
  metaDot: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  ticket: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 10,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeWarning: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  badgeTextWarning: { color: COLORS.warning, fontSize: 10, fontWeight: 'bold' },
  badgeSuccess: { backgroundColor: '#E6EBE6', borderColor: COLORS.primary },
  badgeTextSuccess: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  badgeDanger: { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
  badgeTextDanger: { color: COLORS.danger, fontSize: 10, fontWeight: 'bold' },
  badgeInfo: { backgroundColor: '#DBEAFE', borderColor: '#BFDBFE' },
  badgeTextInfo: { color: COLORS.info, fontSize: 10, fontWeight: 'bold' },
});
