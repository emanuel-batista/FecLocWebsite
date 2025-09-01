import StandardButton from "components/common/StandardButton";
import styles from "./homealternative.module.css";

function PlaceCard({ backgroundImage, standName }) {
  // O estilo inline em React espera um objeto.
  // A propriedade CSS 'background-image' se torna 'backgroundImage' em camelCase.
  // O valor deve ser uma string, como `url(...)`.
  const cardStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover", // Garante que a imagem cubra todo o elemento
    backgroundPosition: "center", // Centraliza a imagem no contêiner
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className={styles.container} style={cardStyle}>
      <div className={styles.infos}>
        <h2 className="h2">{standName}</h2>
        <StandardButton label={"VEJA QUAIS STANDS ESTÃO AQUI!"} type={"#"} />
      </div>
    </div>
  );
}

export default PlaceCard;
