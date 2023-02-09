SELECT properties.id, properties.title, properties.cost_per_night, AVG(property_reviews.rating) FROM properties
JOIN property_reviews
ON properties.id = property_reviews.id
WHERE city LIKE '%ancouv%'
GROUP BY properties.id, properties.title, properties.cost_per_night, property_reviews.rating
HAVING AVG(property_reviews.rating) >= 4
ORDER BY properties.cost_per_night
LIMIT 10;