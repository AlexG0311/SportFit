import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { getRecommendations } from '../services/recommendationService';

const RecommendationItem = ({ item }) => (
  <Card className="mb-3 flex-row items-center">
    <Image source={{ uri: item.image }} style={{ width: 70, height: 70, borderRadius: 10, marginRight: 12 }} />
    <View>
      <Text className="text-white font-semibold">{item.name}</Text>
      <Text className="text-[#8B8BA3]">{item.description}</Text>
    </View>
  </Card>
);

const RecommendationScreen = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecommendations();
        setList(data || []);
      } catch (err) {
      }
    })();
  }, []);

  return (
    <View className="flex-1 bg-[#08080B] p-4">
      <Text className="text-white text-2xl font-bold mb-4">Recomendaciones</Text>
      <FlatList data={list} keyExtractor={(i) => i.id?.toString() || i.name} renderItem={({ item }) => <RecommendationItem item={item} />} />
    </View>
  );
};

export default RecommendationScreen;
