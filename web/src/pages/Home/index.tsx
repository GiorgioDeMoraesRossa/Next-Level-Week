import React, { useState, useEffect, ChangeEvent } from "react";
import { FiLogIn, FiSearch, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import Dialog from "../../components/Dialog";
import axios from "axios";

import "./styles.css";

import logo from "../../assets/logo.svg";

interface IBGEUFresponse {
  sigla: string;
}
interface IBGECityresponse {
  nome: string;
}

const Home = () => {
  const [dialog, setDialog] = useState(false);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [cities, setCities] = useState<string[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<IBGEUFresponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }
    axios
      .get<IBGECityresponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(event.target.value);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  function handleBack() {
    setSelectedCity("");
    setSelectedUf("");
    setDialog(false);
  }

  return (
    <div>
      {dialog ? (
        <Dialog next={() => {}}>
          <header>
            <button onClick={handleBack}>
              <FiArrowLeft />
              Voltar para tela inicial
            </button>
          </header>
          <div className="container-texts-inputs">
            <div className="field">
              <label htmlFor="uf">Selecione a UF</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectedUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Selecione a cidade</label>
              <select name="city" id="city" onChange={handleSelectedCity}>
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <Link
              to={{ pathname: "/find", state: { selectedUf, selectedCity } }}
            >
              <span>
                <FiSearch />
              </span>
              <strong>Procurar pontos!</strong>
            </Link>
          </div>
        </Dialog>
      ) : null}

      <div id="page-home">
        <div className="content">
          {!dialog && (
            <header>
              <img src={logo} alt="Ecoleta" />
              <Link to="/create-point">
                <FiLogIn />
                Cadastre um ponto de coleta
              </Link>
            </header>
          )}

          <main>
            <h1>Seu marketplace de coleta de resíduos</h1>
            <p>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </p>
            <button onClick={() => setDialog(true)}>
              <span>
                <FiSearch />
              </span>
              <strong>Pesquisar pontos de coleta</strong>
            </button>
          </main>
        </div>
      </div>
    </div>
  );
};
export default Home;
