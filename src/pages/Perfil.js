import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import httpClient from '../services/api';
import * as ImagePicker from 'expo-image-picker';



const Perfil = ({ navigation }) => {
    const [role, setRole] = useState(false)
    const [user, setUser] = useState({})
    const [allPoints, setAllPoints] = useState(0)
    const [averagePoints, setAveragePoints] = useState(0)
    const [todayPoints, setTodayPoints] = useState(0)
    const [isEditing, setIsEditing] = useState(false)
    const [editUser, setEditUser] = useState({})
    const [fotoPerfil, setFotoPerfil] = useState("");

    useEffect(() => {
        handleGetRole();
        handleGetUser()
    }, [])

    const selecionarImagem = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setFotoPerfil(uri);
        }
    };

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
            setEditUser({ ...response.data, confsenha: response.data.senha });


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

    const handleEditUser = async () => {
        try {
            console.log(editUser.senha)
            console.log(editUser.confsenha)
            if (editUser.senha != editUser.confsenha) {
                Alert.alert('Alerta', 'As senhas não conferem.');
                return
            }
            const formData = new FormData();
            formData.append('email', editUser.email);
            formData.append('senha', editUser.senha);
            if (fotoPerfil) {
                const uri = fotoPerfil;
                const fileType = uri.split('.').pop(); // Obtém o tipo do arquivo
                formData.append('imagem', {
                    uri,
                    name: `fotoPerfil.${fileType}`, // Nome do arquivo
                    type: `image/${fileType}`, // Tipo MIME
                });
            }
            await httpClient.put(`/Usuario/Atualizar`, formData).then((response) => {
                console.log(response)
            });
            setUser(editUser);
            setIsEditing(false); 
            Alert.alert('Sucesso', 'Dados do usuário atualizados com sucesso.');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar os dados do usuário. Tente novamente.');
        }
    };

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
                    <TouchableOpacity onPress={selecionarImagem} style={{ bottom: 120, position: 'absolute' }}>
                        <Image
                            style={{ ...stylesLocal.profileImage, }}
                            source={{ uri: user.fotoPerfil ?? 'https://via.placeholder.com/100' }}
                        />
                    </TouchableOpacity>
                    {isEditing ? (
                        <View style={{ position: 'relative', top: 55, alignItems: 'center', width: "80%" }}>
                            <TextInput
                                style={{ ...stylesLocal.input }}
                                value={editUser.email}
                                onChangeText={(text) => setEditUser({ ...editUser, email: text })}
                            />
                            <TextInput
                                style={stylesLocal.input}
                                value={editUser.senha}
                                onChangeText={(text) => setEditUser({ ...editUser, senha: text })}
                            />
                            <TextInput
                                style={stylesLocal.input}
                                value={editUser.confsenha?.toString()}
                                onChangeText={(text) => setEditUser({ ...editUser, confsenha: text })}
                            />
                        </View>
                    ) : (
                        <>
                            <Text style={stylesLocal.profileName}>{user?.nome}</Text>
                            <Text style={stylesLocal.profileDetail}>{user?.sala?.serie}° {user?.sala?.descricao}</Text>
                            <Text style={stylesLocal.profileDetail}>RM: {user?.rm}</Text>
                        </>
                    )}
                </View>
                <View style={{ flexDirection: 'row', width: "90%", justifyContent: 'space-between', marginVertical: 20, backgroundColor: "#005C6D", paddingHorizontal: 15, paddingVertical: 30, borderRadius: 30 }}>
                    <View style={stylesLocal.metric}>
                        <Text style={stylesLocal.metricTitle}>Pontuação Total</Text>
                        <Text style={stylesLocal.metricValue}>{allPoints}</Text>
                    </View>
                    <View style={{ width: 2, height: "100%", borderColor: "#fff", borderWidth: 1 }} />
                    <View style={stylesLocal.metric}>
                        <Text style={stylesLocal.metricTitle}>Pontuação Média</Text>
                        <Text style={stylesLocal.metricValue}>{averagePoints}</Text>
                    </View>
                    <View style={{ width: 2, height: "100%", borderColor: "#fff", borderWidth: 1 }} />
                    <View style={stylesLocal.metric}>
                        <Text style={stylesLocal.metricTitle}>Pontuação do dia</Text>
                        <Text style={stylesLocal.metricValue}>{todayPoints}</Text>
                    </View>
                </View>

                {isEditing ? (
                    <TouchableOpacity style={{ ...styles.button, backgroundColor: "#00C1CF" }} onPress={handleEditUser}>
                        <Text style={styles.buttonText}>Salvar Alterações</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{ ...styles.button, backgroundColor: "#00C1CF" }} onPress={() => setIsEditing(true)}>
                        <Text style={styles.buttonText}>Editar Perfil</Text>
                    </TouchableOpacity>
                )}

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
        width: "100%"
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
        width: '100%',
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
