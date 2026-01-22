import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { DevicesScreen } from './screens/DevicesScreen';
import { ConnectionScreen } from './screens/ConnectionScreen';
import { AddDeviceModal } from './screens/AddDeviceModal';

// Tab Navigator dla głównej nawigacji
const Tab = createBottomTabNavigator();

const HomeTabs = createBottomTabNavigator({
  screens: {
    Devices: {
      screen: DevicesScreen,
      options: {
        title: 'DEVICES',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="grid-outline" size={size} color={color} />
        ),
        headerShown: false,
      },
    },
    Connection: {
      screen: ConnectionScreen,
      options: {
        title: 'CONNECTION',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="wifi-outline" size={size} color={color} />
        ),
        headerShown: false,
      },
    },
  },
  screenOptions: {
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#8E8E93',
    tabBarStyle: {
      backgroundColor: '#FFFFFF',
      borderTopColor: '#E0E0E0',
      height: 60,
      paddingBottom: 8,
      paddingTop: 8,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500',
    },
  },
});

// Root Stack Navigator dla modalów
const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
    AddDevice: {
      screen: AddDeviceModal,
      options: {
        title: 'New device',
        presentation: 'modal',
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}