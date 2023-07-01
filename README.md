Let's transcende this

# Make
`make up` deploy 4 containers: a postgres database and Adminer to look in the database, the frontend (a React app) and the backend (a Nestjs app).

- http://localhost:5000 -> Adminer
	+ System: PostgreSQL
	+ Username: postgres
	+ Password: example
	+ Database: postgres
- http://localhost:3000 -> Backend
- http://localhost:8000 -> Frontend

The apps are deployed in developed mode, so if you change the code, the application will reload.
