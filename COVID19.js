console.log('working COVID19');

const countries = [];
const countries_info =[];
getCountries();
getCountriesCOVID('countries');

//diplayData();

//https://corona-api.com/countries
async function getCountriesCOVID(land){ //gets COVID info per country or continent
 const covidBaseEndpoint = `https://corona-api.com/${land}`;
 try{
  const countriesCOVID_info =await fetchAnyURL(covidBaseEndpoint);
  let counrtyData = countriesCOVID_info.data;
  counrtyData.forEach(country => {
   let countryCovidObj = {
    id: country.code,
    name: country.name,
    latest_data: {
     confirmed: country.latest_data.confirmed,
     critical: country.latest_data.critical,
     deaths: country.latest_data.deaths,
     recovered: country.latest_data.recovered,
    },
    today: country.today,
   }; 
   countries_info.push(countryCovidObj);
  });
  console.log('countries_covid_info: ',countries_info);
  //console.log(counrtyData);
 }
 catch(error){console.log('Could not fetch Countries data');}
}//getCountriesCOVID

async function getCountries(){ //fetches countries names and regions and code and store them in array of objects
 const countryBaseEndpoint = 'https://restcountries.herokuapp.com/api/v1';
 const cors = 'https://api.codetabs.com/v1/proxy?quest=';
 const countriesFetchURL = `${cors}${countryBaseEndpoint}`
 try{
  const countriesData = await fetchAnyURL(countriesFetchURL);  
  countriesData.forEach(country => {
   let countryObg ={
    id: country.cca2,
    name: country.name.common,
    region: country.region,
   };
   countries.push(countryObg);
  });
  console.log('countries array:',countries);
  diplayData();
  displayCharts();
 }
 catch(error){console.log('Could not fetch Countries data');}
}//getCountries

//generic function for fetching URL
async function fetchAnyURL(url){
 try{
  const requestData = await fetch(`${url}`);
  const entityData = await requestData.json();
  if (!requestData.ok) {  return handleError(entityData.message); }
  return entityData;
 }
 catch(error){console.log(`${error}, error fetching data from ${url}`);}
}//fetchAnyURL

function handleError(error){
 const errorContainer = document.querySelector(".error");
 errorContainer.textContent = error;
};//handleError

function diplayData(){
 console.log('displayData');
 const title= document.querySelector('.title');
 const main = document.querySelector('.main');
 const chartArea = document.createElement('div');
 title.insertAdjacentElement('afterend',chartArea);
 chartArea.classList.add('chartArea');
//latest data statuses and continents
let lastestDataBtns =`
<div class="lastestDataBtns">
 <div class="statuses">
  <button id="Confirmed">Confirmed</button>
  <button id="Deaths">Deaths</button>
  <button id="Recovered">Recovered</button>
  <button id="Critical">Critical</button>
 </div>
 <div class="continents">
  <button id="Asia">Asia</button>
  <button id="Europe">Europe</button>
  <button id="Africa">Africa</button>
  <button id="Americas">Americas</button>
  <button id="World">World</button>
 </div>
</div>`;
main.insertAdjacentHTML('beforeend',lastestDataBtns);

 const btnsDiv = document.querySelector('.countriesBtnsDiv');
 for(let i=0; i< countries.length; i++){
  let cntryBtn = document.createElement('button');
  cntryBtn.textContent = countries[i].name;
  btnsDiv.insertAdjacentElement('afterbegin',cntryBtn);
 }

 const canvas = document.createElement('canvas');
 canvas.id = 'myChart';
 chartArea.insertAdjacentElement('afterbegin',canvas);

 btnsDiv.addEventListener('click', (e)=>{
  console.log(e.target.textContent);
  let cntryName = e.target.textContent
 });
}//diplayData

function displayCharts(){
 let myChart = document.getElementById('myChart').getContext('2d');
 let covidChart = new Chart(myChart, {
   type: 'line', //type of charts
   data:{
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
   },
   options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
  });
}