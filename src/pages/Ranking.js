import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import styles from '../utils/styles';
import httpClient from '../services/api';

const Ranking = ({ navigation }) => {
    const [rankingStudents, setRankingStudents] = useState([]);
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        handleGetRanking();
    }, [])

    const handleGetRanking = async () => {
        httpClient.get("/Usuario/ObterPontuacaoGeral").then((response) => {
            setRankingStudents(response.data)

                ;

            const turmaPontuacaoGeral = response.data.reduce((acc, student) => {
                const turma = student.turma;
                const pontuacaoGeral = student.pontos.pontuacaGeral;


                if (acc[turma])
                    acc[turma] += pontuacaoGeral;
                else
                    acc[turma] = pontuacaoGeral;


                return acc;
            }, {});

            setRanking(Object.entries(turmaPontuacaoGeral).map(([turma, pontuacaoGeral], index) => ({
                position: index,
                turma,
                pontuacaoGeral
            })));

            console.log(Object.entries(turmaPontuacaoGeral).map(([turma, pontuacaoGeral], index) => ({
                position: index + 1,
                turma,
                pontuacaoGeral
            })))
        })
    }
    return (
        <ImageBackground style={styles.backgroundImage} source={require('../../assets/RankingBG.png')}>
            <View style={{ marginTop: 80, height: "100%" }}>
                <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity onPress={() => { navigation.navigate("Home") }}>
                        <Image source={require("../../assets/voltar.png")} style={styles.voltar} />
                    </TouchableOpacity>
                    <Image source={require("../../assets/comboBoxIcon.png")} style={{ width: 30, height: 30, backgroundColor: "white", borderRadius: 7 }} />
                </View>

                <Text style={{ ...styles.title2, color: "white", textAlign: 'left', marginLeft: 40 }}>Ranking das salas</Text>
                <View style={{ marginTop: 40, display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end" }}>
                    <View style={style.rankingItem2}>
                        <Text style={style.rankTitle}>2º Lugar</Text>
                        <View style={{ backgroundColor: "white", width: 70, height: 70, borderRadius: 100 }}></View>
                        <Text style={style.rankName}>Recursos Humanos</Text>
                        <Text style={style.rankPoints}>121.140</Text>
                    </View>
                    <View style={style.rankingItem1}>
                        <Text style={style.rankTitle}>1º Lugar</Text>
                        <View style={{ backgroundColor: "white", width: 90, height: 90, borderRadius: 100 }}></View>
                        <Text style={style.rankName}>Informática</Text>
                        <Text style={style.rankPoints}>135.390</Text>
                    </View>
                    <View style={style.rankingItem3}>
                        <Text style={style.rankTitle}>3º Lugar</Text>
                        <View style={{ backgroundColor: "white", width: 70, height: 70, borderRadius: 100 }}></View>
                        <Text style={style.rankName}>Administração</Text>
                        <Text style={style.rankPoints}>110.450</Text>
                    </View>
                </View>
                <View style={{ flex: 1,marginTop: -10,  backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, justifyContent: "space-around", alignItems: "center", }}>
                    <FlatList
                        data={ranking}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {

                            return (
                                <View style={{ marginVertical: 10, width: "100%", paddingHorizontal: 60, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={styles.itemText}>{item.position}º </Text>
                                    <View style={{ backgroundColor: "grey", width: 30, height: 30, borderRadius: 100 }}></View>
                                    <View style={{ width: 150 }}>
                                        <Text style={styles.itemText}>{item.turma}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                        <Image source={require("../../assets/estrela.png")} style={{ height: 15, width: 15 }} />
                                        <Text style={styles.itemPoints}>{item.pontuacaoGeral}</Text>
                                    </View>
                                </View>
                            )
                        }
                        }
                    />
                </View>
            </View>
        </ImageBackground>
    );
};

const style = StyleSheet.create({
    rankingItem2: {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        height: 200,
        width: 100,
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 20,
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-around",
        alignItems: "center"
    },
    rankingItem1: {
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 20,
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-around",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        height: 250,
        width: 120,
        alignItems: "center"
    },
    rankingItem3: {
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 20,
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-around",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        height: 180,
        width: 100,
        alignItems: "center"
    },
    rankTitle: {
        color: 'white',
        fontSize: 15,
        fontWeight: "700"
    },
    rankName: {
        fontWeight: "500"
    },
    rankPoints: {
        color: "#ffcc64",
        fontWeight: "800"
    }
});

export default Ranking;
