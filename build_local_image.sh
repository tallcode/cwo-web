#!/bin/bash

container_name="cwo-web"
cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && git pull && docker build -t ${container_name}:latest .

container_exists=$(docker ps -a --filter "name=${container_name}" --format '{{.Names}}')
if [ -n "$container_exists" ]; then
    docker container stop ${container_name}
    docker container rm ${container_name}
fi    

docker run --restart=always -p 80:8080 --name ${container_name} -d ${container_name}:latest