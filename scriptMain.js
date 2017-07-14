
//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var W = document.getElementById('container').clientWidth,
    H = document.getElementById('container').clientHeight;

var plot = d3.select('.plot').append('svg')
    .attr('width',W)
    .attr('height',H)
    .append('g')
    .attr('transform','translate(0,0)');

//Create projection
var projection = d3.geoEquirectangular();

var path = d3.geoPath()
    .projection(projection);

var map;

var r = 4, button, forceLayout;

var selectedGroupBtn = '',//Where, How , When
    selectedMenu = ''; //SLinvasion,Alwar,Rwgeno,Irwar,Irinsur,Ircivil,MM,Sywar

//Import data and parse
d3.queue()
  .defer(d3.csv,'data/cpj2017_link_0322.csv',parse)
  .defer(d3.csv,'data/event.csv',parseEvt)
  .defer(d3.json,'data/countries.geo.json') 
  .await(dataloaded);

function dataloaded(err, data, menu, mapData) {

    button = Button()
        .map(mapData)
        .menu(menu);
    plot.datum(data).call(button);


}//dataloaded

function parse(d){

   return {
     year:+d['Year'],
     name:d['Name'],
     sex:d['Sex'],
     countryKilled:d['Country_killed'],
     org:d['Organization'],
     nationality:d['Nationality'],
     medium:d['Medium'],
     job:d['Job'],
     coverage:d['Coverage'],
     freelance:d['Freelance'],
     localForeign:d['Local_Foreign'],
     sourceFire:d['Source_of_Fire'],
     deathType:d['Type_of_Death'],
     impunity:d['Impunity_for_murder'],
     captive:d['Taken_captive'],
     threatened:d['Threatened'],
     tortured:d['Tortured'],
     event:d['Event'],
     link:d['Link']
   };

}

function parseEvt(d){

     return{
        id:d['Id'],
        event:d['Event'],
        abb:d['Abbreviation'],
        death:d['Death'],
        period:d['Period'],
        country:d['Country']
     }

}