/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect } from 'react';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { ModalProvider, useModal } from '../components/context/ModalContext';
import MenuOffCanvas from '../components/MenuOffCanvas';
import DetalheCategoria from '@/components/DetalheCategoriaModal';
import ModalWrapper from '../components/ModalWrapper';
import FormularioCategoria from '../components/FormularioCategoria';
import useDatabase from '../hooks/useDataBase'; // Importa o hook useDatabase

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors[colorScheme].background,
      primary: Colors[colorScheme].acoes,
      text: Colors[colorScheme].textoPrimario,
      card: Colors[colorScheme].fundoCard,
      border: Colors[colorScheme].sombra,
      notification: Colors[colorScheme].aviso,
    },
  };

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Chama o hook useDatabase
  const { loading, error, addData, fetchData, updateData, deleteData } = useDatabase();

  useEffect(() => {
    const initializeDatabase = async () => {
      // Aqui você pode buscar dados iniciais ou adicionar dados padrão
      
    };

    initializeDatabase();
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ModalProvider>
      <ThemeProvider value={theme}>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <MenuWrapper />
          </View>
        </SafeAreaView>
      </ThemeProvider>
    </ModalProvider>
  );
}

function MenuWrapper() {
  const { modalContent, closeModal } = useModal();

  return (
    <ModalWrapper
      visible={!!modalContent}
      onClose={closeModal}
    >
      {modalContent?.type === 'DetalheCategoria' && (
        <DetalheCategoria
          categoria={modalContent.props.categoria}
          fecharModal={closeModal}
        />
      )}
      {modalContent?.type === 'MenuOffCanvas' && (
        <MenuOffCanvas fecharModal={closeModal} />
      )}
      {modalContent?.type === 'FormularioCategoria' && (
        <FormularioCategoria
          categoria={modalContent.props.categoria}
          fecharModal={closeModal}
        />
      )}
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    position: 'relative',
    flex: 1,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
});
