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

  //FIXME add a child_remove trigger

  return true;
}

//consume a beer
function consumeBeer(beerId){
	var rootRef = InventoryManager['imRef'].child('objects').child(beerId)
	rootRef.update({
		"consumed":true,
		"consumer":InventoryManager['uid']
	});

	rootRef.once('value', function(snap) {
	  // store dataSnapshot for use in below examples.
	  // fredSnapshot = dataSnapshot;
	  console.log(snap.val());
	  removeFromFridge(snap.val().container,snap.val().spot)
	});
	addBeerToUserConsumedList(InventoryManager['uid'],beerId);
}

//remove object from Fridge
function removeFromFridge(fridgeId,spot){
	//get beerid from spot, and remove rel to container in beer obj
	var beerRefInFridge = InventoryManager['imRef'].child('containers').child(fridgeId).child('objects').child(spot)
	beerRefInFridge.once('value',function(snap){
		var beerRef = InventoryManager['imRef'].child('objects').child(snap.val())
		beerRef.update({
			"container":""
		})
	});

	var rootRef = InventoryManager['imRef'].child('containers').child(fridgeId).child('objects').child(spot)
	rootRef.remove()

	var fridge = InventoryManager['imRef'].child('containers').child(fridgeId)
	fridge.once('value', function(snap) {
	  console.log(snap.val());
	});
}

//add object to Fridge
function addToFridge(fridgeId,spot,beerId){
	var rootRef = InventoryManager['imRef'].child('containers').child(fridgeId).child('objects').child(spot)
	rootRef.set(beerId)

	var fridge = InventoryManager['imRef'].child('containers').child(fridgeId)
	fridge.once('value', function(snap) {
	  console.log(snap.val());
	});
}

//Find the consumedList of an user
function getConsumedListOfUser(userId,callback){
	// userId -> RootContainer -> ConsumedList 
	var rootRef = InventoryManager['imRef'].child('containers').child(InventoryManager['rootContainer']).child('children')
	rootRef.on('child_added',function(v){
		var listRef = InventoryManager['imRef'].child('containers').child(v.name())
		listRef.once('value',function(snap){
			if(snap.val().compType == "consumedList"){
				callback(snap.name())
			}
		})

	})
}

// add a beer to consumedList
function addBeerToUserConsumedList(consumedListId,beerId){

}