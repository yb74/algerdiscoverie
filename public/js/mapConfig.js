class Map {
    constructor() {
        this.map = am4core.create("chartdiv", am4maps.MapChart); // creating map in the chartdiv

        try {
            this.map.geodata = am4geodata_algeriaHigh; // getting data of Algeria map
        }
        catch (e) {
            this.map.raiseCriticalError({
                "message": "Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."
            });
        }

        this.map.geodataSource.url = "js/regionData.js"; // getting json data of the regions
        this.map.projection = new am4maps.projections.Miller();
        this.polygonSeries = new am4maps.MapPolygonSeries(); // instantiation of polygon series (article polygons)
        this.theme = am4core.useTheme(am4themes_animated); // set themes
        // Configure series (polygon series)
        this.polygonTemplate = this.polygonSeries.mapPolygons.template;

        // events
        // this.getLatLngOnclick(); // get latitude and longitude onclick on map
        this.showRegionInfo(); // setEvents on hover on regions
        this.configMap();
        this.unzoom();

        // this.displayPopup(); // adding popup
        // this.displayModal(); // adding modal

        // this.getRegion();
    }

    // getRegion() {
    //     this.polygonTemplate.events.on("hit", ev => {
    //
    //         fetch('/map/info')
    //             .then(response => response.json())
    //             .then(regions => regions.forEach((region) => {
    //                 let regionData = {
    //                     ref: region.ref,
    //                     coords: region.coords,
    //                     name: region.name,
    //                     description: region.description
    //                 };
    //                 // console.log(regionData);
    //                     console.log(regionData.name);
    //
    //                     let html = "";
    //
    //                     html += "<tr>";
    //                     html += "<td>" + region.ref + "</td>";
    //                     html += "<td>" + region.coords + "</td>";
    //                     html += "<td>" + region.name + "</td>";
    //                     html += "<td>" + region.description + "</td>";
    //                     html += "</tr>";
    //                     document.getElementById("region_info").innerHTML += html;
    //             }))
    //             .catch(error => console.log('Error', error));
    //     });
    // }

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
        // Zoom control bar vertical position
        this.map.zoomControl.valign= top;
        this.map.zoomControl.align= "left";
        console.log(this.map.zoomControl);

        // adding small map
        this.map.smallMap = new am4maps.SmallMap();
        this.map.smallMap.series.push(this.polygonSeries);

        // map background color
        this.map.background.fill = am4core.color("#aadaff");
        this.map.background.fillOpacity = 1;

        // Create hover state and set alternative fill color
        let hs = this.polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#367B25");

        // Configure "active" state
        // let colorSet = new am4core.ColorSet();
        let activeState = this.polygonTemplate.states.create("active");
        activeState.properties.fill = am4core.color("#ff0000");
    }

    showRegionInfo() {
        // setEvents on click on regions
        this.polygonClickEv = this.polygonTemplate.events.on("hit", ev => {
            let regionName = document.getElementById("article-1");
            // regionName.textContent= ev.target.dataItem.dataContext.name;
            let data = ev.target.dataItem.dataContext;
            let info = document.getElementById("region_info");
            info.innerHTML = "<h3>" + data.name + " (" + data.id + ")</h3>";
            // if (data.description) {
            //     info.innerHTML += data.description;
            // } else {
            //     info.innerHTML += "<i>No description provided.</i>"
            // }

            // zoom to an object and unzoom on double click
            ev.target.series.chart.zoomToMapObject(ev.target);
        });
    }

    unzoom() {
        let button = this.map.chartContainer.createChild(am4core.Button);
        button.padding(5, 5, 5, 5);
        button.align = "right";
        button.marginRight = 15;
        // button.height = 50;
        console.log(button);
        button.events.on("hit", () => {
            this.map.goHome();
        });
        button.icon = new am4core.Sprite();
        button.icon.path = "M45.6,0.5 C20.7,0.5 0.5,20.7 0.5,45.6 C0.5,70.5 20.7,90.7 45.6,90.7 C56.6,90.7 66.6,86.8 74.5,80.2 L109.6,115.3 C110.4,116.1 111.4,116.5 112.5,116.5 C113.5,116.5 114.6,116.1 115.4,115.3 C117,113.7 117,111.1 115.4,109.5 L80.3,74.5 C86.8,66.7 90.8,56.6 90.8,45.6 C90.7,20.7 70.5,0.5 45.6,0.5 Z M45.6,82.6 C25.2,82.6 8.6,66 8.6,45.6 C8.6,25.2 25.2,8.6 45.6,8.6 C66,8.6 82.6,25.2 82.6,45.6 C82.6,66 66,82.6 45.6,82.6 Z";

        // home icon :
        // button.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
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

    // displayModal() {
    //     this.polygonTemplate.events.on("hit", ev => {
    //         this.map.modal.close();
    //         let modalTitle = "Basic information";
    //         let modalContent =
    //             "<table style=\"position: relative; width: 100%;\">\n" +
    //             "<tbody><tr>\n" +
    //             "<td><img class=\"flag\" src=\"/img/dz-flag.png\" style=\"vertical-align: bottom; width: 48px;\"></td>\n" +
    //             "<td class=\"countryName\">" + ev.target.dataItem.dataContext.name + "</td>\n" +
    //             "</tr>\n" +
    //             "<tr>\n" +
    //             "<td>&nbsp;</td>\n" +
    //             "<td class=\"stateName\"></td>\n" +
    //             "</tr>\n" +
    //             "<tr>\n" +
    //             "<td class=\"dialogLabel\"><span id=\"capitalCityNameSpan\" style=\"display: inline;\">Capitale</span><span id=\"capitalStateCityNameSpan\" style=\"display: none;\">Capitale</span> :</td>\n" +
    //             "<td class=\"dialogData capitalCityName\">Alger</td>\n" +
    //             "</tr>\n" +
    //             "<tr>\n" +
    //             "<td class=\"dialogLabel\">Population :</td>\n" +
    //             "<td class=\"dialogData population\">34 178 188</td>\n" +
    //             "</tr>\n" +
    //             "<tr>\n" +
    //             "<td class=\"dialogLabel\">Superficie :</td>\n" +
    //             "<td class=\"dialogData\"><span class=\"area\">2 381 741</span> km<span style=\"font-size: 0.7em; vertical-align: super;\">2</span> (<span class=\"areaPct\">1.59</span>% du monde)</td>\n" +
    //             "</tr>\n" +
    //             "<tr>\n" +
    //             "<td class=\"dialogLabel\"><a href='#' class='btn btn-success'>More info</a></td>\n" +
    //             "</tr>\n" +
    //             "</tbody></table>";
    //
    //             // "<img src='../img/dz-flag.png' alt='Algeria\s flag'> <span>" + ev.target.dataItem.dataContext.name + "</span>";
    //
    //         let modal = this.map.openModal(modalContent, modalTitle);
    //         // modal.left = ev.svgPoint.x + 15;
    //         // modal.top = ev.svgPoint.y + 15;
    //
    //         // zoom to an object
    //         ev.target.series.chart.zoomToMapObject(ev.target);
    //
    //         this.map.modal.events.on("opened", ev => {
    //             // console.log(ev);
    //         });
    //
    //         this.map.modal.events.on("closed", ev => {
    //             // console.log(ev);
    //         });
    //     });
    // }

    // getLatLngOnclick() {
    //     this.map.seriesContainer.events.on("hit", ev => {
    //         //console.log(this.map.svgPointToGeo(ev.svgPoint));
    //     });
    // }
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