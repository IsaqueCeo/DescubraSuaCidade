import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { fetchTouristSpots } from '../services/touristAPI';
import { db } from '../services/firebaseConfig';
import * as Location from 'expo-location';

const TouristSpotsScreen = () => {
  const [touristSpots, setTouristSpots] = useState([]);
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    } else {
      alert('Permissão de localização negada.');
    }
  };

  const loadTouristSpots = async () => {
    if (location) {
      const spots = await fetchTouristSpots(location.latitude, location.longitude);
      setTouristSpots(spots);
    }
  };

  const registerVisit = async (spot) => {
    try {
      await db.collection('visits').add({
        name: spot.name,
        description: spot.description,
        date: new Date(),
      });
      alert('Visita registrada com sucesso!');
    } catch (error) {
      alert('Erro ao registrar visita: ' + error.message);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      loadTouristSpots();
    }
  }, [location]);

  const renderTouristSpot = ({ item }) => (
    <View style={styles.spotContainer}>
      <Text style={styles.spotName}>{item.name}</Text>
      <Text>{item.description || 'Descrição não disponível'}</Text>
      <Button title="Registrar Visita" onPress={() => registerVisit(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pontos Turísticos Próximos</Text>
      <FlatList
        data={touristSpots}
        keyExtractor={(item) => item.fsq_id.toString()}
        renderItem={renderTouristSpot}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  spotContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default TouristSpotsScreen;
