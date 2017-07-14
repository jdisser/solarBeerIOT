let seed;

if(process.env.NODE_ENV !== 'production') {
//  require('dotenv-safe').config() // environment variables, used for hiding secrets
  seed = require('./seedquelize.js');
}

//const express = require('express')
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

// Connect to a sql database
const sequelize = new Sequelize('../database/solarbeer.db');



//import the models instead of defining them in this file
sequelize.import('../models/batrecord.js');
sequelize.import('../models/sysrecord.js');




/* from original repo
const Artist = sequelize.define('artist', {
  name: {
    type: Sequelize.STRING,
    field: 'name'
  },
  genre: {
    type: Sequelize.STRING,
    field: 'genre'
  }
});

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    field: 'username'
  },
  twitter: {
    type: Sequelize.STRING,
    field: 'twitter'
  }
});
*/


// This line saves your job by not deleting production data
if(process.env.NODE_ENV !== 'production') {
  
  // Clear out the existing database
  sequelize.sync({force: true}).then(() => {
    
    // This shows the shape of the structure we are expecting.
    // data is just an array of whatever models you want to create,
    // model is of course the actual model you want created
    
    
    const artists = {     //this is just a reference for the object in the array passed to seed
      data: [             //this would be the Monitor array property
        {
          name: 'Andrea Bocelli',
          genre: 'Opera'
        },
        {
          name: 'Britney Spears',
          genre: 'Pop'
        },
        {
          name: 'Lee Morgan',
          genre: 'Jazz'
        }
      ],
      model: Artist         //this would be BatRecord from var in imported model
    }

    const users = {
      data: [
        {
          username: 'jimthedev',
          twitter: '@jimthedev'
        },
        {
          username: 'jnessview',
          twitter: 'JNessView'
        }
      ],
      model: User
    }

    // Actually seed the database using seedquelize
    seed([
      artists,
      users
    ]).then(() =>{
      // Only started after seeding in dev/test
//      startExpress();
    })
  })
} 

// else {
//   // Started right away in prod
//   startExpress();
// }


