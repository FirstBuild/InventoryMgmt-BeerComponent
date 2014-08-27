// Functions for manipulating grocery lists (not the items in them)

/* data is an object with the following attributes:
    parent: Firebase name of parent container (false for root container) [required]
      - appended to "/containers/" to find parent
    owner: string - Firebase uid of container owner [required]
      - appended to "/users/" to find owner
    name: string - the name of the container [required]
    description: string - a description of the container [optional]
*/
function newList(data) {
  if (typeof data !== 'object') {
    return { success: false, message: 'newList requires an object as input' }
  }
  var newChild = InventoryManager['imRef'].child('containers').push(data);
  newChild.setPriority(data['owner']); //simplify finding all containers owned by uid
  if (data['parent'] !== false) {
    var parentRef = InventoryManager['imRef'].child('containers/' + data['parent'] + '/children');
    var update = {};
    update[newChild.name()] = true;
    parentRef.update(update);
  }
}

// recursively descend through the container tree and identify all grocery lists
// adding them to the context array (InventoryManger['lists']) and adding listeners
// for their new children
function recurseContainers(ref, obj) {
  ref.once('value', function(v) {
    if(v.val()['compType'] && v.val()['compType'] == "grocery") {
      var listObj = {
        id: ref.name(),
        name: v.val()['name'],
        description: v.val()['description']
      };
      obj.push(listObj);
      var ch = ref.child('children');
      ch.on('child_added', function(snap) {
        recurseContainers(snap.ref().root().child('containers').child(snap.name()), this);
      }, obj);
    }
  }, obj);
}

// starting at the logged-in user's rootContainer, enumerate all child
// containers
function getUserLists() {
  if (!InventoryManager['uid']) {
    flash('danger', 'You must be logged in to retrieve your containers.');
    return false;
  }
  InventoryManager['lists'] = [];
  var rootRef = InventoryManager['imRef'].child('containers').child(InventoryManager['rootContainer']).child('children');
  rootRef.on('child_added', function(v) {
    var contRef = InventoryManager['imRef'].child('containers').child(v.name());
    recurseContainers(contRef, this);
  }, InventoryManager['lists']);
}
