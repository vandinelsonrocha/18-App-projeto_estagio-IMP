import React, { useState } from 'react';
import { View, TextInput, Modal, StyleSheet, Text, Alert } from 'react-native';
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
  const [mostraDatePicker, setMostraDatePicker] = useState(false);

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
      // Verifica se já existe um equipamento ou mobília com um código de barras já existente
      const equipamento = await db.collection('equipamentos').doc(codigoBarras).get();
      const mobilia = await db.collection('mobilias').doc(codigoBarras).get();
      if (equipamento.exists || mobilia.exists) {
        Alert.alert("Atenção!", `Não foi possível criar porque um equipamento ou mobília com o código de barras ${codigoBarras} já existe.`);
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
          <Text style={styles.equipTitle}>Criar mobília</Text>
          <View style={styles.dadoContainer}>
            <Text style={styles.dado}>Código de barras:</Text>
            <TextInput placeholder="Código de Barras" value={codigoBarras} onChangeText={setCodigoBarras} />
          </View>
          <View style={styles.dadoContainer}>
            <Text style={styles.dado}>Nome:</Text>
            <TextInput placeholder="Nome" value={nome} onChangeText={setNome} />
          </View>
          <View style={styles.dadoContainer}>
            <Text style={styles.dado}>Localização:</Text>
            <TextInput placeholder="Localização" value={localizacao} onChangeText={setLocalizacao} />
          </View>
          <View style={styles.dadoContainer}>
            <Text style={styles.dado}>Data de Aquisição:</Text>
            <TextInput onPress={() => setMostraDatePicker(true)}>{dataAquisicao.toLocaleDateString()}</TextInput>
            {mostraDatePicker && (
              <DateTimePicker value={dataAquisicao} mode="date" display="default"
              onChange={(event, selectedDate) => {
                setMostraDatePicker(false);
                if (selectedDate) {
                  setDataAquisicao(selectedDate);
                }
              }} />
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
          <View style={styles.dadoContainer}>
            <Text style={styles.dado}>Material:</Text>
            <TextInput placeholder="Material" value={material} onChangeText={setMaterial} />
          </View>
          <View style={styles.acoesContainer}>
            <Text style={[styles.botaoAcao, styles.salvar]} onPress={handleCriar}>Salvar</Text>
            <Text style={[styles.botaoAcao, styles.cancelar]} onPress={onClose}>Cancelar</Text>
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
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  equipTitle: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 4,
  },
  dadoContainer: {
    borderBottomWidth: .8,
    borderBottomColor: '#CCC',
    marginBottom: 12,
  },
  dado: {
    fontWeight: '400',
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
