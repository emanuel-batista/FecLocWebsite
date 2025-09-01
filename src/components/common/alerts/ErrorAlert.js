import global from '../global.module.css'
import { useEffect, useState } from 'react';

function ErrorAlert({ message }) {
    const [isVisible, setIsVisible] = useState(true);

    // After 5 seconds, the alert should disappear
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={global.errorAlert}>
            <p>{message}</p>
        </div>
    );
}

export default ErrorAlert;