docker-compose build

docker save -o docker_image/goal-backend.tar goal-backend:latest
docker save -o docker_image/goal-frontend.tar goal-frontend:latest
docker save -o docker_image/postgres-15-alpine.tar postgres:15-alpine

docker-compose up