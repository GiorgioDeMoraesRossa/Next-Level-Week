import React, { useEffect } from "react";

import "./styles.css";

interface Props {
  next: () => void;
}

const Dialog: React.FC<Props> = (props) => {
  useEffect(() => {
    async function handleTime() {
      await setTimeout(() => {
        props.next();
      }, 2000);
    }

    handleTime();
  }, [props]);

  return <div className="container">{props.children}</div>;
};

export default Dialog;
