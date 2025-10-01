.PHONY: docker-up docker-down

docker-up:
	@set -a; source .env; set +a; \
	cd docker && docker-compose up -d

docker-down:
	cd docker && docker-compose down
