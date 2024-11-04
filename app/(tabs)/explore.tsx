/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { useModal } from '@/components/context/ModalContext';
import { Ionicons } from '@expo/vector-icons';
import useDatabase from '@/hooks/useDataBase';

interface Categoria {
  nome: string;
  valor: string;
  percentual: string;
}

const TabTwoScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const coresAtuais = Colors[colorScheme];
  const { setModalContent } = useModal();
  const { fetchData } = useDatabase();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const abrirFormularioCategoria = (categoria: Categoria) => {
    setModalContent({
      type: 'FormularioCategoria', // Certifique-se de que esse tipo está definido no seu ModalContext
      props: { categoria },
    });
  };

  const abrirMenuOffCanvas = () => {
    setModalContent({
      type: 'MenuOffCanvas',
      props: {},
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Mostrar o modal de carregamento
      try {
        const receitasData: any[] = await fetchData('Incomes');
        const despesasData: any[] = await fetchData('Expenses');
        const faturasData: any[] = await fetchData('Invoices');
        const pagamentosData: any[] = await fetchData('Payments');

        const receitasUltimoValor = receitasData.length > 0 ? receitasData[receitasData.length - 1].amount : 'R$ 0';
        const despesasUltimoValor = despesasData.length > 0 ? despesasData[despesasData.length - 1].amount : 'R$ 0';
        const faturasUltimoValor = faturasData.length > 0 ? faturasData[faturasData.length - 1].amount : 'R$ 0';
        const pagamentosUltimoValor = pagamentosData.length > 0 ? pagamentosData[pagamentosData.length - 1].amount : 'R$ 0';

        setCategorias([
          { nome: 'Receitas', valor: `R$ ${receitasUltimoValor}`, percentual: `Entrada Recente` },
          { nome: 'Despesas', valor: `R$ ${despesasUltimoValor}`, percentual: `Último gasto`},
          { nome: 'Faturas', valor: `R$ ${faturasUltimoValor}`, percentual: `Última fatura` },
          { nome: 'Pagamentos', valor: `R$ ${pagamentosUltimoValor}`, percentual: `Custos extras` },
        ]);
        setLoading(true);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        throw error
      } finally {
        setLoading(false); // Ocultar o modal de carregamento
      }
    };
    if (!loading) loadData();
  }, [loading, fetchData]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: coresAtuais.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: coresAtuais.titulo }]}>Formulários</Text>
        <TouchableOpacity onPress={abrirMenuOffCanvas}>
          <Ionicons name="person-circle-outline" size={32} color={coresAtuais.titulo} />
        </TouchableOpacity>
      </View>

      {categorias.map((categoria, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { backgroundColor: coresAtuais.fundoCard, shadowColor: coresAtuais.sombra }]}
          onPress={() => abrirFormularioCategoria(categoria)}
        >
          <View>
            <Text style={[styles.cardTitle, { color: coresAtuais.textoPrimario }]}>{categoria.nome}</Text>
            <Text style={[styles.cardValue, { color: categoria.nome === 'Receitas' ? coresAtuais.sucesso : coresAtuais.erro }]}>{categoria.valor}</Text>
          </View>
          <Text style={[styles.cardPercentage, { color: coresAtuais.textoSecundario }]}>
            {categoria.percentual}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    verticalAlign: 'middle',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardPercentage: {
    fontSize: 16,
  },
});

export default TabTwoScreen;
