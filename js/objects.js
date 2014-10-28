/*
* Functions to manipulate objects in a generic way
*/

// Generic function to add an object to a Container
function addObjectToContainer(containerId,objectId,spot){
	var objRef = InventoryManager['imRef'].child('objects').child(objectId).child('container');
	objRef.set(containerId)

	var rootRef = InventoryManager['imRef'].child('containers').child(containerId).child('objects').child(spot)
	rootRef.set(objectId)

	var fridge = InventoryManager['imRef'].child('containers').child(containerId)
	fridge.once('value', function(snap) {
	  console.log(snap.val());
	});
}

// Generic function add new object
// options = {name:'objectName',compType:'objectType',...}
function newObject(options){
	var rootRef = InventoryManager['imRef'].child('objects')
	var obj = rootRef.push(options)
	return obj.name();
}