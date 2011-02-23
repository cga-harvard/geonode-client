
Ext.namespace("GeoExplorer");

/** api: constructor
 *  Create a tool to perform a WFS GetFeature query for the selected point on the map
 *  target: GeoExplorer instance
 */
GeoExplorer.MapSnapshotGrid =  function(mapid) {

/*
var snapReader = new Ext.data.JsonReader({
    // metadata configuration options:
    idProperty: 'id',
    // the fields config option will internally create an Ext.data.Record
    // constructor that provides mapping for reading the record data objects
    fields: [
        // map Record's 'firstname' field to data object's key of same name
        {name: 'user', mapping: 'user'},
        // map Record's 'job' field to data object's 'occupation' key
        {name: 'date', mapping: 'created_dttm'},

        {name: 'link', mapping: 'snapshot'}
    ]
});
*/



var store = new Ext.data.JsonStore({
    url: '/maps/history/' + mapid,
    fields: [{name:'created', type: 'date'}, 'user', 'url', 'map'],
    idProperty: 'url',
    root: ''
});

    var renderDate = function(value, p, record){
        return String.format(
                '<b><a href="/maps/{0}/{1}">{2}</a>',
                record.data.map, record.id, value);
    };

    var renderUser = function(value, p, record){
        return String.format(
                '<b><a href="/profiles/{0}">{1}</a>',
                value, value);
    };

    
var grid = new Ext.grid.GridPanel({
        width:400,
        height:300,
        title:'Map Revision History',
        store: store,
        trackMouseOver:false,

        // grid columns
        columns:[{
            header: "Revision Date",
            dataIndex: 'created',
            width: 200,
            renderer: renderDate,
            sortable: true
        },{
            header: "URL",
            dataIndex: 'url',
            width: 10,
            hidden: true,
            sortable: false
        },{
            header: "User",
            dataIndex: 'user',
            width: 200,
            align: 'right',
            renderer: renderUser,
            sortable: true
        },{
            header: "Map",
            dataIndex: 'map',
            width: 10,
            align: 'right',
            hidden:true,
            sortable: false
        }],

        // customize view config
        viewConfig: {
            forceFit:true
        }
    });




    var historyWindow = new Ext.Window({
            title: 'Map Revision History',
            closeAction: 'destroy',
            items: grid,
            modal: true,
            autoScroll: true
        });


    // trigger the data store load
    store.load();

    historyWindow.show();

}