import React, { useState } from 'react';
import { ScrollView, TextInput, StyleSheet, Alert, Text, View } from 'react-native';
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
      navigation.navigate('Equipamentos');
    } catch (erro) {
      Alert.alert("Erro!", "Erro ao atualizar o equipamento.");
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
      <View style={styles.dadoContainer}>
        <Text style={styles.dado}>Nome:</Text>
        <TextInput placeholder="Nome" value={nome} onChangeText={setNome} />
      </View>
      <View style={styles.dadoContainer}>
        <Text style={styles.dado}>Número de série:</Text>
        <TextInput placeholder="Número de Série" value={numeroSerie} onChangeText={setNumeroSerie} keyboardType="numeric" />
      </View>
      <View style={styles.dadoContainer}>
        <Text style={styles.dado}>Marca:</Text>
        <TextInput placeholder="Marca" value={marca} onChangeText={setMarca} />
      </View>
      <View style={styles.dadoContainer}>
        <Text style={styles.dado}>Localização:</Text>
        <TextInput placeholder="Localização" value={localizacao} onChangeText={setLocalizacao} />
      </View>
      <View style={styles.dadoContainer}>
        <Text style={styles.dado}>Data de Aquisição:</Text>
        <TextInput onPress={() => setMostraDatePicker(true)}>{dataAquisicao.toLocaleDateString()}</TextInput>
        {mostraDatePicker && (
          <DateTimePicker value={dataAquisicao} mode="date" display="default" onChange={handleDataChange} />
        )}
      </View>
      <View style={styles.dadoContainer}>
        <Text style={styles.dado}>Custo de aquisição:</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, alignItems: 'center'}}>
          <TextInput placeholder="Custo de Aquisição" value={custoAquisicao} onChangeText={setCustoAquisicao} keyboardType="numeric" />
          <Text>$00</Text>
        </View>
      </View>
      <View style={styles.dadoContainer}>
        <Text style={styles.dado}>Condição atual:</Text>
        <TextInput placeholder="Condição Atual" value={condicaoAtual} onChangeText={setCondicaoAtual} />
      </View>
      <View style={styles.dadoContainer}>
        <Text style={styles.dado}>Vida útil estimada:</Text>
        <TextInput placeholder="Vida Útil Estimada" value={vidaUtilEstimada} onChangeText={setVidaUtilEstimada} />
      </View>
      <View style={styles.acoesContainer}>
        <Text style={[styles.botaoAcao, styles.salvar]} onPress={handleSalvar}>Salvar</Text>
        <Text style={[styles.botaoAcao, styles.cancelar]} onPress={() => navigation.navigate('Equipamentos')}>Cancelar</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1 ,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  equipId: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  dadoContainer: {
    borderBottomWidth: .8,
    borderBottomColor: '#CCC',
    marginBottom: 12,
  },
  dado: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  acoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  botaoAcao: {
    borderRadius: 3,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  salvar: {
    backgroundColor: '#261E6B',
  },
  cancelar: {
    backgroundColor: '#EF3236',
  }
});
