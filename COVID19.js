console.log('working COVID19');

const countries = [];
//const countries_info =[];
const covid_info =[];
const continentsArr =[];
const wasSearchedContinent =[1];
const wasSearchedCountry =[1];
let lastestDataBtns=`
<div class="lastestDataBtns"> 
 <div class="continentsBtns">
  <button id="Asia">Asia</button>
  <button id="Europe">Europe</button>
  <button id="Africa">Africa</button>
  <button id="Americas">Americas</button>
  <button id="World">World</button>
 </div>
</div>`;
//let continentName;
let btnsDiv;
const labels =[];
const data = [];
let type= 'line';
let label= 'Confirmed';
getCountries();
getCountriesCOVID('countries');
console.log('countries array:',countries);
console.log('covid_info array', covid_info);

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
  //console.log('countries_covid_info: ',covid_info);
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
  try{diplayData();}catch(error){error,'trying to call displayData function'}
  try{displayCharts();}catch(error){error,'trying to call displayCharts function'} 
  
 }
 catch(error){console.log(error,'Could not fetch Countries data');}
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
function addCanvas(){
 let chartAreaContainer = document.querySelector('.chartArea');
 const canvas = document.createElement('canvas');
 canvas.id = 'myChart';
 chartAreaContainer.insertAdjacentElement('afterbegin',canvas);
}//addCanvas
function diplayData(){
 console.log('displayData function');
 const title= document.querySelector('.title');
 const main = document.querySelector('.main');
 const chartArea = document.createElement('div');
 title.insertAdjacentElement('afterend',chartArea);
 chartArea.classList.add('chartArea');

 main.insertAdjacentHTML('beforeend',lastestDataBtns);
 lastestDataBtns = document.querySelector('.lastestDataBtns');

 //addCanvas();
 const canvas = document.createElement('canvas');
 canvas.id = 'myChart'; 
 chartArea.insertAdjacentElement('afterbegin',canvas); 
 //const theCanvas = document.getElementById('myChart');

 const myChartParent = document.querySelector('.chartArea');//
 const continentsBtns = document.querySelector('.continentsBtns'); 
 /********************HERE IS THE continentsBtns addEventListener*****************************/
 try{
  continentsBtns.addEventListener('click', (e)=>{//continents
  continentName = e.target.textContent;

  const isContinent = wasSearchedContinent.includes(continentName);//test if same continent was clicked twice
  if(isContinent){
    console.log('wasSearchedContinent', wasSearchedContinent);
    return handleError("Continent was searched");
  }
  wasSearchedContinent.push(continentName);
  addStatusesBtns(continentName);//function to add statuses buttons
  addContinentCoutriesBtns(continentName); //function to add this continent countries
  
  console.log('continentName:',continentName);
  addAContinentCountriesTo_continentsArr(continentName, status='confirmed');
  console.log('continentsArr',continentsArr);
  adjustDataToChartsJS(continentsArr, status='confirmed');
 });
}
catch(error){console.log(error, 'problem with continentsBtns.addEventListener');}

/*  btnsDiv.addEventListener('click', (e)=>{//countries
  console.log(e.target.textContent);
  let cntryName = e.target.textContent;
  countries.forEach(country => {
   if(country.region === cntryName){
    
   }
  });
 }); */
}//diplayData

