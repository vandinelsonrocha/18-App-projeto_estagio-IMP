import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert,Text } from 'react-native';
import { db } from '../firebase/config';

export default function EditarMobilia({ route, navigation }) {
  const { id, Nome, Descrição, Localização } = route.params;
  const [nome, setNome] = useState(Nome);
  const [descricao, setDescricao] = useState(Descrição);
  const [localizacao, setLocalizacao] = useState(Localização);

  const handleSalvar = async () => {
    try {
      await db.collection('mobilias').doc(id).update({
        Nome: nome,
        Descrição: descricao,
        Localização: localizacao,
      });
      Alert.alert("Sucesso", "Mobília atualizada com sucesso!");
      navigation.goBack();
    } catch (erro) {
      console.error("Erro ao atualizar a mobília: ", erro);
      Alert.alert("Erro", "Erro ao atualizar a mobília.");
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
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />
      <TextInput
        placeholder="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
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
});
