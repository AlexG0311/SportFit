import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_NAMES } from '../utils/constants';

const LoginScreen = () => {
  const { control, handleSubmit } = useForm();
  const auth = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await auth.login(data.email, data.password);
    } catch (err) {
      // error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#08080B] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <Text className="text-white text-2xl font-bold mb-2">Bienvenido</Text>
        <Text className="text-[#8B8BA3] mb-4">Inicia sesión para continuar</Text>

        <Controller
          control={control}
          name="email"
          defaultValue=""
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Email" value={value} onChangeText={onChange} keyboardType="email-address" />
          )}
        />

        <Controller
          control={control}
          name="password"
          defaultValue=""
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Contraseña" value={value} onChangeText={onChange} secureTextEntry />
          )}
        />

        <View className="mt-4">
          <Button title="Iniciar sesión" onPress={handleSubmit(onSubmit)} loading={loading} />
        </View>

        <View className="mt-3 flex-row justify-center">
          <Text className="text-[#8B8BA3]">¿No tienes cuenta?</Text>
          <Text className="text-white ml-2" onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER)}>
            Regístrate
          </Text>
        </View>
      </Card>
    </View>
  );
};

export default LoginScreen;
