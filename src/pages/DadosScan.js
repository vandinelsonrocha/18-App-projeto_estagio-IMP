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
              setDadosScan({ id: dadosCodBarras, ...equipamentoDoc.data() });
            } else if (mobiliaDoc.exists) {
              setDadosScan({ id: dadosCodBarras, ...mobiliaDoc.data() });
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {dadosScan ? (
        <View>
          <Text>Código de Barras: {dadosScan.id}</Text>
          <Text>Nome: {dadosScan.Nome}</Text>
          <Text>Descrição: {dadosScan.Descrição}</Text>
          <Text>Localização: {dadosScan.Localização}</Text>
        </View>
      ) : (
        <Text>Escaneie um código de barras</Text>
      )}
    </View>
  );
}
