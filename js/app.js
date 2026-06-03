const data=[];
for(let i=1;i<=200;i++){data.push({numero:i,estado:'Disponible'});}

const tickets=document.getElementById('tickets');
let vendidos=0;

data.forEach(t=>{
 const d=document.createElement('div');
 d.className='ticket disponible';
 d.textContent=String(t.numero).padStart(3,'0');
 d.onclick=()=>window.open(`https://wa.me/522297787027?text=Hola,%20me%20interesa%20el%20boleto%20%23${String(t.numero).padStart(3,'0')}`,'_blank');
 tickets.appendChild(d);
});

document.getElementById('stats').innerHTML='0 vendidos de 200';
document.getElementById('progress').style.width='0%';
