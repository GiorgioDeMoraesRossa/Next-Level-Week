import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import api from "../../services/api";
import "./styles.css";
import logo from "../../assets/logo.svg";

interface Props {
  location: {
    state: {
      selectedUf: number;
      selectedCity: number;
    };
  };
}

interface Point {
  id: number;
  image: string;
  image_url: string;
  email: string;
  whatsapp: string;
  name: string;
  city: string;
  uf: string;
  latitude: number;
  longitude: number;
}

interface Items {
  title: string;
}

interface Data {
  point: Point;
  items: {
    title: string;
  }[];
}

const FindPoint = (props: Props) => {
  const [points, setPoints] = useState<Data[]>();

  useEffect(() => {
    api
      .get(
        `pointsItems?city=${encodeURIComponent(
          String(props.location.state.selectedCity).trim()
        )}&uf=${props.location.state.selectedUf}`
      )
      .then((response) => {
        console.log(response);
        let arr = [{} as Data];
        let count = 0;
        for (response.data.points of response.data.points) {
          arr = [
            ...arr,
            {
              point: response.data.points,
              items: response.data.items[count],
            },
          ];
          count++;
        }
        arr = arr.slice(1);

        if (arr.length > 0) {
          setPoints(arr);
        }
      });
  }, [props.location.state.selectedCity, props.location.state.selectedUf]);

  return (
    <div id="page-find">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
          <Link to="/">
            <FiArrowLeft />
            Voltar para página inicial
          </Link>
        </header>
        <div className="list">
          <ul className="items-grid">
            {!!points ? (
              points.map((point) => (
                <Link
                  className="point"
                  to={{
                    pathname: "/point",
                    state: { point: point.point, items: point.items },
                  }}
                  key={point.point.id}
                >
                  <img src={point.point.image_url} alt="Ponto" />
                  <span> {point.point.name}</span>
                  <p>
                    {point.point.city}, {point.point.uf}
                  </p>
                  <p className="items-text">
                    {point.items.map((item) => item.title).join(", ")}
                  </p>
                </Link>
              ))
            ) : (
              <div className="zero">
                <h3>Não encontramos nenhum ponto para esta localidade :(</h3>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FindPoint;
