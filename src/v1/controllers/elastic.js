const { Client } = require('@elastic/elasticsearch');
const { csv } = require('csvtojson')
const { axios } = require('axios')
const { querystring } = require('querystring');


const ETD_FILE_PATH = "";

var elasticClient = new Client({
  node: 'https://localhost:9200',
  auth: {
    apiKey: 'dGU2TDQ0c0JHT3VOV1ozTDFlbmI6dUlfdmFYMnBUS0tZNnZ3ZkNtU3BCQQ=='
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

elasticClient.info().then(function (response) {
  if (response) {
    console.log("Connected to Elastic Search");
  }
}).catch(function (error) {
  console.log("Unable to connect ElasticSearch", error);
});


var searchDocuments = function (req, res, next) {
  var query = req.query.query,
    from = req.query.from,
    size = req.query.size;

  console.log(query)

  try {
    elasticClient.search({
      index: 'search-etddocs',
      body: {
        query: {
          fuzzy: {
            "text": {
              value: query,
              fuzziness: "AUTO",
            },
          },
        },
      },
      from: from,
      size: size,
      highlight: {
        fields: {
          "*": {
            pre_tags: ['<em>'],
            post_tags: ['</em>'],
          }
        },
      },
    }).then(function (result) {
      console.log(query);
      res.send(result);
    }).catch(function (error) {
      console.log(JSON.stringify(error))
      return next(error.message);
    });
  } catch (error) {
    console.log(JSON.stringify(error))
    return next(error.message);
  }
};

var insertDocument = function (req, res, next) {
  var data = req.body;
  console.log(req.file);
  data.pdf = req.file.filename;

  elasticClient.index({
    index: 'search-etddocs',
    body: data,
  }).then(function () {
    return elasticClient.indices.refresh({ index: 'search-etddocs' });
  }).then(function () {
    res.send({ success: true, message: "data inserted successfully" });
  }).catch(function (error) {
    console.log(JSON.stringify(error))
    return next(error.message);
  });
};

const insertDocuments = async (req, res, next) => {
  const data = await prepareMetaData();

  await elasticClient.helpers.bulk({
    datasource: dataset,
    pipeline: "ent-search-generic-ingestion",
    onDocument: (doc) => ({ index: { _index: 'search-etddocs' } }),
  }).then(res => res.status(200).send({message:'Success'})).catch(e => console.log(e))
}

const prepareMetaData = async (req, res, next) => {
  const abstractData = await csv().fromFile("C:\\Users\\mulla\\OneDrive\\Documents\\abstract_output_final.csv");
  const metaDataRes = await csv().fromFile("C:\\Users\\mulla\\OneDrive\\Documents\\metadata.csv");
  let regex = new RegExp(/^['"\[]|['"\]]$/g);

  // Apply the regex to the 'text' field of each object in the array
  let modifiedArray = [];
  for (const item of abstractData) {
    let metaData = metaDataRes.find(data => data.etd_file_id === item.etd_file_id);

    const url = "http://www.wikifier.org/annotate-article";
    const data = querystring.stringify({
      "text": item.text,
      "lang": "en",
      "userKey": "nqctkfuqpgngdsvlxcgistsvfjbnai",
      "pageRankSqThreshold": "0.8",
      "applyPageRankSqThreshold": "true",
      "nTopDfValuesToIgnore": "200",
      "nWordsToIgnoreFromList": "200",
      "wikiDataClasses": "false",
      "wikiDataClassIds": "false",
      "support": "false",
      "ranges": "false",
      "minLinkFrequency": "2",
      "includeCosines": "false",
      "maxMentionEntropy": "3"
    });

    let wikifierTerms = null;

    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const jsonResponse = response.data;
      let wikifierTermsArray = [];
      for (const annotation of jsonResponse.annotations) {
        wikifierTerms.push({ term: annotation.title, url: annotation.url })
      }
      wikifierTerms = wikifierTermsArray;
    } catch (error) {
      console.error("An error occurred:", error);
    }

    modifiedArray.push({
      etdid: item.etd_file_id,
      author: metaData.author,
      year: metaData.year,
      university: metaData.university,
      program: metaData.program,
      degree: metaData.degree,
      advisor: metaData.advisor,
      abstract: item.text.replace(regex, ''),
      pdf: `${item.etd_file_id}.pdf`,
      wikifier_terms: wikifierTerms
    });
  };

  return modifiedArray;
}

module.exports = {
  searchDocuments: searchDocuments,
  insertDocument: insertDocument,
  prepareMetaData: prepareMetaData,
};