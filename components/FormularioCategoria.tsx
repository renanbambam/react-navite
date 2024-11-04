/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useForm, Controller } from 'react-hook-form';
import Colors from '@/constants/Colors';
import useDatabase from '@/hooks/useDataBase';

interface FormularioCategoriaProps {
  categoria: any;
  fecharModal: () => void;
}

const categoryMap: { [key: string]: string } = {
    Receitas: 'Incomes',
    Despesas: 'Expenses',
    Faturas: 'Invoices',
    Pagamentos: 'Payments',
};

const FormularioCategoria: React.FC<FormularioCategoriaProps> = ({ fecharModal, categoria }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const coresAtuais = Colors[colorScheme];
  const { control, handleSubmit, reset } = useForm();
  const { addData } = useDatabase();
  const onSubmit = async (data: any) => {
    console.log('enviando',data);
    const categoryName = categoryMap[categoria?.nome]; // Mapeia o nome da categoria para o inglês
    if (categoryName) {
      try {
        console.log('await')
        await addData(categoryName, data); // Usa o método addData com o nome em inglês
        alert(`${categoria?.nome} adicionado com sucesso`);
        reset();
      } catch (error) {
        console.error(`Erro ao adicionar ${categoria?.nome}`, error);
        alert(`Erro ao adicionar ${categoria?.nome}`);
        console.error(error);
        throw error;
      }
    } else {
      alert('Categoria desconhecida');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: coresAtuais.background }]}>
        <View style={styles.header}>
            <TouchableOpacity onPress={fecharModal}>
            <Text style={[styles.arrow, { color: coresAtuais.textoPrimario }]}>{'←'}</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: coresAtuais.textoPrimario }]}>
                Adicionar {categoria?.nome || "Categoria"}
            </Text>
      </View>
      <ScrollView style={[{ backgroundColor: coresAtuais.fundoCard, paddingTop: 24, paddingLeft: 16, paddingRight: 16, paddingBottom: 16, borderRadius: 8 }]}>
      {categoria?.nome === 'Receitas' && (
        <ScrollView>
          <Text style={[styles.title, { color: coresAtuais.textoPrimario }]}>Entrada</Text>
          <Controller
            control={control}
            name="amount"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Valor"
                keyboardType="numeric"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="date"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Mês"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Descrição"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Button title="Adicionar Entrada" onPress={handleSubmit(onSubmit)} />
        </ScrollView>
      )}
      
      {categoria?.nome === 'Despesas' && (
        <ScrollView>
          <Text style={styles.title}>Despesas</Text>
          <Controller
            control={control}
            name="amount"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Valor"
                keyboardType="numeric"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="date"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Mês"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Descrição"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Button title="Adicionar Despesa" onPress={handleSubmit(onSubmit)} />
        </ScrollView>
      )}

      {categoria?.nome === 'Faturas' && (
        <ScrollView>
          <Text style={styles.title}>Fatura</Text>
          <Controller
            control={control}
            name="amount"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Valor"
                keyboardType="numeric"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="issueDate"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Data de emissão"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="dueDate"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Data de vencimento"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Descrição"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Button title="Adicionar Fatura" onPress={handleSubmit(onSubmit)} />
        </ScrollView>
      )}

      {categoria?.nome === 'Pagamentos' && (
        <ScrollView>
            <Text style={styles.title}>Pagamento</Text>
          <Controller
            control={control}
            name="amount"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Valor"
                keyboardType="numeric"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="paymentDate"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Data de pagamento"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="paymentMethod"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
              style={[styles.input, { backgroundColor: coresAtuais.formulario }]}
                placeholder="Método de pagamento"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Button title="Adicionar Pagamento" onPress={handleSubmit(onSubmit)}/>
        </ScrollView>
      )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    verticalAlign: 'middle',
    textAlign: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },
  arrow: {
    color: 'white',
    fontSize: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'white',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color:'white',
    borderRadius: 8,
  },
  button: {
    
  }
});

export default FormularioCategoria;
