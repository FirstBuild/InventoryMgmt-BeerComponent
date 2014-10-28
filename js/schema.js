// Load  all schemas from Firebase
function loadSchemas(callback){
	var rootRef = InventoryManager['imRef'].child('schemas');
  	
  	var schemas = []
  	rootRef.on('child_added', function(v) {
  		this.push(v.name())
  		callback(this);
	},schemas);
}

//Get specific schemas

function getSchema(schemaId, callback){
	var rootRef = InventoryManager['imRef'].child('schemas').child(schemaId);

	rootRef.once('value',function(snap){
		callback(snap.val())
	})
}