<script type="text/javascript">
var jekyllMapping = (function () {
    'use strict';
    var settings;
    var that = {
        plotArray: function(locations) {
            function jekyllMapListen (m, s) {
                if (s.link) {
                    google.maps.event.addListener(m, 'click', function() {
                        window.location.href = s.link;
                    });
                }
            }
            var bounds = new google.maps.LatLngBounds(), markers = [], s, l, m;
            while (locations.length > 0) {
                s = locations.pop();
                l = new google.maps.LatLng(s.latitude, s.longitude);
                m = new google.maps.Marker({
                    position: l,
                    map: that.map,
                    title: s.title
                });
                markers.push(m);
                bounds.extend(l);                
                jekyllMapListen(m, s);
            }
            that.map.fitBounds(bounds);
        },
        indexMap: function () {
            that.plotArray(settings.pages);
        },
        pageToMap: function () {
            if (typeof(settings.latitude) !== 'undefined' && typeof(settings.longitude) !== 'undefined') {
                that.options.center = new google.maps.LatLng(settings.latitude, settings.longitude);

                var mainMarker = new google.maps.Marker({
                    position: that.options.center,
                    map: that.map,
                    title: "{{ page.title }}"
                });
                that.map.setCenter(that.options.center);
            }     

            if (settings.locations instanceof Array) {
                that.plotArray(settings.locations);
            }

            if (settings.kml) {
                var mainLayer = new google.maps.KmlLayer(settings.kml);
                mainLayer.setMap(that.map);
            }
            
            if (settings.layers) {
                var layers = [];
                while (settings.layers.length > 0){
                    var m = new google.maps.KmlLayer(settings.layers.pop());
                    layers.push(m);
                    m.setMap(that.map);
                }
            }
        },
        mappingInitialize: function () {
            that.options = {
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(0, 0)
            };

            that.map = new google.maps.Map(document.getElementById("jekyll-mapping"), that.options);

            if (settings.pages) {
                that.indexMap();
            } else {
                that.pageToMap();
            }
        },
        loadScript: function (set) {
            settings = set;
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://maps.googleapis.com/maps/api/js?key=" + settings.api_key + "&sensor=false&callback=jekyllMapping.mappingInitialize";
            document.body.appendChild(script);
        }
    };
    return that;
})();
</script> 