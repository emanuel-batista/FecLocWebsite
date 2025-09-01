import PlaceCard from "components/HomeAlternative/PlaceCard";
import styles from "./hAlternative.module.css";

function HomeAlternative(){

    return(
        <div className={styles.hAlternative}>
            <h2>Unidades</h2>
            <PlaceCard backgroundImage={'../../assets/cardnite.jpg'} standName={'Nite'} />
        </div>
    );
}

export default HomeAlternative;