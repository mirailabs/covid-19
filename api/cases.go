package main

import (
	"encoding/json"
	"net/http"

	"github.com/mirailabs/covid-19/api/remote/jhu"
)

type Region struct {
	Province   string  `json:"province"`
	Country    string  `json:"country"`
	Confirmed  int     `json:"confirmed"`
	Recovered  int     `json:"recovered"`
	Dead       int     `json:"dead"`
	Latitude   float32 `json:"latitude"`
	Longitude  float32 `json:"longitude"`
	LastUpdate int     `json:"last_update"`
}

type Response struct {
	TotalConfirmed int      `json:"total_confirmed"`
	TotalRecovered int      `json:"total_recovered"`
	TotalDead      int      `json:"total_dead"`
	Regions        []Region `json:"regions"`
}

// Adapt the backing service's response to our API schema.
func adaptJHUResponse(q *jhu.QueryResponse) *Response {
	resp := &Response{}
	for _, feature := range q.Features {
		attr := feature.Attributes
		resp.Regions = append(resp.Regions, Region{
			Province:   attr.Province_State,
			Country:    attr.Country_Region,
			Confirmed:  attr.Confirmed,
			Recovered:  attr.Recovered,
			Dead:       attr.Deaths,
			Latitude:   attr.Lat,
			Longitude:  attr.Long_,
			LastUpdate: attr.Last_Update,
		})
		resp.TotalConfirmed += attr.Confirmed
		resp.TotalRecovered += attr.Recovered
		resp.TotalDead += attr.Deaths
	}
	return resp
}

func CasesHandler(w http.ResponseWriter, r *http.Request) {
	jhuResp, err := jhu.Get()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := adaptJHUResponse(jhuResp)
	json, err := json.Marshal(resp)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(json)
}
