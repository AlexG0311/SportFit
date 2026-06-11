import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SomatotypeQuizScreen from '../screens/SomatotypeQuizScreen';
import SomatotypeResultScreen from '../screens/SomatotypeResultScreen';
import RecommendationScreen from '../screens/RecommendationScreen';
import { SCREEN_NAMES } from '../utils/constants';

const Stack = createNativeStackNavigator();

export default function QuizStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cuestionario" component={SomatotypeQuizScreen} />
      <Stack.Screen name={SCREEN_NAMES.SOMATOTYPE_RESULT} component={SomatotypeResultScreen} />
      <Stack.Screen name={SCREEN_NAMES.RECOMMENDATION} component={RecommendationScreen} />
    </Stack.Navigator>
  );
}
