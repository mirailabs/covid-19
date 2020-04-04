package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type TSRegion struct {
	Province  string  `json:"province"`
	Country   string  `json:"country"`
	Confirmed []int   `json:"confirmed"`
	Recovered []int   `json:"recovered"`
	Dead      []int   `json:"dead"`
	Latitude  float32 `json:"latitude"`
	Longitude float32 `json:"longitude"`
}

type TSResponse struct {
	Dates   []string   `json:"dates"`
	Regions []TSRegion `json:"regions"`
}

func get(url string) (response *TSResponse, err error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	json.Unmarshal(body, &response)

	return response, nil
}

func CasesTimeSeriesHandler(w http.ResponseWriter, r *http.Request) {
	resp, err := get("https://raw.githubusercontent.com/mirailabs/covid-19/master/data/db/jhu-csse/time_series_latest.json")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json, err := json.Marshal(resp)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(json)
}
