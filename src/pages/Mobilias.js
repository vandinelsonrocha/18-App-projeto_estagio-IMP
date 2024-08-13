import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase/config';
import { useFocusEffect } from '@react-navigation/native'; 

export default function Mobilias({ navigation }) {
  const [dadosMobilias, setDadosMobilias] = useState([]);
  const [carregando, setCarregando] = useState(true);

    const buscarMobilias = async () => {
      try {
        const colecao = await db.collection('mobilias').get();
        if (colecao.empty) {
          setDadosMobilias([]);
        } else {
          const dados = colecao.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDadosMobilias(dados);
        }
      } catch (erro) {
        console.error("Erro ao buscar as mobílias: ", erro);
      } finally {
        setCarregando(false);
      }
    };

  // Use useFocusEffect para recarregar os dados quando a tela for focada
  useFocusEffect(
    React.useCallback(() => {
      buscarMobilias();
    }, [])
  );

  const apagarMobilia = (id) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja apagar esta mobília?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "OK", onPress: async () => {
          try {
            await db.collection('mobilias').doc(id).delete();
            setDadosMobilias(dadosMobilias.filter(item => item.id !== id));
          } catch (erro) {
            console.error("Erro ao apagar a mobília: ", erro);
            Alert.alert("Erro", "Erro ao apagar o equipamento.");
          }
        }},
      ]
    );
  };

  if (carregando) {
    return <Text>Carregando mobílias...</Text>;
  }

  if (dadosMobilias.length === 0) {
    return <Text style={styles.mensagem}>Nenhuma mobília cadastrada.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dadosMobilias}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Código de Barras:</Text> {item.id}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Nome:</Text> {item.Nome}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Descrição:</Text> {item.Descrição}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Localização:</Text> {item.Localização}</Text>
            <View style={styles.equipAcoes}>
              <Text style={[styles.acao, styles.equipEditar]} onPress={() => navigation.navigate('EditarMobilia', item)}>Editar</Text>
              <Text style={[styles.acao, styles.equipApagar]} onPress={() => apagarMobilia(item.id)}>Apagar</Text>
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
