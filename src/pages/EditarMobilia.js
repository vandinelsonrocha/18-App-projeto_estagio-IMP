import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { db } from '../firebase/config';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditarMobilia({ route, navigation }) {
  const { id, Nome, Localizacao, Data_aquisicao, Custo_aquisicao, Condicao_atual, Vida_util_estimada, Material } = route.params;

  const [nome, setNome] = useState(Nome);
  const [localizacao, setLocalizacao] = useState(Localizacao);
  const [dataAquisicao, setDataAquisicao] = useState(Data_aquisicao ? Data_aquisicao.toDate() : new Date());
  const [custoAquisicao, setCustoAquisicao] = useState(Custo_aquisicao);
  const [condicaoAtual, setCondicaoAtual] = useState(Condicao_atual);
  const [vidaUtilEstimada, setVidaUtilEstimada] = useState(Vida_util_estimada);
  const [material, setMaterial] = useState(Material);
  const [mostraDatePicker, setMostraDatePicker] = useState(false);

  const handleSalvar = async () => {
    try {
      await db.collection('mobilias').doc(id).update({
        Nome: nome,
        Localizacao: localizacao,
        Data_aquisicao: dataAquisicao,
        Custo_aquisicao: custoAquisicao,
        Condicao_atual: condicaoAtual,
        Vida_util_estimada: vidaUtilEstimada,
        Material: material,
      });
      Alert.alert("Sucesso", "Mobília atualizada com sucesso!");
      navigation.goBack();
    } catch (erro) {
      console.error("Erro ao atualizar a mobília: ", erro);
      Alert.alert("Erro", "Erro ao atualizar a mobília.");
    }
  };

  const handleDataChange = (event, selectedDate) => {
    setMostraDatePicker(false);
    if (selectedDate) {
      setDataAquisicao(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.equipId}>Editar mobília: {id}</Text>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
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
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Material"
        value={material}
        onChangeText={setMaterial}
        style={styles.input}
      />
      <Button title="Salvar" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  equipId: {
    textAlign: 'center',
    marginBottom: 32,
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
