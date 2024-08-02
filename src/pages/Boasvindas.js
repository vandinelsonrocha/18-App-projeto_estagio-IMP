import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function Boasvindas() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Animatable.Image 
            animation='flipInY' 
            source={require('../assets/logo.png')} 
            style={{width: '100%', height: 200}} 
            resizeMode='contain'
        />
      </View>
      <Animatable.View animation='fadeInUp' delay={600} style={styles.containerAcesso}>
        <Text style={styles.titulo}>Gestão de equipamentos otimizada e inteligente, simplificando a gestão de Inventários!</Text>
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.botaoText}>Acessar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    containerLogo: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerAcesso:{
        flex: 1,
        backgroundColor: '#261E6B',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    titulo: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginTop: 28,
    },
    botao: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '15%',
        alignItems:'center',
        justifyContent: 'center',
    },
    botaoText: {
        fontSize: 18,
        color: '#261E6B',
        fontWeight: 'bold',
    }
})
