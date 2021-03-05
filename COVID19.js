console.log('working COVID19');

const countries = [];
//const countries_info =[];
const covid_info =[];
const continentsArr =[];
const wasSearchedContinent =[1];
const wasSearchedCountry =[1];
let lastestDataBtns;
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
   covid_info.push(countryCovidObj);
  });
  console.log('countries_covid_info: ',covid_info);
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
  //console.log('countries array:',countries);
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
 console.log('displayData function');
 const title= document.querySelector('.title');
 const main = document.querySelector('.main');
 const chartArea = document.createElement('div');
 title.insertAdjacentElement('afterend',chartArea);
 chartArea.classList.add('chartArea');
//latest data statuses and continents
lastestDataBtns =`
<div class="lastestDataBtns"> 
 <div class="continentsBtns">
  <button id="Asia">Asia</button>
  <button id="Europe">Europe</button>
  <button id="Africa">Africa</button>
  <button id="Americas">Americas</button>
  <button id="World">World</button>
 </div>
</div>`;

main.insertAdjacentHTML('beforeend',lastestDataBtns);
lastestDataBtns = document.querySelector('.lastestDataBtns');

 /*const btnsDiv = document.querySelector('.countriesBtnsDiv');
 for(let i=0; i< countries.length; i++){
  let cntryBtn = document.createElement('button');
  cntryBtn.textContent = countries[i].name;
  btnsDiv.insertAdjacentElement('afterbegin',cntryBtn);
 }*/

 const canvas = document.createElement('canvas');
 canvas.id = 'myChart';
 chartArea.insertAdjacentElement('afterbegin',canvas);
 //const theCanvas = document.getElementById('myChart');

 const myChartParent = document.querySelector('.chartArea');//
 const continentsBtns = document.querySelector('.continentsBtns'); 
 continentsBtns.addEventListener('click', (e)=>{//continents
  continentName = e.target.textContent;

  const isContinent = wasSearchedContinent.includes(continentName);//test if same continent was clicked twice
  if(isContinent){
    console.log('wasSearchedContinent', wasSearchedContinent);
    return handleError("Continent was searched");
  }
  wasSearchedContinent.push(continentName);
  addStatusesBtns();
  
  console.log('continentName:',continentName);
  countries.forEach(country => {
   if(country.region === continentName){
    let countryCode = country.id;
    covid_info.forEach(covCountry => {
     if(covCountry.id === countryCode){
      let continentsObj={
       name: covCountry.name,
       latest_data: covCountry.latest_data,
       today: covCountry.today,
      };
      continentsArr.push(continentsObj);
     }
    });
   }
  });//countries.forEach
  //debugger;  
  
  adjustDataToChartsJS(continentsArr);
 });
 btnsDiv.addEventListener('click', (e)=>{//countries
  console.log(e.target.textContent);
  let cntryName = e.target.textContent;
  countries.forEach(country => {
   if(country.region === cntryName){
    
   }
  });
 });
}//diplayData

function addStatusesBtns(){
 let statusesBtns =`
 <div class="statuses">
  <button id="Confirmed">Confirmed</button>
  <button id="Deaths">Deaths</button>
  <button id="Recovered">Recovered</button>
  <button id="Critical">Critical</button>
 </div>`;
 let statuses = document.querySelector('.statuses');
 if(!statuses){
  lastestDataBtns.insertAdjacentHTML('afterbegin',statusesBtns);
 }
 

}


const labels =[];
const data = [];
const type= 'line';
const label= 'Confirmed';

function adjustDataToChartsJS(array){
 for(let i=0; i<array.length; i++){
  labels.push(array[i].name);
  data.push(array[i].latest_data.confirmed);
 }
 displayCharts(labels, label, data, type);
}



function displayCharts(labelsArr, label, dataArr, type){//data.labels[], data.datasets.label, data.datasets.data[], type
 //console.log('data received to displayCharts', labelsArr, label, dataArr, type);
 let myChart = document.getElementById('myChart').getContext('2d'); 
 let covidChart = new Chart(myChart, {
   type: type, //type of charts
   data:{
    labels: labelsArr,
    datasets: [{
     label: label,
     data: dataArr,
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
     }],
     xAxes:[{
      ticks:{
       autoSkip: true,
       maxTicksLimit: 250
      }
     }]
    },
    legend:{
     labels:{
      fontSize:12,
     }
    }
   }
  });
}


/* 
function displayCharts(){//data.labels[], data.datasets.label, data.datasets.data[], type
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
} */