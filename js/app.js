const CSV_URL =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvm9G4sdAd6lVVB39YEUOSzAtk4c6megl4qhqk7gmC9VO0OsMM7HmzHl-XhbP-7rcEdXo37lgzkBBU/pub?gid=0&single=true&output=csv';

const tickets = document.getElementById('tickets');

async function cargarBoletos() {

```
try {

    const response = await fetch(CSV_URL);

    const csv = await response.text();

    const filas = csv.trim().split('\n');

    const datos = {};

    for (let i = 1; i < filas.length; i++) {

        const columnas = filas[i].split(',');

        const numero =
            String(parseInt(columnas[0]))
            .padStart(3, '0');

        const estado =
            columnas[1]
            .trim()
            .toLowerCase();

        datos[numero] = estado;
    }

    tickets.innerHTML = '';

    let vendidos = 0;

    for (let i = 1; i <= 200; i++) {

        const numero =
            String(i).padStart(3, '0');

        const estado =
            datos[numero] || 'disponible';

        let clase = 'disponible';

        if (estado === 'apartado') {
            clase = 'apartado';
        }

        if (estado === 'pagado') {
            clase = 'pagado';
            vendidos++;
        }

        const d =
            document.createElement('div');

        d.className =
            'ticket ' + clase;

        d.textContent =
            numero;

       d.onclick = () => {
    alert(numero);
};

        tickets.appendChild(d);
    }

    document.getElementById('stats').innerHTML =
        `${vendidos} vendidos de 200`;

    document.getElementById('progress').style.width =
        `${(vendidos / 200) * 100}%`;

} catch (error) {

    console.error(error);

    tickets.innerHTML =
        '<h3>Error cargando boletos</h3>';
}
```

}

cargarBoletos();
