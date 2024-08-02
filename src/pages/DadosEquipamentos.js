import React, { useEffect, useState } from 'react';
import { Alert, View, Text } from 'react-native';
import { db, auth } from '../firebase/config';

export default function DadosEquipamentos({ route, navigation }) {
  const [dadosEquipamentos, setDadosEquipamentos] = useState(null);
  const { dadosCodBarras } = route.params || {};

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await db.collection('usuariosAutenticados').doc(user.uid).get();
        if (userDoc.exists) {
          if (dadosCodBarras) {
            db.collection('equipamentos').doc(dadosCodBarras).get().then((doc) => {
              if (doc.exists) {
                setDadosEquipamentos(doc.data());
              } else {
                Alert.alert('Dados', 'O equipamento não existe!');
                navigation.navigate('Scan')
              }
            }).catch((error) => {
              Alert.alert('Erro', 'Erro ao buscar documento: ', error);
            });
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
      {dadosEquipamentos ? (
        <View>
          <Text>Nome: {dadosEquipamentos.Nome}</Text>
          <Text>Descrição: {dadosEquipamentos.Descrição}</Text>
          <Text>Localização: {dadosEquipamentos.Localização}</Text>
        </View>
      ) : (
        <Text>Escaneie um código de barras</Text>
      )}
    </View>
  );
}
