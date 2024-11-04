/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart, AreaChart, BarChart, PieChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import useDatabase from '@/hooks/useDataBase';
import { Svg, G, Text as SvgText } from 'react-native-svg';
import LoadingModal from './LoadingModal';

interface DetalheCategoriaProps {
  categoria: any; // O tipo real pode ser ajustado conforme necessário
  fecharModal: () => void;
}

const DetalheCategoria: React.FC<DetalheCategoriaProps> = ({ fecharModal, categoria }) => {
  const [receitas, setReceitas] = useState<number[]>([]);
  const [despesas, setDespesas] = useState<number[]>([]);
  const [faturas, setFaturas] = useState<number[]>([]);
  const [pagamentos, setPagamentos] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchData } = useDatabase();

  const colorScheme = useColorScheme() ?? 'light';
  const coresAtuais = Colors[colorScheme];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const receitasData = await fetchData('Incomes');
        const despesasData = await fetchData('Expenses');
        const faturasData = await fetchData('Invoices');
        const pagamentosData = await fetchData('Payments');
  
        setReceitas(receitasData.slice(-20).map((item: any) => item.amount));
        setDespesas(despesasData.slice(-20).map((item: any) => item.amount));
        setFaturas(faturasData.slice(-20).map((item: any) => item.amount));
        setPagamentos(pagamentosData.slice(-20).map((item: any) => item.amount));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const renderLabel = (value: number, index: number, total: number) => {
    return (
      <SvgText
        key={index}
        x={16 + index * 73}
        y={180}
        fontSize={12}
        fill={coresAtuais.textoPrimario}
        alignmentBaseline="middle"
        textAnchor="middle"
      >
        {value}
      </SvgText>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: coresAtuais.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={fecharModal}>
          <Text style={[styles.arrow, { color: coresAtuais.textoPrimario }]}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: coresAtuais.textoPrimario }]}>
          {categoria?.nome || "Detalhes da Categoria"}
        </Text>
      </View>
      <ScrollView style={[{marginTop: 0}]}>
        {categoria?.nome === 'Receitas' && (
        <View>
          <LineChart
            style={[styles.chart, {backgroundColor: coresAtuais.fundoGrafico}]}
            data={receitas.slice(-5)}
            svg={{ stroke: coresAtuais.sucesso, strokeWidth: 2 }}
            contentInset={{ top: 20, bottom: 20 }}
            curve={shape.curveNatural}
            yMin={Math.min(...receitas) - 10}
            yMax={Math.max(...receitas) + 10}
          />
          <Svg height={200} width={400} style={{ marginTop: -150, display: 'flex', justifyContent:'space-between', padding: 0 }}>
            <G>
              {receitas.slice(-5).map((item, index) => renderLabel(item, index, receitas.length))}
            </G>
          </Svg>
        </View>
        )}

        {categoria?.nome === 'Despesas' && (
          <View>
            <LineChart
              style={[styles.chart, {backgroundColor: coresAtuais.fundoGrafico}]}
              data={despesas.slice(-5)}
              svg={{ stroke: coresAtuais.erro, strokeWidth: 2 }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveNatural}
              yMin={Math.min(...despesas) - 10}
              yMax={Math.max(...despesas) + 10}
            />
            <Svg height={200} width={400} style={{ marginTop: -150, display: 'flex', justifyContent:'space-between', padding: 0 }}>
            <G>
              {despesas.slice(-5).map((item, index) => renderLabel(item, index, despesas.length))}
            </G>
          </Svg>
          </View>  
        )}

        {categoria?.nome === 'Faturas' && (
          <View>
            <LineChart
              style={[styles.chart, {backgroundColor: coresAtuais.fundoGrafico}]}
              data={faturas.slice(-5)}
              svg={{ stroke: coresAtuais.erro, strokeWidth: 2 }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveNatural}
              yMin={Math.min(...faturas) - 10}
              yMax={Math.max(...faturas) + 10}
            />
            <Svg height={200} width={400} style={{ marginTop: -150, display: 'flex', justifyContent:'space-between', padding: 0 }}>
            <G>
              {faturas.slice(-5).map((item, index) => renderLabel(item, index, faturas.length))}
            </G>
          </Svg>
          </View>  
        )}

        {categoria?.nome === 'Pagamentos' && (
          <View>
            <AreaChart
              style={[styles.chart, {backgroundColor: coresAtuais.fundoGrafico}]}
              data={pagamentos.slice(-5)}
              svg={{
                fill: 'rgba(244, 65, 65, 0.5)', // Cor de preenchimento com transparência
                stroke: coresAtuais.navegacao,
                strokeWidth: 2
              }}
              contentInset={{ top: 20, bottom: 20 }}
              curve={shape.curveNatural}
            />
            <Svg height={200} width={300} style={{ marginTop: -150, display: 'flex', justifyContent:'space-between', padding: 0 }}>
            <G>
              {pagamentos.slice(-5).map((item, index) => renderLabel(item, index, pagamentos.length))}
            </G>
          </Svg>
          </View>
        )}
      </ScrollView>
      <View>
        <Text style={[styles.subtitle, { color: coresAtuais.textoSecundario, marginTop: 40 }]}>
          Histórico (últimos vinte registros)
        </Text>
        <View>
        {categoria?.nome === 'Receitas' && (
          receitas.map((categoria, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: coresAtuais.fundoCard, shadowColor: coresAtuais.sombra }]}
            >
              <View style={[{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }]}>
                <Text style={[styles.cardTitle, { color: coresAtuais.textoPrimario }]}>Lucros:</Text>
                <Text style={[styles.cardValue, { color: coresAtuais.sucesso }]}>R$ {categoria},00</Text>
              </View>
              <Text style={[{ color: coresAtuais.textoSecundario }]}>
                {index}
              </Text>
            </TouchableOpacity>
        )).reverse())}
        {categoria?.nome === 'Despesas' && (
          despesas.map((categoria, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: coresAtuais.fundoCard, shadowColor: coresAtuais.sombra }]}
            >
              <View style={[{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }]}>
                <Text style={[styles.cardTitle, { color: coresAtuais.textoPrimario }]}>Gastos:</Text>
                <Text style={[styles.cardValue, { color: coresAtuais.erro }]}>R$ {categoria},00</Text>
              </View>
              <Text style={[{ color: coresAtuais.textoSecundario }]}>
                {index}
              </Text>
            </TouchableOpacity>
        )).reverse())}
        {categoria?.nome === 'Faturas' && (
          faturas.map((categoria, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: coresAtuais.fundoCard, shadowColor: coresAtuais.sombra }]}
            >
              <View style={[{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }]}>
                <Text style={[styles.cardTitle, { color: coresAtuais.textoPrimario }]}>Valores:</Text>
                <Text style={[styles.cardValue, { color: coresAtuais.erro }]}>R$ {categoria},00</Text>
              </View>
              <Text style={[{ color: coresAtuais.textoSecundario }]}>
                {index}
              </Text>
            </TouchableOpacity>
        )).reverse())}
        {categoria?.nome === 'Pagamentos' && (
          pagamentos.map((categoria, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: coresAtuais.fundoCard, shadowColor: coresAtuais.sombra }]}
            >
              <View style={[{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }]}>
                <Text style={[styles.cardTitle, { color: coresAtuais.textoPrimario }]}>Valores:</Text>
                <Text style={[styles.cardValue, { color: coresAtuais.erro }]}>R$ {categoria},00</Text>
              </View>
              <Text style={[{ color: coresAtuais.textoSecundario }]}>
                {index}
              </Text>
            </TouchableOpacity>
        )).reverse())}
        </View>
      </View>
      <LoadingModal visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    verticalAlign: 'middle',
    textAlign: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },
  container: {
    marginTop: 0,
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  arrow: {
    color: 'white',
    fontSize: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -18,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center', 
  },
  chart: {
    height: 200,
    borderRadius: 6
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
    marginRight: 16,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DetalheCategoria;