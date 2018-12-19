// Global variables
var mapCenter = [-78.48, 38.043];
var mapZoom = 12.25;

// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoiY3oydSIsImEiOiJjam5ldXUwdHowZTM0M3FwN2lobGIwMnNiIn0.iAbJXUNX-2-ipOcGBbOWUg'; 

var map = new mapboxgl.Map({
    container: 'map', 
    center: [-73.959,40.755], 
    zoom: 11.07, 
    style: 'mapbox://styles/cz2u/cjo90360y01zl2sk3m1uwvwkp', 
    customAttribution: 'NYC Open Data (https://opendata.cityofnewyork.us/)',
});

// Show modal when About button is clicked
$("#about").on('click', function() { 
    $("#screen").fadeToggle(); 
    $(".modal").fadeToggle(); 
});

$(".modal>.close-button").on('click', function() { 
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});

// Legend
var layers = [ 
];

var colors = [ 
];

// for loop to create individual legend items
for (i=0; i<layers.length; i++) {
    var layer =layers[i]; 
    var color =colors[i]; 
    
    var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; 
    var item = $(itemHTML).appendTo("#legend"); 
    var legendKey = $(item).find(".legend-key"); 
    legendKey.css("background", color); 
}

// 10.25 starts here----------------------------------------------
// 
// INFO WINDOW CODE 

    map.on('mousemove', function(e) {  

        var parks = map.queryRenderedFeatures(e.point, {    
            layers: ['cville-parks']    
        });
              
        if (parks.length > 0) {  

            $('#info-window-body').html('<h3><strong>' + parks[0].properties.PARKNAME + '</strong></h3><p>' + parks[0].properties.PARK_TYPE + ' PARK</p><img class="park-image" src="img/' + parks[0].properties.PARKNAME + '.jpg">');

        } else {    

            $('#info-window-body').html('<p>Hover over a park or click on a bus stop to learn more about it.');
            
        }

    });

// POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) {   

      var stops = map.queryRenderedFeatures(e.point, {  
        layers: ['cville-bus-stops']    
    });
      if (stops.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, 
        closeOnClick: true, 
        anchor: 'bottom', 
        offset: [0, -15] 
    });

      popup.setLngLat(stops[0].geometry.coordinates);

      popup.setHTML('<h3>Stop ID: ' + stops[0].properties.stop_id + '</h3><p>' + stops[0].properties.stop_name + '</p>');

  });


// 11.01 starts here----------------------------------------------

// SHOW/HIDE LAYERS
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [

        ['waterfront-access-plans', 'Waterfront'],                      
        ['publicly-accessible', 'Public'],                            
        ['sandy-inundation-zone', 'Sandy inundation zone'],     
        ['sea-level-rise-maps', 'Sea level rise maps'],
        ['background 1', 'Map background']
    ]; 

    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); 
        }

        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); 
                }
        });
    });

    
    var swatches = $("#swatches");

    var colors = [  
        '#ffd000',
        '#f00',
    ]; 

    var layer = 'cville-bus-stops';

    colors.forEach(function(color) {
        var swatch = $("<button class='swatch'></button>").appendTo(swatches);

        $(swatch).css('background-color', color); 

        $(swatch).on('click', function() {
            map.setPaintProperty(layer, 'circle-color', color); 
        });

        $(swatches).append(swatch);
    });

