class Map {
    constructor() {
        this.map = am4core.create("chartdiv", am4maps.MapChart); // creating map in the chartdiv
        this.map.geodata = am4geodata_algeriaHigh; // getting data of Algeria map
        this.map.geodataSource.url = "js/regionData.js"; // getting json data of the regions
        this.map.projection = new am4maps.projections.Miller();
        this.polygonSeries = new am4maps.MapPolygonSeries(); // instantiation of polygon series (article polygons)
        // Configure series (polygon series)
        this.polygonTemplate = this.polygonSeries.mapPolygons.template;

        // events
        this.getLatLngOnclick(); // get latitude and longitude onclick on map
        this.showRegionInfoOnhover(); // setEvents on hover on regions

        this.configMap();

        this.settingImageSeries();

        // this.displayPopup(); // adding popup
        this.displayModal(); // adding modal
    }

    configMap() {
        this.polygonSeries.useGeodata = true;
        this.map.series.push(this.polygonSeries); // Splitting Algeria map into regions

        // adding tooltipText
        this.map.tooltip.getFillFromObject = false;
        console.log(this.map.tooltip.background.fill = am4core.color("red"));
        this.polygonTemplate.tooltipText = "{name}";
        this.polygonTemplate.fill = am4core.color("#74B266"); // polygon color

        //adding chart zoom control
        this.map.zoomControl = new am4maps.ZoomControl();
        // zoom control bar height
        this.map.zoomControl.slider.height = 100;

        // adding small map
        this.map.smallMap = new am4maps.SmallMap();
        this.map.smallMap.series.push(this.polygonSeries);

        // map background color
        this.map.background.fill = am4core.color("#aadaff");
        this.map.background.fillOpacity = 1;

        // Create hover state and set alternative fill color
        let hs = this.polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#367B25");
    }

    showRegionInfoOnhover() {
        // setEvents on hover on regions
        this.polygonClickEv = this.polygonTemplate.events.on("over", ev => {
            let regionName = document.getElementById("article-1");
            // regionName.textContent= ev.target.dataItem.dataContext.name;
            let data = ev.target.dataItem.dataContext;
            let info = document.getElementById("region_info");
            info.innerHTML = "<h3>" + data.name + " (" + data.id + ")</h3>";
            if (data.description) {
                info.innerHTML += data.description;
            } else {
                info.innerHTML += "<i>No description provided.</i>"
            }
            // zoom to an object
            // ev.target.series.chart.zoomToMapObject(ev.target);
        });
    }

    // displayPopup() {
    //     this.polygonTemplate.events.on("hit", ev => {
    //         this.map.closeAllPopups();
    //         let popup = this.map.openPopup("Popup: We clicked on <strong>" + ev.target.dataItem.dataContext.name + "</strong>");
    //         // popup.left = ev.svgPoint.x + 15;
    //         // popup.top = ev.svgPoint.y + 15;
    //
    //         // popup.defaultStyles = false; // disable default css style of a popup
    //
    //         this.map.popups.template.events.on("opened", ev => {
    //             console.log(ev);
    //         });
    //
    //         this.map.popups.template.events.on("closed", ev => {
    //             console.log(ev);
    //         });
    //     });
    // }

    displayModal() {
        this.polygonTemplate.events.on("hit", ev => {
            this.map.modal.close();
            let modalTitle = "Basic information";
            let modalContent =
                "<table style=\"position: relative; width: 100%;\">\n" +
                "<tbody><tr>\n" +
                "<td><img class=\"flag\" src=\"/img/dz-flag.png\" style=\"vertical-align: bottom; width: 48px;\"></td>\n" +
                "<td class=\"countryName\">" + ev.target.dataItem.dataContext.name + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>&nbsp;</td>\n" +
                "<td class=\"stateName\"></td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td class=\"dialogLabel\"><span id=\"capitalCityNameSpan\" style=\"display: inline;\">Capitale</span><span id=\"capitalStateCityNameSpan\" style=\"display: none;\">Capitale</span> :</td>\n" +
                "<td class=\"dialogData capitalCityName\">Alger</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td class=\"dialogLabel\">Population :</td>\n" +
                "<td class=\"dialogData population\">34 178 188</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td class=\"dialogLabel\">Superficie :</td>\n" +
                "<td class=\"dialogData\"><span class=\"area\">2 381 741</span> km<span style=\"font-size: 0.7em; vertical-align: super;\">2</span> (<span class=\"areaPct\">1.59</span>% du monde)</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td class=\"dialogLabel\"><a href='#' class='btn btn-success'>More info</a></td>\n" +
                "</tr>\n" +
                "</tbody></table>";

                // "<img src='../img/dz-flag.png' alt='Algeria\s flag'> <span>" + ev.target.dataItem.dataContext.name + "</span>";

            let modal = this.map.openModal(modalContent, modalTitle);
            // modal.left = ev.svgPoint.x + 15;
            // modal.top = ev.svgPoint.y + 15;

            // zoom to an object
            ev.target.series.chart.zoomToMapObject(ev.target);

            this.map.modal.events.on("opened", ev => {
                // console.log(ev);
            });

            this.map.modal.events.on("closed", ev => {
                // console.log(ev);
            });
        });
    }

