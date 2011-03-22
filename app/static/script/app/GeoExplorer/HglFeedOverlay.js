Ext.namespace("GeoExplorer")


/*
 *  Create a tool to display Picasa Feeds in GeoExplorer based on 1 or more keywords
 *  target: GeoExplorer instance
 */
GeoExplorer.HglFeedOverlay = function(target){
		
		this.picasaRecord = null;
			
		this.popupControl = null;

        this.popup = null;
		
		this.createOverlay = function() {
			var keywords = target.about["keywords"] ? target.about["keywords"] : "of";
            var hglConfig = {name: "Picasa", source: "0", group: "Overlays", buffer: "0", type: "OpenLayers.Layer.WFS",
            		args: ["HGL Points", "/hglpoint/",
                           {  'max-results':'50', 'q' : keywords},
                           {  format: OpenLayers.Format.GeoRSS, projection: "EPSG:4326", displayInLayerSwitcher: false,
                              formatOptions: {
                                              createFeatureFromItem: function(item) {
                                                                     var feature = OpenLayers.Format.GeoRSS.prototype
                                                                                   .createFeatureFromItem.apply(this, arguments);
                                                                                    feature.attributes.guid = OpenLayers.Util.getXmlNodeValue(this.getElementsByTagNameNS(item, "*","guid")[0]);
                                                                                    feature.attributes.title = OpenLayers.Util.getXmlNodeValue(this.getElementsByTagNameNS(item, "*","title")[0]);
                                                                                    feature.attributes.description = OpenLayers.Util.getXmlNodeValue(this.getElementsByTagNameNS(item, "*","description")[0]);
                                                                                    return feature;
                                                                                    }
                                             }
                      }]
             };

            
            
                                                                                                                       
             var feedSource = Ext.ComponentMgr.createPlugin(
                          hglConfig, "gx_olsource"
             );
             this.hglRecord = feedSource.createLayerRecord(hglConfig);
             this.hglRecord.group = hglConfig.group;
             
             
     		this.popupControl = new OpenLayers.Control.SelectFeature(this.hglRecord.getLayer(), {
 			   //hover:true,
 			   clickout: true,
 			   onSelect: function(feature) {
 			      
 			      var pos = feature.geometry;
                  this.popup = new OpenLayers.Popup.FramedCloud("popup",
                             feature.geometry.getBounds().getCenterLonLat(),
                             new OpenLayers.Size(150,150),
                             "<a target='_blank' href=\"" +
 			                                         feature.attributes.guid + "\">" +  feature.attributes.title +"</a><p>" + feature.attributes.description + "</p>",
                             null, true);
 			      this.popup.closeOnMove = false;
                  this.popup.maxSize = new OpenLayers.Size(300,300);
 			      this.popup.keepInMap = true;
 			      target.mapPanel.map.addPopup(this.popup);
 	        },
 	        
 	        onUnselect: function(feature) {
 	        	target.mapPanel.map.removePopup(this.popup);
 	            this.popup = null;
 	        }
 	       }); 
             
    		target.mapPanel.map.addControl(this.popupControl);
    	    this.popupControl.activate();
    	    target.mapPanel.layers.insert(target.mapPanel.layers.data.items.length, [this.hglRecord] );
		}
		
		
		this.removeOverlay = function(){
			target.mapPanel.layers.remove(this.hglRecord, true);
			this.hglRecord = null;
			this.popupControl = null;
		}

}