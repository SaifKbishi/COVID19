console.log('working COVID19');

const countries = [];
//const countries_info =[];
const covid_info =[];
const continentsArr =[];
const wasSearchedContinent =[1];
const wasSearchedCountry =[1];

let continentName;
let btnsDiv;
const labels =[];
const data = [];
let type= 'line';
let label= 'confirmed';
getCountries();
getCountriesCOVID('countries');
const colorsArray =[250];
randomColorsArray();
console.log('countries array:',countries);
console.log('covid_info array', covid_info);
let continentsBtns;

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
  console.log(error);
 /*const errorContainer = document.querySelector(".error");
 errorContainer.textContent = error;*/
};//handleError

function diplayData(){
 console.log('displayData function');
 const title= document.querySelector('.title');
 const main = document.querySelector('.main');
 const chartArea = document.createElement('div');
 title.insertAdjacentElement('afterend',chartArea);
 chartArea.classList.add('chartArea');
 //addCanvas
 const canvas = document.createElement('canvas');
 canvas.id = 'myChart'; 
 chartArea.insertAdjacentElement('afterbegin',canvas); 

 continentsBtnsDiv = document.querySelector('.continentsBtnsDiv'); 
 /********************HERE IS THE continentsBtns addEventListener*****************************/
 try{
  continentsBtnsDiv.addEventListener('click', (e)=>{//continents
   continentName ='';   
   continentName = e.target.textContent;   
   let continent = continentName;
  const isContinent = wasSearchedContinent.includes(continent);//test if same continent was clicked twice
  if(isContinent){
    console.log('wasSearchedContinent', wasSearchedContinent);
    return handleError("Continent was searched");
  }
  wasSearchedContinent.push(continent);
  
  addStatusesBtns(continent);//function to add statuses buttons
  addContinentCoutriesBtns(continent); //function to add this continent countries buttons
  
  addAContinentCountriesTo_continentsArr(continentName, status='confirmed');
  console.log('continentsArr',continentsArr);
  adjustDataToChartsJS(continentsArr, status='confirmed');
 });
}
catch(error){console.log(error, 'problem with continentsBtns.addEventListener');}
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
 try{
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

function addStatusesBtns(cntnntName){
  const newContinentName =cntnntName;
  let statuses = document.querySelector('.statuses');
  statuses.style.visibility= 'visible';
  statuses.addEventListener('click', (ev)=>{
    let statusbtn =ev.target.textContent;    
    //addAContinentCountriesTo_continentsArr(continentName, statusbtn);
    createAContinentCountries_Array(newContinentName, statusbtn);
  }); 
}//addStatusesBtns

function createAContinentCountries_Array(continent, statusbtn){
 console.log('182', continent, statusbtn);
 let thisContinentCountries = countries.filter(country => {
  if(country.region === continent) return country.id;
 });
 console.log('186 thisContinentCountries', thisContinentCountries);
 let thisContinentCountries_IDs =[];
 for(let i=0; i<thisContinentCountries.length; i++){
  thisContinentCountries_IDs[i] = thisContinentCountries[i].id;
 }
 console.log('191 IDs: ',thisContinentCountries_IDs);
 createAContinentArrayPerStatus(thisContinentCountries_IDs, statusbtn);
}//createAContinentCountries_Array

function createAContinentArrayPerStatus(thisContinentCountries_IDs, statusbtn){
  console.log('191 thisContinentCountries', thisContinentCountries_IDs, 'statusbtn clicked', statusbtn);
  let status = statusbtn.toLowerCase();
  let filteredStatusArray = [];
  for(let i=0; i<covid_info.length; i++){
    if(thisContinentCountries_IDs.includes(covid_info[i].id)){
      let countryStatusObj ={
        name: covid_info[i].name,
        status: covid_info[i].latest_data[status],
      };
      filteredStatusArray.push(countryStatusObj);
    }
  }
  //send filteredStatusArray with status to display the chart
  console.log(filteredStatusArray);
}



btnsDiv = document.createElement('div');
function addContinentCoutriesBtns(thisContinent){
 console.log('thisContinent from addContinentCoutriesBtns:',thisContinent); 
 mainBtns = document.querySelector('.mainBtns'); 
 mainBtns.insertAdjacentElement('afterend',btnsDiv);
 btnsDiv.innerHTML = '';
 countries.forEach(country => {
  if(country.region === thisContinent){
   let countryCode = country.id;
   covid_info.forEach(covCountry => {
    if(covCountry.id === countryCode){
     let cntryBtn = document.createElement('button');
     cntryBtn.textContent = covCountry.name;
     btnsDiv.insertAdjacentElement('afterbegin',cntryBtn);
     btnsDiv.classList.add('CountriesButtons');
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
}//adjustDataToChartsJS

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
     borderColor: colorsArray ,
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
}//displayCharts

function randomColorsArray(){
  for(let i=0; i< 250; i++){   
    colorsArray[i] = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
  }  
}//randomColorsArray