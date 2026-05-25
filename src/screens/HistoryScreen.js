import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Card from '../components/common/Card';
import { getHistory } from '../services/historyService';

const HistoryItem = ({ item }) => (
  <Card className="mb-3">
    <Text className="text-white font-semibold">{new Date(item.date).toLocaleDateString()}</Text>
    <Text className="text-[#8B8BA3] mt-1">{item.result?.somatotype || '—'}</Text>
  </Card>
);

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getHistory();
        setHistory(data || []);
      } catch (err) {
      }
    })();
  }, []);

  return (
    <View className="flex-1 bg-[#08080B] p-4">
      <Text className="text-white text-2xl font-bold mb-4">Historial</Text>
      <FlatList data={history} keyExtractor={(i) => i.id?.toString() || Math.random().toString()} renderItem={({ item }) => <HistoryItem item={item} />} />
    </View>
  );
};

export default HistoryScreen;
