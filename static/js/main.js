var linksArray = [...document.getElementsByClassName('links')];
let aboutSection = document.getElementById('about');
let dodajUTablicu =  document.getElementById('dodajUTablicu');
let table =  document.getElementById('table');
var inputArray = [...document.getElementsByClassName('inputs')];
let entrys = [...document.getElementsByClassName('entrys')];
let submit = document.getElementById('submit');
let elementTable =  document.getElementById('element');
let editBTN = document.getElementsByClassName('editBTN')[0];
let deleteBTN = document.getElementsByClassName('deleteBTN')[0];
let selectButton = document.getElementById('selectButton');



linksArray[0].addEventListener('click',()=>{
    publicId=-1;
    table.style.display= "none";
    aboutSection.style.display= "none";
    elementTable.style.display= "none";
    inputArray.forEach(element=>{
        element.value="";
     })

   
    dodajUTablicu.style.display= "block";
})

linksArray[1].addEventListener('click',()=>{
    getPutovanja()
    publicId=-1;
    dodajUTablicu.style.display= "none";
    aboutSection.style.display= "none";
    elementTable.style.display= "none";
    table.style.display= "block";
})

linksArray[2].addEventListener('click',()=>{
    publicId=-1;
    dodajUTablicu.style.display= "none";
    table.style.display= "none";
    elementTable.style.display= "none";
    aboutSection.style.display= "block";
})

editBTN.addEventListener('click',()=>{
    GetPutovanjePoID( publicId); 
    aboutSection.style.display= "none";
    dodajUTablicu.style.display= "none";
    elementTable.style.display= "none";
    table.style.display= "block";
})
deleteBTN.addEventListener('click',()=>{
    DeletePutovanje(publicId); 
    aboutSection.style.display= "none";
    dodajUTablicu.style.display= "none";
    elementTable.style.display= "none";
    table.style.display= "block";
})

selectButton.addEventListener('click',()=>{
    getPutovanja()
})

let publicId=-1;
const keys = ['destinacija', 'datum', 'aktivnosti', 'troskovi', 'dojmovi'];


submit.addEventListener('click', (e)=>{
    e.preventDefault();
    if(publicId===-1){
        publicId=-1;
        PostPutovanje();
    }
    else{
        PutPutovanje(publicId)
    } 
})

let sortDirection = 'ASC'; 


function toggleSortDirection() {
  sortDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
}

async function getPutovanja() {
  const sortSelect = document.querySelector('#sortSelect');
  const selectedOption = sortSelect ? sortSelect.value : null;

  const url = new URL('http://127.0.0.1:8000/putovanja');
  if (selectedOption) {
    url.searchParams.set('sort', selectedOption);
    url.searchParams.set('sort_direction', sortDirection); 
  }

  const res = await fetch(url, {
    method: 'GET',
  });

  if (res.ok) {
    let result = await res.json();
    const tbody = document.querySelector('#putovanja-table tbody');
    tbody.innerHTML = '';

    if (sortDirection === 'ASC') {
      result.forEach(putovanje => {
        const row = createTableRow(putovanje);
        tbody.appendChild(row);
        row.addEventListener('click', () => {
            const id = putovanje.id;
            GetPutovanjePoID2(id);
          });
      });
    } else if (sortDirection === 'DESC') {
      for (let i = result.length - 1; i >= 0; i--) {
        const putovanje = result[i];
        const row = createTableRow(putovanje);
        tbody.appendChild(row);
        row.addEventListener('click', () => {
            const id = putovanje.id;
            GetPutovanjePoID2(id);
          });
      }
    }
  } else {
    console.log("nije mogao dobiti ime");
  }
  
}
getPutovanja()


function createTableRow(putovanje) {
  const row = document.createElement('tr');
  row.style.zIndex = -10;
  row.innerHTML = `
      <td>${putovanje.destinacija}</td>
      <td>${putovanje.datum}</td>
      <td>${putovanje.aktivnosti}</td>
      <td>${putovanje.troskovi}</td>
      <td>${putovanje.dojmovi}</td>
  `;
  return row;
}


function handleToggleSort() {
  toggleSortDirection();
  getPutovanja(); 
}


const toggleSortButton = document.querySelector('#toggleSortButton');
toggleSortButton.addEventListener('click', handleToggleSort);

  
async function PostPutovanje(){
    const putovanjeData = {};
    inputArray.forEach((value, index) => {
        const key = keys[index];
        putovanjeData[key] = value.value;
      });
    const res = await fetch('http://127.0.0.1:8000/putovanja',{
        method: 'POST',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify(
            putovanjeData
        )
    })
    if (res.ok) {
        alert("Putovanje uspjesno dodano!")
        }
    else{
        alert("Nes ne radi!");
    }
}


/* Po id GET */
async function GetPutovanjePoID(id){
    const response = await fetch('http://127.0.0.1:8000/putovanja/'+id,{
        method: 'GET'  
    })
    if (response.ok) {
        const result = await response.json();
        inputArray[0].value = result.destinacija;
        inputArray[1].value = result.datum;
        inputArray[2].value = result.aktivnosti;
        inputArray[3].value = result.troskovi;
        inputArray[4].value = result.dojmovi;
        publicId = result.id;
        table.style.display= "none";
        aboutSection.style.display= "none";
        dodajUTablicu.style.display= "block";
        }
    else{
        alert("Nes ne radi!");
        return;
    }
}

/* Po id 2 GET */
async function GetPutovanjePoID2(id){
    const response = await fetch('http://127.0.0.1:8000/putovanja/'+id,{
        method: 'GET'  
    })
    if (response.ok) {
        const result = await response.json();
        entrys[0].textContent = result.id;
        entrys[1].textContent = result.destinacija;
        entrys[2].textContent = result.datum;
        entrys[3].textContent = result.aktivnosti;
        entrys[4].textContent = result.troskovi;
        entrys[5].textContent = result.dojmovi;
        publicId = result.id;
        table.style.display= "none";
        aboutSection.style.display= "none";
        dodajUTablicu.style.display= "none";
        elementTable.style.display= "block";
        }
    else{
        alert("Nes ne radi!");
        return;
    }
}




/* Azuriranje */
async function PutPutovanje(id){
    const putovanjeData = {};
    inputArray.forEach((value, index) => {
        const key = keys[index];
        putovanjeData[key] = value.value;
      });
    const res = await fetch('http://127.0.0.1:8000/putovanja/'+id,{
        method: 'PUT',
        headers:{
            "Content-Type": 'application/json'
        },
        body:JSON.stringify(
            putovanjeData
        )
    })
    if (res.ok) {
        alert("azuriranje")
        window.location.href = "http://127.0.0.1:8000/"
        }
    else{
        alert("Nes ne radi!");
    }
}


/* Delete putovanje */
async function DeletePutovanje(id){
    const putovanjeData = {};
    inputArray.forEach((value, index) => {
        const key = keys[index];
        putovanjeData[key] = value.value;
      });
    const res = await fetch('http://127.0.0.1:8000/putovanja/'+id ,{
        method: 'DELETE'
    })
    if (res.ok) {
        alert("Podatak obrisan")
        window.location.href = "http://127.0.0.1:8000/"
        }
    else{
        alert("Nes ne radi!");
    }
}