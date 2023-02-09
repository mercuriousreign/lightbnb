SELECT properties.id, properties.title, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating) 
FROM reservations
JOIN properties
ON properties.id = reservations.property_id
JOIN property_reviews
ON properties.id = property_reviews.property_id
JOIN users
ON users.id = reservations.guest_id
WHERE users.id = 1
GROUP BY properties.id, reservations.start_date
ORDER BY start_date
LIMIT 10;