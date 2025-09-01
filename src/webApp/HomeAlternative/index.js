import PlaceCard from "components/HomeAlternative/PlaceCard";
import styles from "./hAlternative.module.css";
import cardniteImg from "./cardnite.jpg"; // <-- Import the image
import SearchBar from "components/HomeAlternative/SearchBar";

function HomeAlternative() {
    return (
        <div>
            <SearchBar />
            <h2 className={styles.h2}>Unidades</h2>
            <div className={styles.hAlternative}>
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
                <PlaceCard backgroundImage={cardniteImg} standName={'Nite'} />
                
            </div>
        </div>
    );
}

export default HomeAlternative;