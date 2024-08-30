import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    navigation.navigate('DadosScan', { dadosCodBarras: data });
  };

  if (hasPermission === null) {
    return <Text style={[styles.msgText, styles.msgText1]}>Solicitando permissão para usar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={[styles.msgText, styles.msgText2]}>Sem acesso à câmera!</Text>;
  }
  return (
    <View style={styles.wrapper}>
      <Text style={styles.scanDica}>Aponte a câmera para o código de barras para escanear.</Text>
      <View style={styles.container}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <TouchableOpacity onPress={() => setScanned(false)}>
            <Text style={styles.scan}>Escanear novamente</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.bordasCamera, styles.cimaEsq]} />
        <View style={[styles.bordasCamera, styles.cimaDireita]} />
        <View style={[styles.bordasCamera, styles.baixoEsq]} />
        <View style={[styles.bordasCamera, styles.baixoDireita]} />
      </View>
      <View style={styles.categoriaContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Equipamentos')}>
          <Text style={[styles.categoria, styles.categoriaEquip]}>Equipamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Mobilias')}>
          <Text style={styles.categoria}>Mobílias</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
    padding: 20,
  },
  scanDica: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 48,
    fontWeight: '700',
  },
  container: {
    height: 208,
    width: '100%',
    maxWidth: 238,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
    position: 'relative',
  },
  scan: {
    textTransform: 'uppercase',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 3,
    padding: 4,
    color: '#261E6B',
    opacity: .8,
    fontWeight: '600',
  },
  bordasCamera: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderColor: '#FFFFFF',
  },
  cimaEsq: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cimaDireita: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  baixoEsq: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  baixoDireita: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  categoria: {
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    color: '#261E6B',
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 4,
    textAlign: 'center',
  },
  categoriaEquip: {
    marginBottom: 28,
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
