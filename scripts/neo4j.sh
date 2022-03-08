#!/bin/sh

docker run \
	--name school-zone-neo4j \
	-p 7474:7474 \
	-p 7687:7687 \
	--detach \
	--volume $HOME/dev/school-zone/neo4j/data:/data \
	--volume $HOME/dev/school-zone/neo4j/logs:/logs \
	--volume $HOME/dev/school-zone/neo4j/import:/var/lib/neo4j/import \
	--volume $HOME/dev/school-zone/neo4j/plugins:/plugins \
	--env NEO4J_AUTH=neo4j/test \
	neo4j:latest

