import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth } from '../firebase/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    if (email === '' && password === '') {
      setError('Preencha os campos para Entrar.');
      return;
    }

    if (email === '') {
      setError('O E-mail é obrigatório.');
      return;
    }

    if (password === '') {
      setError('A palavra-passe é obrigatória.');
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        setError('');
        navigation.navigate('Scan');
      })
      .catch((firebaseError) => {
        // Tratamento específico para códigos de erro
        switch (firebaseError.code) {
          case 'auth/user-not-found':
            setError('Você não tem permissões para acessar a aplicação.');
            break;
          case 'auth/invalid-email':
            setError('O e-mail inserido não é válido.');
            break;
          case 'auth/invalid-credential':
            setError('O e-mail ou a palavra-passe estão errados. Tente novamente.');
            break;
          default:
            setError('Ocorreu um erro inesperado. Tente novamente.');
            break;
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgUser}>
        <Image 
            source={require('../assets/user-login.png')} 
            style={{width: '100%', height: 200}} 
            resizeMode='contain'
        />
        <Text style={styles.titulo}>Faça login para continuar!</Text>
      </View>
      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Text style={styles.inputTitulo}>E-mail</Text>
        <TextInput style={styles.inputEmail}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <View>
          <Text style={styles.inputTitulo}>Palavra-passe</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.inputPassword}
              placeholder="Palavra-passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={toggleShowPassword} style={styles.icon}>
              <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.botao} onPress={handleLogin}>
          <Text style={styles.botaoText}>Entrar</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.msgErro}>{error}</Text> : null}
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#261E6B',
  },
  titulo: {
    textAlign: 'center',
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    padding: 16,
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  inputTitulo: {
    fontSize: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  inputEmail: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.9,
    borderBottomColor: 'black',
    marginBottom: 12,
    height: 40,
  },
  inputPassword: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  icon: {
    padding: 10,
  },
  botao: {
    backgroundColor: '#261E6B',
    width: '100%',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  msgErro: {
    textAlign: 'center',
    marginTop: 48,
    color: '#EF3236',
    fontSize: 16,
  }
})

