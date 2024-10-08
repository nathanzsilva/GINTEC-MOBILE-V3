import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native"
import styles from "../utils/styles";
import { useEffect, useState } from "react";
import httpClient from "../services/api";
import { FlatList } from "react-native-gesture-handler";


const Oficina = ({ navigation, route }) => {
    const { oficina, codigo, horarios } = route.params;
    const [showPhase, setShowPhase] = useState(false);
    const [scheduler, setScheduler] = useState(horarios);    

    const renderPhases = ({ item }) => {
        var userCode = async () => await AsyncStorage.getItem("usuarioCodigo")
        var date = new Date(item.horario);
        var feito = oficina.oficinaHorarioFuncionamentoCodigo == item.codigo
        return (
            <TouchableOpacity style={{ ...styles.button2, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                {feito ?
                    <Image source={require("../../assets/campeonatofeito.png")} />
                    :
                    <Image source={require("../../assets/campeonatopendente.png")} />
                }

                <Text style={{ ...styles.buttonText2 }}>{`${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`}</Text>
            </TouchableOpacity>
        )
    };
    return (
        <ImageBackground source={require("../../assets/oficina.png")} style={styles.backgroundImage}>
            <View style={{ marginTop: 80 }}>
                <TouchableOpacity onPress={() => { navigation.navigate("Oficinas") }}>
                    <Image source={require("../../assets/voltar.png")} style={styles.voltar} />
                </TouchableOpacity>
                <View style={{ height: showPhase ? 150 : 400, justifyContent: "center", alignSelf: "flex-start", marginLeft: 29 }}>
                    <Text style={{ ...styles.titleGG, color: "white" }}>{oficina}</Text>
                    <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>Jogo de pátio</Text>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 40, borderTopRightRadius: 40, justifyContent: "space-around", alignItems: "center" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                    <Text style={{ fontSize: 20 }} t>Quantidade de pontos</Text>
                    <View style={{ backgroundColor: "#E8FBE4", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                        <Text style={{ fontSize: 15, color: "#3ACF1F" }}> 300</Text>
                    </View>
                </View>
                {(scheduler ?? []).length > 0 ?
                    <TouchableOpacity style={{ width: "80%" }} onPress={() => { setShowPhase(!showPhase) }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginVertical: 10 }}>
                            <Text style={{ fontSize: 20, fontWeight: 500, textAlign: "left" }}>Fases</Text>
                            <Image source={require("../../assets/setabaixo.png")} style={{ transform: [{ rotate: showPhase ? "0deg" : "180deg" }] }} />
                        </View>
                        {showPhase ?
                            <FlatList
                                contentContainerStyle={{ justifyContent: "space-evenly", width: "100%" }}
                                data={scheduler}
                                renderItem={renderPhases}
                            />
                            : ""
                        }

                    </TouchableOpacity>
                    : <Text>Campeonato não iniciado</Text>}
                <TouchableOpacity style={{ ...styles.button, marginTop: 35, width: 280 }} onPress={() => { navigation.navigate("QrCode") }}>
                    <Text style={styles.buttonText}>Validar Campeonato</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

export default Oficina;