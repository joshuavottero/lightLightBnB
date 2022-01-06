
-- my answer
-- SELECT reservations.*, properties.*,  avg(property_reviews.rating) as average_rating
-- FROM reservations
-- JOIN users ON reservations.guest_id = users.id 
-- JOIN properties ON reservations.property_id = properties.id 
-- JOIN property_reviews ON property_reviews.reservation_id = reservations.id 
-- WHERE reservations.guest_id = 1
-- GROUP BY reservations.id, properties.id, users.id
-- HAVING now()::date > end_date
-- ORDER BY start_date
-- LIMIT 10;

-- bootcamp answer
SELECT properties.*, reservations.*, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;

-- limited view of boot camp answer
-- SELECT properties.id, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
-- FROM reservations
-- JOIN properties ON reservations.property_id = properties.id
-- JOIN property_reviews ON properties.id = property_reviews.property_id
-- WHERE reservations.guest_id = 1
-- AND reservations.end_date < now()::date
-- GROUP BY properties.id, reservations.id
-- ORDER BY reservations.start_date
-- LIMIT 10;



