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

```npm install --build-from-source --sqlite=/var/lib/cloud9/solarBeerIOT/source sqlite3 --save```

compiling both apps from source takes hours on the BBB. If done using cloud9 connection between the BBB and the IDE will be lost before compiling is finished 
but this does not prevent a successful installation, just the ability to see it. Connection will be restablished once the processor is not busy and the module installed.

## Sequelize Database Creation

Coming from Rails using Sequelize to generate an app is challenging considering the state of the documentation. Clearly a case for Google Driven Development!
My appraoch was to first create a database using a sqlite command from the command line in the ```/database``` directory.

```sqlite "solarbeer.db"```

curiously this doesn't actually create it until a table is created and saved (sometimes?), so I created a scrap table called notes to keep track of comments and
saved the table causing the database to be created.

The plan to use the migrations and seeders is to create a script in the package.json file that will execute a command sequence based on the parameter passed like this example

```"scripts": {```
```  "dev": "grunt && sequelize db:migrate && sequelize db:seed:all && node bin/www",```
```  "start": "sequelize db:migrate && sequelize db:seed:all && node bin/www" }, ```



The most coherent explaination of the process to create and intialize the database can be found on this Stack Overflow question. Kinda scary building a production app using a module documented like this. This example uses
umzug to run the migrations but the docs suggest that the ```db:migrate``` will do this. 


## Seeding The Database

To create the models/tables I'm using the sequelize-cli tools and migrations. The naming convention I picked is for the models to be Capitialized-Singular and the tables to be named
Capitalized-Plural. The tool alters the table naming by changing it to lowecase and pluralizing it in the migrations that it generates. Here are the commands that were used to create
the models and migrations.

First initialize the project to generate the folders and the code to load the models on startup.

```./node_modules/.bin/sequelize init```

Then create the models and migrations

```./node_modules/.bin/sequelize model:create --name BatRecord --attributes batV:decimal,batI:decimal,batP:decimal,batE:decimal,batC:decimal,batQ:decimal,timeIndex:decimal```

```./node_modules/.bin/sequelize model:create --name SysRecord --attributes timeIndex:decimal,totalEin:decimal,totalEout:decimal,totalPin:decimal,totalPout:decimal,batVmin:decimal,```
```batVmax:decimal,batTfull:decimal,minDischarge:decimal,avgDischarge:decimal,lastDischarge:decimal,discharges:decimal,cycles:decimal ```

And run the migrations

```./node_modules/.bin/sequelize db:migrate```

To seed the database first create a seeder.

```./node_modules/.bin/sequelize seed:create --name 'DataSeed'```

Often I find the suggested way to seed data is to use Sequelize in the app code to build models and then use the sync method with the ```force: true``` option which results in the
tables being dropped and reconstructed. This isn't compatible with migrations and seeding since it's really unlikely that whats happening in the app code is going to be consistently 
up to date with the migrations and seeders. Why would that happen :-) ?! So there needs to be a way that the table DATA is deleted and restored in the seeder. This is possible using the 
commands

```sequelize db:seed:undo:all```

```sequelize db:seed:all```

Seed undo removes only the data using

this method ```queryInterface.bulkDelete```

The ```queryInterface.bulkInsert``` command takes an array of data objects and inserts them into the table refernced in the seeder parameter and generates a promise that is returned to
sequelize-cli. This code needs to run once for each table/seeder in the folder by using ```:all```

The module to generate the data arrays for seeding the database is required by the seeders in each seeder seperately since it's not clear to me how to create a singlton
within the sequelize-cli module and pass that to each seeder.

## Generating Express in a seperate Git Branch

This is the branch where I'll run the generator so nothing in Master will break!
In order to avoid a big mess I copied the package.json and package-lock.json files to duplicates
and I'll merge these together by hand using a split screen editor in Cloud9.

Speaking of Cloud9 it uses port 3000 which turns out to be a popular port and is
also used by Express in the scaffolded app. To avoid bad things I hard coded the port
to 4000 and hope that nothing important is using that too!

After running the Express generator the following instructions are displayed

DON"T EXECUTE THESE INSRTRUCTIONS YET!!!

```install dependencies:```
     ```$ cd . && npm install```

   ```run the app:```
     ```$ DEBUG=solarbeeriot:* npm start```
     
It would be a bad idea to do this BEFORE hand merging the package.json files.
## Problems with Sequelize db:seed

It appears that using db:seed is not fully reliable. Following the methods outlined here resulted in some odd results.
In one case (one table) the seed ran but there weren't any changes to the database. In another the seed code had a typo
and errored out, not unusual. But when the typo was corrected it again errored out and could not be restored by reloading
the IDE. It might recover on rebooting but I didn't want to try that yet. Making a small change to the seed file that ran
(with no result) created an error and then it too did not run again after the line was reverted back to it's original form!
SO it appears that once an error occurs it can't be corrected. At this point, given the state of the documentation on seeding
I decided to switch to a seeder script. This avoids the problem of running two seperate instances of the data generating model
but is not as flexible as a good Sequelize based seeding system. It appears that there is some activity to upgrade the docs.
It might be that this is a problem isolated to sqlite too (file based not URL based). I did run into problem along these lines
when connecting to the database in the script while trying to use a file: type URI. So it looks like seeding is a work in
process and I thought it best to avoid it now and move on with more beer code!

## Generating Express in an exising project

Looking to build from the bottom up the project started with installing and implementing a seeded database using Sequelize
and Sqlite on Node.js running on the Beagle Bone Black Wireless. Not the easiest thing in the world, like most things. But
this results in quite a bit of code in the project including models. Express does not have the concept of models and 
usually is used in a stack with a non-sql database like Mongo. What fun is that? So since it doesn't persist data the auto
generator doesn't create a models folder or overwrite the one in the project! But the same may not be true for the
package.json file and possibly others. So to handle this and still use the auto generator I'm going to use GIT and merge
and compare tools on github to make sure nothing breaks. The Big Idea is simple. Create two brnaches from Master, Testing and 
addExpress. Use addExpress to generate the app and then attempt to do a merge into Testing. If all else fails Master remains
unchanged. If it works then merge Testing into Master and go on from there. Just crazy enough to work! So here we are with
this commit in the Testing branch that adds to this readme.

## Routing

The battery monitor will be generating two kinds of records, hourly (or periodically) and daily. In the model code these
are referenced as BatRecords and SysRecords respectively. To get started we'll create a page with a table listing the
data collected and another using parameters to define a date range to display in a graph for the batRecords and a table
for the daily sysRecords. So the URLs will look look like this

| URL                  | Page                               | Parameters          |
| -------------------- | ---------------------------------- | ------------------- |
| /batrecords          | Table of all records               | none                |
| /batrecords/range?   | Plot of parameter for date range   | Start length Value  |
| /sysrecords          | Table of daily totals              | None                |
| /sysrecords/range?   | Table of date range                | Start End           |

There will be two controllers, batRecord and sysRecord (pluralization?)