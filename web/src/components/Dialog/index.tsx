import React, { useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";

import "./styles.css";

interface Props {
  navigateBack: () => void;
}

const Dialog = (props: Props) => {
  useEffect(() => {
    async function handleTime() {
      await setTimeout(() => {
        props.navigateBack();
      }, 2000);
    }

    handleTime();
  }, []);

  return (
    <div className="container">
      <FiCheckCircle color="#2fb86e" size={45} />
      <p className="texto">Cadastro concluído!</p>
    </div>
  );
};

export default Dialog;
