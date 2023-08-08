up:
	docker compose up

down:
	docker compose down

clean: down
	./clean_docker.sh
