/**
 * Copyright (c) 2009 OpenGeo
 */

/** api: (define)
 *  module = gxp // to be ported to gxp
 *  class = GoogleEarthPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("GeoExplorer");

/** api: constructor
 *  .. class:: GoogleEarthPanel(config)
 *   
 *      Create a panel for showing a 3D visualization of
 *      a map with the Google Earth plugin.  
 *      See http://code.google.com/apis/earth/ for plugin api
 *      documentation.
 */
GeoExplorer.GoogleEarthPlusPanel = Ext.extend(gxp.GoogleEarthPanel, {
	
	menuButton: null,
	
    onEarthReady: function(object){
        this.earth = object;
        
        // We don't want to fly. Just go to the right spot immediately.
        this.earth.getOptions().setFlyToSpeed(this.earth.SPEED_TELEPORT);
        
        // Set the extent of the earth to be that shown in OpenLayers.
        this.resetCamera();
        this.setExtent(this.map.getExtent());
        
        // Show the navigation control, and make it so it is on the left.
        // Not actually sure how the second to fourth lines make that happen,
        // but hey -- it works. :)
        this.earth.getNavigationControl().setVisibility(this.earth.VISIBILITY_SHOW);
        var screenXY = this.earth.getNavigationControl().getScreenXY();
        screenXY.setXUnits(this.earth.UNITS_PIXELS);
        screenXY.setYUnits(this.earth.UNITS_INSET_PIXELS);
        
        // Show the plugin.
        this.earth.getWindow().setVisibility(true);

        this.layers.each(function(record) {
            this.addLayer(record);
        }, this);

        this.layers.on("remove", this.updateLayers, this);

        this.layers.on("update", this.updateLayers, this);
        
        this.layers.on("add", this.updateLayers, this);
        
        // Set up events. Notice global google namespace.
        // google.earth.addEventListener(this.earth.getView(), 
            // "viewchangeend", 
            // this.updateMap.createDelegate(this));
    
		if (this.menuButton != null)
			this.insertMenuButton();
		
	},
	
	/**
 * Create a custom button using the IFRAME shim and CSS sprite technique
 * at the given x, y offset from the top left of the plugin container.
 */
insertMenuButton : function() {
  
	x = 0;
	y = 0;
	height = 50;
	width = 100;
	
  // create an IFRAME shim for the button
  var iframeShim = document.createElement('iframe');
  iframeShim.frameBorder = 0;
  iframeShim.scrolling = 'no';
  iframeShim.src = (navigator.userAgent.indexOf('MSIE 6') >= 0) ?
      '' : 'javascript:void(0);';

  // position the button and IFRAME shim
  var pluginRect = this.getElementRect(this.mapPanel);
  iframeShim.className = "cga-logo-overlay";
  
  // set up z-orders
  iframeShim.style.zIndex = 999;
  
  
  // add the iframe shim and button
  document.body.appendChild(iframeShim);
  iframeShim.appendChild(this.menuButton);

  
},

/**
 * Helper function to get the rectangle for the given HTML element.
 */
getElementRect: function(element) {
  var left = element.offsetLeft;
  var top = element.offsetTop;
  
  var p = element.offsetParent;
  while (p && p != document.body.parentNode) {
    if (isFinite(p.offsetLeft) && isFinite(p.offsetTop)) {
      left += p.offsetLeft;
      top += p.offsetTop;
    }
    
    p = p.offsetParent;
  }
  
  return { left: left, top: top,
           width: element.offsetWidth, height: element.offsetHeight };
}


	
	
});
