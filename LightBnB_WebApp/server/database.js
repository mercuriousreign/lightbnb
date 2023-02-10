const properties = require('./json/properties.json');
const users = require('./json/users.json');
const {Pool} = require('pg')

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users


/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users
    WHERE users.email = $1 LIMIT 1;`,[email]).then((result) => {
      //console.log("Testing",result.rows);
      
    return result.rows[0];
      // result.rows.forEach(user => {
      //   console.log(user)
      //   //return user;
      //   return Promise.resolve(user);
      // });
    }).catch((err)=> {
      console.log(err);
      return null;
    });

  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  //return Promise.resolve(users[id]);
  return pool
    .query(`SELECT * FROM users
    WHERE users.id = $1 LIMIT 1;`,[id]).then((result) => {
      return result.rows[0];
    }).catch((err)=> {
      console.log(err);
      return null;
    });

}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  return pool
  .query(`INSERT INTO users(name,password,email)
  VALUES ($1,$2,$3) RETURNING *;`,[user.name,user.password,user.email]).then((result) => {
    console.log("add user func",result.rows[0]);
    return result.rows[0];
  }).catch((err)=> {
    console.log("error for add user",err);
    return null;
  });

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return pool
    .query(`SELECT * FROM properties
    LIMIT $1`,[limit]).then((result) => {
      //console.log(result.rows);
      return result.rows;
    }).catch((err)=> {
      console.log(err)
    });
  
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  return pool
  .query(`INSERT INTO properties(name,email,password)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,[property]).then((result) => {
    console.log(result.rows);
    return result.rows;
  }).catch((err)=> {
    console.log(err);
    return null;
  });
}
exports.addProperty = addProperty;
