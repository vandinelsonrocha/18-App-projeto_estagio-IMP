import React, { useEffect, useState } from 'react';
import { Alert, View, Text } from 'react-native';
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
              Alert.alert('Dados', 'O equipamento ou mobília não existe!');
              navigation.navigate('Scan');
            }
          }
        } else {
          alert('Usuário não autorizado!');
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {dadosScan ? (
        <View>
          <Text>Código de Barras: {dadosScan.id}</Text>
          <Text>Nome: {dadosScan.Nome}</Text>
          <Text>Localização: {dadosScan.Localizacao}</Text>
          <Text>Data de Aquisição: {formatarData(dadosScan.Data_aquisicao)}</Text>
          <Text>Custo de Aquisição: {dadosScan.Custo_aquisicao}</Text>
          <Text>Condição Atual: {dadosScan.Condicao_atual}</Text>
          <Text>Vida Útil Estimada: {dadosScan.Vida_util_estimada}</Text>

          {dadosScan.tipo === 'equipamento' && (
            <>
              <Text>Número de Série: {dadosScan.Numero_serie}</Text>
              <Text>Marca: {dadosScan.Marca}</Text>
            </>
          )}

          {dadosScan.tipo === 'mobilia' && (
            <>
              <Text>Material: {dadosScan.Material}</Text>
            </>
          )}
        </View>
      ) : (
        <Text>Escaneie um código de barras</Text>
      )}
    </View>
  );
}
