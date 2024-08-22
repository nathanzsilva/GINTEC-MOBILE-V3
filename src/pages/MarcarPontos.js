import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, Modal, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import styles from '../utils/styles';
import httpClient from '../services/api';

const MarcarPontos = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [rm, setRm] = useState('');

    const handleConfirmRm = () => {
        setModalVisible(false);
        try {
            httpClient.post("/Atividade/MarcarPontos2", {
                token: rm,
            })
        }
        catch (error) {

        }
        finally {
            setRm('');
        }
    };

    return (
        <>
            <View style={localstyles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={localstyles.centeredView}>
                        <View style={localstyles.modalView}>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                <Image source={require('../../assets/voltar.png')} style={styles.voltar} />
                            </TouchableOpacity>
                            <Text style={{ fontWeight: '600', fontSize: 15, textAlign: "center" }}>Validar atividade </Text>
                            <Text style={{ color: 'rgba(0, 0, 0, 0.4)', marginLeft: 30, marginTop: 10 }}>
                                Escolha o modo pelo qual deseja validar a atividade.
                            </Text>
                            <View style={{ alignItems: "center", width: "100%" }}>
                                <View style={{ ...styles.inputContainer, marginTop: 20 }}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Digite seu RM"
                                        placeholderTextColor="#ccc"
                                        value={rm}
                                        onChangeText={setRm}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                                <TouchableOpacity style={{ ...styles.button, marginTop: 35 }} onPress={handleConfirmRm}>
                                    <Text style={styles.buttonText}>Validar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>
            </View>
            <View style={{ marginTop: 80, height: '100%' }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Home'); }}>
                    <Image source={require('../../assets/voltar.png')} style={styles.voltar} />
                </TouchableOpacity>
                <Text style={{ ...styles.title2, marginTop: 30, textAlign: 'left', marginLeft: 40 }}>Escanear Atividade</Text>
                <Text style={{ color: 'rgba(0, 0, 0, 0.4)', marginLeft: 30, marginTop: 10 }}>
                    Escolha o modo pelo qual deseja validar a atividade.
                </Text>
                <View style={{ marginTop: 35, marginHorizontal: 30, justifyContent: 'space-around', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Scanner'); }}>
                        <View style={styles.buttonScanner}>
                            <View style={{ backgroundColor: 'white', height: 30, width: 30, borderRadius: 1000, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={require('../../assets/camera.png')} />
                            </View>
                            <Text>Câmera</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <View style={styles.buttonScanner}>
                            <View style={{ backgroundColor: 'white', height: 30, width: 30, borderRadius: 1000, alignItems: 'center', justifyContent: 'center' }}>
                            </View>
                            <Text>RM</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const localstyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        width: "80%",
        height: "50%",
        backgroundColor: 'white',
        borderRadius: 30,
        paddingVertical: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default MarcarPontos;
