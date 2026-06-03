const CSV_URL =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvm9G4sdAd6lVVB39YEUOSzAtk4c6megl4qhqk7gmC9VO0OsMM7HmzHl-XhbP-7rcEdXo37lgzkBBU/pub?gid=0&single=true&output=csv';

const tickets = document.getElementById('tickets');

async function cargar() {

    try {

        const response = await fetch(CSV_URL);

        console.log("STATUS:", response.status);

        const csv = await response.text();

        console.log(csv);

        tickets.innerHTML =
            "<h2>Google Sheets conectado correctamente</h2>";

    } catch(error) {

        console.error(error);

        tickets.innerHTML =
            "<h2>Error al leer Google Sheets</h2>";
    }
}

cargar();
