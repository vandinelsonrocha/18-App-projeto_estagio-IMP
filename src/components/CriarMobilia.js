import React, { useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../firebase/config';

export default function CriarMobilia({ visible, onClose, onCriar }) {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [dataAquisicao, setDataAquisicao] = useState(new Date());
  const [custoAquisicao, setCustoAquisicao] = useState('');
  const [condicaoAtual, setCondicaoAtual] = useState('');
  const [vidaUtilEstimada, setVidaUtilEstimada] = useState('');
  const [material, setMaterial] = useState('');
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);

  const limparCampos = () => {
    setCodigoBarras('');
    setNome('');
    setLocalizacao('');
    setDataAquisicao(new Date());
    setCustoAquisicao('');
    setCondicaoAtual('');
    setVidaUtilEstimada('');
    setMaterial('');
  };

  const handleCriar = async () => {
    try {
      // Verifica se já existe um equipamento com o mesmo código de barras
      const doc = await db.collection('mobilias').doc(codigoBarras).get();
      if (doc.exists) {
        Alert.alert("Erro", `Não foi possível criar porque uma mobília com o código de barras ${codigoBarras} já existe.`);
        return;
      }

      // Se não existir, cria o novo equipamento
      await db.collection('mobilias').doc(codigoBarras).set({
        Nome: nome,
        Localizacao: localizacao,
        Data_aquisicao: dataAquisicao,
        Custo_aquisicao: custoAquisicao,
        Condicao_atual: condicaoAtual,
        Vida_util_estimada: vidaUtilEstimada,
        Material: material,
      });

      onCriar();
      limparCampos();
      onClose();
    } catch (erro) {
      console.error("Erro ao criar a mobília: ", erro);
      Alert.alert("Erro", "Erro ao criar a mobília.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Código de Barras"
            value={codigoBarras}
            onChangeText={setCodigoBarras}
            style={styles.input}
          />
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
          <TouchableOpacity onPress={() => setMostrarDatePicker(true)}>
            <Text style={styles.input}>{`Data de Aquisição: ${dataAquisicao.toLocaleDateString()}`}</Text>
          </TouchableOpacity>
          {mostrarDatePicker && (
            <DateTimePicker
              value={dataAquisicao}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setMostrarDatePicker(false);
                if (selectedDate) {
                  setDataAquisicao(selectedDate);
                }
              }}
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
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onClose} color="#EF3236" />
            <Button title="Ok" onPress={handleCriar} color="#261E6B" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
