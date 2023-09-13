up:
	docker compose up --build

down:
	docker compose down

clean: down
	./clean_docker.sh
