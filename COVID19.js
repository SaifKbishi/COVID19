console.log('working COVID19');

const countries = [];
console.log('countries',countries);
const covid_info =[];
console.log('covid_info', covid_info);
const continentsArr =[];
const wasSearchedContinent =[1];
const wasSearchedCountry =[1];

let continentName;
let btnsDiv;
const labels =[];
const data = [];
let type= 'line';
let label= 'confirmed';
const countryBaseEndpoint = 'https://restcountries.herokuapp.com/api/v1';
const cors = 'https://api.codetabs.com/v1/proxy?quest=';
getCountries();
getCountriesCOVID('countries');
const colorsArray =[250];
randomColorsArray();
let continentsBtns;


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
 }
 catch(error){console.log('Could not fetch Countries data');}
}//getCountriesCOVID

async function getCountries(){ //fetches countries names and regions and code and store them in array of objects
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
 const title= document.querySelector('.title');
 const chartArea = document.createElement('div');
 title.insertAdjacentElement('afterend',chartArea);
 chartArea.classList.add('chartArea');
 //addCanvas
 const canvas = document.createElement('canvas');
 canvas.id = 'myChart'; 
 chartArea.insertAdjacentElement('afterbegin',canvas); 

 continentsBtnsDiv = document.querySelector('.continentsBtnsDiv');
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
  
  //addTheWorldCoutriesBtns(continent); //function to add the world countries buttons  
  if(continent === 'World'){
    console.log('this is the world');
    addTheWorldCoutriesBtns();
    createTheWorldArrayPerStatus(status='confirmed');
  }else{
    addContinentCoutriesBtns(continent); //function to add this continent countries buttons  
    createAContinentCountries_Array(continent, status='confirmed');
  }  
 });
}
catch(error){console.log(error, 'problem with continentsBtns.addEventListener');}
}//diplayData

function addStatusesBtns(cntnntName){
  const newContinentName =cntnntName;
  let statuses = document.querySelector('.statuses');
  statuses.style.visibility= 'visible';
  statuses.addEventListener('click', (ev)=>{
    let statusbtn =ev.target.textContent;
    createAContinentCountries_Array(newContinentName, statusbtn);
  }); 
}//addStatusesBtns

function createAContinentCountries_Array(continent, statusbtn){
 let thisContinentCountries = countries.filter(country => {
  if(country.region === continent) return country.id;
 });
 let thisContinentCountries_IDs =[];
 for(let i=0; i<thisContinentCountries.length; i++){
  thisContinentCountries_IDs[i] = thisContinentCountries[i].id;
 }
 createAContinentArrayPerStatus(thisContinentCountries_IDs, statusbtn);
}//createAContinentCountries_Array

function createTheWorldArrayPerStatus(statusbtn){
  let status = statusbtn.toLowerCase();
  let filteredStatusArray = [];
  for(let i=0; i<covid_info.length; i++){    
    let countryStatusObj ={
      name: covid_info[i].name,
      status: covid_info[i].latest_data[status],
    };
    filteredStatusArray.push(countryStatusObj);    
  }
  adjustDataToChartsJS(filteredStatusArray,status);
}//createTheWorldCountries_Array

function createAContinentArrayPerStatus(thisContinentCountries_IDs, statusbtn){
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
  adjustDataToChartsJS(filteredStatusArray,status);
}//createAContinentArrayPerStatus

btnsDiv = document.createElement('div');
function addContinentCoutriesBtns(thisContinent){
 mainBtns = document.querySelector('.mainBtns'); 
 mainBtns.insertAdjacentElement('afterend',btnsDiv);
 btnsDiv.innerHTML = '';
 let i=1;
 countries.forEach(country => {
  if(country.region === thisContinent){
   let countryCode = country.id;
   covid_info.forEach(covCountry => {
    if(covCountry.id === countryCode){
     let cntryBtn = document.createElement('button');
     cntryBtn.textContent = covCountry.name;
     cntryBtn.style.background = `linear-gradient(${i*7}deg, #33ccff 0%, #FF0000 ${i*3}%)`; i++;
     btnsDiv.insertAdjacentElement('afterbegin',cntryBtn);
     btnsDiv.classList.add('CountriesButtons');
    }
   });   
  }
 });//countries.forEach
 btnsDiv.addEventListener('click', (e)=>{
  let countryName  = e.target.textContent;
  for(let i=0; i<covid_info.length; i++){
   if(countryName === covid_info[i].name){
    adjustCountryDataToChartJS(covid_info[i]);
   }
  }
 });
}//addContinentCoutriesBtns

function addTheWorldCoutriesBtns(){
  mainBtns = document.querySelector('.mainBtns'); 
  mainBtns.insertAdjacentElement('afterend',btnsDiv);
  btnsDiv.classList.add('CountriesButtons');
  btnsDiv.innerHTML = '';
  for(let i=0; i< countries.length; i++){
    let cntryBtn = document.createElement('button');
    cntryBtn.textContent = countries[i].name;
    btnsDiv.insertAdjacentElement('afterbegin',cntryBtn);    
  }  
  btnsDiv.addEventListener('click', (e)=>{
   let countryName  = e.target.textContent;
   for(let i=0; i<covid_info.length; i++){
    if(countryName === covid_info[i].name){
     adjustCountryDataToChartJS(covid_info[i]);
    }
   }
  });
 }//addTheWorldCoutriesBtns

function adjustCountryDataToChartJS(countryToDisplay){
 let dataArr = Object.values(countryToDisplay.latest_data);
 let labelsArr = Object.keys(countryToDisplay.latest_data);
 let label = countryToDisplay.name; 
 console.log(label);
 let type = 'doughnut';
 displayCharts(labelsArr, label, dataArr, type)
}//adjustCountryDataToChartJS

function adjustDataToChartsJS(array, status){  
 console.log('Emptying arraies');
 for(let i=0; i<array.length; i++){
  labels.pop();
  data.pop();
 }
 console.log('Adding data');
 for(let i=0; i<array.length; i++){
  labels.push(array[i].name);
  data.push(array[i].status);
 }
 label= status;
 displayCharts(labels, label, data, type);
}//adjustDataToChartsJS

function displayCharts(labelsArr, label, dataArr, type){
 Chart.defaults.global.defaultFontSize = 10;
 let myChart = document.getElementById('myChart').getContext('2d'); 
 let covidChart; 
 covidChart = new Chart(myChart, {
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
       maxTicksLimit: 100
      }
     }]
    },
    responsive:true,
   }
  });
  
}//displayCharts

function randomColorsArray(){
  for(let i=0; i< 250; i++){   
    colorsArray[i] = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
  }  
}//randomColorsArray
