/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import useDatabase from '@/hooks/useDataBase';
import { AreaChart, BarChart, LineChart, Path, PieChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import LoadingModal from './LoadingModal';
import Svg, { Defs, TextPath } from 'react-native-svg';


interface MenuOffCanvasProps {
  categoria?: any;
  fecharModal: () => void;
}

const MenuOffCanvas: React.FC<MenuOffCanvasProps> = ({ fecharModal, categoria }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const coresAtuais = Colors[colorScheme];
  const { fetchData } = useDatabase();
  const [isLoading, setIsLoading] = useState(false);
  const [receitas, setReceitas] = useState<number[]>([]);
  const [despesas, setDespesas] = useState<number[]>([]);
  const [faturas, setFaturas] = useState<number[]>([]);
  const [pagamentos, setPagamentos] = useState<number[]>([]);
  const [balanco, setBalanco] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const receitasData = await fetchData('Incomes');
        const despesasData = await fetchData('Expenses');
        const faturasData = await fetchData('Invoices');
        const pagamentosData = await fetchData('Payments');

        setReceitas(receitasData.slice(-5).map((item: any) => item.amount));
        setDespesas(despesasData.slice(-5).map((item: any) => item.amount));
        setFaturas(faturasData.slice(-5).map((item: any) => item.amount));
        setPagamentos(pagamentosData.slice(-5).map((item: any) => item.amount));

        const totalReceitas = receitasData.reduce((acc: number, val: any) => acc + val.amount, 0);
        const totalDespesas = despesasData.reduce((acc: number, val: any) => acc + val.amount, 0);
        const totalFaturas = faturasData.reduce((acc: number, val: any) => acc + val.amount, 0);
        const totalPagamentos = pagamentosData.reduce((acc: number, val: any) => acc + val.amount, 0);

        setBalanco(totalReceitas - (totalDespesas + totalFaturas + totalPagamentos));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const CircularText = ({ text }: { text: string }) => {
    const radius = 40; // Raio do círculo
  
    return (
      <View style={[styles.circleContainer, styles.chartText, { transform: [{ rotate: '70deg' }], top: 13, left: -15}]}>
        <Svg height="350" width="500">
          <Defs>
            <Path
              id="circlePath"
              d={`M 200, 300
                  m -${radius}, 0
                  a ${radius},${radius} 0 1,1 ${(radius * 2)},0
                  a ${radius},${radius} 0 1,1 -${(radius * 2)},0`}
              {...({} as any)}
            />
          </Defs>
          <Text style={[{color: coresAtuais.textoPrimario}]}>
            <TextPath href="#circlePath" startOffset="10%" fill={coresAtuais.textoPrimario} fontWeight={'bold'}>
              {text}
            </TextPath>
          </Text>
        </Svg>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: coresAtuais.background }]}>
      {isLoading && <LoadingModal visible={isLoading}/>}

      <View style={styles.header}>
        <TouchableOpacity onPress={fecharModal}>
          <Text style={[styles.arrow, { color: coresAtuais.textoPrimario }]}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: coresAtuais.textoPrimario }]}>
          Perfil de {categoria?.nome || "Usuário"}
        </Text>
      </View>

      <View style={[{ backgroundColor: coresAtuais.fundoCard, paddingTop: 12, paddingLeft: 12, paddingRight: 12, paddingBottom: 12, borderRadius: 8 }]}>
      <View>
          <Text style={[styles.companyName, { color: coresAtuais.textoPrimario }]}>Nome da Empresa: </Text>
          <Text style={[styles.informacoesName, { color: coresAtuais.textoPrimario, marginBottom: 20 }]}>ESCARLATA IND. COM.</Text>
        </View>
        <View style={[styles.companyInfo]}>
          <View>
            <Image
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA8IYwqEnyvogIqkCTddXHLjRU2h0sU9nYhg&s' }}
              style={styles.companyLogo}
            />
          </View>
          <View>
            <Text style={[styles.companyDetails, { color: coresAtuais.textoPrimario }]}>CNPJ: </Text>
            <Text style={[styles.informacoes, { color: coresAtuais.textoPrimario }]}>08.742.231/8462-10</Text>
            <Text style={[styles.companyDetails, { color: coresAtuais.textoPrimario }]}>Endereço: </Text>
            <Text style={[styles.informacoes, { color: coresAtuais.textoPrimario }]}>Rua Exemplo, 254, ap 202 Bairro</Text>
            <Text style={[styles.companyDetails, { color: coresAtuais.textoPrimario }]}>CEP: <Text style={[styles.informacoes, { color: coresAtuais.textoPrimario }]}>57624-71</Text></Text>
          </View>
        </View>
        
      </View>

      <View style={styles.balanceContainer}>
      <Text style={[styles.sectionTitle, { color: coresAtuais.textoPrimario }]}>Balanço Financeiro</Text>
        <Text style={[styles.balanceText, { color: coresAtuais.textoPrimario }]}>
          Balanço:{'  '}
          {balanco !== null ? (
            <Text style={{ color: balanco.toString().includes('-') ? coresAtuais.erro : coresAtuais.sucesso }}>
                R$ {balanco}
            </Text>
          ) : (
            'Calculando...'
          )}
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartGrid}>
          <View>
            <Text style={[styles.chartTitle, { color: coresAtuais.textoPrimario }]}>
              Receitas
            </Text>
            <LineChart style={[styles.chart, { backgroundColor: coresAtuais.fundoGrafico, position: 'relative' }]} data={receitas} svg={{ stroke: coresAtuais.sucesso }} contentInset={{ top: 20, bottom: 20 }} curve={shape.curveNatural} />
            <Text style={[styles.chartText, { color: coresAtuais.textoPrimario }]}>
              {receitas.join('    ')}
            </Text>
          </View>
          <View>
            <Text style={[styles.chartTitle, { color: coresAtuais.textoPrimario }]}>
              Despesas
            </Text>
            <AreaChart style={[styles.chart, { backgroundColor: coresAtuais.fundoGrafico }]} data={despesas} svg={{ fill: coresAtuais.erro }} contentInset={{ top: 20, bottom: 20 }} curve={shape.curveNatural} />
            <Text style={[styles.chartText, { color: coresAtuais.textoPrimario }]}>
              {despesas.join('    ')}
            </Text>
          </View>
        </View>
        <View style={styles.chartGrid}>
          <View>
            <Text style={[styles.chartTitle, { color: coresAtuais.textoPrimario }]}>
              Pagamentos
            </Text>
            <BarChart style={[styles.chart, { backgroundColor: coresAtuais.fundoGrafico }]} data={pagamentos} svg={{ fill: coresAtuais.aviso }} contentInset={{ top: 20, bottom: 20 }} />
            <Text style={[styles.chartText, { color: coresAtuais.textoPrimario }]}>
              {pagamentos.join('    ')}
            </Text>
          </View>
          <View>
            <Text style={[styles.chartTitle, { color: coresAtuais.textoPrimario }]}>
              Faturas
            </Text>
            <PieChart style={[styles.chart, { backgroundColor: coresAtuais.fundoGrafico }]} data={faturas.map((value, index) => ({ value, svg: { fill: index % 2 === 0 ? coresAtuais.sucesso : coresAtuais.erro }, key: `shape.pie-${index}`, }))} outerRadius="70%" />
              <CircularText text={faturas.join('   ').toString()} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  arrow: {
    color: 'white',
    fontSize: 24,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -18,
  },
  companyInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyLogo: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 8,
    marginRight: 20,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  informacoes: {
    fontSize: 12,
    maxWidth: 220
  },
  informacoesName:{
    marginLeft: 10,
    fontSize: 14,
  },
  companyDetails: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceContainer: {
    marginTop: 20,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 10,
  },
  chartGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    position: 'absolute', 
    top: 5, 
    left: 10, 
    zIndex: 1003,
    fontWeight: 'bold',
  },
  chartText: {
    fontSize: 7, 
    position: 'absolute', 
    bottom: 25, 
    marginLeft: 5,
    fontWeight: 'bold',
  },
  chart: {
    width: 160,
    height: 130,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 20,
    borderRadius: 8,
    paddingBottom: 12,
    paddingTop: 12
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 450,
  },
});

export default MenuOffCanvas;