//returns organizations the user belongs to
function getOrganizations(callback){
	if (!InventoryManager['uid']) {
	    flash('danger', 'You must be logged in to retrieve organizations of user.');
	    return false;
	}
	//array of organizations
	var rootRef = InventoryManager['imRef'].child('containers').child(InventoryManager['rootContainer']).child('organizations');
  	
  	var userOrganizations = []
  	rootRef.on('child_added', function(v) {
  		this.push(v.name())
  		callback(this);
	},userOrganizations);

  	return true
}

// get Fridges user has access to
function getFridges(orgRootContainerId,callback){
  if (!InventoryManager['uid']) {
    flash('danger', 'You must be logged in to retrieve Grocery Lists.');
    return false;
  }

  var rootRef = InventoryManager['imRef'].child('containers').child(orgRootContainerId).child('children')	;
  var orgFridges = []

  rootRef.on('child_added', function(v) {
    this.push(v.name())
  	callback(this);
  }, orgFridges);

  return true;
}

// get beers in Fridges
function getBeersFromFridge(fridgeID,callback){
	console.log("ID",fridgeID);
  if (!InventoryManager['uid']) {
    flash('danger', 'You must be logged in to retrieve Grocery Lists.');
    return false;
  }

  var rootRef = InventoryManager['imRef'].child('containers').child(fridgeID).child('objects')	;
  var objects = []

  rootRef.on('child_added', function(v) {
    this.push({spot:v.name(),objectId:v.val()})
  	callback(this);
  }, objects);

  return true;
}