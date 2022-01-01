

# COVID-19 statistic webapp

In this app I have build a covid 19 statistic webapp.  
I have fetched data about the covid stats from https://about-corona.net/ api.  
I used this https://github.com/hengkiardo/restcountries api extract the list of countries per continent.  
And used ChartJS from https://www.chartjs.org/ to display our data on graphs.  


I made the ability for the user to choose statistics between continents.  
The challenge was that the covid api does not give us the ability to choose statistics between continent countries.  
It only give me statistics of the whole world.
So, i had to call the countries api and choose from their the specific continent I want the list of countries from and compare those countries to the covid 19 countries.  

The statistics I will display from each country is the following:
- Confirmed Cases
- Number of Deaths
- Number of recovered
- Number of critical condition
I implemented the ability to choose what statistics we want to see and display them on a graph.  
  
When you click on a specific continent, you also have the ability to choose an individual countries statistics of that particular continent.  
Stats includes the following:
- total cases
- new cases
- total deaths
- new deaths
- total recovered
- in critical condition



## pseudo code  
  
function to gets COVID info per country or continent  
function to fetches countries names and regions and code and store them in array of objects  
   
generic function for fetching URL  
function to diplayData  
function to add Statuses Buttons   
function to create A Continent Countries Array  
function to create The World Array Per Status  
function to create A Continent Array Per Status  
function to add Continent Coutries Buttons  
function to add The World Coutriesbutton   
function to adjust Country Data To ChartJS  
function to adjust Data To ChartsJS  
function to display Charts  
function to create random Colors Array for the graph  
function to remove Data From Chart  (done by emptying the arraies before adjusting them to displayCharts function)