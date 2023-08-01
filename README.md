# ft_transcendence
Let's transcende this
## Make
`make up` deploy 4 containers: a postgres database and Adminer to look in the database, the frontend (a React app) and the backend (a Nestjs app).

- http://localhost:5000 -> Adminer
	+ System: PostgreSQL
	+ Username: postgres
	+ Password: example
	+ Database: postgres
- http://localhost:3000 -> Backend
- http://localhost:8000 -> Frontend

The apps are deployed in development mode, so if you change the code, the application will reload.
## API
The API of the backend was made with Swagger API, to see the specification go to  http://localhost:3000/api
## .env
For security reasons the .env files will not be uploaded. Nevertheless, here are the requirements:
- backend/.env:
	+ DATABASE_URL
	+ INTRA_UID
	+ INTRA_SECRET
	+ REDIRECT_URI
	+ JWT_SECRET
- backend/sql/.env:
	+ POSTGRES_DB	
	+ POSTGRES_USER	
	+ POSTGRES_PASSWORD
- frontend/.env
	+ PORT
	+ REACT_APP_BACKEND
	+ REACT_APP_INTRA_UID
	+ REACT_APP_REDIRECT_URI
