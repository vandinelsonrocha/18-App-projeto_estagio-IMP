import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { auth } from '../firebase/config';

export default function Scan({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    navigation.navigate('DadosEquipamentos', { dadosCodBarras: data });
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para usar a câmera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <Button title={"Escanear novamente"} onPress={() => setScanned(false)} />
        )}
      </View>
      <Button title={"Aceder inventário"} onPress={() => navigation.navigate('Inventario')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 208, 
    width: '100%', 
    maxWidth: 208, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'blue',
  },
  text:  {
    textAlign: 'center',
    marginTop: '2rem',
  },
  absoluteFillObject:  {
    borderRadius: 20,
  }
});