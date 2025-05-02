select
	flight.route_code,
	dc.name as departure_city,
	ac.name as arrival_city,
	flight.departure_date,
	flight.arrival_date,
	timediff(flight.arrival_date, flight.departure_date) as duration,
	c.name as company,
	flight.seats_available,
	flight.price,
	flight.status
from flight
left join airport da on flight.departure_airport_id = da.id
left join city dc on da.city_id = dc.id
left join airport aa on flight.arrival_airport_id = aa.id
left join city ac on aa.city_id = ac.id
left join company c on flight.company_id = c.id
order by departure_date asc