    getLatLngOnclick() {
        this.map.seriesContainer.events.on("hit", ev => {
            //console.log(this.map.svgPointToGeo(ev.svgPoint));
        });
    }

    settingImageSeries() {
        // // Prepare a MapImageSeries
        let imageSeries = this.map.series.push(new am4maps.MapImageSeries());
        let mapImage = imageSeries.mapImages.template;
        let mapMarker = mapImage.createChild(am4core.Sprite);
        mapMarker.path = "M4 12 A12 12 0 0 1 28 12 C28 20, 16 32, 16 32 C16 32, 4 20 4 12 M11 12 A5 5 0 0 0 21 12 A5 5 0 0 0 11 12 Z";
        mapMarker.width = 32;
        mapMarker.height = 32;
        mapMarker.scale = 0.7;
        mapMarker.fill = am4core.color("#3F4B3B");
        mapMarker.fillOpacity = 0.8;
        mapMarker.horizontalCenter = "middle";
        mapMarker.verticalCenter = "bottom";

        // console.log(imageSeries);
    }

    // let france = polygonSeries.getPolygonById("FR");
    // france.isHover = true;
}

const map = new Map();



// $.ajax({
//     url: 'https://api.weatherstack.com/current',
//     data: {
//         access_key: '96b88531510bd8aee983a22e34037d83',
//         query: 'New York'
//     },
//     dataType: 'json',
//     success: function(apiResponse) {
//         console.log(`Current temperature in ${apiResponse.location.name} is ${apiResponse.current.temperature}℃`);
//     }
// });






//
// // map.series.events.on("over", over);
// // map.series.events.on("out", out);
// //
// // function over(ev) {
// //     ev.target.mapPolygons.each(function(polygon) {
// //         polygon.setState("highlight");
// //         polygonTemplate.tooltipText = "{series.name}: [bold]{name}[/]";
// //         //regionName.style.color = "red";
// //     });
// // }
// //
// // function out(ev) {
// //     ev.target.mapPolygons.each(function(polygon) {
// //         polygon.setState("default");
// //         polygonTemplate.tooltipText = "{series.name}";
// //         //regionName.style.color = "black";
// //     });
// // }
//
// var regionListName = document.getElementById("article-1");
//
// // function over(ev) {
// //     ev.target.mapPolygons.each(function(polygon) {
// //         // ici tu mets ton changement de couleur de ton texte a droite >>>
// //         // regionListName.style.color = "red";
// //         alert("hello");
// //     });
// // }
//
// let regionName = document.getElementById("article-1");
// // polygonTemplate.tooltipText = "{series.name}: [bold]{name}[/]";

// // map.series.events.on("over", over);
// // map.series.events.on("out", out);
// //
// // function over(ev) {
// //     ev.target.mapPolygons.each(function(polygon) {
// //         polygon.setState("highlight");
// //         polygonTemplate.tooltipText = "{series.name}: [bold]{name}[/]";
// //         //regionName.style.color = "red";
// //     });
// // }
// //
// // function out(ev) {
// //     ev.target.mapPolygons.each(function(polygon) {
// //         polygon.setState("default");
// //         polygonTemplate.tooltipText = "{series.name}";
// //         //regionName.style.color = "black";
// //     });
// }