const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQvm9G4sdAd6lVVB39YEUOSzAtk4c6megl4qhqk7gmC9VO0OsMM7HmzHl-XhbP-7rcEdXo37lgzkBBU/pub?gid=0&single=true&output=csv';

const TOTAL = 200;
const INTERVALO_MS = 15000; // 15 segundos — suficiente para Sheets y sin abusar

// Estado anterior para comparar y solo tocar los boletos que cambiaron
let estadoAnterior = {};
let inicializado = false;

async function cargarBoletos() {
  try {
    const response = await fetch(CSV_URL + '&nocache=' + Date.now(), {
      cache: 'no-store'
    });

    if (!response.ok) throw new Error('Error HTTP ' + response.status);

    const csv = await response.text();
    const filas = csv.trim().split('\n');

    const datos = {};
    for (let i = 1; i < filas.length; i++) {
      const columnas = filas[i].split(',');
      const numero = (columnas[0] || '').trim();
      let estado = (columnas[1] || '').trim().toLowerCase();
      if (!estado) estado = 'disponible';
      if (numero) datos[numero] = estado;
    }

    const contenedor = document.getElementById('tickets');

    // Primera carga: construir todos los boletos de una vez
    if (!inicializado) {
      const fragment = document.createDocumentFragment();
      for (let i = 1; i <= TOTAL; i++) {
        const numero = String(i).padStart(3, '0');
        const estado = datos[numero] || 'disponible';
        const clase = claseDeEstado(estado);

        const d = document.createElement('div');
        d.className = 'ticket ' + clase;
        d.id = 'ticket-' + numero;
        d.textContent = numero;
        d.onclick = () =>
          window.open(
            `https://wa.me/522297787027?text=Hola,%20me%20interesa%20el%20boleto%20%23${numero}`,
            '_blank'
          );
        fragment.appendChild(d);
      }
      contenedor.appendChild(fragment);
      inicializado = true;
    } else {
      // Actualizaciones siguientes: solo tocar los boletos que cambiaron
      for (let i = 1; i <= TOTAL; i++) {
        const numero = String(i).padStart(3, '0');
        const estadoNuevo = datos[numero] || 'disponible';
        const estadoViejo = estadoAnterior[numero] || 'disponible';

        if (estadoNuevo !== estadoViejo) {
          const el = document.getElementById('ticket-' + numero);
          if (el) {
            el.className = 'ticket ' + claseDeEstado(estadoNuevo);
          }
        }
      }
    }

    // Guardar estado actual para la próxima comparación
    for (let i = 1; i <= TOTAL; i++) {
      const numero = String(i).padStart(3, '0');
      estadoAnterior[numero] = datos[numero] || 'disponible';
    }

    // Actualizar estadísticas
    let vendidos = 0;
    let apartados = 0;
    for (let i = 1; i <= TOTAL; i++) {
      const numero = String(i).padStart(3, '0');
      const e = estadoAnterior[numero];
      if (e === 'pagado') vendidos++;
      if (e === 'apartado') apartados++;
    }

    document.getElementById('stats').innerHTML =
      `<strong>${vendidos}</strong> pagados &nbsp;|&nbsp; <strong>${apartados}</strong> apartados &nbsp;|&nbsp; <strong>${TOTAL - vendidos - apartados}</strong> disponibles`;

    document.getElementById('progress').style.width =
      `${(vendidos / TOTAL) * 100}%`;

    // Indicador de última actualización
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const indicador = document.getElementById('ultima-actualizacion');
    if (indicador) indicador.textContent = 'Última actualización: ' + hora;

  } catch (err) {
    console.warn('Error al cargar boletos:', err);
    // No romper el ciclo en caso de fallo de red — reintentará en el siguiente intervalo
  }
}

function claseDeEstado(estado) {
  if (estado === 'apartado') return 'apartado';
  if (estado === 'pagado') return 'pagado';
  return 'disponible';
}

// Carga inicial
cargarBoletos();

// Refresco periódico sin recursión
setInterval(cargarBoletos, INTERVALO_MS);
