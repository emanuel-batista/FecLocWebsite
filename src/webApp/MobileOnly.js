import { useEffect } from "react";

function isMobileDevice() {
  return /android|iphone|ipad|ipod|windows phone/i.test(navigator.userAgent);
}

const MobileOnly = ({ children }) => {
  useEffect(() => {
    if (!isMobileDevice()) {
      alert("Por favor, acesse esta página usando um celular.");
      window.location.href = "/";
    }
  }, []);

  return children;
};

export default MobileOnly;