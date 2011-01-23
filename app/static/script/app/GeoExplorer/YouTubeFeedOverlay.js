Ext.namespace("GeoExplorer")

/*
 *  Create a tool to display YouTube Feeds in GeoExplorer based on 1 or more keywords
 *  target: GeoExplorer instance
 */
GeoExplorer.YouTubeFeedOverlay = function(target){
		
		this.youtubeRecord = null;
			
		this.popupControl = null;
		
		this.createOverlay = function() {
			var keywords = target.about["keywords"] ? target.about["keywords"] : "of";
            var youtubeConfig = {name: "Picasa", source: "0", group: "Overlays", buffer: "0", type: "OpenLayers.Layer.WFS",  
            		args: ["Picasa Pictures", "/youtube/", 
                           { 'kind': 'photo', 'max-results':'50', 'q' : keywords},
                           {  format: OpenLayers.Format.GeoRSS, projection: "EPSG:4326", displayInLayerSwitcher: false, 
                              formatOptions: {
                                              createFeatureFromItem: function(item) {
                                                                     var feature = OpenLayers.Format.GeoRSS.prototype
                                                                                   .createFeatureFromItem.apply(this, arguments);
                                                                                    feature.attributes.thumbnail = this.getElementsByTagNameNS(item, "http://search.yahoo.com/mrss/", "thumbnail")[0].getAttribute("url");
                                                                                    feature.attributes.content = OpenLayers.Util.getXmlNodeValue(this.getElementsByTagNameNS(item, "*","summary")[0]);
                                                                                    return feature;
                                                                                    }
                                             },
                              styleMap: new OpenLayers.StyleMap({
                                                                 "default": new OpenLayers.Style({externalGraphic: "${thumbnail}", pointRadius: 14}),
                                                                 "select": new OpenLayers.Style({pointRadius: 20})
                                                               })
                      }]
             };

            
            
                                                                                                                       
             var feedSource = Ext.ComponentMgr.createPlugin(
                          youtubeConfig, "gx_olsource"
             );
             this.youtubeRecord = feedSource.createLayerRecord(youtubeConfig);
             this.youtubeRecord.group = youtubeConfig.group;
             
             
     		this.popupControl = new OpenLayers.Control.SelectFeature(this.youtubeRecord.getLayer(), {
 			   //hover:true,
 			   clickout: true,
 			   onSelect: function(feature) {
 			      
 			      var pos = feature.geometry;
 			      popup = new OpenLayers.Popup("popup",
 			                                         new OpenLayers.LonLat(pos.x, pos.y),
 			                                         new OpenLayers.Size(160,160),
 			                                         "<a target='_blank' href=" + 
 			                                         $(feature.attributes.content).find("a").attr("href") +"><img title='" +
 			                                         feature.attributes.title +"' src='" + feature.attributes.thumbnail +"' /></a>",
 			                                         false);
 			      popup.closeOnMove = true;
 			      popup.keepInMap = true;
 			      target.mapPanel.map.addPopup(popup);
 	        },
 	        
 	        onUnselect: function(feature) {
 	        	target.mapPanel.map.removePopup(popup);
 	            popup = null;
 	        }
 	       }); 
             
    		target.mapPanel.map.addControl(this.popupControl);
    	    this.popupControl.activate();
    	    target.mapPanel.layers.insert(target.mapPanel.layers.data.items.length, [this.youtubeRecord] );
		}
		
		
		this.removeOverlay = function(){
			target.mapPanel.layers.remove(this.youtubeRecord, true);
			this.youtubeRecord = null;
			this.popupControl = null;
		}

}