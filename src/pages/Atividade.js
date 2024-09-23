import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native"
import styles from "../utils/styles";


const Atividade = ({ navigation, route }) => {
    const { atividade, isPendente } = route.params;
    return (
        <ImageBackground source={require("../../assets/atividade.png")} style={styles.backgroundImage}>
            <View style={{ marginTop: 80 }}>
                <TouchableOpacity onPress={() => { navigation.navigate("Atividades") }}>
                    <Image source={require("../../assets/voltar.png")} style={styles.voltar} />
                </TouchableOpacity>
                <View style={{ height: 400, justifyContent: "center", alignSelf: "flex-start", marginLeft: 29 }}>
                    <Text style={{ ...styles.titleGG, color: "white" }}>{atividade}</Text>
                    <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>Jogo de pátio</Text>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 40, borderTopRightRadius: 40, justifyContent: "space-around", alignItems: "center" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                    <Text style={{ fontSize: 20 }} t>Quantidade de pontos</Text>
                    <View style={{ backgroundColor: "#E8FBE4", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                        <Text style={{ fontSize: 15, color: "#3ACF1F" }}> 600</Text>
                    </View>
                </View>
                {isPendente ? <TouchableOpacity style={{ ...styles.button, marginTop: 35, width: 280 }} onPress={() => { navigation.navigate("QrCode") }}>
                    <Text style={styles.buttonText}>Validar Atividade</Text>
                </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ ...styles.button2, backgroundColor: "#E8FBE4", width: "60%" }}>
                        <Text style={{ ...styles.buttonText2, color: "#3ACF1F", fontSize: 25, fontWeight: 400 }}>Atividade Concluído</Text>
                    </TouchableOpacity>
                }

            </View>
        </ImageBackground>
    )
}

export default Atividade;