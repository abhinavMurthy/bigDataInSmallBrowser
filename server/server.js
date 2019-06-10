const express = require('express')
const app = express()
const fs = require('fs');
var path = require('path');

const port = 3100;
/**
 * Mongo Database Connection
 */
var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if (err) throw err

  var db = client.db('bank_example')

  app.get('/transactions', (request, response) => {
    var startRow = parseInt(request.param('startRow'));
    var endRow = parseInt(request.param('endRow'));
    var columnName = request.param('sortColumnName');
    var sortOrder = request.param('sortOrder');
    var filterModel = JSON.parse(request.param('filterModel'));
    
    // console.log("filterModel inside server js", filterModel);

    const sortType = sortOrder === 'desc' ? -1 : 1;

    const sortObject = { [columnName]: sortType};

    /**
     * Database query
     */
    db.collection('transactions')
      .find({})
      .sort(sortObject)
      .skip(startRow)
      .limit(endRow)
      .toArray(function(err, result) {

      const length = db.collection('transactions').count();
      var lastRow = length <= endRow ? length : -1;
      return response.send({
        success: true,
        rows: result,
        lastRow: lastRow
      });
    })
  });

  app.use('/', express.static(path.join(__dirname, '../dist/my-workspace')));
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
