Ext.namespace("GeoNode");

GeoNode.DataCart = Ext.extend(Ext.util.Observable, {
    
    selectedLayersText: 'UT: Selected Layers',
    emptySelectionText: 'UT: No Layers Selected',
    titleText: 'UT: Title',
    clearSelectedButtonText: 'UT: Clear Selected',
    clearAllButtonText: 'UT: Clear All',
    addLayersButtonText: 'UT: Add Layers',


    addToMapButtonFunction: null,
    addToMapButtonTarget: null,

    constructor: function(config) {
        Ext.apply(this, config);
        this.doLayout();
    },

    getSelectedLayerIds: function() {
        var layerIds = [];
        this.grid.selModel.each(function(rec) {
            layerIds.push(rec.get('name'));
        });
        return layerIds;
    },
    
    doLayout: function() {
        var widgetHTML =
        '<div class="selection-table"></div>' +
        '<div class="selection-controls"></div>' +
        '<div class="selection-ops></div>"';
        
        var el = Ext.get(this.renderTo);
        el.update(widgetHTML);
        var controls_el = el.query('.selection-controls')[0];
        var table_el = el.query('.selection-table')[0];
        var ops_el = el.query('.selection-ops')[0];
        
        sm = new Ext.grid.CheckboxSelectionModel({});
        this.grid = new Ext.grid.GridPanel({
            store: this.store,
            viewConfig: {
                autoFill: true,
                forceFit: true,
                emptyText: this.emptySelectionText,
                deferEmptyText: false
            },
            height: 100,
            renderTo: table_el,
            selModel: sm,
            hideHeaders: true,
            colModel: new Ext.grid.ColumnModel({
                defaults: {sortable: false, menuDisabled: true},
                columns: [
                    sm,
                    {dataIndex: 'title'}
                ]
            })
        });
        // data cart items are initially selected
        this.store.on('add', function(store, records, index) {
            sm.selectRow(index, true);
        })


        var addToMapButton = new Ext.Button({
            text: this.addLayersButtonText,
            iconCls: 'icon-add',
            cls: 'x-btn-link-medium x-btn-text'
        });

        var clearAll = function() {
            this.store.removeAll();
            this.store.reselect();
        };

        if (this.addToMapButtonFunction) {
            var addToMapFunction = this.addToMapButtonFunction;
            var addToMapTarget = this.addToMapButtonTarget;
            var dataGrid = this.grid;
            var dataCart = this;
            
            addToMapButton.on('click', function() {
            addToMapFunction.call(addToMapTarget, dataGrid.getSelectionModel().getSelections());
            clearAll.call(dataCart);
        });
        }


        var clearSelectedButton = new Ext.Button({
            text: this.clearSelectedButtonText
        });
        clearSelectedButton.on('click', function() {
            sm.each(function(rec) {
                var index = this.store.indexOfId(rec.id);
                if (index >= 0) {
                    this.store.removeAt(index);
                }
            }, this);
            this.store.reselect();
        }, this);


        
        var clearAllButton = new Ext.Button({
            text: this.clearAllButtonText
        });
        clearAllButton.on('click', clearAll, this);

        var spacer = new Ext.Spacer({
            width:20
        })

        var controlsForm = new Ext.Panel({
             frame:false,
             border: false,
             layout: new Ext.layout.HBoxLayout({
                 defaultMargins: {
                     top: 10,
                     bottom: 10,
                     left: 0,
                     right: 0
                  }
             }),
             items: [this.addToMapButtonFunction ? addToMapButton : "", this.addToMapButtonFunction ? spacer : "", clearSelectedButton, clearAllButton]
         });


         controlsForm.render(controls_el);
    }
});
