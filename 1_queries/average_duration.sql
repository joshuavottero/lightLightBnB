SELECT avg(end_date - start_date ) as average_duration
FROM reservations;
join property_reviews ON id = property_reviews.property_id