// 11.08 starts here----------------------------------------------
// SCROLL TO ZOOM THROUGH SITES
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {

        'darden-towe': {
            name: "Sea level rise",
            description: "At least since 1880, the average global sea level has been rising, with about an 18 cm (7.1 in) rise from 1897 to 1997. More precise satellite based data show about a 7.5 cm (3.0 in) accelerating rise in sea level from 1993 to 2017. This is due mostly to anthropogenic global warming that is driving the thermal expansion of seawater while melting land-based ice sheets and glaciers. This trend is expected to accelerate during the 21st century. Projecting future sea level has always been challenging, due to our imperfect understanding of many aspects of the climate system. As climate research leads to improved computer models, projections have consistently increased.",
            imagepath: "img/Rising-sea-level.jpg",
            bearing: 0,
            center: [ -73.960,40.736],
            zoom: 13.30,
            pitch: 45
        },
        'mcguffey-park': {
            name: "Hurricane",
            description: "In 2012, Hurricane Sandy tore a path of destruction through the North East. In some ways, it was an event that revealed the fragile nature of the city's electrical and mechanical infrastructures. Hurricane Sandy (unofficially referred to as Superstorm Sandy) was the deadliest and most destructive hurricane of the 2012 Atlantic hurricane season. Inflicting nearly $70 billion (2012 USD) in damage, it was the second-costliest hurricane on record in the United States until surpassed by Hurricanes Harvey and Maria in 2017. The eighteenth named storm, tenth hurricane, and second major hurricane of the year, Sandy was a Category 3 storm at its peak intensity when it made landfall in Cuba. While it was a Category 2 hurricane off the coast of the Northeastern United States, the storm became the largest Atlantic hurricane on record (as measured by diameter, with tropical-storm-force winds spanning 900 miles (1,400 km)). At least 233 people were killed along the path of the storm in eight countries.",
            imagepath: "img/Hurricane Sandy.jpg",
            bearing: 0,
            center: [ -73.984,40.716],
            zoom: 12.28,
            pitch: 45
        },
        'mcintire-park': {
            name: "Public Parks",
            description: "Central Park is an urban park in Manhattan, New York City. It is located between the Upper West Side and Upper East Side, roughly bounded by Fifth Avenue on the east, Central Park West (Eighth Avenue) on the west, Central Park South (59th Street) on the south, and Central Park North (110th Street) on the north. Central Park is the most visited urban park in the United States, with 40 million visitors in 2013, and one of the most filmed locations in the world. In terms of area, Central Park is the fifth-largest park in New York City, covering 843 acres (341 ha).",
            imagepath: "img/central park.jpg",
            bearing: 20,
            center: [ -73.969,40.773],
            zoom: 13.60,
            pitch: 60
        },
    };


    console.log(chapters['darden-towe']['name']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h3>" + chapters[key]['name'] + "</h3><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
    }


    $("#chapters").scroll(function(e) {

        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        map.flyTo(chapters[chapterName]);

        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();


        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }


// ADD GEOJSON DATA (static layers)

    // See example at https://www.mapbox.com/mapbox-gl-js/example/live-geojson/
    var staticUrl = 'https://opendata.arcgis.com/datasets/edaeb963c9464edeb14fea9c7f0135e3_11.geojson';
    map.on('load', function () {
        window.setInterval(function() { 
            console.log();
            map.getSource('polling-places').setData(staticUrl);
        }, 2000); 
        
        map.addSource('polling-places', { type: 'geojson', data: staticUrl });
        map.addLayer({
            "id": "polling-places",
            "type": "symbol",
            "source": "polling-places",
            "layout": {
                "icon-image": "embassy-15"
            }
        });
    });

// 12.06 starts here----------------------------------------------
// RESET MAP BUTTON
    
    $("#reset").click(function() {
        map.setCenter(mapCenter);
        map.setZoom(mapZoom);
        map.setPitch(0);
        map.setBearing(0);
        map.setFilter("sea-level-rise-maps", null); 
      
        for (i=0; i<layers.length; i++) {
            map.setLayoutProperty(layers[i][0], 'visibility', 'visible'); 
            $("#" + layers[i][0]).addClass('active');
        }                   

    });

// Timeline labels using d3

    var width = 500;
    var height = 20;
    var marginLeft = 15;
    var marginRight = 15;

    var data = [0, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];
    
    // Append SVG 
    var svg = d3.select("#timeline-labels")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Create scale
    var scale = d3.scaleLinear()
                  .domain([d3.min(data), d3.max(data)])
                  .range([marginLeft, width-marginRight]); 

    // Add scales to axis
    var x_axis = d3.axisBottom()
                   .scale(scale)
                   .tickFormat(d3.format("d"));  // Formats number as a date, e.g. 2008 instead of 2,008 

    //Append group and insert axis
    svg.append("g")
       .call(x_axis);

    map.on('load', function () {

        var permits = map.queryRenderedFeatures(null, {
            layers: ["sea-level-rise-maps"]
        });

        var permitDatesArray = [];
        var permitYearsArray = [];

        for (i=0; i<permits.length; i++) {
            var permitDate = permits[i].properties.AppliedDat;
          
            var permitYear = permitDate.substring(0, 4);
            
            permitDatesArray.push(permitDate);    
            permitYearsArray.push(permitYear);
        }

        
        $("#timeslider").change(function(e) {
            var year = this.value; 
            var indices = [];

            var matches = permitDatesArray.filter(function(item, i){
                if (item.indexOf(year) >= 0) {
                    indices.push(i);
                }
            });

            // create filter 
            var newFilters = ["any"];
            
            for (i=0; i<indices.length; i++) {
                var filter = ["==","AppliedDat", permitDatesArray[indices[i]]];
                newFilters.push(filter);
            }

            map.setFilter("sea-level-rise-maps", newFilters);
        });

    });
