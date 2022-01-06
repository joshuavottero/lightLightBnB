const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
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
  .query( `
    SELECT *
    FROM users
    WHERE email = $1
  `, [email])
  .then((result) => {
    // console.log(result.rows);
    // console.log(result.rows[0]);
    return result.rows[0];
  })
  .catch((err) => { 
    console.log(err.message)
  });
  
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */


const getUserWithId = function(id) {
  return pool
  .query( `
    SELECT *
    FROM users
    WHERE id = $1
  `, [id])
  .then((result) => {
    // console.log(result.rows);
    // console.log(result.rows[0]);
    return result.rows[0];
  })
  .catch((err) => { 
    console.log(err.message)
  });

  //return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;



/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  console.log(user.name);
  return pool
  .query( `
    INSERT INTO users(name, email, password)
    VALUES($1, $2, $3)
    RETURNING *;
  `, [user.name, user.email, user.password])
  .then((result) => {
    // console.log(result.rows);
    // console.log("hi");
    // console.log(result);
    return result;
  })
  .catch((err) => { 
    console.log(err.message)
  });

  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  console.log([guest_id]);
  return pool
  .query( `
    SELECT *
    FROM reservations
    join properties ON properties.id = reservations.property_id
    WHERE guest_id = $1
    LIMIT $2
  `, [guest_id, limit])
  .then((result) => {
    // console.log("hi");
    // console.log([result.rows]);
    // console.log(result.rows);
    // console.log(result.rows[0]);
    return result.rows;
  })
  .catch((err) => { 
    console.log(err.message)
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
const getAllProperties = (options, limit = 10) => {
  

  // WHERE city LIKE '%ancouv%'
  //   GROUP BY properties.id
  //   HAVING avg(property_reviews.rating) >= 4
  //   ORDER BY cost_per_night

  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id 
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE properties.city LIKE $${queryParams.length} `
  }
  
  if (options.id) {
    if (queryParams.length === 0) {
      queryString += `WHERE `
    }
    else {
      queryString += `AND `
    }
    queryParams.push(`${options.id}`);
    queryString += `id = $${queryParams.length} `
  }

  if (options.minimum_price_per_night) {
    if (queryParams.length === 0) {
      queryString += `WHERE `
    }
    else {
      queryString += `AND `
    }
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `properties.cost_per_night >= $${queryParams.length} `;
  }
  console.log(options);

  if (options.maximum_price_per_night) {
    if (queryParams.length === 0) {
      queryString += `WHERE `
    }
    else {
      queryString += `AND `
    }
    queryParams.push(`${options.maximum_price_per_night}`)
    queryString += `properties.cost_per_night <= $${queryParams.length} `;
  }

  
 

  
  queryString += `
  GROUP BY properties.id`
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`)
    queryString += ` HAVING avg(property_reviews.rating)  >= $${queryParams.length} `;
  }
  queryParams.push(limit);
  queryString += `
  ORDER BY properties.cost_per_night
  LIMIT $${queryParams.length};  
  `;

  return pool
  .query(queryString, queryParams)
  .then((result) => result.rows)
  .catch((err) => { 
    console.log(err.message)
  });
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
