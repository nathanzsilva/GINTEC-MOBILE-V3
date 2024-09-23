import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import httpClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Scanner = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            await Camera.requestCameraPermissionsAsync();
            const { status } = await Camera.getCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        httpClient.post("/Usuario/InformacoesQRCode", {
            token: data
        }).then((response) => {
            Alert.alert(
                `Deseja validar os pontos de ${response.data.nome}!`,
                '',
                [
                    {
                        text: 'Não',
                        onPress: () => { },
                        style: 'cancel',
                    },
                    {
                        text: 'Sim',
                        onPress: async () => {
                            var credencial = await handleGetAjudante();
                            let atividadesExtras = [];                            

                            if (credencial.attCode != "null") {
                                await httpClient.get("/Atividade/" + credencial.attCode)
                                    .then((response) => {
                                        if (response.status == 200)
                                            if (response.data.atividadePontuacaoExtra.length > 0) {
                                                atividadesExtras = response.data.atividadePontuacaoExtra;
                                            }
                                            else if (response.status == 400) {
                                                if (response.data.error == "Você já jogou este jogo/campeonato")
                                                    Alert.alert(
                                                        'Atividade Feita!',
                                                        'Você já jogou este jogo/campeonato.',
                                                        [{ text: 'OK' }],
                                                        { cancelable: false }
                                                    );
                                                else if (response.data.error == "Atividade não é deste dia")
                                                    Alert.alert(
                                                        'Atividade não pode ser marcada!',
                                                        'Esta atividade não pode ser marcada, pois não pertence a este dia da Gincana.',
                                                        [{ text: 'OK' }],
                                                        { cancelable: false }
                                                    );
                                            }
                                    });

                                if (atividadesExtras.length > 0) {
                                    let buttons = [{ pontuacao: "Participação", AtividadePontuacaoExtraCodigo: null }, ...atividadesExtras].map((extra) => ({
                                        text: `Pontuação: ${extra.pontuacao}`,
                                        onPress: async () => {
                                            await httpClient.post("/Atividade/MarcarPontos", {
                                                token: data,
                                                atividadeCodigo: credencial.attCode,
                                                campeonatoCodigo: credencial.campCode,
                                                AtividadePontuacaoExtraCodigo: extra.codigo
                                            }).then((response) => {                                                
                                                if (response.status == 200)
                                                    Alert.alert(
                                                        'Pontos Marcados!',
                                                        'A atividade foi realizada com sucesso.',
                                                        [{ text: 'OK' }],
                                                        { cancelable: false }
                                                    );
                                                else if (response.status == 400) {
                                                    if (response.data.error == "Você já jogou este jogo/campeonato")
                                                        Alert.alert(
                                                            'Atividade Feita!',
                                                            'Você já jogou este jogo/campeonato.',
                                                            [{ text: 'OK' }],
                                                            { cancelable: false }
                                                        );
                                                    else if (response.data.error == "Atividade não é deste dia")
                                                        Alert.alert(
                                                            'Atividade não pode ser marcada!',
                                                            'Esta atividade não pode ser marcada, pois não pertence a este dia da Gincana.',
                                                            [{ text: 'OK' }],
                                                            { cancelable: false }
                                                        );
                                                }
                                            }).catch((error) => {                                                
                                            });
                                        },
                                    }));

                                    Alert.alert(
                                        'Selecione a Pontuação Extra',
                                        'Escolha a pontuação extra para essa atividade:',
                                        buttons,
                                        { cancelable: true }
                                    );
                                } else {
                                    await httpClient.post("/Atividade/MarcarPontos", {
                                        token: data,
                                        atividadeCodigo: credencial.attCode,
                                        campeonatoCodigo: credencial.campCode

                                    }).then((response) => {                                        
                                        if (response.status == 200)
                                            Alert.alert(
                                                'Pontos Marcados!',
                                                'A atividade foi realizada com sucesso.',
                                                [{ text: 'OK' }],
                                                { cancelable: false }
                                            );
                                        else if (response.status == 400) {
                                            if (response.data.error == "Você já jogou este jogo/campeonato")
                                                Alert.alert(
                                                    'Atividade Feita!',
                                                    'Você já jogou este jogo/campeonato.',
                                                    [{ text: 'OK' }],
                                                    { cancelable: false }
                                                );
                                            else if (response.data.error == "Atividade não é deste dia")
                                                Alert.alert(
                                                    'Atividade não pode ser marcada!',
                                                    'Esta atividade não pode ser marcada, pois não pertence a este dia da Gincana.',
                                                    [{ text: 'OK' }],
                                                    { cancelable: false }
                                                );
                                        }
                                    }).catch((error) => {                                        
                                    });
                                }
                            }
                            if (credencial.attCode == "null") {
                                await httpClient.post("/Atividade/MarcarPontos", {
                                    token: data,
                                    atividadeCodigo: credencial.attCode,
                                    campeonatoCodigo: credencial.campCode

                                }).then((response) => {                                    
                                    if (response.status == 200)
                                        Alert.alert(
                                            'Pontos Marcados!',
                                            'A atividade foi realizada com sucesso.',
                                            [{ text: 'OK' }],
                                            { cancelable: false }
                                        );
                                    else if (response.status == 400) {
                                        if (response.data.error == "Você já jogou este jogo/campeonato")
                                            Alert.alert(
                                                'Atividade Feita!',
                                                'Você já jogou este jogo/campeonato.',
                                                [{ text: 'OK' }],
                                                { cancelable: false }
                                            );
                                    }
                                }).catch((error) => {                                    
                                });
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
            return;
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleGetAjudante = async () => {
        const attCode = await AsyncStorage.getItem("atividadeCodigo");
        const campCode = await AsyncStorage.getItem("campeonatoCodigo");


        return {
            attCode: attCode,
            campCode: campCode
        };
    };

    if (hasPermission === null) {
        return <Text>Solicitando permissão para usar a câmera</Text>;
    }
    if (hasPermission === false) {
        return <Text style={{ marginTop: 200, textAlign: "center" }}>Sem acesso à câmera</Text>;
    }

    return (
        <View style={{ marginTop: 80, height: "100%" }}>
            <TouchableOpacity onPress={() => { navigation.navigate("MarcarPontos") }}>
                <Image source={require("../../assets/voltar.png")} style={styles.voltar} />
            </TouchableOpacity>
            <View style={{ marginTop: 40, flex: 1, backgroundColor: "red" }}>
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "pdf417"],
                    }}
                    style={StyleSheet.absoluteFillObject}
                />
                {scanned && (
                    <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
                )}
            </View>
        </View>
    );
};


export default Scanner;
