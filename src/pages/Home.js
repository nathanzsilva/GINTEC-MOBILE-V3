import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, TouchableOpacity, ImageBackground, } from 'react-native';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import httpClient from '../services/api';


const Home = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(false)

    useEffect(() => {
        handleGetRole();
        handleGetNotification();
    }, [])

    const handleGetRole = async () => {
        var att = await AsyncStorage.getItem("atividadeCodigo");
        var camp = await AsyncStorage.getItem("campeonatoCodigo");

        await setRole(att != "null" ? true : camp != "null" ? true : false)
    }

    const handleGetNotification = async () => {
        setLoading(true)
        httpClient.get("/Notificacao").then((response) => {            
            setNotifications(response.data);
        })
        setLoading(false)
    }

    const renderNotification = ({ item }) => (
        <View style={{
            marginVertical: 10, marginHorizontal: 5, padding: 10, borderRadius: 5, flexDirection: "row", backgroundColor: "#ffff", borderRadius: 8,
            shadowColor: "#000", // Cor da sombra
            shadowOffset: { width: 0, height: 0 }, // Deslocamento da sombra
            shadowOpacity: 0.25, // Opacidade da sombra
            shadowRadius: 3.84, // Raio da sombra
            elevation: 5, // Somente para Android
            height: 77,                        
        }}>
            <View style={{ backgroundColor: item.color, height: "100%", width: 8, marginRight: 6, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'space-evenly', marginLeft: 10}}>
                <Text style={styles.notificationTitle}>{item.titulo}</Text>
                <Text style={{ ...styles.notificationBody, fontWeight: '300' }}>{item.descricao}</Text>
            </View>
        </View>
    );
    return (
        <View style={{ paddingTop: 50, flex: 1, backgroundColor: "#fff" }}>
            <View style={{ height: 30 }}>
                {/* <Image source={require("../../assets/sinoAtivado.png")} style={{ alignSelf: 'flex-end', marginRight: 40 }} height={140} /> */}
            </View>
            <Text style={{ ...styles.title2, alignSelf: 'flex-start', marginLeft: 30, marginBottom: 30 }}>Olá, seja Bem-Vindo</Text>
            <View style={{ height: 270, display: "flex", flexDirection: "row" }}>

                {!role ?
                    <View style={{ alignItems: "center", justifyContent: "center", width: "50%", height: "100%", justifyContent: "space-evenly" }}>
                        <TouchableOpacity onPress={() => { navigation.navigate('FichaPessoal') }}>
                            <ImageBackground source={require("../../assets/fichaPessoal.png")} style={{ width: 150, height: "100%", justifyContent: "flex-end", alignItems: "flex-start" }} imageStyle={{ objectFit: "contain" }}>
                                <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "left", marginBottom: 50, marginLeft: 10 }}>
                                    {"Ficha \n Pessoal"}
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{ alignItems: "center", justifyContent: "space-evenly", width: "50%", height: "100%" }}>
                        <TouchableOpacity onPress={() => { navigation.navigate('FichaPessoal') }}>
                            <ImageBackground source={require("../../assets/fichaPessoalMini.png")} style={{ width: 150, height: 105, justifyContent: "flex-end", alignItems: "flex-start" }} imageStyle={{ objectFit: "contain" }}>
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 10, marginLeft: 10 }}>
                                    {'Ficha\n Pessoal'}
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate('MarcarPontos') }}>
                            <ImageBackground source={require("../../assets/Scanner.png")} style={{ width: 150, height: 105, justifyContent: "flex-end", alignItems: "flex-start" }} imageStyle={{ objectFit: "contain" }}>
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 15, marginLeft: 10 }}>
                                    {"Scanner"}
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                }

                <View style={{ alignItems: "center", justifyContent: "space-evenly", width: "50%", height: "100%" }}>
                    <TouchableOpacity onPress={() => { navigation.navigate("Ranking") }}>
                        <ImageBackground source={require("../../assets/ranking.png")} style={{ width: 150, height: 105, justifyContent: "flex-end", alignItems: "flex-start" }} imageStyle={{ objectFit: "contain" }}>
                            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 19, marginLeft: 10 }}>
                                Ranking
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("Perfil") }}>
                        <ImageBackground source={require("../../assets/perfil.png")} style={{ width: 150, height: 105, justifyContent: "flex-end", alignItems: "flex-start" }} imageStyle={{ objectFit: "contain" }}>
                            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 19, marginLeft: 10 }}>
                                Perfil
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

            </View>
            <Text style={{ ...styles.title2, alignSelf: 'flex-start', marginLeft: 30, marginBottom: 30 }}>Últimas notificações</Text>

            {
                loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (

                    <FlatList scrollEnabled={true}
                        data={notifications}
                        renderItem={renderNotification}
                        style={{ paddingHorizontal: 25 }}
                        contentContainerStyle={{
                            paddingBottom: 50,
                            justifyContent: 'center'
                        }}
                    />

                )
            }
        </View >
    );
};

export default Home;