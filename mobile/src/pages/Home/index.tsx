import React, { useState, useEffect } from 'react'
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { View, Image, ImageBackground, Text, StyleSheet } from 'react-native'
import { RectButton } from "react-native-gesture-handler"
import RNPickerSelect from 'react-native-picker-select'
import axios from "axios"

interface Estados {
  label: string,
  value: string
}

interface IBGEapi {
  nome: string,
  sigla: string
}

const Home = () => {
  const [ estados, setEstados ] = useState<Estados[]>([])
  const [ uf, setUf ] = useState<string>("AC")
  const [ city, setCity ] = useState<string>("")
  const [ cities, setCities ] = useState<Estados[]>([])
  const navigation = useNavigation()

  function handleNavigatePoints() {
    navigation.navigate("Points", { city, uf })
  }

  useEffect(() => {
    axios.get<IBGEapi[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome").then(response => {
      const arrEstados = response.data.map( estado => (
        { label: `${estado.nome} - ${estado.sigla}`, value: estado.sigla }
      ))

      setEstados(arrEstados)
    })
  }, [])

  useEffect(() => {
    axios.get<IBGEapi[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then(response => {
      const arrCities = response.data.map( estado => (
        { label: `${estado.nome}`, value: estado.nome }
      ))

      setCities(arrCities)
    })
  }, [uf])

  return (
    <ImageBackground 
      style={styles.container}
      source={require("../../assets/home-background.png")}
      imageStyle={{
        width: 274, height: 368
      }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu Marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>

        <View style={styles.selectContainer}>
          <Text style={styles.selectTitle}>Selecione:</Text>
          <RNPickerSelect
              placeholder={{label: "Selecione um Estado(UF)"}}
              onValueChange={(value) => {setUf(value)}}
              items={estados}
          />

          <RNPickerSelect
              placeholder={{label: "Selecione uma Cidade"}}
              onValueChange={(value) => setCity(value)}
              items={cities}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigatePoints}>
          <View style={styles.buttonIcon}>
            <Feather name="arrow-right" size={24} color="#FFF" />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  selectContainer: {
    marginTop: 50,
  },
  selectTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium"
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home
