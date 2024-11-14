import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../services/firebaseConfig';
import moment from 'moment';

const VisitHistoryScreen = () => {
  const [visitHistory, setVisitHistory] = useState([]);

  const fetchVisitHistory = async () => {
    try {
      const visitsSnapshot = await db.collection('visits').get();
      const visitsData = visitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVisitHistory(visitsData);
    } catch (error) {
      console.error("Erro ao buscar o histórico de visitas:", error);
    }
  };

  useEffect(() => {
    fetchVisitHistory();
  }, []);

  const renderVisitItem = ({ item }) => (
    <View style={styles.visitItem}>
      <Text style={styles.visitName}>{item.name}</Text>
      <Text style={styles.visitDate}>{moment(item.date.toDate()).format('DD/MM/YYYY')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Visitas</Text>
      {visitHistory.length > 0 ? (
        <FlatList
          data={visitHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderVisitItem}
        />
      ) : (
        <Text style={styles.noHistoryText}>Nenhum histórico de visitas disponível.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  visitItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  visitName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  visitDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noHistoryText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default VisitHistoryScreen;
