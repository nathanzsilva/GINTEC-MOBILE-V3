import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/api';

const Perfil = ({ navigation }) => {
    const [role, setRole] = useState(false)
    const [user, setUser] = useState({})
    const [allPoints, setAllPoints] = useState(0)
    const [averagePoints, setAveragePoints] = useState(0)
    const [todayPoints, setTodayPoints] = useState(0)

    useEffect(() => {
        handleGetRole();
        handleGetUser()
    }, [])
    const handleGetRole = async () => {
        var att = await AsyncStorage.getItem("atividadeCodigo");
        var camp = await AsyncStorage.getItem("campeonatoCodigo");

        await setRole(att != "null" ? true : camp != "null" ? true : false)
    }
    const handleLogOut = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('userPassword');

            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
        }
    }
    const handleGetUser = async () => {
        const userID = await AsyncStorage.getItem("usuarioCodigo")
        httpClient.get("/Usuario/" + userID).then((response) => {
            setUser(response.data);

            let todosPontos = 0;
            let pontosHoje = 0;
            const pontosPorDia = {};

            response.data.atividadeCampeonatoRealizada.forEach((item) => {
                const pontuacaoExtra = item?.atividadePontuacaoExtra?.Pontuacao ?? 0;
                const pontos = pontuacaoExtra + 300;
                
                todosPontos += pontos;
                
                const dataFormatada = new Date(item.dataCad).toISOString().split('T')[0];
                
                if (pontosPorDia[dataFormatada]) {
                    pontosPorDia[dataFormatada] += pontos;
                } else {
                    pontosPorDia[dataFormatada] = pontos;
                }
                
                const hoje = new Date().toISOString().split('T')[0];
                if (dataFormatada === hoje) {
                    pontosHoje += pontos;
                }
            });

            const mediaPontosPorDia = todosPontos / Object.keys(pontosPorDia).length;

            setAllPoints(todosPontos.toString());
            setAveragePoints(isNaN(mediaPontosPorDia) ? 0 : mediaPontosPorDia);
            setTodayPoints(pontosHoje.toString());
        });
    }
    return (
        <ImageBackground source={require("../../assets/perfilbg.png")} style={styles.backgroundImage}>
            <View style={{ marginTop: 80 }}>
                <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
                    <Image source={require("../../assets/voltar.png")} style={styles.voltar} />
                </TouchableOpacity>
                <View style={{ height: 150, marginBottom: 30, justifyContent: "flex-start", alignSelf: "flex-start", width: "100%", alignItems: "center" }}>
                    <Text style={{ ...styles.title, color: "white" }}>Seu Perfil</Text>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 40, borderTopRightRadius: 40, justifyContent: "space-around", alignItems: "center" }}>
                <View style={stylesLocal.profileSection}>
                    <Image style={{ ...stylesLocal.profileImage, bottom: 120, position: 'absolute' }} source={{ uri: 'https://via.placeholder.com/100' }} />
                    <Text style={stylesLocal.profileName}>{user?.nome}</Text>
                    <Text style={stylesLocal.profileDetail}>{user?.sala?.serie}° {user?.sala?.descricao}</Text>
                    <Text style={stylesLocal.profileDetail}>RM: {user?.rm}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: "90%", justifyContent: 'space-between', marginVertical: 20, backgroundColor: "#005C6D", paddingHorizontal: 15, paddingVertical: 30, borderRadius: 30 }}>
                    <View style={stylesLocal.metric}>
                        <Text style={stylesLocal.metricTitle}>Pontuação Total</Text>
                        <Text style={stylesLocal.metricValue}>{allPoints}</Text>
                    </View>
                    <View style={{ width: 2, height: "100%", borderColor: "#fff", borderWidth: 1 }}>

                    </View>
                    <View style={stylesLocal.metric}>
                        <Text style={stylesLocal.metricTitle}>Pontuação Média</Text>
                        <Text style={stylesLocal.metricValue}>{averagePoints}</Text>
                    </View>
                    <View style={{ width: 2, height: "100%", borderColor: "#fff", borderWidth: 1 }}>
                    </View>
                    <View style={stylesLocal.metric}>
                        <Text style={stylesLocal.metricTitle}>Pontuação do dia</Text>
                        <Text style={stylesLocal.metricValue}>{todayPoints}</Text>
                    </View>

                </View>
                {role ? <TouchableOpacity style={{ width: "80%" }}>
                    <Text style={{ fontSize: 17, color: "#00C1CF" }}>Transferir titulo de ajudante</Text>
                </TouchableOpacity>
                    :
                    ""}

                <TouchableOpacity style={{ ...styles.button, backgroundColor: "#B20000" }} onPress={handleLogOut}>
                    <Text style={styles.buttonText}>Sair da conta</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const stylesLocal = StyleSheet.create({
    profileSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 500,
        backgroundColor: '#ccc',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    profileDetail: {
        fontSize: 16,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        width: '80%',
        borderRadius: 5,
    },
    metric: {
        alignItems: 'center',
    },
    metricTitle: {
        fontSize: 11,
        color: '#fff',
    },
    metricValue: {
        marginTop: 12,
        fontSize: 14,
        color: "#fff",
        fontWeight: 'bold',
    },
});

export default Perfil;
