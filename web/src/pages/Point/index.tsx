import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

import { Map, TileLayer, Marker } from "react-leaflet";

import "./styles.css";
import logo from "../../assets/logo.svg";

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

interface Props {
  location: {
    state: {
      point: Point;
      items: Items[];
    };
  };
}

const Point = (props: Props) => {
  const [point, setPoint] = useState<Point>();
  const [items, setItems] = useState<Items[]>();

  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

  useEffect(() => {
    setPoint(props.location.state.point);
    setItems(props.location.state.items);
    setPosition([
      props.location.state.point.latitude,
      props.location.state.point.longitude,
    ]);
  }, []);

  return (
    <div id="page-point">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
          <Link to="/">
            <FiArrowLeft />
            Voltar para página de procura
          </Link>
        </header>
        <div className="point">
          <img src={point?.image_url} alt="point" />
          <div className="dados">
            <h1>{point?.name}</h1>
            <Map center={position} zoom={15}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} />
            </Map>
            <h4>Pelotas, RS</h4>
            <div className="res-group">
              <h4>Resíduos coletados: </h4>
              <span> {items?.map((item) => item.title).join(", ")}</span>
            </div>

            <div className="contact-group">
              <h4>Contato</h4>
              <ul>
                <li>
                  <span>
                    <strong>Whatsapp:</strong> {point?.whatsapp}
                  </span>
                  <button
                    onClick={() =>
                      window.open(
                        `https://web.whatsapp.com/send?text="Olá! Gostaria de mais informações sobre o ecoponto"&phone=${point?.whatsapp}`
                      )
                    }
                  >
                    <span>
                      <FaWhatsapp />
                    </span>
                    <strong>Send zap</strong>
                  </button>
                </li>

                <li>
                  <span>
                    <strong>E-mail:</strong> {point?.email}
                  </span>
                  <button>
                    <span>
                      <FaEnvelope />
                    </span>
                    <strong>Send Mail</strong>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Point;
