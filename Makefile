.PHONY: dev prod down build logs

dev:
	docker compose up --build

prod:
	docker compose -f docker-compose.prod.yml up --build -d

down:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

build:
	docker compose -f docker-compose.prod.yml build

logs:
	docker compose logs -f