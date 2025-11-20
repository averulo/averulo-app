UPDATE "Booking"
SET "bookingCode" = LPAD(CAST(FLOOR(RANDOM() * 1000000000)::INT AS TEXT), 9, '0')
WHERE "bookingCode" IS NULL;