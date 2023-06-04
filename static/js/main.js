var linksArray = [...document.getElementsByClassName('links')];
let aboutSection = document.getElementById('about');
let dodajUTablicu =  document.getElementById('dodajUTablicu');
let table =  document.getElementById('table');

linksArray[0].addEventListener('click',()=>{
    table.style.display= "none";
    aboutSection.style.display= "none";
    dodajUTablicu.style.display= "block";
})

linksArray[1].addEventListener('click',()=>{
    dodajUTablicu.style.display= "none";
    aboutSection.style.display= "none";
    table.style.display= "block";
})

linksArray[2].addEventListener('click',()=>{
    getPutovanja()
    dodajUTablicu.style.display= "none";
    table.style.display= "none";
    aboutSection.style.display= "block";
})


async function getPutovanja(){
    const res = await fetch('http://127.0.0.1:8000/putovanja',{
        method: 'GET',
    })
    if (res.ok) {
        const result = await res.json();
        console.log(result);
        }
    else{
        console.log("nije mogao dobiti ime");
    }

}