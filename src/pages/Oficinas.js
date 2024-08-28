import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import httpClient from "../services/api";

const Oficinas = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [workshopsDates, setWorkshopsDates] = useState([]);
    const [workshops, setWorkshops] = useState([]);
    const [workshopsFilter, setWorkshopsFilter] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        handleGetWorkshops()
    }, [])
    useEffect(() => {
        const currentDate = new Date(selectedDate) ?? new Date();
        setWorkshopsFilter(workshops.filter(x => {
            const gincanaDate = new Date(x.data);
            return gincanaDate.getFullYear() === currentDate.getFullYear() &&
                gincanaDate.getMonth() === currentDate.getMonth() &&
                gincanaDate.getDate() === currentDate.getDate();
        }))


    }, [selectedDate])

    const handleGetWorkshops = async () => {
        httpClient.get("/Oficina").then((response) => {
            const uniqueDates = new Set();  

            response.data.forEach(item => {
                if (item.data) {
                    uniqueDates.add(item.data);
                }
            });
            setWorkshopsDates(Array.from(uniqueDates.keys()));
            var date = response.data.find(x => {
                var currentDate = new Date();
                var date = new Date(x.data)
                return date.getFullYear() === currentDate.getFullYear() &&
                    date.getMonth() === currentDate.getMonth() &&
                    date.getDate() === currentDate.getDate();
            }).data

            setWorkshopsFilter(response.data.filter(x => {
                var currentDate = date ? new Date(date) : new Date();
                var date = new Date(x.data)
                return date.getFullYear() === currentDate.getFullYear() &&
                    date.getMonth() === currentDate.getMonth() &&
                    date.getDate() === currentDate.getDate();
            }));
            setLoading(false)
        })
    }

    const renderworkshops = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { navigation.navigate("Oficina", { oficina: item.descricao, codigo: item.codigo, horarios: item.horariosFuncionamento }) }}>
                <View style={{ margin: 10, alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, flexDirection: "row", borderWidth: 1.75, borderColor: "#00C1CF", justifyContent: "space-between" }}>
                    <Text style={{ color: "#00C1CF" }}>{item.descricao}</Text>
                    <Image source={require("../../assets/botaosetaazul.png")} />
                </View>
            </TouchableOpacity >
        )
    };
    const renderDataWorkShops = ({ item }) => {
        var date = new Date(item);
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
            <Text style={{ ...styles.title2, marginTop: 30 }}>Oficinas</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 35 }}>
                <FlatList
                    contentContainerStyle={{ justifyContent: "space-evenly", width: "100%" }}
                    horizontal={true}
                    data={workshopsDates}
                    renderItem={renderDataWorkShops}
                />
            </View>

            {
                loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 200 }} />
                ) : (workshopsFilter ?? []).length > 0 ? (
                    <FlatList
                        data={workshopsFilter}
                        renderItem={renderworkshops}
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


export default Oficinas;