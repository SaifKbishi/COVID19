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
 const tilte= document.querySelector('.tilte');
 const main = document.querySelector('.main');
 const chartArea = document.createElement('div');
 tilte.insertAdjacentElement('afterend',chartArea);
 chartArea.classList.add('chartArea');

 const btnsDiv = document.querySelector('.countriesBtnsDiv');
 for(let i=0; i< countries.length; i++){
  let cntryBtn = document.createElement('button');
  cntryBtn.textContent = countries[i].name;
  btnsDiv.insertAdjacentElement('afterbegin',cntryBtn);
 }

    
}