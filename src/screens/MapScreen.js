import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const mapRef = useRef(null);

  // Tipos de lugares que queremos buscar (en español e inglés para OSM)
  const placeTypes = [
    { query: 'gimnasio', icon: 'barbell', color: '#6C5CE7' },
    { query: 'parque', icon: 'leaf', color: '#00E676' },
    { query: 'cancha deportiva', icon: 'football', color: '#FFD600' },
    { query: 'pista de atletismo', icon: 'walk', color: '#00D2FF' },
    { query: 'fitness', icon: 'fitness', color: '#FF5252' },
  ];

  useEffect(() => {
    (async () => {
      // Solicitar permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      // Obtener ubicación actual
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Buscar lugares cercanos
      await searchNearbyPlaces(currentLocation.coords.latitude, currentLocation.coords.longitude);
      
      setLoading(false);
    })();
  }, []);

const searchNearbyPlaces = async (lat, lon) => {
  setLoading(true);
  let allPlaces = [];
  
  for (const type of placeTypes) {
    try {
      // Construir URL correctamente codificada
      const query = encodeURIComponent(`${type.query} en Sincelejo`);
      // Usar un bounding box aproximado de Sincelejo para limitar resultados
      const viewbox = '-75.5,9.45,-75.3,9.25'; // Ajusta según necesidad
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=15&bounded=1&viewbox=${viewbox}&accept-language=es`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SportFitApp/1.0 (contacto@sportfit.com)', // Obligatorio para Nominatim
          'Accept-Language': 'es',
        }
      });
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const formattedPlaces = data.map(item => ({
          id: item.place_id,
          name: item.display_name.split(',')[0],
          address: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          type: type.query,
          icon: type.icon,
          color: type.color,
        }));
        allPlaces = [...allPlaces, ...formattedPlaces];
      }
    } catch (error) {
      console.error(`Error buscando ${type.query}:`, error);
    }
    
    // Pausa entre solicitudes para no exceder 1 req/segundo
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Eliminar duplicados por nombre
  const uniquePlaces = allPlaces.filter((place, index, self) => 
    index === self.findIndex(p => p.name === place.name)
  );
  
  setPlaces(uniquePlaces);
  setLoading(false);
};

  const focusOnPlace = (place) => {
    setSelectedPlace(place);
    mapRef.current?.animateToRegion({
      latitude: place.lat,
      longitude: place.lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.loadingText}>Buscando lugares para entrenar...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="sad-outline" size={50} color="#FF5252" />
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: location?.coords.latitude || 9.3375,
          longitude: location?.coords.longitude || -75.515,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Marcadores de lugares */}
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.lat, longitude: place.lon }}
            title={place.name}
            description={place.type}
            onPress={() => focusOnPlace(place)}
          >
            <View style={[styles.marker, { backgroundColor: place.color }]}>
              <Ionicons name={place.icon} size={16} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Lista de lugares cercanos */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
         Lugares cerca de ti ({places.length})
        </Text>
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.placeCard, { borderLeftColor: item.color }]}
              onPress={() => focusOnPlace(item)}
            >
              <View style={[styles.cardIcon, { backgroundColor: item.color + '22' }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.placeName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.placeType}>{item.type}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08080B',
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#08080B',
    padding: 20,
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#8B8BA3',
    marginTop: 12,
    textAlign: 'center',
  },
  listContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  listTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: 'black',
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 220,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  placeName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeType: {
    color: '#8B8BA3',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default MapScreen;