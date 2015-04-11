frontend-scaffold
=================

just a personal front end starter setup with bower / grunt / and tastey bits I often use. 

Make sure you have `Ruby, SASS, NPM, GRUNT & BOWER` installed.

run **all** of the following to get started (from inside the assets folder) : 

```bash
npm install
```

this will install grunt and all of its dependancies, next, install all of the bower compenents with :

```bash
bower install
```

this will install all of the usual suspects. next  run the first grunt task to set up the project :

```bash
grunt buildit
```

This will copy the essential libraries and do the first build which will create a public folder where the built assets will be kept.  Lastly run:

```bash
grunt
```
to start watching your project folders and files.


### Now that you're watching....
to add js plugins to the project drop the **unminified** versions into the `assets/js/plugins` folder, edit sass in the sass folder, and add any custom scripts into the `assets/js/scripts/` folder.  to add additional js libraries please edit the gruntfile.js and run `grunt buildit` again.  the `img` and `favicons` folders are also watched in assets and any images dropped in while `grunt` is running will be optimised and transfered to the public folder.

### Cleaning Up
Note that the following folders are cleaned by grunt, so adding files directly or editing them in these locations will not be persisted : 

* The whole public folder.
* the JS libs and plugin folder
* the sass libs folder





