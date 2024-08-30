import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { db } from '../firebase/config';
import { useFocusEffect } from '@react-navigation/native';
import CriarEquipamento from '../components/CriarEquipamento';

export default function Equipamentos({ navigation }) {
  const [dadosEquipamentos, setDadosEquipamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false); // Estado para controlar a visibilidade do modal
  const [pesquisa, setPesquisa] = useState(''); // Estado para o texto de pesquisa
  const [dadosFiltrados, setDadosFiltrados] = useState([]); // Estado para armazenar os dados filtrados

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
        setDadosFiltrados(dados); // Inicialmente, os dados filtrados são os mesmos que os dados carregados
      }
    } catch (erro) {
      Alert.alert('Erro', 'Erro ao buscar os equipamentos!');
      navigation.navigate('Scan');
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

  // Função para filtrar os equipamentos com base no texto de pesquisa
  useEffect(() => {
    const dadosAtualizados = dadosEquipamentos.filter(item => 
      item.Nome.toLowerCase().includes(pesquisa.toLowerCase())
    );
    setDadosFiltrados(dadosAtualizados);
  }, [pesquisa, dadosEquipamentos]);

  const apagarEquipamentoTi = (id) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja apagar este equipamento?",
      [
        {
          text: "Cancelar",
        },
        {
          text: "OK", onPress: async () => {
            try {
              await db.collection('equipamentos').doc(id).delete();
              setDadosEquipamentos(dadosEquipamentos.filter(item => item.id !== id));
            } catch (erro) {
              Alert.alert("Erro", "Erro ao apagar o equipamento.");
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
    return <Text style={[styles.msgText, styles.msgText1]}>Carregando equipamentos...</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Mobilias')}>
        <Text style={styles.mobilias}>Mobílias</Text>
      </TouchableOpacity>
      <Text style={styles.equipDica}>Adicione, edite ou remova equipamentos com um clique e mantenha-os sempre atualizados!</Text>
      
      {/* Campo de pesquisa */}
      <TextInput
        style={styles.inputPesquisa}
        placeholder="Pesquise equipamentos pelo nome"
        value={pesquisa}
        onChangeText={setPesquisa}
      />
      
      <FlatList
        data={dadosFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Código de barras:</Text> {item.id}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Nome:</Text> {item.Nome}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Número de série:</Text> {item.Numero_serie}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Marca:</Text> {item.Marca}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Localização:</Text> {item.Localizacao}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Data de aquisição:</Text> {formatarData(item.Data_aquisicao)}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Custo de aquisição:</Text> {item.Custo_aquisicao}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Condição atual:</Text> {item.Condicao_atual}</Text>
            <Text style={styles.equipTexto}><Text style={styles.equipRotulo}>Vida útil estimada:</Text> {item.Vida_util_estimada}</Text>
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
      <TouchableOpacity style={styles.criar} onPress={() => setModalVisivel(true)}>
        <Text style={styles.equipCriar}>Criar</Text>
      </TouchableOpacity>
      <CriarEquipamento
        visible={modalVisivel}
        onClose={() => setModalVisivel(false)}
        onCriar={buscarEquipamentos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  mobilias: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#261E6B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    color: '#261E6B',
    fontSize: 16,
  },
  equipDica: {
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 14,
    color: '#261E6B',
    fontSize: 16,
    fontWeight: '400',
  },
  inputPesquisa: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 0,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  item: {
    paddingVertical: 15,
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
  },
});
