import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = () => {
  const { control, handleSubmit } = useForm();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await auth.register(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#08080B] p-6">
      <Card className="mt-10">
        <Text className="text-white text-2xl font-bold mb-2">Crea tu cuenta</Text>
        <Text className="text-[#8B8BA3] mb-4">Completa tus datos para empezar</Text>

        <Controller
          control={control}
          name="name"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Nombre" value={value} onChangeText={onChange} />
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Contraseña"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirmar contraseña"
              value={value}
              onChangeText={onChange}
              secureTextEntry
            />
          )}
        />
        <Controller
          control={control}
          name="height"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Altura (cm)"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />
        <Controller
          control={control}
          name="weight"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Peso (kg)"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />
        <Controller
          control={control}
          name="age"
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Edad"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
            />
          )}
        />

        {/* Selector de género */}
        <Controller
          control={control}
          name="gender"
          defaultValue="Male"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 16 }}>
              <Text className="text-white mb-1">Género</Text>
              <View
                style={{
                  backgroundColor: '#1C1C1E',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={{ color: 'white' }}
                  dropdownIconColor="white"
                >
                  <Picker.Item label="Hombre" value="Male" />
                  <Picker.Item label="Mujer" value="Female" />
                </Picker>
              </View>
            </View>
          )}
        />

        <View className="mt-4">
          <Button title="Registrarme" onPress={handleSubmit(onSubmit)} loading={loading} />
        </View>
      </Card>
    </ScrollView>
  );
};

export default RegisterScreen;