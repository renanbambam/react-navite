/* eslint-disable @typescript-eslint/no-unused-vars */
// Cabecalho.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface CabecalhoProps {
  onMenuToggle: () => void;
}

const Cabecalho: React.FC<CabecalhoProps> = ({ onMenuToggle }) => {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Meu Aplicativo</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
});

export default Cabecalho;
