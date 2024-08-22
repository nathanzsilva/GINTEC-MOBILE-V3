import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const QrCode = () => {
    const [qr, setQr] = useState('');

    useEffect(() => {
        handleGenerateQrCode();
    }, [])

    const handleGenerateQrCode = async () => {
        const userCode = await AsyncStorage.getItem("usuarioCodigo");
        const email = await AsyncStorage.getItem("email");
        console.log(JSON.stringify({
            UsuarioCodigo: Number(userCode),
            Email: email
        }))
        await axios.post("https://5q91oxvsj0.execute-api.us-east-1.amazonaws.com/default/Crypto/Criptografar", {
            mensagem: JSON.stringify({
                UsuarioCodigo: Number(userCode),
                Email: email
            })
        }).then((response) => {
            setQr(response.data.token)

        })
            .catch(error => {
                Alert.alert('Erro', 'Usuário ou senha incorretos');
            });
    }

    return (
        <View style={stylescreen.containerlogin}>
            <View style={{width: "100%", alignItems: "flex-start"}}>
                <Text style={{...styles.title2, marginLeft: 40, marginTop: 70}}>Validar Atividade</Text>
                <Text style={{marginLeft: 40, marginTop:20}}>Apresente o QR Code ao ajudante da atividade para efetuar a validação.</Text>
            </View>
            {qr ?                
                    <Image source={{ uri: "https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=" + qr }} style={{ width: 220, height: 220, margin: 8, marginTop: 150 }} />                
                :
                <ActivityIndicator size="large" color="#0000ff"  style={{margin: 8, marginTop: 150}}/>
            }
        </View>
    );
};

export default QrCode;

const stylescreen = StyleSheet.create({
    containerlogin: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 45
    }
})