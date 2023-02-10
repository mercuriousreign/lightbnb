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
    return result.rows[0];
    }).catch((err)=> {
      console.log(err);
      return null;
    });


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

  const queryString = `SELECT properties.id, properties.title, properties.description, properties.cover_photo_url, properties.thumbnail_photo_url , properties.number_of_bedrooms , properties.number_of_bathrooms, properties.parking_spaces, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating) 
  FROM properties
  LEFT JOIN reservations
  ON properties.id = reservations.property_id
  LEFT JOIN property_reviews
  ON properties.id = property_reviews.property_id
  JOIN users
  ON users.id = reservations.guest_id
  WHERE users.id = $1
  GROUP BY properties.id, reservations.start_date
  ORDER BY start_date
  LIMIT $2;`;

  return pool.query(queryString,[guest_id,limit]).then((result) => {
    console.log(result.rows);
    return result.rows;
  }).catch((err)=> {
    console.log(err)
  });
  
  //return getAllProperties(null, 2);
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
  
  const queryParams = [];
  
  let qString = `SELECT properties.*, AVG(property_reviews.rating) as average_rating FROM properties JOIN property_reviews ON properties.id = property_id `;



  if (options.owner_id) {
    qString += `JOIN users ON users.id = properties.owner_id `;
  }

  if (options.owner_id) {    
    queryParams.push(options.owner_id)
    qString += (qString.includes("WHERE")) ? 'AND': 'WHERE';
    qString += ` users.id = $${queryParams.length}`;
  }
  
  if (options.city) {
    
    queryParams.push(`%${options.city}%`);
    qString += (qString.includes('WHERE')) ? 'AND': 'WHERE';
    qString += ` city LIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night, options.maximum_price_per_night);
    qString += (qString.includes('WHERE')) ? 'AND': 'WHERE';
    qString += ` price_per_night BETWEEN ${queryParams.length-1} AND ${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating)
    qString += (qString.includes('WHERE')) ? 'AND': 'WHERE';
    qString += ` user.id = $${queryParams.length} `;
  }
  
  
  queryParams.push(limit);
  qString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  
  console.log("final q string is /n",qString,typeof qString);

  return pool
    .query(qString,queryParams).then((result) => {
  
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

  let queryParams = [];
  let queryString = `INSERT INTO properties (
    title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
    VALUES ( `;
    
    for (let val of Object.values(property)){
      queryParams.push(val);
      queryString += `$${queryParams.length}, `;
    }
    queryString = queryString.slice(0,-2);
    queryString += ")";

  queryString += " RETURNING *;";
  console.log(queryString,queryParams);

  return pool
  .query(queryString,property).then((result) => {
    console.log(result.rows);
    return result.rows;
  }).catch((err)=> {
    console.log(err);
    return null;
  });
}
exports.addProperty = addProperty;
