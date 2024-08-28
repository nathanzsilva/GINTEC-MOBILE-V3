import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import httpClient from '../services/api';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [seePassWord, setSeePassWord] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailValidate, setEmailValidate] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordValidate, setPasswordValidate] = useState(false);

  useEffect(() => {
    handleAutoLogin();
  }, []);

  const handleAutoLogin = async () => {
    var email = await AsyncStorage.getItem("email");
    var password = await AsyncStorage.getItem("password");
    
    if(!email || !password)
      return;
    setLoading(true);
    if (email && password) {
      httpClient.post('/Auth', {
        email: email,
        password: password,
      })
        .then(response => {
          setLoading(false);
          if (response.status == 200) {
            handleSaveStorage(response.data, password);
            navigation.navigate('Logado');
          }
        })
        .catch(error => {
          setLoading(false);
        });
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    if (!email) setEmailValidate(true);
    else setEmailValidate(false);

    if (!password) setPasswordValidate(true);
    else setPasswordValidate(false);

    if (!password || !email) {
      setLoading(false);
      return;
    }

    httpClient.post('/Auth', {
      email: email,
      password: password,
    })
      .then(response => {
        if (response.status == 200) {
          handleSaveStorage(response.data, password);
          setLoading(false);
          navigation.navigate('Logado');
        }
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Erro', 'Usuário ou senha incorretos');
      });
  };

  const handleSaveStorage = async (request, password) => {  
    httpClient.defaults.headers.authorization = `Bearer ${request.token}`;
    AsyncStorage.setItem("email", request.email);
    AsyncStorage.setItem("password", password);
    AsyncStorage.setItem("status", String(request.status));
    AsyncStorage.setItem("usuarioCodigo", String(request.usuarioCodigo));
    AsyncStorage.setItem("atividadeCodigo", String(request.atividadeCodigo));
    AsyncStorage.setItem("campeonatoCodigo", String(request.campeonatoCodigo));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={false}>
        <View style={screenstyles.containerloginhead}>
          <Image
            source={require('../../assets/icon.png')}
            style={{ height: 133, width: 153, objectFit: "contain" }}
          />
        </View>
        <View style={screenstyles.containerloginbody}>
          <Text style={{ ...styles.title, marginVertical: 40 }}>Faça seu Login</Text>
          <View style={styles.inputContainer}>
            <Image source={require('../../assets/user.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu RM"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <Text style={{ ...styles.errorText, marginBottom: 45 }}>
            {emailValidate ? "Por favor, digite seu e-mail!" : ""}
          </Text>
          <View style={styles.inputContainer}>
            <Image source={require('../../assets/cadeado.png')} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={seePassWord}
            />
            <TouchableOpacity onPress={() => { setSeePassWord(!seePassWord) }}>
              <Image source={require('../../assets/olho.png')} style={{ ...styles.icon, objectFit: "fill" }} />
            </TouchableOpacity>
          </View>
          <Text style={styles.errorText}>
            {passwordValidate ? "Por favor, digite sua senha!" : ""}
          </Text>
          <TouchableOpacity style={{ ...styles.button, marginTop: 35 }} onPress={handleLogin}>
            <Text style={styles.buttonText}>
              {loading ? <ActivityIndicator size="large" color="#fff" /> : "Entrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const screenstyles = StyleSheet.create({
  containerloginhead: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 330
  },
  containerloginbody: {
    shadowOffset: {
      width: 0, height: -4
    },
    shadowOpacity: 0.12,
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
});
