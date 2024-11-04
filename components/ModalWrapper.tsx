import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, ScrollView, Animated, Dimensions, Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const { width } = Dimensions.get('window');

const ModalWrapper: React.FC<ModalWrapperProps> = ({ visible, onClose, title, children }) => {
  const translateX = useRef(new Animated.Value(width)).current;
  const [isVisible, setIsVisible] = useState(visible); // Estado local para controle de visibilidade
  const colorScheme = useColorScheme() ?? 'light';
  const coresAtuais = Colors[colorScheme];

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(translateX, {
        toValue: 0, // Posiciona dentro da tela
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      // Animação de saída
      Animated.timing(translateX, {
        toValue: width, // Sai para fora da tela à direita
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false); // Atualiza o estado local após a animação de saída
        onClose(); // Chama a função de fechamento após a animação
      });
    }
  }, [visible]);

  return (
    <Modal transparent={true} animationType="none" visible={isVisible} onRequestClose={() => onClose()}>
      <Animated.View style={[styles.container, { transform: [{ translateX }], backgroundColor: coresAtuais.background }]}>
        <ScrollView>
          {title && <Text style={[styles.title, { color: coresAtuais.textoPrimario }]}>{title}</Text>}
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ModalWrapper;
