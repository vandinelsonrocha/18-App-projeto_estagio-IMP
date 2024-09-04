import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';

export default function DadosScan({ route, navigation }) {
  const [dadosScan, setDadosScan] = useState(null);
  const { dadosCodBarras } = route.params || {};

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await db.collection('usuariosAutenticados').doc(user.uid).get();
        if (userDoc.exists) {
          if (dadosCodBarras) {
            const equipamentoDoc = await db.collection('equipamentos').doc(dadosCodBarras).get();
            const mobiliaDoc = await db.collection('mobilias').doc(dadosCodBarras).get();

            if (equipamentoDoc.exists) {
              setDadosScan({ id: dadosCodBarras, tipo: 'equipamento', ...equipamentoDoc.data() });
            } else if (mobiliaDoc.exists) {
              setDadosScan({ id: dadosCodBarras, tipo: 'mobilia', ...mobiliaDoc.data() });
            } else {
              Alert.alert('Dados', 'O equipamento ou mobília não está cadastrado!');
              navigation.navigate('Scan');
            }
          }
        } else {
          Alert.alert('Aviso', 'Não tem permissão para aceder aos dados!');
          navigation.navigate('Scan');
        }
      }
    };
    verificarAutenticacao();
  }, [dadosCodBarras]);

  const formatarData = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    const data = timestamp.toDate();
    return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      {dadosScan ? (
        <View>
          <View style={[styles.dadosContainer, styles.codBarras]}>
            <Text style={[styles.dadoScan, styles.dadoScan1]}>Código de barras:</Text>
            <Text style={[styles.dado, styles.id]}>{dadosScan.id}</Text>
          </View>
          <View style={styles.dadosContainer}>
            <Text style={styles.dadoScan}>Nome:</Text>
            <Text style={styles.dado}>{dadosScan.Nome}</Text>
          </View>
          <View style={styles.dadosContainer}>
            <Text style={styles.dadoScan}>Localização:</Text>
            <Text style={styles.dado}>{dadosScan.Localizacao}</Text>
          </View>
          <View style={styles.dadosContainer}>
            <Text style={styles.dadoScan}>Data de aquisição:</Text>
            <Text style={styles.dado}>{formatarData(dadosScan.Data_aquisicao)}</Text>
          </View>
          <View style={styles.dadosContainer}>
            <Text style={styles.dadoScan}>Custo de aquisição:</Text>
            <Text style={styles.dado}>{dadosScan.Custo_aquisicao}</Text>
          </View>
          <View style={styles.dadosContainer}>
            <Text style={styles.dadoScan}>Condição atual:</Text>
            <Text style={styles.dado}>{dadosScan.Condicao_atual}</Text>
          </View>
          <View style={styles.dadosContainer}>
            <Text style={styles.dadoScan}>Vida útil estimada:</Text>
            <Text style={styles.dado}>{dadosScan.Vida_util_estimada}</Text>
          </View>

          {dadosScan.tipo === 'equipamento' && (
            <>
              <View style={styles.dadosContainer}>
                <Text style={styles.dadoScan}>Número de série:</Text>
                <Text style={styles.dado}>{dadosScan.Numero_serie}</Text>
              </View>
              <View style={styles.dadosContainer}>
                <Text style={styles.dadoScan}>Marca:</Text>
                <Text style={styles.dado}>{dadosScan.Marca}</Text>
              </View>
            </>
          )}

          {dadosScan.tipo === 'mobilia' && (
            <>
              <View style={styles.dadosContainer}>
                <Text style={styles.dadoScan}>Material:</Text>
                <Text style={styles.dado}>{dadosScan.Material}</Text>
              </View>
            </>
          )}
        </View>
      ) : (
        <Text style={styles.msgText}>Carregando dados...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
  },
  dadosContainer: {
    marginBottom: 8,
    borderBottomWidth: .6,
    borderColor: '#CACACA',
  },
  codBarras: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 0,
  },
  id: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 16,
  },
  dadoScan1: {
    fontSize: 20,
    fontWeight: '400',
  },
  dadoScan: {
    color: '#144AB7',
    fontSize: 18,
    fontWeight: '400',
  },
  dado: {
    color: '#000',
    fontSize: 16,
    textAlign: 'justify',
  },
  msgText: {
    color: '#00A884',
    fontSize: 20,
    fontWeight: '400',
  }
})