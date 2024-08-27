docker-compose build

docker save -o docker_image/goal-backend.tar goal-backend:latest
docker save -o docker_image/goal-frontend.tar goal-frontend:latest
docker save -o docker_image/postgres-15-alpine.tar postgres:15-alpine


docker load -i docker_image/goal-backend.tar
docker load -i docker_image/goal-frontend.tar
docker load -i docker_image/postgres-15-alpine.tar

