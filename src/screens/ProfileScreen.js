import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const auth = useAuth();
  const [editing, setEditing] = useState(false);
  const [tempGender, setTempGender] = useState(auth.user?.gender || 'Male');

  const handleSave = () => {
    auth.updateUser({ gender: tempGender });
    setEditing(false);
  };

  return (
    <View className="flex-1 bg-[#08080B] p-4">
      <View className="items-center mb-6">
        <Image
          source={{ uri: auth.user?.avatar || 'https://placehold.co/100x100' }}
          style={{ width: 100, height: 100, borderRadius: 9999 }}
        />
        <Text className="text-white text-xl font-bold mt-3">{auth.user?.name || 'Usuario'}</Text>
      </View>

      <Card className="mb-4">
        <Text className="text-[#8B8BA3]">Altura: {auth.user?.height || '—'} cm</Text>
        <Text className="text-[#8B8BA3]">Peso: {auth.user?.weight || '—'} kg</Text>
        <Text className="text-[#8B8BA3]">Edad: {auth.user?.age || '—'}</Text>

        {editing ? (
          <>
            <Text className="text-white mt-2 mb-1">Género</Text>
            <View
              style={{
                backgroundColor: '#1C1C1E',
                borderRadius: 8,
                overflow: 'hidden',
                marginBottom: 12,
              }}
            >
              <Picker
                selectedValue={tempGender}
                onValueChange={setTempGender}
                style={{ color: 'white' }}
                dropdownIconColor="white"
              >
                <Picker.Item label="Hombre" value="Male" />
                <Picker.Item label="Mujer" value="Female" />
              </Picker>
            </View>
            <View className="flex-row justify-between">
              <Button title="Cancelar" variant="secondary" onPress={() => setEditing(false)} />
              <Button title="Guardar" onPress={handleSave} />
            </View>
          </>
        ) : (
          <>
            <Text className="text-[#8B8BA3]">Género: {auth.user?.gender === 'Male' ? 'Hombre' : 'Mujer'}</Text>
            <Button title="Editar" onPress={() => setEditing(true)} />
          </>
        )}
      </Card>

      <View className="mt-3">
        <Button title="Cerrar sesión" variant="secondary" onPress={auth.logout} />
      </View>
    </View>
  );
};

export default ProfileScreen;