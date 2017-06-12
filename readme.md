# Solar Beer IOT project

I live in the Keys and needed a reliable source of emergency power in the event of an extended period of power loss due to a hurricane.
A few solar panels, a D battery with an MPPT charge controller, a 3000 Watt inverter plus a battery monitor and I have a system to produce
and store power. But how much? I needed a load to see what the system could do and had a small refigerator. Since one of the problems
with the extended power outages is preserving food that was a good test load, but what should I put in the fridge?? Solar Powered Beer!!!

This is the story and the code to monitor how the system reponds to weather and as much beer as we can throw at it. As the parameters being monitored
grow more sensors will be added and networked using mesh networking and energy harvesting. Eventually the components built for the system
will be refined and marketed for BatteryLess Networking, an IOT platform that never needs winding!

Follow along on the saga of Solar Powered Beer!


## Notes on installing sqlite and sequelize

The first component being built is a data logger and IOT bridge built using a Beaglebone Black Wireless single board computer. The BBB
is running Angstrom Linux and the app to collect and serve the data is built using NodeJS on a sqlite database. MongoDB doesn't install
in the BBB and Redis and other NoSQL DB's aren't the best fit for the long timestamped data arrays that are recorded from the battery monitor.

Of course this is easier said that done, as a quick search on installing sqlite on a 32bit ARM processor will turn up. Here's how I was able to
get the database installed and running.

Attempting to install the sqlite3 node module fails due to the lack of a binary for sqlite3 that is compatible with the BBB
To install the module it's neccasary to build the sqlite3 database engine from source files using the gcc compiler configured for the BBB.
Use this command to complile sqlite3 from the amalgamation files. This build was set to use the USLEEP option(?) and the JSON extension.

```sudo gcc -Os -I. -DSQLITE_THREADSAFE=0 -DSQLITE_OMIT_LOAD_EXTENSION -DSQLITE_ENABLE_JSON1 -DSQLITE_ENABLE_EXPLAIN_COMMENTS -DHAVE_USLEEP shell.c sqlite3.c -ldl -o sqlite3```

This will create a sqlite3 executable file in the directory that contains the source files assuming it was run from the same directory.
Once Sqlite3 is built and runs without error the node-sqlite3 module also needs to be rebuilt to use an external squlite3 instance. The default is to create an "internal" copy using the
downloaded binary which isn't available. Use this command to install the module using the build-from-source option and targeting the externally installed sqlite3 instance.

```npm install --build-from-source --sqlite=/var/lib/cloud9/solarBeerIOT/source/ sqlite3 --save```

compiling both apps from source takes hours on the BBB. If done using cloud9 connection between the BBB and the IDE will be lost before compiling is finished 
but this does not prevent a successful installation, just the ability to see it. Connection will be restablished once the processor is not busy and the module installed. 