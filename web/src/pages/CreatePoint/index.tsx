import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import "./styles.css"
import { Link, useHistory } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import api from "../../services/api"
import axios from "axios"
import DropZone from "../../components/Dropzone"

import { Map, TileLayer, Marker } from "react-leaflet"
import { LeafletMouseEvent } from "leaflet"

import logo from "../../assets/logo.svg"

interface Item {
  id: number,
  title: string,
  image_url: string
}

interface Estado {
  id: number,
  sigla: string,
  nome: string,
}

interface Citys {
  id: number,
  nome: string
}

const CreatePoint = () => {
  const history = useHistory()
  const [ items, setItems ] = useState<Item[]>([])
  const [ estados, setEstados ] = useState<Estado[]>([])
  const [ uf, setUf ] = useState("0")
  const [ citys, setCitys ] = useState<Citys[]>([])
  const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0, 0])
  const [ formData, setFormData ] = useState({
      name: "",
      email: "",
      whatsapp: ""
  })

  const [ selectedCity, setSelectedCity ] = useState("0")
  const [ selectedPosition, setSelectedPosition ] = useState<[number, number]>([0, 0])
  const [ selectedItems, setSelectedItems ] = useState<number[]>([])
  const [ selectedFile, setSelectedFile ] = useState<File>()
  

  function handleChangeUf(event: ChangeEvent<HTMLSelectElement>) {
    setUf(event.target.value)
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value)
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setFormData({...formData, [name]: value})
  }

  function handleSelectItem(id: number) {
    // Retorna -1 se a condição for verdadeira e um número maior que zero se for falsa
    const alreadySelected = selectedItems.findIndex(item => item === id)

    if(alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)

      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }

  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    const {name, email, whatsapp} = formData
    const [latitude, longitude] = selectedPosition
    const items = selectedItems

    const data = new FormData()

    data.append("name", name)
    data.append("email", email)
    data.append("whatsapp", whatsapp)
    data.append("latitude", String(latitude))
    data.append("longitude", String(longitude))
    data.append("items", items.join(","))
    data.append("city", selectedCity)
    data.append("uf", uf)
    
    if(selectedFile) {
      data.append("image", selectedFile)
    }

    await api.post("/points", data)

    alert("Ponto de coleta criado!")
    history.push("/")
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      setInitialPosition([latitude, longitude])
    })
  }, [])

  useEffect(() => {
    api.get("items").then(response => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome").then(response => {
      setEstados(response.data)
    })
  }, [])

  useEffect(() => {
    if(uf === "0") {
      return
    }

    axios.get<Citys[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then(response => {
      const cityArray = response.data.map( city => (
        {id: city.id, nome: city.nome}
      ))

      setCitys(cityArray)
    })
  }, [uf])

  

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <DropZone onSelectedFile={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da Entidade</label>
            <input 
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">Whatsapp</label>
            <input 
              type="text"
              name="whatsapp"
              id="whatsapp"
              onChange={handleInputChange}
            />
          </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado(UF)</label>
              <select name="uf" id="uf" onChange={handleChangeUf} value={uf}>
                <option value="0">Selecione um Estado(UF)</option>
                {estados.map(estado => (
                  <option key={estado.id} value={estado.sigla}>{estado.nome} - {estado.sigla}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" onChange={handleSelectedCity} value={selectedCity}>
                <option value="0">Selecione uma Cidade</option>
                {citys.map(city => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li 
                key={item.id} 
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id)? "selected": ""}
              >
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>
            ))}
            
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint
