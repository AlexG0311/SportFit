import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { sendChatMessage } from '../services/coachService';

const CHAT_STORAGE_KEY = '@chat_history';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <View style={{ flexDirection: 'row', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
      {!isUser && (
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#6C5CE7', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
          <Ionicons name="fitness" size={18} color="white" />
        </View>
      )}
      <View style={{ maxWidth: '80%', backgroundColor: isUser ? '#6C5CE7' : '#1E1E2E', padding: 12, borderRadius: 16, borderBottomRightRadius: isUser ? 4 : 16, borderBottomLeftRadius: isUser ? 16 : 4 }}>
        <Text style={{ color: 'white', fontSize: 15, lineHeight: 22 }}>{message.content}</Text>
      </View>
    </View>
  );
};

const ChatScreen = () => {
  const { user } = useAuth();
  const { unlockAchievement } = useGamification();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollViewRef = useRef();

  // Cargar historial al montar el componente
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Guardar historial cada vez que cambian los mensajes
  useEffect(() => {
    if (!isInitializing && messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
      } else {
        // Mensaje de bienvenida inicial
        const welcomeMessage = { 
          role: 'model', 
          content: `¡Hola ${user?.name?.split(' ')[0] || 'Atleta'}! Soy tu AI Coach personal. ${user?.somatotype ? `He notado que tu somatotipo es ${user.somatotype}. ` : ''}¿En qué puedo ayudarte hoy con tu entrenamiento o nutrición?` 
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Fallback: mensaje de bienvenida
      setMessages([{ 
        role: 'model', 
        content: `¡Hola ${user?.name?.split(' ')[0] || 'Atleta'}! Soy tu AI Coach. ¿En qué puedo ayudarte?` 
      }]);
    } finally {
      setIsInitializing(false);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Borrar conversación',
      '¿Estás seguro de que quieres eliminar todo el historial del chat?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Borrar', 
          style: 'destructive',
          onPress: async () => {
            const welcomeMessage = { 
              role: 'model', 
              content: `¡Hola de nuevo! He borrado nuestra conversación anterior. ¿En qué puedo ayudarte hoy?` 
            };
            setMessages([welcomeMessage]);
            await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
          }
        }
      ]
    );
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    // Desbloquear logro al enviar el primer mensaje (solo si es el primer mensaje del usuario)
    if (messages.filter(m => m.role === 'user').length === 0) {
      unlockAchievement('coach_chat');
    }

    const userMessage = { role: 'user', content: inputText.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        newMessages,
        user?.somatotype,
        user?.height,
        user?.weight,
        user?.age,
        user?.gender
      );
      
      if (response.success) {
        const assistantMessage = { role: 'model', content: response.message };
        setMessages([...newMessages, assistantMessage]);
      } else {
        const errorMessage = { role: 'model', content: 'Lo siento, tuve un problema al procesar tu mensaje. ¿Puedes intentarlo de nuevo?' };
        setMessages([...newMessages, errorMessage]);
      }
    } catch (error) {
      const errorMessage = { role: 'model', content: 'Hubo un error de conexión con el servidor.' };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#08080B', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={{ color: 'white', marginTop: 16 }}>Cargando conversación...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#08080B' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header con botón para borrar historial */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 20, backgroundColor: '#15151A', borderBottomWidth: 1, borderBottomColor: '#1E1E2E' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#6C5CE7', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name="hardware-chip" size={20} color="white" />
          </View>
          <View>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>AI Coach</Text>
            <Text style={{ color: '#00E676', fontSize: 12, fontWeight: '600' }}>• En línea</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearHistory} style={{ padding: 8 }}>
          <Ionicons name="trash-outline" size={22} color="#FF5252" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }} 
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
        {isLoading && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 16 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#6C5CE7', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
              <Ionicons name="fitness" size={18} color="white" />
            </View>
            <View style={{ backgroundColor: '#1E1E2E', padding: 12, borderRadius: 16, borderBottomLeftRadius: 4 }}>
              <ActivityIndicator size="small" color="#6C5CE7" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Box */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#15151A', borderTopWidth: 1, borderTopColor: '#1E1E2E' }}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Pregúntale a tu Coach..."
          placeholderTextColor="#8B8BA3"
          style={{ flex: 1, backgroundColor: '#1E1E2E', color: 'white', borderRadius: 20, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, minHeight: 40, maxHeight: 100 }}
          multiline
        />
        <TouchableOpacity 
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: inputText.trim() && !isLoading ? '#6C5CE7' : '#2A2A35', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}
        >
          <Ionicons name="send" size={20} color={inputText.trim() && !isLoading ? "white" : "#8B8BA3"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;