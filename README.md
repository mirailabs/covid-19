# COVID-19 Tracker

![CI](https://github.com/mirailabs/covid-19/workflows/CI/badge.svg)

Automated tracker and API for COVID-19.

## API

https://mirailabs-covid-19.herokuapp.com/cases/

### `GET /cases`

Get all current COVID-19 cases.

```
$ curl https://mirailabs-covid-19.herokuapp.com/cases/ | jq
{
  "total_confirmed": 156241,
  "total_recovered": 73966,
  "total_dead": 5833,
  "regions": [
    {
      "province": "",
      "country": "Finland",
      "confirmed": 225,
      "recovered": 1,
      "dead": 0,
      "latitude": 61.9241,
      "longitude": 25.7482,
      "last_update": 1584225183000
    },
    {
      "province": "Saint Barthelemy",
      "country": "France",
      "confirmed": 1,
      "recovered": 0,
      "dead": 0,
      "latitude": 17.9,
      "longitude": -62.8333,
      "last_update": 1584203583000
    },
    [...]
    {
      "province": "Mississippi",
      "country": "US",
      "confirmed": 6,
      "recovered": 0,
      "dead": 0,
      "latitude": 32.741646,
      "longitude": -89.678696,
      "last_update": 1584204783000
    },
    [...]
}
```

## Data

This repository continuously archives case data under [/data/db](https://github.com/mirailabs/covid-19/tree/master/data/db).

### Sources

* [John Hopkins CSSE](https://github.com/CSSEGISandData/COVID-19)
* [New York State Department of Health](https://health.ny.gov/diseases/communicable/coronavirus/)
* [Virginia State Department of Health](http://www.vdh.virginia.gov/surveillance-and-investigation/novel-coronavirus/)

