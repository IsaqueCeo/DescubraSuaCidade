import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { fetchTouristSpots } from './src/services/touristAPI';
import { db } from './src/services/firebaseConfig';

export default function App() {
  const [touristSpots, setTouristSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } else {
      alert('Permissão de localização negada.');
    }
  };

  const loadTouristSpots = async () => {
    setLoading(true);
    const coords = await getLocation();
    if (coords) {
      const spots = await fetchTouristSpots(coords.latitude, coords.longitude);
      setTouristSpots(spots);
    }
    setLoading(false);
  };

  // Função para registrar visita no Firebase
  const registerVisit = async (spot) => {
    try {
      await db.collection('visits').add({
        name: spot.name,
        description: spot.description,
        date: new Date(),
      });
      alert('Visita registrada com sucesso!');
    } catch (error) {
      alert('Erro ao registrar visita:', error.message);
    }
  };

  useEffect(() => {
    Notifications.requestPermissionsAsync();
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Descubra novos lugares!",
        body: "Que tal explorar um novo ponto turístico hoje?",
      },
      trigger: null,
    });
  }, []);

  useEffect(() => {
    loadTouristSpots();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Descubra Sua Cidade</Text>
      {loading ? (
        <Text>Carregando pontos turísticos...</Text>
      ) : (
        <FlatList
          data={touristSpots}
          keyExtractor={(item) => item.fsq_id}
          renderItem={({ item }) => (
            <View style={styles.spotContainer}>
              <Text style={styles.spotName}>{item.name}</Text>
              <Text style={styles.spotDescription}>{item.description || 'Descrição não disponível'}</Text>
              <Button title="Registrar Visita" onPress={() => registerVisit(item)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  spotContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spotDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
});
