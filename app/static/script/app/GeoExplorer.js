/**
 * Copyright (c) 2009 The Open Planning Project
 */

/**
 * Constructor: GeoExplorer
 * Create a new GeoExplorer application.
 *
 * Parameters:
 * config - {Object} Optional application configuration properties.
 *
 * Valid config properties:
 * map - {Object} Map configuration object.
 * ows - {String} OWS URL
 *
 * Valid map config properties:
 * layers - {Array} A list of layer configuration objects.
 * center - {Array} A two item array with center coordinates.
 * zoom - {Number} An initial zoom level.
 *
 * Valid layer config properties:
 * name - {String} Required WMS layer name.
 * title - {String} Optional title to display for layer.
 */

    var LayerData = function(iid, isearchFields, icount)
	{
		this.id = iid;
		this.searchFields = isearchFields;
		this.count = icount;
//		alert(this.id+":"+this.category+":"+this.count);

	};



var GeoExplorer = Ext.extend(gxp.Viewer, {

    dataLayers : [],


    /**
     * api: config[localGeoServerBaseUrl]
     * ``String`` url of the local GeoServer instance
     */
    localGeoServerBaseUrl: "",

    /**
     * api: config[fromLayer]
     * ``Boolean`` true if map view was loaded with layer parameters
     */
    fromLayer: false,

    /**
     * private: property[mapPanel]
     * the :class:`GeoExt.MapPanel` instance for the main viewport
     */
    mapPanel: null,

    /**
     * Property: legendPanel
     * {GeoExt.LegendPanel} the legend for the main viewport's map
     */
    legendPanel: null,

    /**
     * Property: toolbar
     * {Ext.Toolbar} the toolbar for the main viewport
     */
    toolbar: null,

    /**
     * Property: capGrid
     * {<Ext.Window>} A window which includes a CapabilitiesGrid panel.
     */
    capGrid: null,

    /**
     * Property: modified
     * ``Number``
     */
    modified: 0,

    /**
     * Property: popupCache
     * {Object} An object containing references to visible popups so that
     *     we can insert responses from multiple requests.
     */
    popupCache: null,

    /** private: property[propDlgCache]
     *  ``Object``
     */
    propDlgCache: null,

    /** private: property[stylesDlgCache]
     *  ``Object``
     */
    stylesDlgCache: null,

    /** private: property[busyMask]
     *  ``Ext.LoadMask``
     */
    busyMask: null,

    /** private: property[urlPortRegEx]
     *  ``RegExp``
     */
    urlPortRegEx: /^(http[s]?:\/\/[^:]*)(:80|:443)?\//,


    treeRoot : null,

    searchFields : [],

    gxSearchBar : null,

    loginWin: null,

    registerWin: null,

    worldMapSourceKey: null,

    //public variables for string literals needed for localization
    addLayersButtonText: "UT:Add Layers",
    areaActionText: "UT:Area",
    backgroundContainerText: "UT:Background",
    capGridAddLayersText: "UT:Add Layers",
    capGridDoneText: "UT:Done",
    capGridText: "UT:Available Layers",
    connErrorTitleText: "UT:Connection Error",
    connErrorText: "UT:The server returned an error",
    connErrorDetailsText: "UT:Details...",
    heightLabel: 'UT: Height',
    helpLabel: 'UT: Help',
    infoButtonText: "UT:Info",
    largeSizeLabel: 'UT:Large',
    layerAdditionLabel: "UT: Add WMS server",
    layerLocalLabel: 'UT:Upload your own data',
    layerContainerText: "UT:Map Layers",
    layerPropertiesText: 'UT: Layer Properties',
    layerPropertiesTipText: 'UT: Change layer format and style',
    layerStylesText: 'UT:Edit Styles',
    layerStylesTipText: 'UT:Edit layer styles',
    layerSelectionLabel: "UT:View available data from:",
    layersContainerText: "UT:Data",
    layersPanelText: "UT:Layers",
    legendPanelText: "UT:Legend",
    lengthActionText: "UT:Length",
    loadingMapMessage: "UT:Loading Map...",
    mapSizeLabel: 'UT: Map Size',
    measureSplitText: "UT:Measure",
    metadataFormCancelText : "UT:Cancel",
    metadataFormSaveAsCopyText : "UT:Save as Copy",
    metadataFormSaveText : "UT:Save",
    metaDataHeader: 'UT:About this Map View',
    metaDataMapAbstract: 'UT:Abstract (brief description)',
    metaDataMapKeywords: 'UT: Keywords (for Picasa and YouTube overlays)',
    metaDataMapIntroText: 'UT:Introduction (tell visitors more about your map view)',
    metaDataMapTitle: 'UT:Title',
    metaDataMapUrl: 'UT:UserUrl',
    miniSizeLabel: 'UT: Mini',
    renameCategoryActionText: 'UT: Rename Category',
    renameCategoryActionTipText: 'UT: Rename this category',
    removeCategoryActionText: 'UT: Remove Category',
    removeCategoryActionTipText: 'UT: Remove this category and layers',
    navActionTipText: "UT:Pan Map",
    navNextAction: "UT:Zoom to Next Extent",
    navPreviousActionText: "UT:Zoom to Previous Extent",
    premiumSizeLabel: 'UT: Premium',
    printTipText: "UT:Print Map",
    printBtnText: "UT:Print",
    printWindowTitleText: "UT:Print Preview",
    propertiesText: "UT:Properties",
    publishActionText: 'UT:Link To Map',
    publishBtnText: 'UT:Link',
    removeLayerActionText: "UT:Remove Layer",
    removeLayerActionTipText: "UT:Remove Layer",
    saveFailMessage: "UT: Sorry, your map could not be saved.",
    saveFailTitle: "UT: Error While Saving",
    saveMapText: "UT: Save Map",
    saveMapBtnText: "UT: Save",
    saveMapAsText: "UT: Save Map As",
    saveNotAuthorizedMessage: "UT: You Must be logged in to save this map.",
    shareLayerText: 'UT: Share Layer',
    shareMapText: 'UT: Share Map',
    smallSizeLabel: 'UT: Small',
    sourceLoadFailureMessage: 'UT: Error contacting server.\n Please check the url and try again.',
    switchTo3DActionText: "UT:Switch to Google Earth 3D Viewer",
    unknownMapMessage: 'UT: The map that you are trying to load does not exist.  Creating a new map instead.',
    unknownMapTitle: 'UT: Unknown Map',
    unsupportedLayersTitleText: 'UT:Unsupported Layers',
    unsupportedLayersText: 'UT:The following layers cannot be printed:',
    widthLabel: 'UT: Width',
    zoomInActionText: "UT:Zoom In",
    zoomOutActionText: "UT:Zoom Out",
    zoomSelectorText: 'UT:Zoom level',
    zoomSliderTipText: "UT: Zoom Level",
    zoomToLayerExtentText: "UT:Zoom to Layer Extent",
    zoomVisibleButtonText: "UT:Zoom to Original Map Extent",


    updateMapLogin: function() {
        Ext.getCmp("shareMapButton").show();
    },

    constructor: function(config) {
    	this.config = config;
        this.popupCache = {};
        this.propDlgCache = {};
        this.stylesDlgCache = {};
        // add any custom application events
        this.addEvents(
            /**
             * api: event[saved]
             * Fires when the map has been saved.
             *  Listener arguments:
             *  * ``String`` the map id
             */
            "saved",
            /**
             * api: event[beforeunload]
             * Fires before the page unloads. Return false to stop the page
             * from unloading.
             */
            "beforeunload"
        );

        // add old ptypes
        Ext.preg("gx_wmssource", gxp.plugins.WMSSource);
        Ext.preg("gx_olsource", gxp.plugins.OLSource);
        Ext.preg("gx_googlesource", gxp.plugins.GoogleSource);

        // global request proxy and error handling
        Ext.util.Observable.observeClass(Ext.data.Connection);
        Ext.data.Connection.on({
            "beforerequest": function(conn, options) {
                // use django's /geoserver endpoint when talking to the local
                // GeoServer's RESTconfig API
                var url = options.url.replace(this.urlPortRegEx, "$1/");
                var localUrl = this.localGeoServerBaseUrl.replace(
                    this.urlPortRegEx, "$1/");
                if(url.indexOf(localUrl + "rest/") === 0) {
                    options.url = url.replace(new RegExp("^" +
                        localUrl), "/geoserver/");
                    return;
                };
                // use the proxy for all non-local requests
                if(this.proxy && options.url.indexOf(this.proxy) !== 0 &&
                        options.url.indexOf(window.location.protocol) === 0) {
                    var parts = options.url.replace(/&$/, "").split("?");
                    var params = Ext.apply(parts[1] && Ext.urlDecode(
                        parts[1]) || {}, options.params);
                    var url = Ext.urlAppend(parts[0], Ext.urlEncode(params));
                    delete options.params;
                    options.url = this.proxy + encodeURIComponent(url);
                }
            },
            "requestexception": function(conn, response, options) {
                if(options.failure) {
                    // exceptions are handled elsewhere
               } else {
                    this.busyMask && this.busyMask.hide();
                    var url = options.url;
                    if (response.status == 401 && url.indexOf("http" != 0) &&
                                            url.indexOf(this.proxy) === -1) {
                        this.showLoginWindow(options);
                    } else {
                        this.displayXHRTrouble(response);
                    }
                }
            },
            scope: this
        });

        // global beforeunload handler
        window.onbeforeunload = (function() {
            if (this.fireEvent("beforeunload") === false) {
                return "If you leave this page, unsaved changes will be lost.";
            }
        }).bind(this);

        // register the color manager with every color field
        Ext.util.Observable.observeClass(gxp.form.ColorField);
        gxp.form.ColorField.on({
            render: function(field) {
                var manager = new Styler.ColorManager();
                manager.register(field);
            }
        });

        // limit combo boxes to the window they belong to - fixes issues with
        // list shadow covering list items
        Ext.form.ComboBox.prototype.getListParent = function() {
            return this.el.up(".x-window") || document.body;
        }

        // don't draw window shadows - allows us to use autoHeight: true
        // without using syncShadow on the window
        Ext.Window.prototype.shadow = false;

        // set SLD defaults for symbolizer
        OpenLayers.Renderer.defaultSymbolizer = {
            fillColor: "#808080",
            fillOpacity: 1,
            strokeColor: "#000000",
            strokeOpacity: 1,
            strokeWidth: 1,
            strokeDashstyle: "solid",
            pointRadius: 3,
            graphicName: "square",
            fontColor: "#000000",
            fontSize: 10,
            haloColor: "#FFFFFF",
            haloOpacity: 1,
            haloRadius: 1
        };

        // set maxGetUrlLength to avoid non-compliant GET urls for WMS GetMap
        OpenLayers.Tile.Image.prototype.maxGetUrlLength = 2048;

        if (!config.map) {
            config.map = {};
        }
        config.map.numZoomLevels = 20;

        GeoExplorer.superclass.constructor.apply(this, arguments);

        this.mapID = this.initialConfig.id;
    },

     getNodeRecord : function(node) {
            if(node && node.layer) {
                var layer = node.layer;
                var store = node.layerStore;
                record = store.getAt(store.findBy(function(r) {
                    return r.getLayer() === layer;
                }));
            }
            return record;
    },


    reorderNodes : function(){
    		        var mpl = this.mapPanel.layers;
        	        nodes = '';
                  	x = 0;
                  	layerCount = this.mapPanel.layers.getCount()-1;
                  	this.treeRoot.cascade(function(node) {
                  		if (node.isLeaf() && node.layer)
                  			{
                		var layer = node.layer;
                		var store = node.layerStore;
               			record = store.getAt(store.findBy(function(r) {
                    		return r.getLayer() === layer;
                		 }));
                   		 if (record.get("group") !== "background")
                  				{
                  					nodes += node.text + ":" + x + ":" + record.get("name") + "\n";
                  					mpl.remove(record);
                  					mpl.insert(layerCount-x, [record]);
                  				}
                  		x++;
            			}
                  	});
        },


      addCategoryFolder : function(category, isExpanded){
    	mapRoot = this.treeRoot.findChild("id","maplayerroot");
    	if (category == "" || category == undefined || category == null)
    		category = "General";
      	if(mapRoot.findChild("text", category) == null)
      	{
      	    //alert("adding category");
      		mapRoot.appendChild(new GeoExt.tree.LayerContainer({
              text: category,
              group:category,
              iconCls: "gx-folder",
              cls: "folder",
              expanded: isExpanded == "true",
              loader: new GeoExt.tree.LayerLoader({
                  store: this.mapPanel.layers,
                  filter: function(record) {
                      return record.get("group") == category &&
                          record.getLayer().displayInLayerSwitcher == true;
                  },
                  createNode: function(attr) {
                      var layer = attr.layer;
                      var store = attr.layerStore;
                      if (layer && store) {
                          var record = store.getAt(store.findBy(function(r) {
                              return r.getLayer() === layer;
                          }));
                          if (record && !record.get("queryable")) {
                              attr.iconCls = "gx-tree-rasterlayer-icon";
                          }
                      }
                      return GeoExt.tree.LayerLoader.prototype.createNode.apply(this, [attr]);
                  }
              }),
              singleClickExpand: true,
              allowDrag: true,
              listeners: {
                  append: function(tree, node) {
                      node.expand();
                  }
              }
          }));
      		//mapRoot.getOwnerTree().reload();
      	} else if (isExpanded == "true"){
      		(mapRoot.findChild("text", category)).expand();
      	}
      },


      registerEvents: function(layer) {

        var geoEx = this;
        layer.events.register("loadstart", layer, function() {
            if (!geoEx.busyMask)
            {
              geoEx.busyMask = new Ext.LoadMask(
                    geoEx.mapPanel.map.div, {
                        msg: 'Searching...'
              });
            }
            geoEx.busyMask.show();
        });


        layer.events.register("loadend", layer, function() {
            if (geoEx.busyMask)
            {
                geoEx.busyMask.hide();
            }
        });
    },




    displayXHRTrouble: function(response) {
        response.status && Ext.Msg.show({
            title: this.connErrorTitleText,
            msg: this.connErrorText +
                ": " + response.status + " " + response.statusText,
            icon: Ext.MessageBox.ERROR,
            buttons: {ok: this.connErrorDetailsText, cancel: true},
            fn: function(result) {
                if(result == "ok") {
                    var details = new Ext.Window({
                        title: response.status + " " + response.statusText,
                        width: 400,
                        height: 300,
                        items: {
                            xtype: "container",
                            cls: "error-details",
                            html: response.responseText
                        },
                        autoScroll: true,
                        buttons: [{
                            text: "OK",
                            handler: function() { details.close(); }
                        }]
                    });
                    details.show();
                }
            }
        });
    },

    showLoginWindow: function(options){

                   this.loginWin = null;
                   var submit = function() {
                            form = this.loginWin.items.get(0);
                            form.getForm().submit({
                                waitMsg: "Logging in...",
                                success: function(form, action) {
                                    this.loginWin.close();
                                    this.propDlgCache = {};
                                    this.stylesDlgCache = {};
                                    document.cookie = action.response.getResponseHeader("Set-Cookie");
                                    if (options) {
                                        // resend the original request
                                        Ext.Ajax.request(options);
                                    }
                                },
                                failure: function(form, action) {
                                    var username = form.items.get(0);
                                    var password = form.items.get(1);
                                    username.markInvalid();
                                    password.markInvalid();
                                    username.focus(true);
                                },
                                scope: this
                            });
                        }.bind(this);


                            this.loginWin = new Ext.Window({
                            title: "WorldMap Login",
                            modal: true,
                            width: 230,
                            autoHeight: true,
                            layout: "fit",
                            items: [{
                                xtype: "form",
                                autoHeight: true,
                                labelWidth: 55,
                                border: false,
                                bodyStyle: "padding: 10px;",
                                url: "/accounts/ajax_login",
                                waitMsgTarget: true,
                                errorReader: {
                                    // teach ExtJS a bit of RESTfulness
                                    read: function(response) {
                                        return {
                                            success: response.status == 200,
                                            records: []
                                        }
                                    }
                                },
                                defaults: {
                                    anchor: "100%"
                                },
                                items: [{
                                    xtype: "textfield",
                                    name: "username",
                                    fieldLabel: "Username"
                                }, {
                                    xtype: "textfield",
                                    name: "password",
                                    fieldLabel: "Password",
                                    inputType: "password"
                                }, {
                                    xtype: "hidden",
                                    name: "csrfmiddlewaretoken",
                                    value: this.csrfToken
                                }, {
                                    xtype: "button",
                                    text: "Login",
                                    inputType: "submit",
                                    handler: submit
                                }]
                            }],
                            keys: {
                                "key": Ext.EventObject.ENTER,
                                "fn": submit
                            }
                        });

        var form = this.loginWin.items.get(0);
        form.items.get(0).focus(false, 100);
        this.loginWin.show();
    },

    addInfo : function() {
           var queryableLayers = this.mapPanel.layers.queryBy(function(x){
               return x.get("queryable");
           });
           var geoEx = this;



           queryableLayers.each(function(x){
           	var dl = x.getLayer();
               if (dl.name != "HighlightWMS" && !geoEx.dataLayers[dl.params.LAYERS]){
               	  Ext.Ajax.request({
               		url: "/maps/searchfields/?" + dl.params.LAYERS,
               		method: "POST",
               		params: {layername:dl.params.LAYERS},
               		success: function(result,request)
               		{
                           var jsonData = Ext.util.JSON.decode(result.responseText);
                           layerfields = jsonData.searchFields;
                           category = x.get("group") != "" && x.get("group") != undefined && x.get("group")  ? x.get("group") : jsonData.category;
                           if (category == "")
                        	   category = "General";
                           x.set("group", category);
                           geoEx.dataLayers[dl.params.LAYERS] = new LayerData(dl.params.LAYERS, jsonData.searchFields, jsonData.scount);
                           geoEx.addCategoryFolder(category, true);
               		},
               		failure: function(result,request) {
                         // alert(result.responseText);
               		}

               	  });

                }

           }, this);

       },

    initMapPanel: function() {
        this.mapItems = [{
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100,
            plugins: new GeoExt.ZoomSliderTip({
                template: "<div>"+this.zoomSliderTipText+": {zoom}<div>"
            })
        }];

	    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 10;
	    OpenLayers.Util.onImageLoadErrorColor = "transparent";

        GeoExplorer.superclass.initMapPanel.apply(this, arguments);
        var searchFields = this.searchFields;
        var layerCount = 0;

        this.mapPanel.map.events.register("preaddlayer", this, function(e) {
            var layer = e.layer;
            if (layer instanceof OpenLayers.Layer.WMS ) {
                // we need to keep this until the default of tiled is true again
                // in gxp for WMSCSource, see:
                // https://github.com/opengeo/gxp/commit/6abb29b474c4296a4a3ddd52d2c14c267cac7d79
                !layer.singleTile && layer.mergeNewParams({
                    tiled: true
                });
                layer.events.on({
                    "loadstart": function() {
                        layerCount++;
                        if (!this.busyMask) {
                            this.busyMask = new Ext.LoadMask(
                                this.mapPanel.map.div, {
                                    msg: this.loadingMapMessage
                                }
                            );
                            this.busyMask.show();
                        }
                        layer.events.unregister("loadstart", this, arguments.callee);
                    },
                    "loadend": function() {
                        layerCount--;
                        if(layerCount === 0) {
                            this.busyMask.hide();
                        }
                        layer.events.unregister("loadend", this, arguments.callee);
                    },
                    scope: this
                })
            }
        });
    },

    /**
     * Method: initPortal
     * Create the various parts that compose the layout.
     */
    initPortal: function() {
        this.on("beforeunload", function() {
            if (this.modified && this.config["edit_map"]) {
                this.showMetadataForm();
                return false;
            }
        }, this);


		var geoEx = this;
        // TODO: make a proper component out of this
        var mapOverlay = this.createMapOverlay();
        this.mapPanel.add(mapOverlay);


//        var overlayTools = this.createOverlayTools();
//    	this.mapPanel.add(overlayTools);



        var addLayerButton = new Ext.Button({
            tooltip : this.addLayersButtonText,
            disabled: false,
            text: '<span class="x-btn-text">' + this.addLayersButtonText + '</span>',
            handler : this.showSearchWindow,
            scope: this
        });

        this.on("ready", function() {
            this.addInfo();

            var queryTool = new GeoExplorer.FeatureQueryTool(this, 'queryPanel', 'gridWinPanel');

            this.mapPanel.layers.on({
                "update": function() {this.modified |= 1;},
                "add": function() {this.modified |= 1;},
                "remove": function(store, rec) {
                    this.modified |= 1;
                    delete this.stylesDlgCache[rec.getLayer().id];
                },
                scope: this
            });

            //Show the info window if it's the first time here
            if (this.config.first_visit)
            	this.showInfoWindow();
        });

        var getRecordFromNode = function(node) {
            if(node && node.layer) {
                var layer = node.layer;
                var store = node.layerStore;
                record = store.getAt(store.findBy(function(r) {
                    return r.getLayer() === layer;
                }));
            }
            return record;
        };

        var getSelectedLayerRecord = function() {
            var node = layerTree.getSelectionModel().getSelectedNode();
            return getRecordFromNode(node);
        };

        var removeLayerAction = new Ext.Action({
            text: this.removeLayerActionText,
            iconCls: "icon-removelayers",
            disabled: true,
            tooltip: this.removeLayerActionTipText,
            handler: function() {
                var record = getSelectedLayerRecord();
                if(record) {
                    this.mapPanel.layers.remove(record, true);
                    removeLayerAction.disable();
                }
            },
            scope: this
        });

        this.treeRoot = new Ext.tree.TreeNode({
            text: "Layers",
            expanded: true,
            isTarget: false,
            allowDrop: false
        });

        this.treeRoot.appendChild(new GeoExt.tree.LayerContainer({
            text: this.layerContainerText,
            id: "maplayerroot",
            iconCls: "gx-folder",
            expanded: true,
            loader: new GeoExt.tree.LayerLoader({
                store: this.mapPanel.layers,
                filter: function(record) {
                    return record.get("group") == "none" &&
                        record.getLayer().displayInLayerSwitcher == true;
                },
                createNode: function(attr) {
                    var layer = attr.layer;
                    var store = attr.layerStore;
                    if (layer && store) {
                        var record = store.getAt(store.findBy(function(r) {
                            return r.getLayer() === layer;
                        }));
                        if (record && !record.get("queryable")) {
                            attr.iconCls = "gx-tree-rasterlayer-icon";
                        }
                    }
                    return GeoExt.tree.LayerLoader.prototype.createNode.apply(this, [attr]);
                }
            }),
            singleClickExpand: true,
            allowDrop: true,
            allowDrag: true,
            listeners: {
                append: function(tree, node) {
                    node.expand();
                }
            }
        }));

        this.treeRoot.appendChild(new GeoExt.tree.LayerContainer({
            text: this.backgroundContainerText,
            iconCls: "gx-folder",
            expanded: true,
            group: "background",
            loader: new GeoExt.tree.LayerLoader({
                baseAttrs: {checkedGroup: "background"},
                store: this.mapPanel.layers,
                filter: function(record) {
                    return record.get("group") === "background" &&
                        record.getLayer().displayInLayerSwitcher == true;
                },
                createNode: function(attr) {
                    var layer = attr.layer;
                    var store = attr.layerStore;
                    if (layer && store) {
                        var record = store.getAt(store.findBy(function(r) {
                            return r.getLayer() === layer;
                        }));
                        if (record) {
                            if (!record.get("queryable")) {
                                attr.iconCls = "gx-tree-rasterlayer-icon";
                            }
                            if (record.get("fixed")) {
                                attr.allowDrag = false;
                            }
                        }
                    }
                    return GeoExt.tree.LayerLoader.prototype.createNode.apply(this, arguments);
                }
            }),
            singleClickExpand: true,
            allowDrag: false,
            listeners: {
                append: function(tree, node) {
                    node.expand();
                }
            }
        }));





        createPropertiesDialog = function() {
            var node = layerTree.getSelectionModel().getSelectedNode();
            if (node && node.layer) {
                var layer = node.layer;
                var store = node.layerStore;
                var record = store.getAt(store.findBy(function(record){
                    return record.getLayer() === layer;
                }));
                var backupParams = Ext.apply({}, record.getLayer().params);
                var prop = this.propDlgCache[layer.id];
                if (!prop) {
                    prop = this.propDlgCache[layer.id] = new Ext.Window({
                        title: "Properties: " + record.getLayer().name,
                        width: 280,
                        autoHeight: true,
                        closeAction: "hide",
                        items: [{
                            xtype: "gxp_wmslayerpanel",
                            rasterStyling: true,
                            autoHeight: true,
                            layerRecord: record,
                            defaults: {
                                autoHeight: true,
                                hideMode: "offsets"
                            },
                            listeners: {
                                "change": function() {this.modified |= 1;},
                                scope: this
                            }
                        }]
                    });
                    // disable the "About" tab's fields to indicate that they
                    // are read-only
                    //TODO WMSLayerPanel should be easier to configure for this
                    prop.items.get(0).items.get(1).cascade(function(i) {
                        i instanceof Ext.form.Field && i.setDisabled(true);
                    });
                    if (layer.params.LAYERS.indexOf("geonode") === 0) {
                    	prop.items.get(0).items.get(0).add({html: "<a href='/data/" + layer.params.LAYERS + "'>" + this.shareLayerText + "</a>", xtype: "panel"});
                    }

                    //Don't show style dialog unless editable for now
                    prop.items.get(0).remove(prop.items.get(0).items.get(3),true);

                    var geoEx = this;

                    Ext.Ajax.request({
                    		url: "/data/" + layer.params.LAYERS + "/ajax_layer_edit_check/",
                    		method: "POST",
                    		params: {layername:layer.params.LAYERS},
                    		success: function(result,request) {
                                if (result.responseText == "True") {
                                    var stylesPanel = geoEx.createStylesPanel({
                                        layerRecord: record
                                    });
                                    stylesPanel.items.get(0).on({
                                        "styleselected": function() {
                                            this.modified |= 1;
                                        },
                                        "modified": function() {
                                            this.modified |= 2;
                                        },
                                        scope: this
                                    });
                                    stylesPanel.setTitle("Styles");
                                    // add styles tab

                                    prop.items.get(0).add(stylesPanel)
                                }

                            },
                            failure: function (result,request){

                            }
                    });
                }
                prop.show();

            }
        };

        var showPropertiesAction = new Ext.Action({
            text: this.layerPropertiesText,
            iconCls: "icon-layerproperties",
            disabled: true,
            tooltip: this.layerPropertiesTipText,
            handler: createPropertiesDialog.createSequence(function() {
                var node = layerTree.getSelectionModel().getSelectedNode();
                this.propDlgCache[node.layer.id].items.get(0).setActiveTab(1);
            }, this),
            scope: this
//            listeners: {
//                "enable": function() {showStylesAction.enable()},
//                "disable": function() {showStylesAction.disable()}
//            }
        });


//        var showStylesAction = new Ext.Action({
//            text: this.layerStylesText,
//            iconCls: "icon-layerstyles",
//            disabled: true,
//            tooltip: this.layerStylesTipText,
//            handler: createPropertiesDialog.createSequence(function() {
//                var node = layerTree.getSelectionModel().getSelectedNode();
//                this.propDlgCache[node.layer.id].items.get(0).setActiveTab(2);
//            }, this),
//            scope: this
//        });

        var updateLayerActions = function(sel, node) {
            if(node && node.layer) {
            	removeLayerAction.show();
            	zoomLayerAction.show();
            	showPropertiesAction.show();
//            	showStylesAction.show();
                // allow removal if more than one non-vector layer
                var count = this.mapPanel.layers.queryBy(function(r) {
                    return !(r.getLayer() instanceof OpenLayers.Layer.Vector);
                }).getCount();
                if(count > 1) {
                    removeLayerAction.enable();
                    zoomLayerAction.enable();
                } else {
                	zoomLayerAction.disable();
                    removeLayerAction.disable();
                }
                var record = getRecordFromNode(node);
                if (record.get("properties")) {
                    showPropertiesAction.enable();
                } else {
                    showPropertiesAction.disable();
                }
        		removeCategoryAction.hide();
        		renameAction.hide();
            } else {

                removeLayerAction.hide();
                showPropertiesAction.hide();
//                showStylesAction.hide();
                zoomLayerAction.hide();
                if (node  && !node.parentNode.isRoot)
                	{
                		removeCategoryAction.show();
                		renameAction.show();
                	} else
                	{
                		removeCategoryAction.hide();
                		renameAction.hide();
                	}

            }
        };

        var zoomLayerAction = new Ext.Action({
                        text: this.zoomToLayerExtentText,
                        disabled: true,
                        iconCls: "icon-zoom-to",
                        handler: function() {
                            var node = layerTree.getSelectionModel().getSelectedNode();
                            if(node && node.layer) {
                                var map = this.mapPanel.map;
                                var extent = node.layer.restrictedExtent || map.maxExtent;
                                map.zoomToExtent(extent, true);
                            }
                        },
                        scope: this
                    })

        var renameNode = function(node) {
        	Ext.MessageBox.prompt('Rename Category', 'New name for \"' + node.text + '\"', function(btn, text){
        		if (btn == 'ok'){
        			this.modified |= 1;
        			var a = node;
        			node.setText(text);
        			node.attributes.group = text;
        			node.group = text;
        			node.loader.filter =  function(record) {

                      return record.get("group") == text &&
                          record.getLayer().displayInLayerSwitcher == true;
                  }

                	node.eachChild(function(n) {

                		record = getRecordFromNode(n);
                		if(record) {
                            record.set("group", text);
                        }
                	});


        			node.ownerTree.fireEvent('beforechildrenrendered', node.parentNode);
        		}
        	});
        };

        var renameAction =new Ext.Action({
            text: this.renameCategoryActionText,
            iconCls: "icon-layerproperties",
            disabled: false,
            tooltip: this.renameCategoryActionTipText,
            handler: function() {
            	var node = layerTree.getSelectionModel().getSelectedNode();
            	renameNode(node);
            },
            scope: this
        });


        var removeCategoryAction = new Ext.Action({
            text: this.removeCategoryActionText,
            iconCls: "icon-removelayers",
            disabled: false,
            tooltip: this.removeCategoryActionTipText,
            handler: function() {
            	var node = layerTree.getSelectionModel().getSelectedNode();
            	if (node.parentNode.isRoot)
            	{
            		Ext.Msg.alert("Map Layers", "This category cannot be removed");
            		return false;
            	}
            	if (node)
            	{

            		while (node.childNodes.length > 0){
            			cnode = node.childNodes[0];
            			record = getRecordFromNode(cnode);
            			if(record) {
                        	this.mapPanel.layers.remove(record,true);
                    	}
            		};
            			parentNode = node.parentNode;
            			parentNode.removeChild(node,true);
            	}
            },
            scope: this
        });


        //var geoEx = this;
        var layerTree = new Ext.tree.TreePanel({
            root: this.treeRoot,
            rootVisible: false,
            border: false,
            enableDD: true,
            selModel: new Ext.tree.DefaultSelectionModel({
                listeners: {
                    beforeselect: updateLayerActions,
                    scope: this
                }
            }),
            listeners: {
                contextmenu: function(node, e) {
                    if(node) {
                        node.select();
                        var c = node.getOwnerTree().contextMenu;
                        c.contextNode = node;
                        c.showAt(e.getXY());
                    }
                },
                beforemovenode: function(tree, node, oldParent, newParent, index) {
                    // change the group when moving to a new container
                    if(node.layer && oldParent !== newParent) {
                        var store = newParent.loader.store;
                        var index = store.findBy(function(r) {
                            return r.getLayer() === node.layer;
                        });
                        var record = store.getAt(index);
                        record.set("group", newParent.attributes.group);
                    }
                },
                beforenodedrop: function(dropEvent) {
                  	var source_folder_id = undefined;
                  	var dest_folder = undefined;

                    // Folders can be dragged, but not into another folder
                    if(dropEvent.data.node.attributes.iconCls == 'gx-folder') {
                    	//alert(dropEvent.target.attributes.iconCls + ":" + dropEvent.point + ":" + dropEvent.target.parentNode.text);
                    	if (dropEvent.target.attributes.iconCls != "gx-folder")
                    		dropEvent.target = dropEvent.target.parentNode;
                        if( (dropEvent.target.attributes.iconCls == 'gx-folder' && dropEvent.point == "above") || (dropEvent.target.text != 'Background' && dropEvent.target.attributes.iconCls == 'gx-folder' && dropEvent.point == "below")) {
                            return true;
                          } else {
                            return false;
                          }
                    } else {
                    	//alert(dropEvent.target.parentNode.text);
                    	if (dropEvent.target.parentNode.text == 'Background' || dropEvent.target.parentNode.text == 'Layers')
                    		return false;
                    	else
                    		return true;
                    }

                  },
                  movenode: function(tree, node, oldParent, newParent, index )
                  {
                  	if (!node.layer)
                  		this.reorderNodes();
                  },
                scope: this
            },
            contextMenu: new Ext.menu.Menu({
                items: [ zoomLayerAction,
                    removeLayerAction,
                    showPropertiesAction,
                    //showStylesAction,
                    renameAction,
                    removeCategoryAction
            ]
            })
        });

		this.gxSearchBar = new GeoExplorer.SearchBar(this);
		var searchPanel = new Ext.Panel({
			anchor: "100% 5%",
			items: [this.gxSearchBar]
		});

        var layersContainer = new Ext.Panel({
            autoScroll: true,
            border: false,
            title: this.layersContainerText,
            items: [layerTree]
        });


        this.legendPanel = new GeoExt.LegendPanel({
            title: this.legendPanelText,
            border: false,
            hideMode: "offsets",
            split: true,
            autoScroll: true,
            ascending: false,
            map: this.mapPanel.map,
            filter: function(record) {
            	return record.data.group == undefined || record.data.group != "Overlays";
            },
            defaults: {cls: 'legend-item'}
        });

        var layersTabPanel = new Ext.TabPanel({
        	anchor: "100% 95%",
            border: false,
            deferredRender: false,
            items: [layersContainer, this.legendPanel],
            activeTab: 0
        });

        //needed for Safari
        var westPanel = new Ext.Panel({
			layout: "anchor",
            collapseMode: "mini",
            header: false,
            split: true,
            items: [layersTabPanel,searchPanel],
            region: "west",
            width: 250
        });



        var gridWinPanel = new Ext.Panel({
        	id: 'gridWinPanel',
            collapseMode: "mini",
            title: 'Search Results',
            autoScroll: true,
            split: true,
            items: [],
            anchor: '100% 50%'
        });

        var gridResultsPanel = new Ext.Panel({
        	id: 'gridResultsPanel',
            title: 'Feature Details',
            collapseMode: "mini",
            autoScroll: true,
            split: true,
            items: [],
            anchor: '100% 50%'
        });

        var eastPanel = new Ext.Panel({
        	id: 'queryPanel',
            layout: "anchor",
            collapseMode: "mini",
            split: true,
            items: [gridWinPanel, gridResultsPanel],
            collapsed: true,
            region: "east",
            width: 350
        });



        this.toolbar = new Ext.Toolbar({
            disabled: true,
            items: [
            addLayerButton,
            "-",
            this.createTools()
            ]
        });

        this.on("ready", function() {
            // enable only those items that were not specifically disabled
            var disabled = this.toolbar.items.filterBy(function(item) {
                return item.initialConfig && item.initialConfig.disabled;
            });
            this.toolbar.enable();
            disabled.each(function(item) {
                item.disable();
            });
        }, this);


        this.mapPanelContainer = new Ext.Panel({
            layout: "card",
            region: "center",
            id: "mapPnlCntr",
            defaults: {
                // applied to each contained panel
                border:false
            },
            items: [
                this.mapPanel
            ],
            activeItem: 0
        });

        var header = new Ext.Panel({
            region: "north",
            autoHeight: true,
            contentEl: 'header-wrapper'
        });

        Lang.registerLinks();

        this.portalItems = [
            header, {
                region: "center",
                xtype: "container",
                layout: "fit",
                border: false,
                hideBorders: true,
                items: {
                    layout: "border",
                    deferredRender: false,
                    tbar: this.toolbar,
                    items: [
                        this.mapPanelContainer,
                        westPanel, eastPanel
                    ]
                }
            }
        ];

        GeoExplorer.superclass.initPortal.apply(this, arguments);

        if (this.config.treeconfig != undefined)
    	{
    		for (x = 0; x < this.config.treeconfig.length; x++)
    			{
    				if (this.config.treeconfig[x] != null)
    					this.addCategoryFolder(this.config.treeconfig[x].group, this.config.treeconfig[x].expanded);
    			}

    	};
    },

    /** api: method[createStylesPanel]
     *  :param options: ``Object`` Options for the :class:`gxp.WMSStylesDialogWithFonts`.
     *      Supported options are ``layerRecord``, ``styleName``, ``editable``
     *      and ``listeners`` (except "ready", "modified" and "styleselected"
     *      listeners)
     *  :return: ``Ext.Panel`` A panel with a :class:`gxp.WMSStylesDialogWithFonts` as
     *      only item.
     */
    createStylesPanel: function(options) {
        var layer = options.layerRecord.getLayer();

        var stylesPanel, stylesDialog;
        var createStylesDialog = function() {
            if (stylesPanel) {
                stylesDialog.destroy();
                stylesPanel.getFooterToolbar().items.each(function(i) {
                    i.disable();
                });
            }
            var modified = false;
            stylesDialog = this.stylesDlgCache[layer.id] =
                                            new gxp.WMSStylesDialog(Ext.apply({
                style: "padding: 10px 10px 0 10px;",
                fonts:[
			        "Arial Unicode MS",
        			"Serif",
        			"SansSerif",
        			"Arial",
        			"Courier New",
        			"Jomolhari",
        			"Tahoma",
        			"Times New Roman",
        			"Verdana"
    			],
                editable: layer.url.replace(
                    this.urlPortRegEx, "$1/").indexOf(
                    this.localGeoServerBaseUrl.replace(
                    this.urlPortRegEx, "$1/")) === 0,
                hasPermission: true,
                plugins: [{
                    ptype: "gxp_geoserverstylewriter",
                    baseUrl: layerUrl.split(
                        "?").shift().replace(/\/(wms|ows)\/?$/, "/rest")
                }, {
                    ptype: "gxp_wmsrasterstylesdialog"
                }],
                autoScroll: true,
                listeners: Ext.apply(options.listeners || {}, {
                    "ready": function() {
                        // we don't want the Cancel and Save buttons
                        // if we cannot edit styles
                        stylesDialog.editable === false &&
                            stylesPanel.getFooterToolbar().hide();
                    },
                    "modified": function(cmp, name) {
                        // enable the cancel and save button
                        stylesPanel.buttons[0].enable();
                        stylesPanel.buttons[1].enable();
                        // instant style preview
                        layer.mergeNewParams({
                            "STYLES": name,
                            "SLD_BODY": cmp.createSLD({userStyles: [name]})
                        });
                        modified = true;
                    },
                    "styleselected": function(cmp, name) {
                        // enable the cancel button
                        stylesPanel.buttons[0].enable();
                        layer.mergeNewParams({
                            "STYLES": name,
                            "SLD_BODY": modified ?
                                cmp.createSLD({userStyles: [name]}) : null
                        });
                    },
                    "saved": function() {
                        this.busyMask.hide();
                        this.modified ^= this.modified & 2;
                        var rec = stylesDialog.selectedStyle;
                        var styleName = rec.get("userStyle").isDefault ?
                            "" : rec.get("name");
                        if (options.applySelectedStyle === true ||
                                    styleName === initialStyle ||
                                    rec.get("name") === initialStyle) {
                            layer.mergeNewParams({
                                "STYLES": styleName,
                                "SLD_BODY": null,
                                "_dc": Math.random()
                            });
                        }
                        stylesPanel.ownerCt instanceof Ext.Window ?
                            stylesPanel.ownerCt.close() :
                            createStylesDialog();
                    },
                    scope: this
                })
            }, options));
            if (stylesPanel) {
                stylesPanel.add(stylesDialog);
                stylesPanel.doLayout();
            }
        }.bind(this);

        var layerUrl = layer.url;

        // remember the layer's current style
        var initialStyle = layer.params.STYLES;

        createStylesDialog();
        stylesPanel = new Ext.Panel({
            autoHeight: true,
            border: false,
            items: stylesDialog,
            buttons: [{
                text: "Cancel",
                disabled: true,
                handler: function() {
                    layer.mergeNewParams({
                        "STYLES": initialStyle,
                        "SLD_BODY": null
                    });
                    stylesPanel.ownerCt instanceof Ext.Window ?
                        stylesPanel.ownerCt.close() :
                        createStylesDialog();
                },
                scope: this
            }, {
                text: "Save",
                disabled: true,
                handler: function() {
                    this.busyMask = new Ext.LoadMask(stylesPanel.el,
                        {msg: "Applying style changes..."});
                    this.busyMask.show();
                    stylesDialog.saveStyles();
                },
                scope: this
            }],
            listeners: {
                "added": function(cmp, ownerCt) {
                    ownerCt instanceof Ext.Window &&
                        cmp.buttons[0].enable();
                }
            }
        });
        return stylesPanel;
    },


    reloadWorldMapSource : function(layerRecords){
        var geoEx = this;
        if (this.worldMapSourceKey == null)
            this.setWorldMapSourceKey();
        var wmsource = this.layerSources[this.worldMapSourceKey];

        var addUploadedLayer = function() {
            geoEx.addWorldMapLayers(layerRecords);
            wmsource.un('ready', addUploadedLayer, this)
        }

        if (layerRecords)
            wmsource.on("ready", addUploadedLayer, this);

        var wmStore = wmsource.getStore();
        wmStore.reload();

    },

    setWorldMapSourceKey : function(){
        for (var id in this.layerSources) {
            source = this.layerSources[id];
            if ( source instanceof gxp.plugins.WMSCSource)
            {
                this.worldMapSourceKey = id;
            }
        }

    },

    addWorldMapLayers: function(records){
        if (this.worldMapSourceKey == null)
            this.setWorldMapSourceKey();

        var wmSource = this.layerSources[this.worldMapSourceKey];
        if (wmSource)
            this.addLayerAjax(wmSource, this.worldMapSourceKey, records);


    },


    addLayerAjax: function (dataSource, dataKey, dataRecords){
            var geoEx = this;
            var key = dataKey;
            var records = dataRecords;
            var source = dataSource;
            var layerStore = this.mapPanel.layers;
            for (var i=0, ii=records.length; i<ii; ++i) {
            			var layer = records[i].get("name");
                        var tiled =  records[i].get("tiled");

                    	Ext.Ajax.request({
                    		url: "/maps/searchfields/?" + records[i].get("name"),
                    		method: "POST",
                    		params: {layername:records[i].get("name")},

                    		success: function(result,request)
                    		{
                    				var layer = request.params["layername"];
                    			    var record = (typeof(tiled) != "undefined" ? source.createLayerRecord({
                    					name: layer,
                    					source: key,
                    					buffer: 0,
                                        tiled: tiled
                					}): source.createLayerRecord({
                    					name: layer,
                    					source: key,
                    					buffer: 0
                					}));

                					if (record) {
                    					if (record.get("group") === "background") {
                        					var pos = layerStore.queryBy(function(rec) {
                            					return rec.get("group") === "background"
                        					}).getCount();
                        					layerStore.insert(pos, [record]);

                    					} else {
                                			var jsonData = Ext.util.JSON.decode(result.responseText);
                                			category = jsonData.category;
	                                		if (!category || category == '')
	                                			category = "General";
                                			geoEx.dataLayers[layer] = new LayerData(geoEx.dataLayers[layer], jsonData.searchFields, jsonData.scount);
                                			record.set("group",category);

                                			layerStore.add([record]);
                                			geoEx.addCategoryFolder(record.get("group"), "true");
                                			geoEx.reorderNodes();
                    					}
                					}
                    		},
                    		failure: function(result,request) {
                    				var layer = request.params["layername"];
                    			    var record = source.createLayerRecord({
                    					name: layer,
                    					source: key,
                    					buffer: 0
                					});
                					//alert(layer + " created after FAIL");
                					if (record) {
                    					if (record.get("group") === "background") {
                        					var pos = layerStore.queryBy(function(rec) {
                            					return rec.get("group") === "background"
                        					}).getCount();
                        					layerStore.insert(pos, [record]);
                    					} else {
	                                		category = "General";
                                			record.set("group",category);
                                			layerStore.add([record]);
                                			geoEx.addCategoryFolder(record.get("group"), "true");
                                            geoEx.reorderNodes();
                    					}
                					}
                    		}

                    	});


                    }

    },


    /**
     * Method: initCapGrid
     * Constructs a window with a capabilities grid.
     */
    initCapGrid: function(){
		var geoEx = this;
        var initialSourceId, source, data = [];
        for (var id in this.layerSources) {
            source = this.layerSources[id];
            if ( source instanceof gxp.plugins.WMSCSource) {
                            //do nothing
            } else
            {
                 if (source.store) {
                    data.push([id, this.layerSources[id].title || id]);
                 }
            }
        }

        if (data[0] && data[0][0])
            initialSourceId = data[0][0];


        var sources = new Ext.data.ArrayStore({
            fields: ["id", "title"],
            data: data
        });

        var expander = new GeoExplorer.CapabilitiesRowExpander({
            ows: this.localGeoServerBaseUrl + "ows"
        });


        var addLocalLayers = function() {
        	if (!this.mapID)
    			{Ext.Msg.alert("Save your Map View", "You must save this map view before uploading your data");}
        	else
        		document.location.href="/data/upload?map=" + this.mapID;
        };



        var addLayers = function() {
            var key = sourceComboBox.getValue();
            var layerStore = this.mapPanel.layers;
            var source = this.layerSources[key];
            var records = capGridPanel.getSelectionModel().getSelections();
            this.addLayerAjax(source, key, records);
        };

        var source = null;

        if (initialSourceId) {
            source = this.layerSources[initialSourceId];
            source.store.filterBy(function(r) {
                return !!source.getProjection(r);
            }, this);
        }

        var capGridPanel = new Ext.grid.GridPanel({
            store: source != null ? source.store: [],
            height:300,
            region:'center',
            autoScroll: true,
            autoExpandColumn: "title",
            plugins: [expander],
            colModel: new Ext.grid.ColumnModel([
                expander,
                {id: "title", header: "Title", dataIndex: "title", sortable: true}
            ]),
            listeners: {
                rowdblclick: addLayers,
                scope: this
            }
        });

        var sourceComboBox = new Ext.form.ComboBox({
            store: sources,
            valueField: "id",
            displayField: "title",
            triggerAction: "all",
            editable: false,
            allowBlank: false,
            forceSelection: true,
            mode: "local",
            value: initialSourceId,
            listeners: {
                select: function(combo, record, index) {
                    var source = this.layerSources[record.get("id")];
                    var store = source.store;
                    store.setDefaultSort('title', 'asc');
                    store.filterBy(function(r) {
                        return !!source.getProjection(r);
                    }, this);
                    expander.ows = store.url;
                    capGridPanel.reconfigure(store, capGridPanel.getColumnModel());
                    // TODO: remove the following when this Ext issue is addressed
                    // http://www.extjs.com/forum/showthread.php?100345-GridPanel-reconfigure-should-refocus-view-to-correct-scroller-height&p=471843
                    capGridPanel.getView().focusRow(0);
                },
                scope: this
            }
        });


        var addWmsButton = new Ext.Button({
                text: this.layerAdditionLabel,
                iconCls: 'icon-add',
                cls: 'x-btn-link-medium x-btn-text',
                handler: function() {
                    newSourceWindow.show();
                }
            });

        var app = this;
        var newSourceWindow = new gxp.NewSourceWindow({
            modal: true,
            listeners: {
                "server-added": function(url) {
                    newSourceWindow.setLoading();
                    this.addLayerSource({
                        config: {url: url}, // assumes default of gxp_wmssource
                        callback: function(id) {
                            // add to combo and select
                            var record = new sources.recordType({
                                id: id,
                                title: this.layerSources[id].title || "Untitled" // TODO: titles
                            });
                            sources.insert(0, [record]);
                            sourceComboBox.onSelect(record, 0);
                            newSourceWindow.hide();
                        },
                        failure: function() {
                            // TODO: wire up success/failure
                            newSourceWindow.setError("Error contacting server.\nPlease check the url and try again.");
                        },
                        scope: this
                    });
                },
                scope: this
            },
            // hack to get the busy mask so we can close it in case of a
            // communication failure
            addSource: function(url, success, failure, scope) {
                app.busyMask = scope.loadMask;
            }
        });


        var addLayerButton = new Ext.Button({
                    text: "Add Layers",
                    iconCls: "gxp-icon-addlayers",
                    handler: addLayers,
                    scope : this
                });


        var sourceAdditionLabel = { xtype: 'box', autoEl: { tag: 'span',  html: this.layerSelectionLabel }};

        var sourceForm = new Ext.Panel({
             frame:false,
             border: false,
             region: 'north',
             height:40,
             layout: new Ext.layout.HBoxLayout({
                 defaultMargins: {
                     top: 10,
                     bottom: 10,
                     left: 10,
                     right: 0
                  }
             }),
             items: [sourceAdditionLabel, sourceComboBox, {xtype: 'spacer', width:20 }, addWmsButton]
         });


        var addLayerForm = new Ext.Panel({
             frame:false,
             border: false,
             region: 'south',
             layout: new Ext.layout.HBoxLayout({
                 defaultMargins: {
                     top: 10,
                     bottom: 10,
                     left: 10,
                     right: 0
                  }
             }),
             items: [addLayerButton]
         });

        this.capGrid = new Ext.Panel({
            autoScroll: true,
            title: 'External Data',
            header: false,
            layout: 'border',
            border: false,
            renderTo: 'externalDiv',
            padding:'2 0 0 20',
            items: [sourceForm, capGridPanel, addLayerForm],
            listeners: {
                hide: function(win){
                    capGridPanel.getSelectionModel().clearSelections();
                }
            }
        });
    },

    /**
     * Method: showCapabilitiesGrid
     * Shows the window with a capabilities grid.
     */
    showCapabilitiesGrid: function() {
        if(!this.capGrid) {
            this.initCapGrid();
        }
        this.capGrid.show();
    },



    /** private: method[createMapOverlay]
     * Builds the :class:`Ext.Panel` containing components to be overlaid on the
     * map, setting up the special configuration for its layout and
     * map-friendliness.
     */
    createMapOverlay: function() {

    	var cgaLink = new Ext.BoxComponent({
    		html:'<div class="cga-link" onclick="javascript:window.open(\'http://gis.harvard.edu\', \'_blank\');"><a href="http://gis.harvard.edu">Center for Geographic Analysis</a></div>'
    	});

        var scaleLinePanel = new Ext.BoxComponent({
            autoEl: {
                tag: "div",
                cls: "olControlScaleLine overlay-element overlay-scaleline"
            }
        });

        scaleLinePanel.on('render', function(){
            var scaleLine = new OpenLayers.Control.ScaleLine({
                div: scaleLinePanel.getEl().dom,
                geodesic: true
            });

            this.mapPanel.map.addControl(scaleLine);
            scaleLine.activate();
        }, this);

        var zoomSelectorWrapper = new Ext.Panel({
            cls: 'overlay-element overlay-scalechooser',
            ctCls: 'transparent-panel',
            border: false
        });

        this.on("ready", function() {
            var zoomStore = new GeoExt.data.ScaleStore({
                map: this.mapPanel.map
            });

            var zoomSelector = new Ext.form.ComboBox({
                emptyText: this.zoomSelectorText,
                tpl: '<tpl for="."><div class="x-combo-list-item">1 : {[parseInt(values.scale)]}</div></tpl>',
                editable: false,
                triggerAction: 'all',
                mode: 'local',
                store: zoomStore,
                width: 110
            });

            zoomSelector.on({
                click: function(evt) {
                    evt.stopEvent();
                },
                mousedown: function(evt) {
                    evt.stopEvent();
                },
                select: function(combo, record, index) {
                    this.mapPanel.map.zoomTo(record.data.level);
                },
                scope: this
            });

            function setScale() {
                var scale = zoomStore.queryBy(function(record) {
                    return this.mapPanel.map.getZoom() == record.data.level;
                }, this);

                if (scale.length > 0) {
                    scale = scale.items[0];
                    zoomSelector.setValue("1 : " + parseInt(scale.data.scale, 10));
                } else {
                    if (!zoomSelector.rendered) {
                        return;
                    }
                    zoomSelector.clearValue();
                }
            }
            setScale.call(this);
            this.mapPanel.map.events.register('zoomend', this, setScale);

            zoomSelectorWrapper.add(zoomSelector);
            zoomSelectorWrapper.doLayout();
        }, this);

        var mapOverlay = new Ext.Panel({
            // title: "Overlay",
            cls: 'map-overlay',
            items: [
                scaleLinePanel,
                zoomSelectorWrapper,
                cgaLink
            ]
        });

        mapOverlay.on("afterlayout", function(){
            scaleLinePanel.getEl().dom.style.position = 'relative';
            scaleLinePanel.getEl().dom.style.display = 'inline';

            mapOverlay.getEl().on("click", function(x){x.stopEvent();});
            mapOverlay.getEl().on("mousedown", function(x){x.stopEvent();});
        }, this);

        return mapOverlay;
    },



    createTools: function() {
        var toolGroup = "toolGroup";
        var mapPanel = this.mapPanel;
        var busyMask = null;
        var geoEx = this;

        var picasaOverlay = new GeoExplorer.PicasaFeedOverlay(this);
        var picasaRecord = null;
		var youtubeOverlay = new GeoExplorer.YouTubeFeedOverlay(this);
        var youtubeRecord = null;
        var hglPointsOverlay = new GeoExplorer.HglFeedOverlay(this);
        var hglRecord= null;


        var printButton = new Ext.Button({
            tooltip: this.printTipText,
            text: '<span class="x-btn-text">' + this.printBtnText + '</span>',
            handler: function() {
                var unsupportedLayers = [];
                var printWindow = new Ext.Window({
                    title: this.printWindowTitleText,
                    modal: true,
                    border: false,
                    autoHeight: true,
                    resizable: false,
                    items: [{
                        xtype: "gxux_printpreview",
                        mapTitle: this.about["title"],
                        comment: this.about["abstract"],
                        minWidth: 336,
                        printMapPanel: {
                            height: Math.min(450, Ext.get(document.body).getHeight()-150),
                            autoWidth: true,
                            limitScales: true,
                            map: {
                                controls: [
                                    new OpenLayers.Control.Navigation({
                                        zoomWheelEnabled: false,
                                        zoomBoxEnabled: false
                                    }),
                                    new OpenLayers.Control.PanPanel(),
                                    new OpenLayers.Control.Attribution()
                                ],
                                eventListeners: {
                                    "preaddlayer": function(evt) {
                                        if(evt.layer instanceof OpenLayers.Layer.Google) {
                                            unsupportedLayers.push(evt.layer.name);
                                            return false;
                                        }
                                    },
                                    scope: this
                                }
                            }
                        },
                        printProvider: {
                            capabilities: window.printCapabilities,
                            listeners: {
                                "beforeprint": function() {
                                    // The print module does not like array params.
                                    //TODO Remove when http://trac.geoext.org/ticket/216 is fixed.
                                    printWindow.items.get(0).printMapPanel.layers.each(function(l){
                                        var params = l.getLayer().params;
                                        for(var p in params) {
                                            if (params[p] instanceof Array) {
                                                params[p] = params[p].join(",");
                                            }
                                        }
                                    })
                                },
                                "print": function() {printWindow.close();},
                                "printException": function(cmp, response) {
                                    this.displayXHRTrouble(response);
                                },
                                scope: this
                            }
                        },
                        includeLegend: true,
                        sourceMap: this.mapPanel,
                        legend: this.legendPanel
                    }]
                }).show();
                printWindow.center();

                unsupportedLayers.length &&
                    Ext.Msg.alert(this.unsupportedLayersTitleText, this.unsupportedLayersText +
                        "<ul><li>" + unsupportedLayers.join("</li><li>") + "</li></ul>");

            },
            scope: this
        });

        // create a navigation control
        var navAction = new GeoExt.Action({
            tooltip: this.navActionTipText,
            iconCls: "icon-pan",
            enableToggle: true,
            pressed: true,
            allowDepress: false,
            control: new OpenLayers.Control.Navigation(),
            map: this.mapPanel.map,
            toggleGroup: toolGroup
        });

        // create a navigation history control
        var historyControl = new OpenLayers.Control.NavigationHistory();
        this.mapPanel.map.addControl(historyControl);

        // create actions for previous and next
        var navPreviousAction = new GeoExt.Action({
		tooltip: this.navPreviousActionText,
            iconCls: "icon-zoom-previous",
            disabled: true,
            control: historyControl.previous
        });

        var navNextAction = new GeoExt.Action({
		tooltip: this.navNextAction,
            iconCls: "icon-zoom-next",
            disabled: true,
            control: historyControl.next
        });

        var info = {controls: []};
        // create an info control to show introductory text window
        var infoButton = new Ext.Button({
		tooltip: this.infoButtonText,
            text: '<span class="x-btn-text">' + this.infoButtonText + '</span>',
            handler: this.showInfoWindow,
            scope:this
        });



        var picasaMenuItem = {
            	 text: 'Picasa',
            	 scope:this,
            	 checkHandler: function(menuItem, checked) {
            					if(checked) {
            						if (picasaOverlay.picasaRecord !== null) {
            							picasaOverlay.removeOverlay();
            						}
									picasaOverlay.createOverlay();
            					} else {
            						picasaOverlay.removeOverlay();
            			            //picasaRecord.getLayer().setVisibility(false);
            					}
            			}
        };


        var youtubeMenuItem = {
            	 text: 'YouTube',
            	 scope:this,
            	 checkHandler: function(menuItem, checked) {
            					if(checked) {
            						if (youtubeOverlay.youtubeRecord !== null) {
            							youtubeOverlay.removeOverlay();
            						}
									youtubeOverlay.createOverlay();
            					} else {
            						youtubeOverlay.removeOverlay();
            			            //youtubeRecord.getLayer().setVisibility(false);
            					}
            			}
        };

        var hglMenuItem = {
            	 text: 'Harvard Geospatial Library',
            	 scope:this,
            	 checkHandler: function(menuItem, checked) {
            					if(checked) {
            						if (hglPointsOverlay.hglRecord !== null) {
            							hglPointsOverlay.removeOverlay();
            						}
									hglPointsOverlay.createOverlay();
            					} else {
            						hglPointsOverlay.removeOverlay();
            			            //picasaRecord.getLayer().setVisibility(false);
            					}
            			}
        };

       var moreButton = new Ext.Button({
       	text: 'More...',
        cls: "more-overlay-element",
       	id: 'moreBtn',
       	menu: {
       	    defaults: {
       			checked: false
       		},

       		items: [
       			picasaMenuItem,
    			youtubeMenuItem,
                hglMenuItem
       		]
       	}
       });


    	this.mapPanel.add(moreButton);


	  var jumpstore = new Ext.data.SimpleStore({
		        fields: ['dataFieldName', 'displayFieldName'],
		        data: [[0, 'Yelp'],
		               [1, 'Bing Map'],
		               [2, 'Social Explorer']
		              ],
		        autoLoad: false
		      });

       var jumpBar = new Ext.form.ComboBox({
    	   id: 'jumpbar',
		store: jumpstore,
displayField: 'displayFieldName',   // what the user sees in the popup
valueField: 'dataFieldName',        // what is passed to the 'change' event
typeAhead: true,
forceSelection: true,
fieldLabel: 'ComboBox',
emptyText:'Jump to...',
mode: 'local',
triggerAction: 'all',
selectOnFocus: true,
editable: true,
listeners: {

 /**'select' will be fired as soon as an item in the ComboBox is selected.
  *1) get the bbox or center point
  *2) parse the bbox or center point
  *3) go to the web pages
  *reference: http://www.hutten.org/bill/extjs/
  **/
 select: function(combo, record, index){
   displayProjection = new OpenLayers.Projection("EPSG:4326");
   if (record.data.dataFieldName == 0)
   {
      //http://www.yelp.com/search?find_desc=&find_loc=Boston%2C+MA&ns=1&rpp=10#bbox=-71.1611938477%2C42.2823890429%2C-70.9538269043%2C42.4356201565&sortby=category

      var bounds = mapPanel.map.getExtent();
      var extents= bounds.transform(mapPanel.map.getProjectionObject(),displayProjection);
      window.open ('http://www.yelp.com/search?find_desc=&ns=1&rpp=10#l=g:'+extents.left+'%2C'+extents.bottom+'%2C'+extents.right+'%2C'+extents.top+'&sortby=category');
   }
   else if (record.data.dataFieldName == 1){
      //http://www.bing.com/maps/default.aspx?v=2&FORM=LMLTCP&cp=42.353216~-70.989532&style=r&lvl=12&tilt=-90&dir=0&alt=-1000&phx=0&phy=0&phscl=1&encType=1

      var point = mapPanel.map.getCenter();
      var lonlat = point.transform(mapPanel.map.getProjectionObject(), displayProjection);
      window.open ('http://www.bing.com/maps/default.aspx?v=2&FORM=LMLTCP&cp='+ lonlat.lat +'~'+ lonlat.lon +'&style=r&lvl='+mapPanel.map.getZoom()+'&tilt=-90&dir=0&alt=-1000&phx=0&phy=0&phscl=1&encType=1');

   }
   else if (record.data.dataFieldName == 2){
      //http://www.socialexplorer.com/pub/maps/map3.aspx?g=0&mapi=SE0012&themei=B23A1CEE3D8D405BA2B079DDF5DE9402&l=2507554.70420796&r=2572371.78398336&t=5433997.44009869&b=5403894.11016116&rndi=1
      var bounds = mapPanel.map.getExtent();
      var extents= bounds.transform(mapPanel.map.getProjectionObject(),displayProjection);
      window.open('http://www.socialexplorer.com/pub/maps/map3.aspx?g=0&mapi=SE0012&themei=B23A1CEE3D8D405BA2B079DDF5DE9402&l='+ConvertLonToAlbersEqArea(extents.left)+'&r='+ConvertLonToAlbersEqArea(extents.right)+'&t='+ConvertLatToAlbersEqArea(extents.top)+'&b='+ConvertLatToAlbersEqArea(extents.bottom)+'&rndi=1');
   } else {}

 }
}
});




        // create split button for measure controls
        var activeIndex = 0;
        var measureSplit = new Ext.SplitButton({
            iconCls: "icon-measure-length",
            tooltip: this.measureSplitText,
            enableToggle: true,
            toggleGroup: toolGroup, // Ext doesn't respect this, registered with ButtonToggleMgr below
            allowDepress: false, // Ext doesn't respect this, handler deals with it
            handler: function(button, event) {
                // allowDepress should deal with this first condition
                if(!button.pressed) {
                    button.toggle();
                } else {
                    button.menu.items.itemAt(activeIndex).setChecked(true);
                }
            },
            listeners: {
                toggle: function(button, pressed) {
                    // toggleGroup should handle this
                    if(!pressed) {
                        button.menu.items.each(function(i) {
                            i.setChecked(false);
                        });
                    }
                },
                render: function(button) {
                    // toggleGroup should handle this
                    Ext.ButtonToggleMgr.register(button);
                }
            },
            menu: new Ext.menu.Menu({
                items: [
                    new Ext.menu.CheckItem(
                        new GeoExt.Action({
				text: this.lengthActionText,
                            iconCls: "icon-measure-length",
                            map: this.mapPanel.map,
                            toggleGroup: toolGroup,
                            group: toolGroup,
                            allowDepress: false,
                            map: this.mapPanel.map,
                            control: this.createMeasureControl(
                                OpenLayers.Handler.Path, "Length")
                        })),
                    new Ext.menu.CheckItem(
                        new GeoExt.Action({
                            text: this.areaActionText,
                            iconCls: "icon-measure-area",
                            map: this.mapPanel.map,
                            toggleGroup: toolGroup,
                            group: toolGroup,
                            allowDepress: false,
                            map: this.mapPanel.map,
                            control: this.createMeasureControl(
                                OpenLayers.Handler.Polygon, "Area")
                            }))
                  ]})});
        measureSplit.menu.items.each(function(item, index) {
            item.on({checkchange: function(item, checked) {
                measureSplit.toggle(checked);
                if(checked) {
                    activeIndex = index;
                    measureSplit.setIconClass(item.iconCls);
                }
            }});
        });


        var helpButton = new Ext.Button({
		tooltip: this.helpLabel,
            text: '<span class="x-btn-text">' + this.helpLabel + '</span>',
            handler: this.showHelpWindow,
            scope:this
        });

        var advancedToolsLink = function() {
        	if (!this.mapID)
    			{Ext.Msg.alert("Save your Map View", "You must save this map view before using advanced map tools");}
        	else
        		document.location.href="/maps/" + this.mapID + "/edit";
        };

        var shareMapButton = new Ext.Button({
                id: 'shareMapButton',
                text: '<span class="x-btn-text">' + this.shareMapText + '</span>',
                handler: this.initMapShareWindow,
                cls: 'x-btn-link-medium',
                hidden: !this.config["edit_map"],
                disabled: !this.mapID,
                scope: this
            });


        var publishAction = new Ext.Action({
                tooltip: this.publishActionText,
                handler: this.makeExportDialog,
                scope: this,
                text: '<span class="x-btn-text">' + this.publishBtnText + '</span>',
                disabled: !this.mapID
            });

        var tools = [
            new Ext.Button({
                tooltip: this.saveMapText,
                handler: this.showMetadataForm,
                scope: this,
                disabled: !this.config["edit_map"],
            	text: '<span class="x-btn-text">' + this.saveMapBtnText + '</span>'
            }),
            "-",
            publishAction,
            "-",
            printButton, "-", infoButton,
            "-",
            jumpBar,
            '->',
            shareMapButton,"-",
            helpButton
            ];
        this.on("saved", function() {
            // enable the "Publish Map" button
            publishAction.enable();
            shareMapButton.show();
            shareMapButton.enable();
            this.modified ^= this.modified & 1;
        }, this);

        return tools;
    },

    createMeasureControl: function(handlerType, title) {

        var styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({
                    symbolizer: {
                        "Point": {
                            pointRadius: 4,
                            graphicName: "square",
                            fillColor: "white",
                            fillOpacity: 1,
                            strokeWidth: 1,
                            strokeOpacity: 1,
                            strokeColor: "#333333"
                        },
                        "Line": {
                            strokeWidth: 3,
                            strokeOpacity: 1,
                            strokeColor: "#666666",
                            strokeDashstyle: "dash"
                        },
                        "Polygon": {
                            strokeWidth: 2,
                            strokeOpacity: 1,
                            strokeColor: "#666666",
                            fillColor: "white",
                            fillOpacity: 0.3
                        }
                    }
                })]
            })
        });

        var cleanup = function() {
            if (measureToolTip) {
                measureToolTip.destroy();
            }
        };

        var makeString = function(metricData) {
            var metric = metricData.measure;
            var metricUnit = metricData.units;

            measureControl.displaySystem = "english";

            var englishData = metricData.geometry.CLASS_NAME.indexOf("LineString") > -1 ?
            measureControl.getBestLength(metricData.geometry) :
            measureControl.getBestArea(metricData.geometry);

            var english = englishData[0];
            var englishUnit = englishData[1];

            measureControl.displaySystem = "metric";
            var dim = metricData.order == 2 ?
                '<sup>2</sup>' :
                '';

            return metric.toFixed(2) + " " + metricUnit + dim + "<br>" +
                english.toFixed(2) + " " + englishUnit + dim;
        };

        var measureToolTip;
        var measureControl = new OpenLayers.Control.Measure(handlerType, {
            persist: true,
            handlerOptions: {layerOptions: {styleMap: styleMap}},
            eventListeners: {
                measurepartial: function(event) {
                    cleanup();
                    measureToolTip = new Ext.ToolTip({
                        target: Ext.getBody(),
                        html: makeString(event),
                        title: title,
                        autoHide: false,
                        closable: true,
                        draggable: false,
                        mouseOffset: [0, 0],
                        showDelay: 1,
                        listeners: {hide: cleanup}
                    });
                    if(event.measure > 0) {
                        var px = measureControl.handler.lastUp;
                        var p0 = this.mapPanel.getPosition();
                        measureToolTip.targetXY = [p0[0] + px.x, p0[1] + px.y];
                        measureToolTip.show();
                    }
                },
                measure: function(event) {
                    cleanup();
                    measureToolTip = new Ext.ToolTip({
                        target: Ext.getBody(),
                        html: makeString(event),
                        title: title,
                        autoHide: false,
                        closable: true,
                        draggable: false,
                        mouseOffset: [0, 0],
                        showDelay: 1,
                        listeners: {
                            hide: function() {
                                measureControl.cancel();
                                cleanup();
                            }
                        }
                    });
                },
                deactivate: cleanup,
                scope: this
            }
        });

        return measureControl;
    },

    /** private: method[makeExportDialog]
     *
     * Create a dialog providing the HTML snippet to use for embedding the
     * (persisted) map, etc.
     */
    makeExportDialog: function() {

        var mapConfig = this.getState();
        var treeConfig = [];
        for (x = 0; x < this.treeRoot.firstChild.childNodes.length; x++)
        {
        	node = this.treeRoot.firstChild.childNodes[x];
        	    treeConfig.push({group : node.text, expanded:  node.expanded.toString()  });
        }



        mapConfig['treeconfig'] = treeConfig;


     		   Ext.Ajax.request({
                    url: "/maps/snapshot/create",
                    method: 'POST',
                    jsonData: mapConfig,
                    success: function(response, options) {
                    	var encodedSnapshotId = response.responseText;
                    	if (encodedSnapshotId != null) {
                                    new Ext.Window({
                                    title: this.publishActionText,
                                    layout: "fit",
                                    width: 380,
                                    autoHeight: true,
                                    items: [{
                                        xtype: "gx_linkembedmapdialog",
                                        linkUrl: this.rest + (this.about["urlsuffix"] ? this.about["urlsuffix"]: this.mapID) +  '/' + encodedSnapshotId,
                                        linkMessage: '<span style="font-size:10pt;">Paste link in email or IM:</span>',
                                        publishMessage: '<span style="font-size:10pt;">Paste HTML to embed in website:</span>',
                                        url: this.rest + (this.about["urlsuffix"] ? this.about["urlsuffix"]: this.mapID) + '/' + encodedSnapshotId + "/embed"
                                    }]
                                    }).show();
                    	}
                    },
                    failure: function(response, options)
                    {
                    	return false;
                    	Ext.Msg.alert('Error', response.responseText, this.showMetadataForm);
                    },
                    scope: this
                });
    },


    /** private: method[initMetadataForm]
     *
     * Initialize metadata entry form.
     */
    initMetadataForm: function(){

    	var geoEx = this;

        var titleField = new Ext.form.TextField({
            width: '95%',
            fieldLabel: this.metaDataMapTitle,
            value: this.about.title,
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                "valid": function() {
                	if (urlField.isValid()) {
                    //saveAsButton.enable();
                    saveButton.enable();
                	}
                },
                "invalid": function() {
                    //saveAsButton.disable();
                    saveButton.disable();
                }
            }
        });



        //Make sure URL is not taken; if it is, show list of taken url's that start with field value
        Ext.apply(Ext.form.VTypes, {
           UniqueMapId : this.mapID,
     	   UniqueUrl: function(value, field) {

     		   var allowedChars = value.match(/^(\w+[-]*)+$/g);
     		   if (!allowedChars) {
     			   this.UniqueUrlText = "URL's can only contain letters, numbers, dashes & underscores."
     			   return false;
     		   }

     		   Ext.Ajax.request({
                    url: "/maps/checkurl/",
                    method: 'POST',
                    params : {query:value, mapid: this.UniqueMapId},
                    success: function(response, options) {
                    	var urlcount = Ext.decode(response.responseText).count;
                    	if (urlcount > 0) {
                    		this.UniqueUrlText = "The following URL's are already taken:";
                    		var urls = Ext.decode(response.responseText).urls;
                    		var isValid=true;
                    		for (var u in urls) {
                    			if (urls[u].url != undefined && urls[u].url != null)
                    				this.UniqueUrlText+="<br/>" + urls[u].url;
                    			if (urls[u].url == value) {
                    				isValid=false;
                    			}

                    		}
                    		if (!isValid)
                    			field.markInvalid(this.UniqueUrlText);
                    	}
                    },
                    failure: function(response, options)
                    {
                    	return false;
                    	Ext.Msg.alert('Error', response.responseText, this.showMetadataForm);
                    },
                    scope: this
                });
     		   return true;
     		   },

     		   UniqueUrlText: "The following URL's are already taken, please choose another"
     		});

        var urlField = new Ext.form.TextField({
        	width:'30%',
        	fieldLabel: this.metaDataMapUrl + "<br/><span style='font-style:italic;'>http://" + document.location.hostname + "/maps/</span>",
        	labelSeparator:'',
        	enableKeyEvents: true,
        	validationEvent: 'onblur',
        	vtype: 'UniqueUrl',
        	itemCls:'x-form-field-inline',
        	ctCls:'x-form-field-inline',
        	value: this.about["urlsuffix"],
        	listeners: {
                "valid": function() {
                	if (titleField.isValid())
                	{
                    //saveAsButton.enable();
                    saveButton.enable();
                	}
                },
                "invalid": function() {
                    //saveAsButton.disable();
                    saveButton.disable();
                }
            }
        });

        var checkUrlBeforeSave =  function(as) {
            Ext.getCmp('gx_saveButton').disable();
            //Ext.getCmp('gx_saveAsButton').disable();

            Ext.Ajax.request({
                    url: "/maps/checkurl/",
                    method: 'POST',
                    params : {query:urlField.getValue(), mapid: geoEx.mapID},
                    success: function(response, options) {
                    	var urlcount = Ext.decode(response.responseText).count;
                    	var rt = "";
                    	var isValid=true;
                    	if (urlcount > 0) {
                    		rt = "The following URL's are already taken:";
                    		var urls = Ext.decode(response.responseText).urls;

                    		for (var u in urls) {
                    			if (urls[u].url != undefined && urls[u].url != null)
                    				rt+="<br/>" + urls[u].url;
                    			if (urls[u].url == urlField.getValue()) {
                    				isValid=false;
                    			}

                    		}
                    		if (!isValid) {
                    			urlField.markInvalid(rt);
                                Ext.getCmp('gx_saveButton').enable();
                                //Ext.getCmp('gx_saveAsButton').enable();
                    			return false;
                    		}

                    	}
                    	if (isValid) {
                    			geoEx.about.title = titleField.getValue();
                				geoEx.about["abstract"] = abstractField.getValue();
                				geoEx.about["urlsuffix"] = urlField.getValue();
                				geoEx.about["introtext"] = introTextField.getValue();
                				geoEx.about["keywords"] = keywordsField.getValue();
                				geoEx.save(as);
                				geoEx.initInfoTextWindow();
                    	}
                    },
                    failure: function(response, options)
                    {
                        Ext.getCmp('gx_saveButton').enable();
                        //Ext.getCmp('gx_saveAsButton').enable();
                    	return false;
                    	//Ext.Msg.alert('Error', response.responseText, geoEx.showMetadataForm);
                    },
                    scope: this
                });
        };

        var abstractField = new Ext.form.TextArea({
            width: '95%',
            height: 50,
            fieldLabel: this.metaDataMapAbstract,
            value: this.about["abstract"]
        });

        var keywordsField = new Ext.form.TextField({
        	width: '95%',
        	fieldLabel: this.metaDataMapKeywords,
        	value: this.about["keywords"]
        });

        var introTextField = new Ext.form.HtmlEditor({
            width: '95%',
            height: 200,
            fieldLabel: this.metaDataMapIntroText,
            value: this.about["introtext"]
        });

        var metaDataPanel = new Ext.FormPanel({
            bodyStyle: {padding: "5px"},
            labelAlign: "top",
            items: [
                titleField,
                urlField,
                abstractField,
                keywordsField,
                introTextField
            ]
        });

        metaDataPanel.enable();
       /*
        var saveAsButton = new Ext.Button({
            id: 'gx_saveAsButton',
            text: this.metadataFormSaveAsCopyText,
            cls:'x-btn-text',
            disabled: !this.about.title,
            handler: function(button, event){
            	if (this.about["urlsuffix"] == urlField.getValue() && this.about["urlsuffix"].length > 0){
            		Ext.Msg.alert("Change the URL suffix", "You must change the URL suffix before saving a copy of this map view.");
            		urlField.markInvalid("This URL is already taken, please choose another");
            		return false;
            	} else {
            		checkUrlBeforeSave(true);
            	}
            },
            scope: this
        });
        */

        var saveButton = new Ext.Button({
            id: 'gx_saveButton',
            text: this.metadataFormSaveText,
            cls:'x-btn-text',
            disabled: !this.about.title,
            handler: function(e){

            	checkUrlBeforeSave(false);
            },
            scope: this
        });

        this.metadataForm = new Ext.Window({
            title: this.metaDataHeader,
            closeAction: 'hide',
            items: metaDataPanel,
            modal: true,
            width: 600,
            autoHeight: true,
            bbar: [
                "->",
                //saveAsButton,
                saveButton,
                new Ext.Button({
                    text: this.metadataFormCancelText,
                    cls:'x-btn-text',
                    handler: function() {
                        titleField.setValue(this.about.title);
                        abstractField.setValue(this.about["abstract"]);
                        urlField.setValue(this.about["urlsuffix"]);
                        introTextField.setValue(this.about["introtext"]);
                        keywordsField.setValue(this.about["keywords"]);
                        this.metadataForm.hide();
                    },
                    scope: this
                })
            ]
        });
    },

    initInfoTextWindow: function(){
        this.infoTextPanel = new Ext.FormPanel({
            bodyStyle: {padding: "5px"},
            labelAlign: "top",
            preventBodyReset: true,
            autoScroll:false,
            height:400,
            html: this.about['introtext']
        });

        this.infoTextPanel.enable();


        this.infoTextWindow = new Ext.Window({
            title: this.about.title,
            closeAction: 'hide',
            items: this.infoTextPanel,
            modal: true,
            width: 500,
            height:400,
            autoScroll: true
        });
    },


    initHelpTextWindow: function(){
            this.helpTextPanel = new Ext.FormPanel({
            bodyStyle: {padding: "5px"},
            labelAlign: "top",
            preventBodyReset: true,
            autoScroll:true,
            autoHeight:true,
            autoLoad:{url:'/maphelp',scripts:true}
        });

        this.helpTextPanel.enable();

       this.helpTextWindow = new Ext.Window({
         title: this.helpLabel,
         closeAction: 'hide',
         items: this.helpTextPanel,
         modal: true,
         width: 600,
         height:500,
         autoScroll: true
       });
    },


    initUploadPanel: function() {
        this.uploadPanel = new Ext.Panel({
        id: 'worldmap_update_panel',
        title: 'Upload Layer',
        header: false,
        autoLoad: {url: '/data/upload/?tab=true', scripts: true},
        listeners:{
            activate : function(panel){
                panel.getUpdater().refresh();
            }
        },
        renderTo: 'uploadDiv',
        autoScroll: true
        });

    },


    initTabPanel: function() {
    this.dataTabPanel = new Ext.TabPanel({
                renderTo: 'dataTabs',
                activeTab: 0,
                region:'center',
                items: [
                    {contentEl: 'searchDiv', title: 'WorldMap Data', autoScroll: true},
                    this.capGrid
                ]
            });
            if (this.config["edit_map"])
            {
                this.dataTabPanel.add(this.uploadPanel)
            }

    },

    initMapShareWindow: function() {


        var mapSharePanel = new Ext.Panel({
            id: 'worldmap_mapshare_panel',
            title: 'Share Map',
            header: false,
            autoLoad: {url: '/maps/' + this.mapID + '/share/', scripts: true},
            autoScroll: true
        });

        var mapShareWindow = new Ext.Window({
            title: "Share Map",
            closeAction: 'destroy',
            layout: 'fit',
            width: 300,
            height:400,
            items: [mapSharePanel],
            modal: true,
            autoScroll: false,
            bodyStyle: 'background-color:#FFF'
        });

        mapShareWindow.show();

    },



    initSearchWindow: function(){

        var mapBounds = this.mapPanel.map.getExtent();
        var llbounds = mapBounds.transform(
                new OpenLayers.Projection(this.mapPanel.map.projection),
                new OpenLayers.Projection("EPSG:4326"));
        this.bbox = new GeoNode.BoundingBoxWidget({
         proxy: "/proxy/?url=",
         viewerConfig: this.getState(),
         renderTo: 'refine',
         height: 275,
         isEnabled: true,
         useGxpViewer: true
        });

        this.searchTable = new GeoNode.SearchTable({
            renderTo: 'search_results',
            trackSelection: true,
            permalinkURL: '/data/search',
            searchURL: '/data/search/api',
            layerDetailURL: '/data/search/detail',
            constraints: [this.bbox],
            searchParams: {'limit':10, 'bbox': llbounds.toBBOX()},
            searchOnLoad: false
        });

        this.searchTable.hookupSearchButtons('refine');

        var dataCart = new GeoNode.DataCart({
            store: this.searchTable.dataCart,
            renderTo: 'data_cart',
            addToMapButtonFunction: this.addWorldMapLayers,
            addToMapButtonTarget: this
        });




        if (!this.capGrid) {
            this.initCapGrid();
        }

        if (!this.uploadPanel && this.config["edit_map"])
        {
            this.initUploadPanel();
        }

        if (!this.dataTabPanel) {
            this.initTabPanel();
        }

        this.searchWindow = new Ext.Window({
            id: 'ge_searchWindow',
            title: "Add Layers",
            closeAction: 'hide',
            layout: 'fit',
            width: 850,
            height:600,
            items: [this.dataTabPanel],
            modal: true,
            autoScroll: true,
            bodyStyle: 'background-color:#FFF'
        });

    },


    /** private: method[showInfoWindow]
     *  Shows the search window
     */
    showSearchWindow: function() {
        if(!this.searchWindow) {
            this.initSearchWindow();
        } else {
            this.bbox.updateBBox(this.mapPanel.map.getExtent());

        }
        this.searchWindow.show();
        this.searchWindow.alignTo(document, 'tl-tl');
        this.searchTable.doSearch();



    },


    /** private: method[showInfoWindow]
     *  Shows the window with intro text
     */
    showInfoWindow: function() {
        if(!this.infoTextWindow) {
            this.initInfoTextWindow();
        }
        this.infoTextWindow.show();
    },

    showHelpWindow: function() {
         if(!this.helpTextWindow) {
            this.initHelpTextWindow();
        }
        this.helpTextWindow.show();
    },


    /** private: method[showMetadataForm]
     *  Shows the window with a metadata form
     */
    showMetadataForm: function() {
        if(!this.metadataForm) {
            this.initMetadataForm();
        }

        this.metadataForm.show();
        //Ext.getCmp('gx_saveButton').enable();
        //Ext.getCmp('gx_saveAsButton').enable();
    },



    updateURL: function() {
        /* PUT to this url to update an existing map */
        return this.rest + this.mapID + '/data';
    },



    /** api: method[save]
     *  :arg as: ''Boolean'' True if map should be "Saved as..."
     *
     *  Subclasses that load config asynchronously can override this to load
     *  any configuration before applyConfig is called.
     */
    save: function(as){
        var config = this.getState();

        var treeConfig = [];
        for (x = 0; x < this.treeRoot.firstChild.childNodes.length; x++)
        {
        	node = this.treeRoot.firstChild.childNodes[x];
        	treeConfig.push({group : node.text, expanded:  node.expanded.toString()  });
        }



        config.treeconfig = treeConfig;
        if (!this.mapID || as) {
            /* create a new map */
            Ext.Ajax.request({
                url: this.rest,
                method: 'POST',
                jsonData: config,
                success: function(response, options) {
                    var id = response.getResponseHeader("Location");
                    // trim whitespace to avoid Safari issue where the trailing newline is included
                    id = id.replace(/^\s*/,'');
                    id = id.replace(/\s*$/,'');
                    id = id.match(/[\d]*$/)[0];
                    this.mapID = id; //id is url, not mapID
                    this.fireEvent("saved", id);
                    this.metadataForm.hide();
                    Ext.Msg.wait('Saving Map', "Your new map is being saved...");

                    window.location = response.getResponseHeader("Location");
                },
                failure: function(response, options)
                {	if (response.status === 401)
                		this.showLoginWindow(options);
                	else
                		Ext.Msg.alert('Error', response.responseText);

                    Ext.getCmp('gx_saveButton').enable();
                    Ext.getCmp('gx_saveAsButton').enable();
                },
                scope: this
            });
        }
        else {
            /* save an existing map */
            Ext.Ajax.request({
                url: this.updateURL(),
                method: 'PUT',
                jsonData: config,
                success: function(response, options) {
                    /* nothing for now */
                    this.fireEvent("saved", this.mapID);
                    this.metadataForm.hide();
                    Ext.getCmp('gx_saveButton').enable();
                    //Ext.getCmp('gx_saveAsButton').enable();
                },
                failure: function(response, options)
                {	if (response.status === 401)
                		this.showLoginWindow(options);
                	else {
                		Ext.Msg.alert('Error', response.responseText);
                        Ext.getCmp('gx_saveButton').enable();
                        //Ext.getCmp('gx_saveAsButton').enable();
                    }
                },
                scope: this
            });
        }
    }
});

