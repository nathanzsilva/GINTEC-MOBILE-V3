import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native"
import styles from "../utils/styles";
import { useEffect, useState } from "react";
import httpClient from "../services/api";
import { FlatList } from "react-native-gesture-handler";


const CampeonatoP = ({ navigation, route }) => {
    const { campeonato, codigo } = route.params;
    const [showPhase, setShowPhase] = useState(false);
    const [championship, setChampionship] = useState({});

    useEffect(() => {
        handleGetChampionship();
    }, [])

    const handleGetChampionship = () => {
        httpClient.get("/Campeonato/" + codigo).then((response) => {
            setChampionship(response.data)
        })
    }

    const renderPhases = ({ item }) => {
        var userCode = async () => await AsyncStorage.getItem("usuarioCodigo")        
        var jogos = item.jogos;
        var feita = []
        if(jogos){
            var attrealizada = jogos.filter(x => x.atividadeCampeonatoRealizada.length > 0)
            feita = attrealizada.filter(x => x.usuarioCodigo == userCode)
        }
        return (
            <TouchableOpacity style={{ ...styles.button2, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                {feita.length > 0 ?
                    <Image source={require("../../assets/campeonatofeito.png")} />
                    :
                    <Image source={require("../../assets/campeonatopendente.png")} />
                }

                <Text style={{ ...styles.buttonText2 }}>{item.descricao}</Text>
            </TouchableOpacity>
        )
    };
    return (
        <ImageBackground source={require("../../assets/campeonatoP.png")} style={styles.backgroundImage}>
            <View style={{ marginTop: 80 }}>
                <TouchableOpacity onPress={() => { navigation.navigate("CampeonatoPatio") }}>
                    <Image source={require("../../assets/voltar.png")} style={styles.voltar} />
                </TouchableOpacity>
                <View style={{ height: showPhase ? 150 : 400, justifyContent: "center", alignSelf: "flex-start", marginLeft: 29 }}>
                <Text style={{ ...styles.titleGG, color: "white", textAlign: "left" }}>{campeonato}</Text>
                    <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>Campeonato de pátio</Text>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 40, borderTopRightRadius: 40, justifyContent: "space-around", alignItems: "center" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                    <Text style={{ fontSize: 20 }} t>Quantidade de pontos</Text>
                    <View style={{ backgroundColor: "#E8FBE4", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                        <Text style={{ fontSize: 15, color: "#3ACF1F" }}> 600</Text>
                    </View>
                </View>
                {(championship?.fases ?? []).length > 0 ?
                    <TouchableOpacity style={{ width: "80%" }} onPress={() => { setShowPhase(!showPhase) }}>
                        <View style={{                            
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 7,
                            marginVertical: 10,
                            backgroundColor: "#ffff",
                            borderRadius: 10,
                            justifyContent: "center",
                            shadowColor: "#000", // Cor da sombra
                            shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
                            shadowOpacity: 0.25, // Opacidade da sombra
                            shadowRadius: 3.84, // Raio da sombra
                            elevation: 5, // Somente para Android,                            
                            paddingVertical: 8,
                            width: "35%"
                        }}>
                            <Text style={{ fontSize: 20, fontWeight: 500, textAlign: "left" }}>Fases</Text>
                            <Image source={require("../../assets/setabaixo.png")} style={{ transform: [{ rotate: showPhase ? "0deg" : "180deg" }] }} />
                        </View>
                        {showPhase ?
                            <FlatList
                                contentContainerStyle={{ justifyContent: "space-evenly",alignItems: "flex-start", width: "100%" }}
                                data={championship.fases}
                                renderItem={renderPhases}
                                style={{width: "100%"}}                                
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

export default CampeonatoP;