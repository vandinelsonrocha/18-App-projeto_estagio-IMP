import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { db } from '../firebase/config';
import { useFocusEffect } from '@react-navigation/native'; // Importe useFocusEffect

export default function Equipamentos({ navigation }) {
  const [dadosEquipamentos, setDadosEquipamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Função para buscar os equipamentos de TI
  const buscarEquipamentos = async () => {
    try {
      const colecao = await db.collection('equipamentos').get();
      if (colecao.empty) {
        setDadosEquipamentos([]);
      } else {
        const dados = colecao.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDadosEquipamentos(dados);
      }
    } catch (erro) {
      console.error("Erro ao buscar os equipamentos: ", erro);
    } finally {
      setCarregando(false);
    }
  };

  // Use useFocusEffect para recarregar os dados quando a tela for focada
  useFocusEffect(
    React.useCallback(() => {
      buscarEquipamentos();
    }, [])
  );

  const apagarEquipamentoTi = (id) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja apagar este equipamento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "OK", onPress: async () => {
            try {
              await db.collection('equipamentos').doc(id).delete();
            } catch (erro) {
              console.error("Erro ao apagar o equipamento: ", erro);
              Alert.alert("Erro", "Erro ao apagar o equipamento.");
            }
          }
        }
      ]
    );
  };

  if (carregando) {
    return <Text>Carregando equipamentos...</Text>;
  }

  if (dadosEquipamentos.length === 0) {
    return <Text style={styles.mensagem}>Nenhum equipamento cadastrado.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dadosEquipamentos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Código de Barras:</Text> {item.id}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Nome:</Text> {item.Nome}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Descrição:</Text> {item.Descrição}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Localização:</Text> {item.Localização}</Text>
            <View style={styles.equipAcoes}>
              <TouchableOpacity onPress={() => navigation.navigate('EditarEquipamento', item)}>
                <Text style={[styles.acao, styles.equipEditar]}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => apagarEquipamentoTi(item.id)}>
                <Text style={[styles.acao, styles.equipApagar]}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  equipTexto: {
    fontSize: 16,
  },
  equipRotulo: {
    fontWeight: 'bold',
  },
  equipAcoes: {
    flexDirection: 'row',
    marginTop: 16,
  },
  acao: {
    borderRadius: 4,
    paddingHorizontal: 32,
    paddingVertical: 8,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  equipEditar: {
    marginRight: 28,
    backgroundColor: '#261E6B',
  },
  equipApagar: {
    backgroundColor: '#EF3236',
  },
  mensagem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: '#888',
  }
});
