

var elasticClient =  Client({
  node: 'https://localhost:9200',
  auth: {
    apiKey: 'RW9VLVdvc0IxZTlYcDk3S0dZRk86czFKRWdBTkZUQkdUOWJsU2hXNjRxUQ=='
  },
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  tls: { rejectUnauthorized: false }
  // tls: {
  //   ca: fs.readFileSync('./http_ca.crt'),
  //   rejectUnauthorized: true
  // }
});

elasticClient.info().then(function(response) {
  if (response) {
    console.log("Connected to Elastic Search");
  }
}).catch(function(error) {
  console.log("Unable to connect ElasticSearch", error);
});


var searchDocuments = function(req, res, next) {
  var query = req.query.query,
    from = req.query.from,
    size = req.query.size;

  try {
    elasticClient.search({
      index: 'search-etddocs',
      q: query,
      from: from,
      size: size,
      suggest: {
        gotsuggest: {
          text: query,
          term: { field: 'abstract' },
        },
      },
      highlight: {
        fields: {
          "*": {
            pre_tags: ['<em>'],
            post_tags: ['</em>'],
          }
        },
      },
    }).then(function(result) {
      console.log(query);
      res.send(result);
    }).catch(function(error) {
      console.log(JSON.stringify(error))
      return next(error.message);
    });
  } catch (error) {
    console.log(JSON.stringify(error))
    return next(error.message);
  }
};

var insertDocument = function(req, res, next) {
  var data = req.body;
  console.log(req.file);
  data.pdf = req.file.filename;

  elasticClient.index({
    index: 'search-etddocs',
    body: data,
  }).then(function() {
    return elasticClient.indices.refresh({ index: 'search-etddocs' });
  }).then(function() {
    res.send({ success: true, message: "data inserted successfully" });
  }).catch(function(error) {
    console.log(JSON.stringify(error))
    return next(error.message);
  });
};

module.exports = {
  searchDocuments: searchDocuments,
  insertDocument: insertDocument,
};