/* function addAContinentCountriesTo_continentsArr(continentName, status){
 status= status.toLowerCase();
 //console.log('status from line 150',status);
 try { 
  for(let i=0; i<countries.length; i++){
   if(countries[i].region === continentName){
    let countryCode = countries[i].id;
    let countryName = countries[i].name;
    for(let j=0; j<covid_info.length; j++){
     if(covid_info[j].id === countryCode){
      let continentsObj={
       name: covid_info[j].name,
       latest_data: covid_info[j].latest_data[status],
       today: covid_info[j].today,
      };
      continentsArr.push(continentsObj);
     }else{j++;}
    }
   }else{i++;}
  } 
 }   
  catch (error) {console.log(error, 'creating continentsArr in function addAContinentCountriesTo_continentsArr'); } 
}//addAContinentCountriesTo_continentsArr */
function addAContinentCountriesTo_continentsArr(continentName, status){
 status= status.toLowerCase();
 try {  
  countries.forEach(country => {
   if(country.region === continentName){
    let countryCode = country.id;
    covid_info.forEach(covCountry => {
     if(covCountry.id === countryCode){
      let continentsObj={
       name: covCountry.name,
       latest_data: covCountry.latest_data[status],
       today: covCountry.today,
      };
      continentsArr.push(continentsObj);
     }
    });
   }
  });
 } catch (error) {console.log(error, 'creating continentsArr in function addAContinentCountriesTo_continentsArr'); } 
}//addAContinentCountriesTo_continentsArr

function addStatusesBtns(continentName){
 let statusesBtns =`
 <div class="statuses">
  <button id="Confirmed">Confirmed</button>
  <button id="Deaths">Deaths</button>
  <button id="Recovered">Recovered</button>
  <button id="Critical">Critical</button>
 </div>`;
 let statuses = document.querySelector('.statuses');
 if(!statuses){
  console.log('adding statusesBtns');
  lastestDataBtns.insertAdjacentHTML('afterbegin',statusesBtns);

  try {
   let statusesBtns = document.querySelector('.statuses');
   statusesBtns.addEventListener('click', (e)=>{
    //debugger;
    console.log(e.target.textContent, continentName);
    let statusbtn =e.target.textContent;

    addAContinentCountriesTo_continentsArr(continentName, statusbtn);
   });
  } catch (error) {console.log(error, 'addEventListener statuses');  }
 }
 
}//addStatusesBtns

function addContinentCoutriesBtns(continentName){
 //console.log('continentName from addContinentCoutriesBtns:',continentName); 
 btnsDiv = document.querySelector('.countriesBtnsDiv');
 btnsDiv.innerHTML = '';
 countries.forEach(country => {
  if(country.region === continentName){
   let countryCode = country.id;
   covid_info.forEach(covCountry => {
    if(covCountry.id === countryCode){
     let cntryBtn = document.createElement('button');
     cntryBtn.textContent = covCountry.name;
     btnsDiv.insertAdjacentElement('afterbegin',cntryBtn);
    }
   });
   
  }
 });//countries.forEach
 btnsDiv.addEventListener('click', (e)=>{
  console.log(e.target.textContent);
  let countryName  = e.target.textContent;
  for(let i=0; i<covid_info.length; i++){
   if(countryName === covid_info[i].name){
    adjustCountryDataToChartJS(covid_info[i]);
   }
  }
 });
}//addContinentCoutriesBtns
function adjustCountryDataToChartJS(countryToDisplay){
 let dataArr = Object.values(countryToDisplay.latest_data);
 let labelsArr = Object.keys(countryToDisplay.latest_data);
 let label = countryToDisplay.name; 
 let type = 'doughnut';
 console.log('labelsArr',labelsArr, 'label',label, 'dataArr',dataArr, 'type',type);
 //displayCharts(labelsArr, label, dataArr, type)
 displayCharts(labelsArr, label, dataArr, type)
}//adjustCountryDataToChartJS


function adjustDataToChartsJS(array){
 console.log('status from adjustDataToChartsJS',status);
 for(let i=0; i<array.length; i++){
  labels.push(array[i].name);
  data.push(array[i].latest_data);
 }
 label= status;
 console.log('label',label);
 displayCharts(labels, label, data, type);
}

function displayCharts(labelsArr, label, dataArr, type){//data.labels[], data.datasets.label, data.datasets.data[], type
 //console.log('data received to displayCharts', labelsArr, label, dataArr, type);
 Chart.defaults.global.defaultFontSize = 12;
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
  /*   legend:{
     labels:{
      fontSize:12,
     }
    }, */
    responsive:true,
   }
  });
}

