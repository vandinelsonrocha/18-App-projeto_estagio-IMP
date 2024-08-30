import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { db } from '../firebase/config';
import { useFocusEffect } from '@react-navigation/native';
import CriarMobilia from '../components/CriarMobilia';

export default function Mobilias({ navigation }) {
  const [dadosMobilias, setDadosMobilias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);

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
      Alert.alert('Erro', 'Erro ao buscar as mobílias!');
      navigation.navigate('Scan');
    } finally {
      setCarregando(false);
    }
  };

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
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "OK", onPress: async () => {
            try {
              await db.collection('mobilias').doc(id).delete();
              setDadosMobilias(dadosMobilias.filter(item => item.id !== id));
            } catch (erro) {
              console.error("Erro ao apagar a mobília: ", erro);
              Alert.alert("Erro", "Erro ao apagar a mobília.");
            }
          }
        }
      ]
    );
  };

  const formatarData = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    const data = timestamp.toDate();
    return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
  };

  if (carregando) {
    return <Text style={[styles.msgText, styles.msgText1]}>Carregando mobílias...</Text>;
  }

  if (dadosMobilias.length === 0) {
    return <Text style={[styles.msgText, styles.msgText1]}>Nenhuma mobília cadastrada.</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Equipamentos')}>
        <Text style={styles.equipamentos}>Equipamentos</Text>
      </TouchableOpacity>
      <FlatList
        data={dadosMobilias}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Código de barras:</Text> {item.id}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Nome:</Text> {item.Nome}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Localização:</Text> {item.Localizacao}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Data de aquisição:</Text> {formatarData(item.Data_aquisicao)}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Custo de aquisição:</Text> {item.Custo_aquisicao}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Condição atual:</Text> {item.Condicao_atual}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Vida útil estimada:</Text> {item.Vida_util_estimada}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Material:</Text> {item.Material}</Text>
            <View style={styles.equipAcoes}>
              <TouchableOpacity onPress={() => navigation.navigate('EditarMobilia', item)}>
                <Text style={[styles.acao, styles.equipEditar]}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => apagarMobilia(item.id)}>
                <Text style={[styles.acao, styles.equipApagar]}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.criar} onPress={() => setModalVisivel(true)}>
        <Text style={styles.equipCriar}>Criar</Text>
      </TouchableOpacity>
      <CriarMobilia
        visible={modalVisivel}
        onClose={() => setModalVisivel(false)}
        onCriar={buscarMobilias}
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
  criar: {
    alignItems: 'center',
    marginTop: 20,
  },
  equipCriar: {
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
    backgroundColor: '#261E6B',
    paddingHorizontal: 32,
    paddingVertical: 8,
  },
  msgText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
    marginTop: 90,
  },
  msgText1: {
    color: '#00A884',
  },
  msgText2: {
    color: '#EF3236',
  }
});
