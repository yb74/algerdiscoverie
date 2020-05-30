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

        this.showRegionInfo();
        this.configMap();
        this.zoomControl();

        // this.displayPopup(); // adding popup
        // this.displayModal(); // adding modal

        this.getRegionList();
    }

    getRegionList() {
        fetch('/map/info')
            .then(response => response.json())
            .then(regions => regions.forEach((region) => {
                let regionData = {
                    ref: region.ref,
                    coords: region.coords,
                    name: region.name,
                    description: region.description
                };

                $("#show_region_list_btn").on('click', () => {
                    let html = "";
                    html += "<p><span class='font-weight-bold'>Zip code :</span> " + regionData.ref + "</p>";
                    html += "<p><span class='font-weight-bold'>Region name :</span>" + region.name + "</p>";
                    document.getElementById("region-list").innerHTML += html;

                    $("#show_region_list_btn").hide();
                    $("#hide_region_list_btn").show();
                    document.getElementById("region-list").style.display = "block";
                });

                $("#hide_region_list_btn").on('click', () => {
                    $("#show_region_list_btn").show();
                    $("#hide_region_list_btn").hide();
                    document.getElementById("region-list").style.display = "none";
                });
            }))
            .catch(error => console.log('Error', error));
    }

    configMap() {
        this.polygonSeries.useGeodata = true;
        this.map.series.push(this.polygonSeries); // Splitting Algeria map into regions

        // adding tooltipText
        this.map.tooltip.getFillFromObject = false;
        this.polygonTemplate.tooltipText = "{name}";
        this.polygonTemplate.fill = am4core.color("#74B266"); // polygon color

        // map background color
        this.map.background.fill = am4core.color("#aadaff");
        this.map.background.fillOpacity = 1;

        // mobile scroll/drag grip config
        this.map.dragGrip.position = "left"; // position
        this.map.dragGrip.height = am4core.percent(70); // height
        this.map.dragGrip.autoHideDelay = 5000; // delay before hiding (set to 0 to disable hiding)
        // grip background style
        this.map.dragGrip.background.fill = am4core.color("lightgrey");
        this.map.dragGrip.background.fillOpacity = 0.8;
        this.map.dragGrip.background.cornerRadius(0, 0, 0, 0);
        // icon color
        this.map.dragGrip.icon.stroke = am4core.color("#fff");
        // adding a shadow
        this.map.dragGrip.background.strokeWidth = 0;
        this.map.dragGrip.background.fillOpacity = 1;
        // this.map.dragGrip.marginRight = 10;
        this.map.dragGrip.filters.push(new am4core.DropShadowFilter);
    }

    showRegionInfo() {
        let colorSet = new am4core.ColorSet();
        // Configure polygons
        let polygonTemplate = this.polygonSeries.mapPolygons.template;
        polygonTemplate.togglable = true;
        // Set events to apply "active" state to clicked polygons
        let currentActive;

        let activeState = this.polygonTemplate.states.create("active");
        activeState.properties.fill = am4core.color("#cc3300");

        // setEvents on click on regions
        this.polygonClickEv = this.polygonTemplate.events.on("hit", ev => {
            let data = ev.target.dataItem.dataContext;
            let info = document.getElementById("region_info");
            info.innerHTML = "<h3>" + data.name + " (" + data.id + ")</h3>";

            // setting parameters for smartphone and tabs
            let winmed = window.matchMedia("(max-width: 985px)");
            if (winmed.matches){
                // Scroll to region info
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

    zoomControl() {
        //adding chart zoom control
        this.map.zoomControl = new am4maps.ZoomControl();
        // zoom control bar height
        this.map.zoomControl.slider.height = 100;
        // Zoom control bar vertical position
        this.map.zoomControl.valign= top;
        this.map.zoomControl.align= "left";

        let zoomoutBtn = this.map.chartContainer.createChild(am4core.Button);
        zoomoutBtn.padding(5, 5, 5, 5);
        zoomoutBtn.align = "right";
        zoomoutBtn.marginRight = 15;

        zoomoutBtn.label.text = "Zoom out";
        zoomoutBtn.align = "right";
        zoomoutBtn.events.on("hit", () => {
            this.map.goHome();
        });

        // setting zoom buttons position for smartphone and tabs
        let winmed = window.matchMedia("(max-width: 985px)");
        if (winmed.matches) {
            zoomoutBtn.valign = "middle";
            this.map.zoomControl.align= "right";
        }
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
}

const map = new Map();

// Algeria lat/lng 28.0339° N, 1.6596° E

// $.ajax({
//     url: 'https://api.openweathermap.org/data/2.5/onecall?lat={28.0339}&lon={1.6596}&exclude={part}&appid={300514692dfa77f36da12226a3fd16ab}',
//     type : 'GET',
//     // data: {
//     //     access_key: '300514692dfa77f36da12226a3fd16ab',
//     //     query: 'New York'
//     // },
//
//     dataType: 'json',
//     success: function(apiResponse) {
//         // console.log(`Current temperature in ${apiResponse.weather.name} is ${apiResponse.current.temperature}℃`);
//         console.log(apiResponse);
//     }
// });