import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import httpClient from "../services/api";

const CampeonatoQuadra = ({ navigation }) => {
    const [isPendente, setIsPendente] = useState(true);
    const [loading, setLoading] = useState(true);
    const [championshipsDates, setChampionshipDates] = useState([]);
    const [championships, setChampionships] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        handleGetChampionship()
    }, [])
    useEffect(() => {
        const currentDate = new Date(selectedDate) ?? new Date();
        const currentDateInApiResponse = championshipsDates.find(x => {
            const gincanaDate = new Date(x.dataGincana);
            return gincanaDate.getFullYear() === currentDate.getFullYear() &&
                gincanaDate.getMonth() === currentDate.getMonth() &&
                gincanaDate.getDate() === currentDate.getDate();
        });
        if (currentDateInApiResponse)
            setChampionships(currentDateInApiResponse.campeonatos)
        
    }, [selectedDate])

    const handleGetChampionship = async () => {
        setLoading(true)

        httpClient.get("/Calendario").then((response) => {
            setChampionshipDates(response.data);
            const currentDate = new Date(selectedDate) ?? new Date();
            const currentDateInApiResponse = response.data.find(x => {
                const gincanaDate = new Date(x.dataGincana);
                return gincanaDate.getFullYear() === currentDate.getFullYear() &&
                    gincanaDate.getMonth() === currentDate.getMonth() &&
                    gincanaDate.getDate() === currentDate.getDate();
            });
            if (currentDateInApiResponse)
                setChampionships(currentDateInApiResponse.campeonatos)
            else
                setChampionships(response.data[0].campeonatos)

            setLoading(false)
        })
    }

    const renderChampionship = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { navigation.navigate("CampeonatoQ", { campeonato: item.descricao, codigo: item.codigo }) }}>
                <View style={{ margin: 10, alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, flexDirection: "row", borderWidth: 1.75, borderColor: "#8A29E6", justifyContent: "space-between" }}>
                    <Text style={{ color: "#8A29E6" }}>{item.descricao}</Text>
                    <Image source={require("../../assets/botaosetaroxa.svg")} />
                </View>
            </TouchableOpacity >
        )
    };
    const renderDataChampionship = ({ item }) => {
        var date = new Date(item.dataGincana);
        return (
            <TouchableOpacity style={{ ...styles.button2, justifyContent: "center" }} onPress={() => { setSelectedDate(item.dataGincana) }}>
                <Text style={{ ...styles.buttonText2, color: "#005C6D" }}>{`${date.getDate().toString().padStart(2, "0")}/${date.getMonth().toString().padStart(2, "0")}`}</Text>
            </TouchableOpacity>
        )
    };
    return (
        <View style={{ paddingTop: 80, backgroundColor: "#fff", flex: 1 }}>
            <TouchableOpacity onPress={() => { navigation.navigate("FichaPessoal") }}>
                <Image source={require("../../assets/voltar.png")} style={styles.voltar} />
            </TouchableOpacity>
            <Text style={{ ...styles.title2, marginTop: 30 }}>Campeonatos de Quadra</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 35 }}>
                <FlatList
                    contentContainerStyle={{ justifyContent: "space-evenly", width: "100%" }}
                    horizontal={true}
                    data={championshipsDates}
                    renderItem={renderDataChampionship}
                />
            </View>

            {
                loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 200 }} />
                ) : championships.length > 0 ? (
                    <FlatList
                        data={championships}
                        renderItem={renderChampionship}
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

export default CampeonatoQuadra;