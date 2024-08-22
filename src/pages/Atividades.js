import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import httpClient from "../services/api";

const Atividades = ({ navigation }) => {
    const [isPendente, setIsPendente] = useState(true);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        handleGetActivities()
    }, [])

    const handleGetActivities = async () => {
        httpClient.get("/Atividade/AtividadesFeitas").then((response) => {
            setActivities(response.data);
            setLoading(false)
        })
    }

    const renderActivities = ({ item }) => {        
        return (
            <TouchableOpacity onPress={() => { navigation.navigate("Atividade", { atividade: item.descricao }) }}>
                <View style={{ margin: 10, alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, flexDirection: "row", borderWidth: 1.75, borderColor: "#4C7EFF", justifyContent: "space-between" }}>
                    <Text style={{ color: "#4C7EFF" }}>{item.descricao}</Text>
                    <Image source={require("../../assets/botaoseta.png")} />
                </View>
            </TouchableOpacity >
        )
    };
    return (
        <View style={{ paddingTop: 80 , backgroundColor: "#fff", flex: 1}}>
            <TouchableOpacity onPress={() => { navigation.navigate("FichaPessoal") }}>
                <Image source={require("../../assets/voltar.png")} style={styles.voltar} />
            </TouchableOpacity>
            <Text style={{ ...styles.title2, marginTop: 30 }}>Ficha de Atividades</Text>
            {isPendente ?
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 35 }}>
                    <TouchableOpacity style={{ ...styles.button2, backgroundColor: "#FDD5D1" }}>
                        <Text style={{ ...styles.buttonText2, color: "#7E0000" }}>Pendentes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.button2 }} onPress={() => { setIsPendente(!isPendente) }}>
                        <Text style={{ ...styles.buttonText2, color: "#DADADA" }}>Concluído</Text>
                    </TouchableOpacity>
                </View>
                :
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 35 }}>
                    <TouchableOpacity style={{ ...styles.button2 }} onPress={() => { setIsPendente(!isPendente) }}>
                        <Text style={{ ...styles.buttonText2, color: "#DADADA" }}>Pendentes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.button2, backgroundColor: "#E8FBE4" }}>
                        <Text style={{ ...styles.buttonText2, color: "#3ACF1F" }}>Concluído</Text>
                    </TouchableOpacity>
                </View>
            }
            {
                loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 200 }} />
                ) : activities.filter(x => x.isRealizada == !isPendente).length > 0 ? (
                    <FlatList
                        data={activities.filter(x => x.isRealizada == !isPendente)}
                        renderItem={renderActivities}
                        style={{ marginLeft: 25, marginTop: 20 }}
                    />
                ) : (
                    <View style={{ height: 400, width: "100%", alignItems: "center", justifyContent: "center" }}>
                        <Text>Sem Atividades</Text>
                    </View>
                )
            }


        </View>
    )
}

export default Atividades;