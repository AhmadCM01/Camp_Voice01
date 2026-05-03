import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions } from '@react-navigation/native';
import { Pressable } from 'react-native';
import { Home, PlusCircle, User, Bell, Menu } from 'lucide-react-native';
import HomeScreen from '../screens/dashboard/HomeScreen';
import NewComplaintScreen from '../screens/complaints/NewComplaintScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import NotificationsScreen from '../screens/dashboard/NotificationsScreen';
import { COLORS, SPACING } from '../constants/Theme';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: { paddingBottom: SPACING.sm, height: 64, backgroundColor: COLORS.surface, borderTopColor: COLORS.border },
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: '900' },
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
            hitSlop={12}
            style={{ marginLeft: SPACING.md }}
          >
            <Menu size={22} color={COLORS.primary} />
          </Pressable>
        ),
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          title: 'Dashboard'
        }}
      />
      <Tab.Screen 
        name="NewComplaint" 
        component={NewComplaintScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
          title: 'Complaints',
          headerTitle: 'New Complaint'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          title: 'Profile'
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
          title: 'Alerts'
        }}
      />
    </Tab.Navigator>
  );
}
