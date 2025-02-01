# Importing files in mongoDB through command line

### Follow the steps-

1. Copy the path of your file (file in json format)
2. Enter the following command

``` bash
$ mongoimport "file path\file name" -d database_name -c collection_name --jsonArray
```

###### <i>or</i>

``` bash
$ mongoimport "file path\file name" --db database_name --collection collection_name --jsonArray
```

###### for example:

``` bash
$ mongoimport "C:\Test Name\Test test\Downloads\testing.json" -d arti -c users --jsonArray
```


