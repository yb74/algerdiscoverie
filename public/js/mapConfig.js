

// Set theme
// am4core.useTheme(am4themes_animated);

// Create map chart
let chart = am4core.createFromConfig({
    // Set map to use
    "geodata": "algeriaHigh",

    // Set map projection
    "projection": "Miller",

    // Create polygon series
    "series": [{
        "id": "s1",
        "type": "MapPolygonSeries",
        "useGeodata": true,
        "exclude": ["AQ"], // exclude Antarctica

        // Configure tooltip
        "tooltip": {
            "fill": "#000000",
            "keepTargetHover": true,
            "label": {
                "interactionsEnabled": true,
            },
        },

        "calculateVisualCenter": true,

        // Configure appearance of polygons
        "mapPolygons": {
            // "tooltipText": "{name}",
            "togglable": true,
            "tooltipPosition": "fixed",
            "tooltipHTML": '<b class="label-name' +
                '">{name}</b><br><a class="btn btn-primary font-size-2" href="https://en.wikipedia.org/wiki/{category.urlEncode()}">Plus d\'infos</a>',

            // Configure states
            "states": {
                "hover": {
                    "properties": {
                        "fill": "#67b7dc"
                    }
                },
                "active": {
                    "properties": {
                        "fill": "#a367dc"
                    }
                }
            },

            // Set click events
            "events": {
                "hit": function (event) {
                    // if we have some country selected, set default state to it
                    if (this.currentActive) {
                        this.currentActive.setState("default");
                    }

                    chart.zoomToMapObject(event.target);
                    this.currentActive = event.target;
                }
            }
        }
    }],

    // Create a small map control
    "smallMap": {
        "series": ["s1"]
    },

    // Add zoom control
    "zoomControl": {
        "slider": {
            "height": 100
        }
    }

}, "chartdiv", "MapChart");


/*let gardia = polygonSeries.getPolygonById("DZ-47");
gardia.isHover = false;*/

console.log(chart.properties.rotation);