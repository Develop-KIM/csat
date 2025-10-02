.PHONY: docker-up docker-down

docker-up:
	cd docker && docker-compose --env-file ../.env up -d

docker-down:
	cd docker && docker-compose down -v