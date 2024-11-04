import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingModal = ({ visible }) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
});

export default LoadingModal;