/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * Illustrates how to display and pick Placemarks.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Define the images we'll use for the placemarks.
        var images = [
            "plain-black.png",
            "plain-blue.png",
            "plain-brown.png",
            "plain-gray.png",
            "plain-green.png",
            "plain-orange.png",
            "plain-purple.png",
            "plain-red.png",
            "plain-teal.png",
            "plain-white.png",
            "plain-yellow.png",
            "castshadow-black.png",
            "castshadow-blue.png",
            "castshadow-brown.png",
            "castshadow-gray.png",
            "castshadow-green.png",
            "castshadow-orange.png",
            "castshadow-purple.png",
            "castshadow-red.png",
            "castshadow-teal.png",
            "castshadow-white.png"
        ];

        var pinLibrary = WorldWind.configuration.baseUrl + "images/pushpins/", // location of the image files
            placemark,
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            highlightAttributes,
            placemarkLayer = new WorldWind.RenderableLayer("Placemarks"),
            latitude = 47.684444,
            longitude = -121.129722;

        var naaLibrary = WorldWind.configuration.baseUrl + "images/Naa.png",
            naaMark,
            naaMarkAttributes = new WorldWind.PlacemarkAttributes(null),
            naaMarkLayer = new WorldWind.RenderableLayer("Go Naa"),
            naaLatitude = 41.4459,
            naaLongitude = -74.4229;

        var kunming,
            kunmingAttributes = new WorldWind.PlacemarkAttributes(null),
            kunmingLatitude = 24.8797,
            kunmingLongitude = 102.8332;


        // Set up the common placemark attributes.
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

        // For each placemark image, create a placemark with a label.
        for (var i = 0, len = images.length; i < len; i++) {
            // Create the placemark and its label.
            placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude + i, 1e2), true, null);
            placemark.label = "Placemark " + i.toString() + "\n"
                + "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n"
                + "Lon " + placemark.position.longitude.toPrecision(5).toString();
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            // Create the placemark attributes for this placemark. Note that the attributes differ only by their
            // image URL.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            placemarkAttributes.imageSource = pinLibrary + images[i];
            placemark.attributes = placemarkAttributes;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            highlightAttributes.imageScale = 1.2;
            placemark.highlightAttributes = highlightAttributes;

            // Add the placemark to the layer.
            placemarkLayer.addRenderable(placemark);
        }

        naaMark = new WorldWind.Placemark(new WorldWind.Position(naaLatitude, naaLongitude, 1e2), true, null);
        naaMark.label = "Naa"+ "\n"
            + "Lat" + "41.4459" + "\n"
            + "Lon" + '74.4229' + "\n";
        naaMark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        naaMarkAttributes = new WorldWind.PlacemarkAttributes(naaMarkAttributes);
        naaMarkAttributes.imageSource = naaLibrary;
        naaMark.attributes = naaMarkAttributes;
        naaMark.highlightAttributes = new WorldWind.PlacemarkAttributes(naaMarkAttributes);

        console.log(naaMark);

        kunming = new WorldWind.Placemark(new WorldWind.Position(kunmingLatitude, kunmingLongitude, 1e2), true, null);
        kunming.label = 'kunming' + "\n"
            + "Lat" + "24.8797" + "\n"
            + "Lon" + "102.8332" + "\n";
        kunming.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        kunmingAttributes = new WorldWind.PlacemarkAttributes(kunmingAttributes);
        kunmingAttributes.imageSource = WorldWind.configuration.baseUrl + "images/cloud.png";
        kunming.attributes = kunmingAttributes;
        kunming.highlightAttributes = new WorldWind.PlacemarkAttributes(kunmingAttributes);

        naaMarkLayer.addRenderable(naaMark);
        naaMarkLayer.addRenderable(kunming);

        // Add the placemarks layer to the WorldWindow's layer list.
        wwd.addLayer(placemarkLayer);

        

        wwd.addLayer(naaMarkLayer);

        console.log(wwd);



        // Now set up to handle picking.

        var highlightedItems = [];

        // The common pick-handling function.
        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

            // De-highlight any previously highlighted placemarks.
            for (var h = 0; h < highlightedItems.length; h++) {
                highlightedItems[h].highlighted = false;
            }
            highlightedItems = [];
            console.log(highlightedItems);

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            console.log(pickList.objects);
            // Get the modal
            var modal = document.getElementById("myModal"),
                // Get the <span> element that closes the modal
                span =  document.getElementsByClassName("close")[0];

  /**         if (pickList.objects.length > 0) {
                redrawRequired = true;
            }
**/

            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    pickList.objects[p].userObject.highlighted = true;

                    // Keep track of highlighted items in order to de-highlight them later.
                    highlightedItems.push(pickList.objects[p].userObject);

                    // Detect whether the placemark's label was picked. If so, the "labelPicked" property is true.
                    // If instead the user picked the placemark's image, the "labelPicked" property is false.
                    // Applications might use this information to determine whether the user wants to edit the label
                    // or is merely picking the placemark as a whole.
                    if (pickList.objects[p].labelPicked) {
                        console.log("Label picked");
                    }
                    if (pickList.objects[p].position.latitude === naaLatitude && pickList.objects[p].position.longitude === naaLongitude) {
                        function myFunction() {
                            modal.style.display = "block";
                        }
                        myFunction();
                        span.onclick = function(){
                            modal.style.display = "none";
                        }
                        window.onclick = function(event){
                            if (event.target == modal){
                                modal.style.display = "none";
                            }
                        }
                    }
                }
            }
            // Update the window if we changed anything.
           if (redrawRequired) {
                wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
            }
        };



        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("click", handlePick);
       // wwd.addEventListener("mousemove", kunmingPick);

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });