import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, TouchableOpacity, } from 'react-native';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';


const Home = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(false)

    useEffect(() => {
        handleGetRole();
        setTimeout(() => {
            setNotifications([{ title: "Campeonato de pátio", body: "Campeonato de pátio" }, { title: "Campeonato de pátio", body: "Campeonato de pátio" }, { title: "Campeonato de pátio", body: "Campeonato de pátio" }, { title: "Campeonato de pátio", body: "Campeonato de pátio" }, { title: "Campeonato de pátio", body: "Campeonato de pátio" }])
            setLoading(false)            
        }, 500);
    }, [])

    const handleGetRole = async () => {
        var att = await AsyncStorage.getItem("atividadeCodigo");
        var camp = await AsyncStorage.getItem("campeonatoCodigo");

        await setRole(att != "null" ? true : camp != "null" ? true : false)
    }

    const renderNotification = ({ item }) => (
        <View style={{ margin: 10, padding: 10, borderRadius: 5, flexDirection: "row" }}>
            <View style={{ backgroundColor: "red", height: "100%", width: 8, marginRight: 6, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
            </View>
            <View>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationBody}>{item.body}</Text>
            </View>
        </View>
    );
    return (
        <View style={{ marginTop: 50, flex: 1 }}>
            <View style={{height: 30}}>
                {/* <Image source={require("../../assets/sinoAtivado.png")} style={{ alignSelf: 'flex-end', marginRight: 40 }} height={140} /> */}
            </View>
            <Text style={{ ...styles.title2, alignSelf: 'flex-start', marginLeft: 30, marginBottom: 30 }}>Olá, seja Bem-Vindo</Text>
            <View style={{ height: 270, display: "flex", flexDirection: "row" }}>

                {!role ?
                    <View style={{ alignItems: "center", justifyContent: "center", width: "50%", height: "100%", justifyContent: "space-evenly" }}>
                        <TouchableOpacity onPress={() => { navigation.navigate('FichaPessoal') }}>
                            <Image source={require("../../assets/fichaPessoal.png")}  style={{width: 150, objectFit: "contain"}}/>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{ alignItems: "center", justifyContent: "space-evenly", width: "50%", height: "100%" }}>
                        <TouchableOpacity onPress={() => { navigation.navigate('FichaPessoal') }}>
                            <Image source={require("../../assets/fichaPessoalMini.png")} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate('MarcarPontos') }}>
                            <Image source={require("../../assets/Scanner.png")} />
                        </TouchableOpacity>
                    </View>
                }

                <View style={{ alignItems: "center", justifyContent: "space-evenly", width: "50%", height: "100%" }}>
                    <TouchableOpacity onPress={() => { navigation.navigate("Ranking") }}>
                        <Image source={require("../../assets/ranking.png")}  style={{width: 150, objectFit: "contain", height: 105}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("Perfil") }}>
                    <Image source={require("../../assets/perfil.png")} style={{width: 150, objectFit: "contain", height: 105}}/>
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
                        style={{
                            marginLeft: 25,
                            paddingHorizontal: 25, height: "80px"
                        }}
                        contentContainerStyle={{
                            paddingBottom: 50
                        }}
                    />

                )
            }
        </View >
    );
};

export default Home;