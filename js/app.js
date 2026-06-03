const tickets = document.getElementById('tickets');

for(let i=1;i<=10;i++){

    const d=document.createElement('div');

    d.className='ticket disponible';

    d.textContent=String(i).padStart(3,'0');

    tickets.appendChild(d);
}
