up:
	docker compose --env-file frontend/.env up --build

down:
	docker compose down

clean: down
	./clean_docker.sh
