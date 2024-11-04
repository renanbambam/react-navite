import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Colors from '@/constants/Colors';

interface MenuModalProps {
  fecharModal: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ fecharModal }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={fecharModal} style={styles.button}>
        <Text style={styles.buttonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  button: {
    backgroundColor: Colors.light.acoes,
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.light.textoPrimario,
    textAlign: 'center',
  },
});

export default MenuModal;
