package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/cases/", CasesHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
