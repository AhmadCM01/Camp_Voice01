import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Home, PlusCircle, User, Bell, LogOut } from 'lucide-react-native';
import TabNavigator from './TabNavigator';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/Theme';
import { useAuthStore } from '../store/authStore';

type DrawerParamList = {
  Tabs: { screen?: string } | undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

function getActiveTabName(props: DrawerContentComponentProps): string {
  const root = props.navigation.getState();
  const tabsRoute = root.routes.find((r: any) => r.name === 'Tabs');
  const tabsState = (tabsRoute as any)?.state;
  const activeTabRoute = tabsState?.routes?.[tabsState.index ?? 0];
  return activeTabRoute?.name ?? 'Home';
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useAuthStore();
  const activeTabName = getActiveTabName(props);

  const items = useMemo(
    () => [
      { label: 'Dashboard', tab: 'Home', Icon: Home },
      { label: 'Complaints', tab: 'NewComplaint', Icon: PlusCircle },
      { label: 'Profile', tab: 'Profile', Icon: User },
      { label: 'Alerts', tab: 'Notifications', Icon: Bell },
    ],
    []
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
      <View style={styles.drawerHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.full_name || 'User'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email || ''}
          </Text>
        </View>
      </View>

      <View style={styles.drawerSection}>
        {items.map(({ label, tab, Icon }) => {
          const focused = activeTabName === tab;
          return (
            <DrawerItem
              key={tab}
              label={label}
              focused={focused}
              onPress={() => (props.navigation as any).navigate('Tabs', { screen: tab })}
              icon={({ size }) => <Icon size={size} color={focused ? COLORS.primary : COLORS.textSecondary} />}
              activeBackgroundColor={COLORS.surfaceAlt}
              inactiveTintColor={COLORS.textSecondary}
              activeTintColor={COLORS.primary}
              labelStyle={styles.drawerItemLabel}
              style={styles.drawerItem}
            />
          );
        })}
      </View>

      <View style={styles.drawerFooter}>
        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await logout();
          }}
          style={({ pressed }) => [styles.logoutButton, pressed ? styles.logoutPressed : null]}
        >
          <LogOut size={18} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: COLORS.background },
        drawerType: 'front',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Tabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerScroll: {
    paddingVertical: SPACING.md,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    fontSize: 16,
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  drawerSection: {
    paddingTop: SPACING.md,
  },
  drawerItem: {
    marginHorizontal: SPACING.md,
    borderRadius: 12,
  },
  drawerItemLabel: {
    fontWeight: '700',
  },
  drawerFooter: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  logoutPressed: {
    opacity: 0.85,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.danger,
  },
});
