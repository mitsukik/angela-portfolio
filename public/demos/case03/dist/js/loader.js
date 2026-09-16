/* loader */
    var loader;
    function loader() {
        loader = setTimeout(showPage, 1000);
    }
    function showPage() {
        document.getElementById("loader").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
    }