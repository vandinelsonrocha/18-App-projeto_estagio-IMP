import React, { useState } from 'react';
import { ScrollView, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { db } from '../firebase/config';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditarEquipamento({ route, navigation }) {
  const { id, Nome, Numero_serie, Marca, Localizacao, Data_aquisicao, Custo_aquisicao, Condicao_atual, Vida_util_estimada } = route.params;

  const [nome, setNome] = useState(Nome);
  const [numeroSerie, setNumeroSerie] = useState(Numero_serie);
  const [marca, setMarca] = useState(Marca);
  const [localizacao, setLocalizacao] = useState(Localizacao);
  const [dataAquisicao, setDataAquisicao] = useState(Data_aquisicao ? Data_aquisicao.toDate() : new Date());
  const [custoAquisicao, setCustoAquisicao] = useState(Custo_aquisicao);
  const [condicaoAtual, setCondicaoAtual] = useState(Condicao_atual);
  const [vidaUtilEstimada, setVidaUtilEstimada] = useState(Vida_util_estimada);
  const [mostraDatePicker, setMostraDatePicker] = useState(false);

  const handleSalvar = async () => {
    try {
      await db.collection('equipamentos').doc(id).update({
        Nome: nome,
        Numero_serie: numeroSerie,
        Marca: marca,
        Localizacao: localizacao,
        Data_aquisicao: dataAquisicao,
        Custo_aquisicao: custoAquisicao,
        Condicao_atual: condicaoAtual,
        Vida_util_estimada: vidaUtilEstimada,
      });
      Alert.alert("Sucesso", "Equipamento atualizado!");
      navigation.goBack();
    } catch (erro) {
      Alert.alert("Erro", "Erro ao atualizar o equipamento.");
    }
  };

  const handleDataChange = (event, selectedDate) => {
    setMostraDatePicker(false);
    if (selectedDate) {
      setDataAquisicao(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.equipId}>Editar equipamento: {id}</Text>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Número de Série"
        value={numeroSerie}
        onChangeText={setNumeroSerie}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Marca"
        value={marca}
        onChangeText={setMarca}
        style={styles.input}
      />
      <TextInput
        placeholder="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
        style={styles.input}
      />
      <Text style={styles.label}>Data de Aquisição:</Text>
      <Button title={dataAquisicao.toLocaleDateString()} onPress={() => setMostraDatePicker(true)} />
      {mostraDatePicker && (
        <DateTimePicker
          value={dataAquisicao}
          mode="date"
          display="default"
          onChange={handleDataChange}
        />
      )}
      <TextInput
        placeholder="Custo de Aquisição"
        value={custoAquisicao}
        onChangeText={setCustoAquisicao}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Condição Atual"
        value={condicaoAtual}
        onChangeText={setCondicaoAtual}
        style={styles.input}
      />
      <TextInput
        placeholder="Vida Útil Estimada"
        value={vidaUtilEstimada}
        onChangeText={setVidaUtilEstimada}
        style={styles.input}
      />
      <Button title="Salvar" onPress={handleSalvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  equipId: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
