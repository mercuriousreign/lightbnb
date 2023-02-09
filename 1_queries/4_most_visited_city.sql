SELECT properties.city, count(*) as total_reservation FROM reservations
JOIN properties
ON properties.id = reservations.property_id
GROUP BY properties.city
ORDER BY total_reservation DESC;