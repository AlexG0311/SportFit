import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const auth = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <View className="flex-1 bg-[#08080B] p-4">
      <View className="items-center mb-6">
        <Image source={{ uri: auth.user?.avatar || 'https://placehold.co/100x100' }} style={{ width: 100, height: 100, borderRadius: 9999 }} />
        <Text className="text-white text-xl font-bold mt-3">{auth.user?.name || 'Usuario'}</Text>
      </View>

      <Card className="mb-4">
        <Text className="text-[#8B8BA3]">Altura: {auth.user?.height || '—'}</Text>
        <Text className="text-[#8B8BA3]">Peso: {auth.user?.weight || '—'}</Text>
        <Text className="text-[#8B8BA3]">Edad: {auth.user?.age || '—'}</Text>
      </Card>

      <Button title="Editar" onPress={() => setEditing(!editing)} />
      <View className="mt-3">
        <Button title="Cerrar sesión" variant="secondary" onPress={auth.logout} />
      </View>
    </View>
  );
};

export default ProfileScreen;
