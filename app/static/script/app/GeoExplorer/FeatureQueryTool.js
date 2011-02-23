
Ext.namespace("GeoExplorer");

/** api: constructor
 *  Create a tool to perform a WFS GetFeature query for the selected point on the map
 *  target: GeoExplorer instance
 */
GeoExplorer.FeatureQueryTool =  function(geoExplorer, queryPanelName, gridPanelName) {

        //target should be the GeoExplorer object 
	var target = geoExplorer;
	var gridWin =  null;
	var hilites=  null;
	var resultWin = null;
	var currentFeatures = [];
	var gridMarker =  null;
	var resultMarker =  null;
    var queryPanel = queryPanelName;
    var gridWinPanel = gridPanelName;

    //Fire this everytime the map is clicked
	var onMapClick = function(e) {
        var pixel = new OpenLayers.Pixel(e.xy.x, e.xy.y);
		var lonlat = target.mapPanel.map.getLonLatFromPixel(pixel);



		var count = 0, successCount = 0, featureCount = 0;
		var features = [];
		var featureMeta = [];

        var queryableLayers = target.mapPanel.layers.queryBy(function(x){
            return x.get("queryable");
        });

        queryableLayers.each(function(x){
        	if (x.getLayer().getVisibility())
        		count++;
        });

        var map = target.mapPanel.map;

        //Do a GetFeature request for every queryable layer (basically every layer that is visible)
        queryableLayers.each(function(x){
        	var dl = x.getLayer();
        	if (dl.getVisibility()){
        	wfs_url = dl.url;
        	//Try to guess WFS url


        	var clickTolerance = 10;
        	pixel = e.xy;
        	var llPx = pixel.add(-clickTolerance/2, clickTolerance/2);
        	var urPx = pixel.add(clickTolerance/2, -clickTolerance/2);
        	var ll = map.getLonLatFromPixel(llPx);
        	var ur = map.getLonLatFromPixel(urPx);
        	var bounds = new OpenLayers.Bounds(ll.lon, ll.lat, ur.lon, ur.lat);


            if (wfs_url.indexOf("?") > -1)
                wfs_url = wfs_url.substring(0, wfs_url.indexOf("?"));
            wfs_url = wfs_url.replace("WMS","WFS").replace("wms","wfs");

            wfs_url+="?service=WFS&request=GetFeature&version=1.1.0&srsName=EPSG:900913&outputFormat=json&typeName=" + dl.params.LAYERS + "&BBOX=" + bounds.toBBOX() + ",EPSG:900913";
    					Ext.Ajax.request({
    						'url':wfs_url,
    						'success':function(resp, opts) {
    							successCount++;

//    							if(dl.params.LAYERS.indexOf("geonode") == -1 &&  resp.responseText != '') {
//       								msg = resp.responseText;
//    								Ext.Msg.alert('Results for ' + x.get("title"),msg);
//    							}
//    							else
                                {
    							if(resp.responseText != '') {
    							    var featureInfo = new OpenLayers.Format.GeoJSON().read(resp.responseText);
    							    if (featureInfo) {
    							        if (featureInfo.constructor != Array) {
    							        	featureInfo = [featureInfo];
    							        }

    								featureInfo.title = x.get("title");

    								if (target.dataLayers[dl.params.LAYERS] && target.dataLayers[dl.params.LAYERS].searchFields.length > 0) {
    									featureInfo.queryfields = target.dataLayers[dl.params.LAYERS].searchFields;
    									featureInfo.nameField = featureInfo.queryfields[0].attribute;
    								} else if (featureInfo.length > 0){

                                            var qfields = [];
                                            for (var fname in featureInfo[0].attributes)
                                            {
                                                qfields.push(fname.toString());
                                            }

                                            featureInfo.queryfields = qfields;

                                            if (featureInfo.queryfields.length > 0)
    									        featureInfo.nameField = featureInfo.queryfields[0];
    								}
    	                        	for(var f = 0; f < featureInfo.length; f++)
    	                        		{
    	                        			feature = featureInfo[f];
    	                        			feature.wm_layer_id = featureCount;
    	                        			feature.wm_layer_title = featureInfo.title;
    	                        			feature.wm_layer_name = feature.attributes[featureInfo.nameField];
    	                        			feature.wm_layer_type = dl.params.LAYERS;
    	                        			featureCount++;
    	                        			features = features.concat(feature);
    	                        		}



    	                        	}
    	                        	featureMeta[dl.params.LAYERS] = featureInfo.queryfields;
                                }
    							}

    							//alert(featureMeta);

    							if(successCount == count) {
    								if(features.length == 0) {
    									Ext.Msg.alert('Map Results','No features found at this location.');
    								} else {
    									displayXYResults(features, featureMeta, e.xy);
    								}
    							}
    						},
    						'failure':function(resp, opts) {
                                successCount++;
    							if(successCount == count) {
    								if(features.length == 0) {
    									Ext.Msg.alert('Map Results','No features found at this location.');
    								} else {
    									displayXYResults(features, featureMeta, e.xy);
    								}
    							}
    							//var msg = 'The feature request failed.';
    							//msg += '<br />details: ' + resp.responseText;
    							//Ext.Msg.alert('Request Failed',msg);
    						},
    						'headers':{},
    						'params':{}
    					});
        	}
        });

    		if (count == 0) {
    			Ext.Msg.alert('Searchable Layers','There are no searchable layers active.');
    		}

	};


        target.mapPanel.map.events.register('click', target, onMapClick);


    /* Clear out any previous results */
	var reset = function(){
    	var theLayers = target.mapPanel.map.layers;
    	var hLayers = [];
        for (l = 0; l < theLayers.length; l++)
    	{
    		if (theLayers[l].name == "hilites"){
    			target.mapPanel.map.removeLayer(theLayers[l], true);
    			break;
    		}

    	}
	};

    /* Set up display of results in two panels */
	var displayXYResults = function(featureInfo, featureMeta, lonlat) {
        var ep = Ext.getCmp(queryPanel);
        var gp = Ext.getCmp(gridWinPanel);

        ep.expand(true);
        gp.removeAll(true);

        //var dp = Ext.getCmp('gridResultsPanel');
        //dp.removeAll();


		var currentFeatures = featureInfo;
		var reader = new Ext.data.JsonReader({}, [
		                               		   {name: 'wm_layer_title'},
		                               		   {name: 'wm_layer_name'},
		                               		   {name: 'wm_layer_id'},
		                               		   {name: 'wm_layer_type'}
		                               		]);

		var winWidth = 450;


		var startX = 50;

        var gridPanel = new Ext.grid.GridPanel({
			store:new Ext.data.GroupingStore({
				reader: reader,
				data: currentFeatures,
				sortInfo:{field: 'wm_layer_name', direction: "ASC"},
				groupField:'wm_layer_title'
			}),
			columns:[
						{ id:'wm_layer_id', sortable:false, header:'FID', dataIndex:'wm_layer_id', hidden:true},
						{ header: 'Name', sortable:true, dataIndex:'wm_layer_name', width:190 },
						{ header:'Feature Type', dataIndex:'wm_layer_type', width:0, hidden:true },
						{ header:'Layer', sortable:false, dataIndex:'wm_layer_title', width:0, hidden:true }
					],
			view: new Ext.grid.GroupingView({
				//forceFit:true,
				groupTextTpl: '{group}',
                		style: 'width: 425px'
			}),
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true,
				listeners: {
					rowselect: {
						fn: function(sm, rowIndex, rec) {

							displaySingleResult(currentFeatures, rowIndex, rec.data, featureMeta[rec.data.wm_layer_type]);
						}
					}
				}
			}),
			layout: 'fit',
			frame:false,
			collapsible: true,
			title: '',
			iconCls: 'icon-grid',
		     autoHeight:true,
            style: 'width: 425px',
            width: '400'

			//autoExpandColumn:'name',
		});


        gp.add(gridPanel);
        gp.doLayout();


		gridPanel.getSelectionModel().selectFirstRow();



	};

    /* Display details for individual feature*/
	var displaySingleResult = function(currentFeatures, rowIndex, gridFeature, metaColumns) {

        var dp = Ext.getCmp('gridResultsPanel');
        dp.removeAll();

		var feature = null;
		// Look for the feature in the full collection of features (the grid store only has simplified objects)
		for(var i = 0; i < currentFeatures.length; i++) {
			if(currentFeatures[i].wm_layer_id == gridFeature.wm_layer_id) {
				feature = currentFeatures[i];
			}
		}

		if(!feature) {
			return;
		}

	    addVectorQueryLayer(feature);


		var featureHtml = createHTML(feature, metaColumns);
		dp.update(featureHtml);
		dp.doLayout();

	};

    /* Create rows of attributes */
	createHTML = function(feature, metaColumns) {
		html = '<ul class="featureDetailList" id="featureDetailList">';

		for(c=0; c < metaColumns.length; c++)
			{
				column = metaColumns[c];
                if (column.label) //This must be a worldmap layer
				    html+= "<li><label>" + column.label + "</label><span>" + feature.attributes[column.attribute] + "</span></li>";
                else // This must be an external WMS layer
                    html+= "<li><label>" + column + "</label><span>" + feature.attributes[column] + "</span></li>";
			}

        html += "</ul>";
		return html;
	};


    /* Highlight the selected feature in red */
	var addVectorQueryLayer = function(feature)
	{
	    var highlight_style = {
	        strokeColor: 'Red',
	        strokeWidth: 4,
	        strokeOpacity: 1,
	        fillOpacity: 0.0,
	        pointRadius: 10

	    };

	    reset();

	    //Add highlight vector layer for selected features
	    hilites = new OpenLayers.Layer.Vector("hilites", {
	        isBaseLayer: false,
	        visibility: true,
	        style: highlight_style,
	        displayInLayerSwitcher : false
	    });
    	hilites.addFeatures(feature);
        hilites.setVisibility(true);

	    target.mapPanel.map.addLayers([hilites]);
	    return hilites;

	};

}




