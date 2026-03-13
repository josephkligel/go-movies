package main

import (
	"fmt"
	"log"
	"net/http"
)

const port = 8081

type application struct {
	Domain string
}

func main() {
	// Set application config
	var app application

	// read from command line

	// conntect to database
	app.Domain = "example.com"
	log.Println("Starting server on port", port)

	// start web server
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
