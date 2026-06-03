const CSV_URL =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvm9G4sdAd6lVVB39YEUOSzAtk4c6megl4qhqk7gmC9VO0OsMM7HmzHl-XhbP-7rcEdXo37lgzkBBU/pub?gid=0&single=true&output=csv';

const tickets = document.getElementById('tickets');

let todosLosBoletos = [];

function actualizarCountdown() {

```
const fechaSorteo = new Date('2026-06-28T23:59:59');

const ahora = new Date();

const diferencia = fechaSorteo - ahora;

const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

const horas = Math.floor(
    (diferencia % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
);

const minutos = Math.floor(
    (diferencia % (1000 * 60 * 60)) /
    (1000 * 60)
);

document.getElementById('countdown').innerHTML =
    `⏳ Sorteo: 28 de junio de 2026<br>
    Faltan ${dias} días ${horas} horas ${minutos} minutos`;
```

}

function crearBoleto(numero, estado) {

```
const d = document.createElement('div');

d.className = 'ticket ' + estado;

d.textContent = numero;

d.onclick = () => window.open(
    `https://wa.me/522297787027?text=Hola,%20me%20interesa%20el%20boleto%20%23${numero}`,
    '_blank'
);

tickets.appendChild(d);
```

}

function filtrar(tipo) {

```
tickets.innerHTML = '';

let lista = todosLosBoletos;

if (tipo !== 'todos') {
    lista = todosLosBoletos.filter(
        b => b.estado === tipo
    );
}

lista.forEach(b => {
    crearBoleto(b.numero, b.estado);
});
```

}

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

    let disponibles = 0;
    let apartados = 0;
    let pagados = 0;

    todosLosBoletos = [];

    for (let i = 1; i <= 200; i++) {

        const numero =
            String(i).padStart(3, '0');

        const estado =
            datos[numero] || 'disponible';

        if (estado === 'pagado') {
            pagados++;
        } else if (estado === 'apartado') {
            apartados++;
        } else {
            disponibles++;
        }

        todosLosBoletos.push({
            numero,
            estado
        });
    }

    document.getElementById('stats').innerHTML =
        `${pagados} vendidos de 200`;

    document.getElementById('progress').style.width =
        `${(pagados / 200) * 100}%`;

    document.getElementById('resumen').innerHTML =
        `🟢 Disponibles: ${disponibles}
        &nbsp;&nbsp;
        🟡 Apartados: ${apartados}
        &nbsp;&nbsp;
        🟥 Pagados: ${pagados}`;

    filtrar('todos');

    actualizarCountdown();

    setInterval(
        actualizarCountdown,
        60000
    );

} catch (error) {

    console.error(error);

    tickets.innerHTML =
        '<h3>Error cargando boletos</h3>';
}
```

}

window.filtrar = filtrar;

cargarBoletos();
