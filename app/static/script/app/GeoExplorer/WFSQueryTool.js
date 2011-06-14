/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = GeoExplorer
 *  class = WFSQueryTool
 */

/** api: (extends)
 *  gxp.plugins/Tool.js
 */
//Ext.namespace("GeoExplorer");
/** api: constructor
 *  .. class:: WMSQueryTool(config)
 *
 *    This plugins provides an action which, when active, will issue a
 *    GetFeatureInfo request to the WMS of all layers on the map. The output
 *    will be displayed in a popup.
 */
GeoExplorer.WFSQueryTool = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = geo_getfeatureinfo */
    ptype: "geo_wfsquerytool",

    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

    /** private: property[popupCache]
     *  ``Object``
     */
    popupCache: null,

    /** api: config[infoActionTip]
     *  ``String``
     *  Text for feature info action tooltip (i18n).
     */
    infoActionTip: "Get Feature Info",

    /** api: config[popupTitle]
     *  ``String``
     *  Title for info popup (i18n).
     */
    popupTitle: "Feature Info",


    proj_merc : new OpenLayers.Projection("EPSG:900913"),

    featurePanel: "",
    attributePanel: "",

    /** api: config[vendorParams]
     *  ``Object``
     *  Optional object with properties to be serialized as vendor specific
     *  parameters in the requests (e.g. {buffer: 10}).
     */

    /** api: config[paramsFromLayer]
     *  ``Array`` List of param names that should be taken from the layer and
     *  added to the GetFeatureInfo request (e.g. ["CQL_FILTER"]).
     */

    /** api: method[addActions]
     */
    addActions: function() {
        //console.log('addActions');
        var tool = this;
        var updateInfo = function(e) {
            var queryableLayers = tool.target.mapPanel.layers.queryBy(function(x){
                return x.get("queryable");
                //console.log(x.get("name") + ":" + x.get("srs"));
            });

            var map = tool.target.mapPanel.map;
		    var count = 0, successCount = 0, featureCount = 0;
		    var features = [];
		    var featureMeta = [];

            queryableLayers.each(function(x){
        	    if (x.getLayer().getVisibility() && x.getLayer().name != 'hilites')
                {
        		    count++
                    //console.log(x.getLayer().name + ":" + count);
                }
                });


            queryableLayers.each(function(x){
                var dl = x.getLayer();

        	    if (dl.getVisibility() && dl.displayInLayerSwitcher === true)
                {
                    wfs_url = dl.url;
                    var clickTolerance = 10;

                    var pixel = e.xy;

                    var llPx = pixel.add(-clickTolerance/2, clickTolerance/2);
                    var urPx = pixel.add(clickTolerance/2, -clickTolerance/2);
                    var ll = map.getLonLatFromPixel(llPx);
                    var ur = map.getLonLatFromPixel(urPx);
                    var bounds = new OpenLayers.Bounds(ll.lon, ll.lat, ur.lon, ur.lat);
                    bounds.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"))

                    if (wfs_url.indexOf("?") > -1)
                        wfs_url = wfs_url.substring(0, wfs_url.indexOf("?"));
                    wfs_url = wfs_url.replace("WMS","WFS").replace("wms","wfs");

                    wfs_url+="?service=WFS&request=GetFeature&version=1.1.0&srsName=EPSG:4326&outputFormat=JSON&typeName=" + dl.params.LAYERS + "&BBOX=" + bounds.toBBOX() + ",EPSG:4326";
                                Ext.Ajax.request({
                                    'url':wfs_url,
                                    'success':function(resp, opts) {
                                        successCount++;

                                        if(resp.responseText != '') {
                                          try {
                                            var featureInfo = new OpenLayers.Format.GeoJSON().read(resp.responseText);
                                            if (featureInfo) {
                                                if (featureInfo.constructor != Array) {
                                                    featureInfo = [featureInfo];
                                                }

                                            featureInfo.title = x.get("title");

                                            if (tool.target.dataLayers[dl.params.LAYERS] && tool.target.dataLayers[dl.params.LAYERS].searchFields.length > 0) {
                                                featureInfo.queryfields = tool.target.dataLayers[dl.params.LAYERS].searchFields;
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

                                                featureMeta[dl.params.LAYERS] = featureInfo.queryfields;

                                            }  //end if(featureInfo)
                                          } catch (err) {
                                              //Could not be queried, WFS probably turned off
                                          }
                                        }  //end if (resp.responseText)


                                        if(successCount == count) {
                                            if(features.length == 0) {
                                                Ext.Msg.alert('Map Results','No features found at this location.');
                                            } else {
                                                tool.displayXYResults(features, featureMeta, e.xy);
                                            }
                                        }
                                    },
                                    'failure':function(resp, opts) {
                                        successCount++;
                                        if(successCount == count) {
                                            if(features.length == 0) {
                                                Ext.Msg.alert('Map Results','No features found at this location.');
                                            } else {
                                                tool.displayXYResults(features, featureMeta, e.xy);
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
            };

        var actions = GeoExplorer.WFSQueryTool.superclass.addActions.call(this, [{
            tooltip: tool.infoActionTip,
            iconCls: "gxp-icon-getfeatureinfo",
            toggleGroup: this.toggleGroup,
            enableToggle: true,
            allowDepress: true,
            toggleHandler: function(button, pressed) {
                    if (pressed) {
                       tool.target.mapPanel.map.events.register('click', tool.target, updateInfo);
                    } else {
                        tool.reset();
                        tool.target.mapPanel.map.events.unregister('click', tool.target, updateInfo);
                    }
                }
        }]);
    },



    /* Clear out any previous results */
	reset:  function(){
    	var theLayers = this.target.mapPanel.map.layers;
    	var hLayers = [];
        for (l = 0; l < theLayers.length; l++)
    	{
    		if (theLayers[l].name == "hilites"){
    			this.target.mapPanel.map.removeLayer(theLayers[l], true);
    			break;
    		}

    	}
	},

    /* Set up display of results in two panels */
	displayXYResults:  function(featureInfo, featureMeta) {
        var ep = Ext.getCmp(this.featurePanel);
        var gp = Ext.getCmp(this.attributePanel);



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

        var tool = this;
        var gridPanel = new Ext.grid.GridPanel({
            id: 'getFeatureInfoGrid',
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

							tool.displaySingleResult(currentFeatures, rowIndex, rec.data, featureMeta[rec.data.wm_layer_type]);
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
        //gridPanel.addListener( 'afterlayout', function(){this.getSelectionModel().selectFirstRow()});
        var t = setTimeout(function(){gridPanel.getSelectionModel().selectFirstRow()},1000);
		//gridPanel.getSelectionModel().selectFirstRow();



	},

    /* Display details for individual feature*/
	displaySingleResult: function(currentFeatures, rowIndex, gridFeature, metaColumns) {

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

	    this.addVectorQueryLayer(feature);


		var featureHtml = this.createHTML(feature, metaColumns);
		dp.update(featureHtml);
		dp.doLayout();

	},

    /* Create rows of attributes */
	createHTML:  function(feature, metaColumns) {
		html = '<ul class="featureDetailList" id="featureDetailList">';

		for(c=0; c < metaColumns.length; c++)
			{
				column = metaColumns[c];

                featureValue = '' + (column.label ? feature.attributes[column.attribute] : feature.attributes[column])


                if (featureValue.indexOf("http://") == 0)
                {
                    featureValue = '<a target="_blank" href="' + featureValue + '">' + featureValue + '</a>'
                }


				html+= "<li><label>" + (column.label ? column.label : column) + "</label><span>" + featureValue + "</span></li>";

			}

        html += "</ul>";
		return html;
	},


    /* Highlight the selected feature in red */
	addVectorQueryLayer: function(feature)
	{
	    var highlight_style = {
	        strokeColor: 'Red',
	        strokeWidth: 4,
	        strokeOpacity: 1,
	        fillOpacity: 0.0,
	        pointRadius: 10

	    };



	    this.reset();

         var inFormat = new OpenLayers.Format.GeoJSON({
                            'internalProjection': new OpenLayers.Projection("EPSG:4326"),
                            'externalProjection': new OpenLayers.Projection("EPSG:900913")
          });

         var outFormat = new OpenLayers.Format.GeoJSON({
                            'internalProjection': new OpenLayers.Projection("EPSG:900913"),
                            'externalProjection': new OpenLayers.Projection("EPSG:900913")
          });

        var json = inFormat.write(feature);

	    //Add highlight vector layer for selected features
	    var hilites = new OpenLayers.Layer.Vector("hilites", {
	        isBaseLayer: false,
            projection: new OpenLayers.Projection("EPSG:900913"),
	        visibility: true,
	        style: highlight_style,
	        displayInLayerSwitcher : false
	    });

    	hilites.addFeatures(outFormat.read(json));
        //hilites.setVisibility(true);


	    this.target.mapPanel.map.addLayer(hilites);
	    return hilites;

	}
});


Ext.preg(GeoExplorer.WFSQueryTool.prototype.ptype, GeoExplorer.WFSQueryTool);
