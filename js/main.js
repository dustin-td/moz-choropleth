window.onload = initialize();

function initialize(){
    setMap();
};

function setMap(){
    //frame dimensions
    var width = 1080;
    var height = 960;

    //new svg element
    var map = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

    //Mozambique albers
    var projection = d3.geo.albers()
                .center([36.72, -17.06])
                .parallels([-13.65, -18.3])
                .rotate([0,0])
                .scale(7000)
                .translate([width / 2, height / 2]);

    //var projection = d3.geo.equirectangular()
    //    .scale(500)
    //    .translate([width / 2, height / 2]);

    //svg path generator
    var path = d3.geo.path()
           .projection(projection);

    // graticules
    var graticule = d3.geo.graticule()
            .step([10,10]);

    var gratBackground = map.append("path")
            .datum(graticule.outline)
            .attr("class", "gratBackground")
            .attr("d", path);

    var gratLines = map.selectAll(".gratLines")
            .data(graticule.lines)
            .enter()
            .append("path")
            .attr("class", "gratLines")
            .attr("d", path);

    //queue
    queue()
            .defer(d3.json, "data/africa.topojson")
            .defer(d3.json, "data/admin2.topojson")
            .await(callback);

    function callback(error, africaData, mozData){

        // Add African countries to map
        var countries = map.append("path")
                .datum(topojson.feature(
                    africaData, africaData.objects.AfricanCountries
                ))
                .attr("class", "OBJECTID")
                .attr("d", path);

        // Add Mozambique districts to map
        var districts = map.selectAll(".admin2")
                .data(topojson.feature(mozData,
                                        mozData.objects.admin2).features)
                .enter()
                .append("path")
                .attr("class", "admin2")
                .attr("id", function(d) { return d.properties.NAME_2 })
                .attr("d", path)
    };
}
