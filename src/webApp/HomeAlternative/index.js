import PlaceCard from "components/HomeAlternative/PlaceCard";
import styles from "./hAlternative.module.css";
import cardniteImg from "./cardnite.jpg"; // <-- Import the image
import SearchBar from "components/HomeAlternative/SearchBar";
import { Alert } from "@mui/material";

function HomeAlternative() {
    const auth = getAuth();

    const handleLogout = () => {
        signOut(auth).then(() => {
            <Alert severity="success">Sign-out successful.</Alert>
        }).catch((error) => {
            <Alert severity="error">An error happened.</Alert>
        });
    };

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
            {/* logout button */}
            <button className={styles.logoutButton}>Logout</button>
        </div>
    );
}

export default HomeAlternative;