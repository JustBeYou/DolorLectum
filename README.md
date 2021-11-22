# DolorLectum
Langua rumena est mucho smecherosa.

## Cum pornesc proiectul?
`docker-compose up` va porni toate aplicatiile.

## Cum adaug o aplicatie?

Vom folosi ca exemplu `mockapp`, scrisa in `go`.

1. Creezi un folder pentru aplicatia ta (ex. `mockapp`)
2. Pui specificatia openapi in `mockapp/openapi.yaml`
3. Folosesti OpenAPI-generator ca sa generezi boilerplate-ul aplicatiei:
```
java -jar openapi-generator-cli.jar generate \
-i ./mockapp/openapi.yaml # sursa specificatiei
-g go-gin-server          # ce generator sa foloseasca*
-o mockapp                # destinatia boilerplate-ului generat

#* pentru o lista a generatoarelor ruleaza:
# java -jar openapi-generator-cli.jar list
```
4. Daca boilerplate-ul generat nu are un Dockerfile, creeaza unul 
(ex. `mockapp/Dockerfile`)
5. Adauga aplicatia ta in serviciile din docker-compose, exemplu:
```
services:
  mockapp:
    build:
      context: ./mockapp # locatia imaginii de docker
    ports:
      - 8081:8080 # expune portul 8080 intern spre 8081 extern

    # ... alte chestii ...
```

Dupa ce pornesti proiectul, `mockapp` (sau aplicatia ta) va fi disponibila
la portul extern specificat, anume 8081.

Informatii despre OpenAPI-generator: https://github.com/OpenAPITools/openapi-generator