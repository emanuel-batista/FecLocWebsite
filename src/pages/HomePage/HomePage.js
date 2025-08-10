import styles from "./HomePage.module.css";
import googleBadge from "../../assets/google-badge.webp";
import aplleBadge from "../../assets/apple-badge.webp";


function HomePage() {
    return (
        <div className={styles.homepage}>
            <div className={styles.downloads}>
                <img src={googleBadge} alt="Download no Google Play Store" className={styles.badge}/>
                <img src={aplleBadge} alt="Download no Apple Store" className={styles.badge}/>
            </div>
        </div>
    );
}

export default HomePage;