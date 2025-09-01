import PlaceCard from "components/HomeAlternative/PlaceCard";
import styles from "./hAlternative.module.css";
import cardniteImg from "./cardnite.jpg"; // <-- Import the image

function HomeAlternative(){
    return(
        <div className={styles.hAlternative}>
            <h2>Unidades</h2>
            <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
        </div>
    );
}

export default HomeAlternative;