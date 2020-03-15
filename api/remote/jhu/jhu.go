package jhu

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

const Endpoint = "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases/FeatureServer/1/query?where=1%3D1&outFields=*&f=json"

type Attribute struct {
	ObjectId       int
	Province_State string
	Country_Region string
	Confirmed      int
	Recovered      int
	Deaths         int
	Active         int
	Lat            float32
	Long_          float32
	Last_Update    int
}

type Feature struct {
	Attributes *Attribute
}

type QueryResponse struct {
	Features []Feature
}

func Get() (queryResponse *QueryResponse, err error) {
	resp, err := http.Get(Endpoint)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	json.Unmarshal(body, &queryResponse)

	return queryResponse, nil
}
