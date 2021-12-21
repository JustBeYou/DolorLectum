FROM golang:1.17 AS build

RUN apt update -y && apt install -y ca-certificates 
RUN update-ca-certificates --fresh -v

WORKDIR /go/src
COPY httpapi ./httpapi
COPY main.go .
COPY go.mod .

ENV CGO_ENABLED=0
RUN go get -d -v ./...

RUN go build -a -installsuffix cgo -o main .

FROM alpine AS runtime
ENV GIN_MODE=release
COPY --from=build /go/src/main ./
EXPOSE 8080/tcp
ENTRYPOINT ["./main"]
