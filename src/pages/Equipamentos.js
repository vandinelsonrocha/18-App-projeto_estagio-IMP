import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { db } from '../firebase/config';
import { useFocusEffect } from '@react-navigation/native';
import CriarEquipamento from '../components/CriarEquipamento';
import IconePesq from 'react-native-vector-icons/MaterialIcons';
import Icone from 'react-native-vector-icons/AntDesign';

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
      Alert.alert('Erro!', 'Erro ao buscar os equipamentos!');
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
      "Apagar equipamento!",
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
              Alert.alert("Erro!", "Erro ao apagar o equipamento.");
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

  if (dadosEquipamentos.length === 0) {
    return (
      <View>
        <Text style={[styles.msgText, styles.msgText2]}>Nenhum equipamento cadastrado!</Text>
        <TouchableOpacity style={styles.criar} onPress={() => setModalVisivel(true)}>
          <Text style={styles.equipCriar}>Criar</Text>
        </TouchableOpacity>
        <CriarMobilia
          visible={modalVisivel}
          onClose={() => setModalVisivel(false)}
          onCriar={buscarEquipamentos}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mobilias} onPress={() => navigation.navigate('Mobilias')}>
        <Icone name="arrowright" size={17} color='#261E6B' />
        <Text style={{color: '#261E6B', marginLeft: 2, fontSize: 16}}>Mobílias</Text>
      </TouchableOpacity>
      <Text style={styles.equipDica}>Adicione, edite ou remova equipamentos com um clique e mantenha-os sempre atualizados!</Text>
      
      {/* Campo de pesquisa com ícone no placeholder */}
      <View style={styles.inputContainer}>
        {pesquisa === '' && (
          <View style={styles.placeholderContainer}>
            <IconePesq name="search" size={20} color="#999" />
            <Text style={styles.placeholderText}>Pesquise equipamentos pelo nome</Text>
          </View>
        )}
        <TextInput
          style={styles.inputPesquisa}
          value={pesquisa}
          onChangeText={setPesquisa}
          placeholder="" // Placeholder real é deixado vazio
        />
      </View>
      {/* Verifica se a pesquisa está em andamento e não encontrou nenhum resultado */}
      {pesquisa !== '' && dadosFiltrados.length === 0 && (
        <Text style={[styles.msgText2, { textAlign: 'center', marginTop: 68 }]}>
          Nenhum equipamento cadastrado com esse nome.
        </Text>      
      )}
      
      <FlatList
        data={dadosFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={[styles.dadosContainer, styles.codBarras]}>
              <Text style={styles.dadoScan}>Código de barras:</Text>
              <Text style={[styles.dado, styles.id]}>{item.id}</Text>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dadoScan}>Nome:</Text>
              <Text style={styles.dado}>{item.Nome}</Text>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dadoScan}>Número de série:</Text>
              <Text style={styles.dado}>{item.Numero_serie}</Text>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dadoScan}>Marca:</Text>
              <Text style={styles.dado}>{item.Marca}</Text>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dadoScan}>Localização:</Text>
              <Text style={styles.dado}>{item.Localizacao}</Text>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dadoScan}>Data de aquisição:</Text>
              <Text style={styles.dado}>{formatarData(item.Data_aquisicao)}</Text>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dadoScan}>Custo de aquisição:</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.dado}>{item.Custo_aquisicao}</Text>
                <Text style={{marginLeft: 4}}>$00</Text>
              </View>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dadoScan}>Condição atual:</Text>
              <Text style={styles.dado}>{item.Condicao_atual}</Text>
            </View>
            <View style={styles.dadosContainer}>
              <Text style={styles.dadoScan}>Vida útil estimada:</Text>
              <Text style={styles.dado}>{item.Vida_util_estimada}</Text>
            </View>
            <View style={styles.equipAcoes}>
              <TouchableOpacity onPress={() => navigation.navigate('EditarEquipamento', item)}>
                <Icone name="edit" size={18} style={[styles.acao, styles.equipEditar]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => apagarEquipamentoTi(item.id)}>
                <Icone name="delete" size={18} style={[styles.acao, styles.equipApagar]} />
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
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#261E6B',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  equipDica: {
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 16,
    color: '#261E6B',
    fontSize: 16,
    fontWeight: '400',
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  placeholderContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'none', // Permite clicar através do placeholder
  },
  placeholderText: {
    color: '#999',
    marginLeft: 5,
  },
  inputPesquisa: {
    borderColor: '#CCC',
    color: '#000',
    fontSize: 16,
  },
  item: {
    paddingTop: 6,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#F8F8FA',
    marginBottom: 4,
  },
  dadosContainer: {
    marginBottom: 6,
  },
  codBarras: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  id: {
    marginLeft: 16,
  },
  dadoScan: {
    fontWeight: '600',
  },
  dado: {
    textAlign: 'justify',
  },
  equipAcoes: {
    flexDirection: 'row',
    marginTop: 16,
  },
  acao: {
    borderRadius: 3,
    padding: 10,
    color: '#FFFFFF',
  },
  equipEditar: {
    marginRight: 48,
    backgroundColor: '#261E6B',
  },
  equipApagar: {
    backgroundColor: '#EF3236',
  },
  criar: {
    alignItems: 'center',
    marginTop: 16,
  },
  equipCriar: {
    borderRadius: 3,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
    backgroundColor: '#261E6B',
    paddingHorizontal: 18,
    paddingVertical: 6,
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
