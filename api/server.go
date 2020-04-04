package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	http.HandleFunc("/cases/", CasesHandler)
	http.HandleFunc("/cases_time_series/", CasesTimeSeriesHandler)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
