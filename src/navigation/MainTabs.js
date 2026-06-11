import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlannerScreen from '../screens/PlannerScreen';
import { SCREEN_NAMES } from '../utils/constants';
import QuizStack from './QuizStack';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
  [SCREEN_NAMES.HOME]: { icon: 'home', iconOutline: 'home-outline', label: 'Inicio' },
  [SCREEN_NAMES.QUIZ]: { icon: 'clipboard', iconOutline: 'clipboard-outline', label: 'Quiz' },
  [SCREEN_NAMES.PLANNER]: { icon: 'calendar', iconOutline: 'calendar-outline', label: 'Rutina' },
  [SCREEN_NAMES.CHAT]: { icon: 'chatbubble', iconOutline: 'chatbubble-outline', label: 'Coach' },
  [SCREEN_NAMES.PROFILE]: { icon: 'person', iconOutline: 'person-outline', label: 'Perfil' },
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const config = TAB_CONFIG[route.name] || TAB_CONFIG[SCREEN_NAMES.HOME];
        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelStyle: { fontSize: 10, marginBottom: 6 },
          tabBarActiveTintColor: '#6C5CE7',
          tabBarInactiveTintColor: '#8B8BA3',
          tabBarStyle: {
            backgroundColor: '#0F0F14',
            borderTopColor: '#1E1E29',
            height: 64,
            paddingTop: 6,
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? config.icon : config.iconOutline} size={22} color={color} />
          ),
          tabBarLabel: config.label,
        };
      }}
    >
      <Tab.Screen name={SCREEN_NAMES.HOME} component={HomeScreen} />
      <Tab.Screen name={SCREEN_NAMES.QUIZ} component={QuizStack} />
      <Tab.Screen name={SCREEN_NAMES.PLANNER} component={PlannerScreen} />
      <Tab.Screen name={SCREEN_NAMES.CHAT} component={ChatScreen} />
      <Tab.Screen name={SCREEN_NAMES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
}
