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
        this.zoomout();

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

        // mobile scroll/drag grip config
        this.map.dragGrip.position = "left"; // position
        this.map.dragGrip.height = am4core.percent(50); // height
        this.map.dragGrip.autoHideDelay = 5000; // delay before hiding (set to 0 to disable hiding)
        // grip background style
        this.map.dragGrip.background.fill = am4core.color("#5f9");
        this.map.dragGrip.background.fillOpacity = 0.8;
        this.map.dragGrip.background.cornerRadius(0, 0, 0, 0);
        // icon color
        this.map.dragGrip.icon.stroke = am4core.color("#fff");
        // adding a shadow
        this.map.dragGrip.background.strokeWidth = 0;
        this.map.dragGrip.background.fillOpacity = 1;
        this.map.dragGrip.marginRight = 10;
        this.map.dragGrip.filters.push(new am4core.DropShadowFilter);
    }

    showRegionInfo() {
        let colorSet = new am4core.ColorSet();
        // Configure polygons
        let polygonTemplate = this.polygonSeries.mapPolygons.template;
        polygonTemplate.togglable = true;
        // Set events to apply "active" state to clicked polygons
        let currentActive;

        // Create hover state and set alternative fill color
        // let hs = this.polygonTemplate.states.create("hover");
        // hs.properties.fill = am4core.color("#367B25");
        // Configure "active" state
        let activeState = this.polygonTemplate.states.create("active");
        activeState.properties.fill = am4core.color("#cc3300");

        // setEvents on click on regions
        this.polygonClickEv = this.polygonTemplate.events.on("hit", ev => {
            let regionName = document.getElementById("article-1");
            // regionName.textContent= ev.target.dataItem.dataContext.name;
            let data = ev.target.dataItem.dataContext;
            let info = document.getElementById("region_info");
            info.innerHTML = "<h3>" + data.name + " (" + data.id + ")</h3>";

            // Scroll to a certain element
            let winmed = window.matchMedia("(max-width: 985px)");
            if (winmed.matches){
                document.querySelector('#region_info').scrollIntoView({
                    behavior: 'smooth'
                });
            }

            if (data.description) {
                info.innerHTML += data.description;
            } else {
                info.innerHTML += "<i>No description provided.</i>"
            }

            // if we have some country selected, set default state to it
            if (currentActive) {
                currentActive.setState("default");
            }

            // zoom to an object on on click
            this.map.zoomToMapObject(ev.target);
            currentActive = ev.target;
        });
    }

    zoomout() {
        let zoomoutBtn = this.map.chartContainer.createChild(am4core.Button);
        zoomoutBtn.padding(5, 5, 5, 5);
        zoomoutBtn.align = "right";
        zoomoutBtn.marginRight = 15;

        // unzoomButton.icon = new am4core.Sprite();
        // // home icon :
        // unzoomButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";

        zoomoutBtn.label.text = "Zoom out";
        zoomoutBtn.align = "right";
        zoomoutBtn.events.on("hit", () => {
            this.map.goHome();
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