import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import PlannerScreen from '../screens/PlannerScreen';
import CameraScreen from '../screens/CameraScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { SCREEN_NAMES } from '../utils/constants';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0F0F14',
          borderTopColor: '#1E1E29',
          height: 70,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home-outline';
          if (route.name === SCREEN_NAMES.HOME) iconName = focused ? 'home' : 'home-outline';
          if (route.name === SCREEN_NAMES.PLANNER) iconName = focused ? 'calendar' : 'calendar-outline';
          if (route.name === SCREEN_NAMES.CAMERA) iconName = focused ? 'camera' : 'camera-outline';
          if (route.name === SCREEN_NAMES.CHAT) iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          if (route.name === SCREEN_NAMES.PROFILE) iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={24} color={focused ? '#6C5CE7' : '#8B8BA3'} />;
        },
      })}
    >
      <Tab.Screen name={SCREEN_NAMES.HOME} component={HomeScreen} />
      <Tab.Screen name={SCREEN_NAMES.PLANNER} component={PlannerScreen} />
      <Tab.Screen name={SCREEN_NAMES.CAMERA} component={CameraScreen} />
      <Tab.Screen name={SCREEN_NAMES.CHAT} component={ChatScreen} />
      <Tab.Screen name={SCREEN_NAMES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
}