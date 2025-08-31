function index() {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) {
        alert("Por favor, acesse este site a partir de um dispositivo móvel.");
        window.location.href = "/";
    }
}

export default index;