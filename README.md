# site

#### Getting Started

Install docker and docker compose
Start docker

set up /nginx/ssl directory with files for:

```
csr.pem
privatekey.pem
public.crt
```

Run

```
docker-compose up
```

To remove all images
`docker-compose down --rmi all`

To build with docker
`docker build .`

To build without cached files
`docker-compose build --no-cache`

Generate ssl files

```
mkdir ssl; cd ssl;
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
```

fill in the data requested for the cert

Use the key.pem and crs.pem files to generate our SSL certificate

```
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

#### docker mount volume

https://releasehub.com/blog/6-docker-compose-best-practices-for-dev-and-prod
mount the source code to a directory (/app) in the docker container

```
volumes:
  - .:/app
```

docker-compose build --no-cache
docker-compose up
