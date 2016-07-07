var Yelp = require('./../config/yelp');
var BusinessInfoController = require('./BusinessInfoController.js');
var unique = require('./../lib/utils').unique;

// var PreferenceController = require('./../controller/PreferenceController.js');

/* assume coming from rec
  { 
    response: [{
      cuisine: "cafes",
      id: "unlessstring",
      name: "The Beat Coffeehouse & Records",
      rating: 0.20202,
      userRated: false
    },
    {
      cuisine: "french",
      id: "unlessstring",
      name: "Sunrise Coffee",
      rating: 0.20202,
      userRated: false
    }]
  }       
*/

var _checkifValid = function (yelpData, business_name) {
  if (yelpData.businesses.length > 0 && yelpData.businesses[0].name === business_name) {
    console.log('valid YELP');
    return true;
  } else {
    console.log('invalid YELP', yelpData, business_name);
    return false;
  }
};

var _isValidYelp = function (business_name) {
  return Yelp.search({term: business_name, location: 'Las Vegas', limit: 1})
    .then(function (yelpData) {
      if (_checkifValid(yelpData, business_name)) {
        return yelpData
      } else {
        return false;
      }
    })
    .catch(function (err) {
      console.error('Error: Cannot complete Yelp query with business_name = ', name);
    });
};

var _shouldSaveToDb = function (business_name, allValidYelp) {
  return _isValidYelp(business_name)
    .then(function (data) {
      if (data) {
        // console.log('valid YELP', data);
        // allValidYelp.push(business_name);
        return BusinessInfoController.checkBus(business_name)
          .then(function(found) {
            return [found, data];
          })
          .catch(function (err) {
            console.error('Error: Cannot match ', business_name, ' in BusinessInfo db');
          })
      } else {
        return [null, null];
      }
    })
    .catch(function (err) {
      console.error('Error: Cannot complete Yelp query with business_name = ', name);
    })
};

module.exports = {
  queryYelp: function(req, res) {
    var recs = req.body.response
    var recNames = [];
    var numberCompleted = 0;
    var validYelp = [];
    // var shouldSend = false;

    // console.log("RECS ===============>", req.body)
    for(var i = 0; i < recs.length; i++) {
      recNames.push(recs[i].name)
    }

    for (var yelpBusiness = 0; yelpBusiness < recNames.length; yelpBusiness++) {
      (function (business_name) {
        _shouldSaveToDb(business_name)
          .then(function (matchedBusiness) {
            // if(numberCompleted === recNames.length -1) {
            //   shouldSend = true
            // }
            // console.log('valid YELP => business', matchedBusiness[0]);
            // console.log('valid YELP => count', matchedBusiness[1]);
            // console.log('valid YELP => shouldSend', matchedBusiness[2]);

            if (matchedBusiness[0] === null && // not in db
                matchedBusiness[1] !== null) { // valid yelp and business
              // save
                console.log('valid YELP => saving to db', business_name);
                BusinessInfoController
                  ._addFromYelp(matchedBusiness[1])
                    // then call next
                    .then(function () {
                      numberCompleted++;
                      validYelp = validYelp.concat(matchedBusiness[1].businesses[0].name);
                      console.log('all my valid yelps =>', validYelp);
                      if (numberCompleted === recNames.length) {
                        res.status(201).send(unique(validYelp));
                      }
                    })

            } else { // invalid yelp or business
              // increment count
              numberCompleted++;

              if (matchedBusiness[1] !== null) {
                validYelp = validYelp.concat(matchedBusiness[1].businesses[0].name);
              }

              if (numberCompleted === recNames.length) {
                res.status(201).send(unique(validYelp));
              }
            }
          })
          .catch(function (err) {
            console.error('Error: In _shouldSaveToDb with ', business_name);
          })
      }) (recNames[yelpBusiness]);
    }

    // var _handleYelpSaveAndRes = function (all_business_names, validYelpBusinesses) {
    //   if (count === all_business_names.length) {
    //     return;
    //   }

    //   _shouldSaveToDb(all_business_names[count], validYelpBusinesses)
    //     .then(function (matchedBusiness) {
    //       if(count === recNames.length -1) {
    //         shouldSend = true
    //       }
    //       console.log('valid YELP => business', matchedBusiness);
    //       console.log('valid YELP => count', count);
    //       console.log('valid YELP => shouldSend', shouldSend);

    //       if (matchedBusiness[0] === null && 
    //           matchedBusiness[1] !== null) { // valid yelp and business
    //         // save
    //           console.log('valid YELP => saving to db');
    //           BusinessInfoController
    //             ._addFromYelp(matchedBusiness[1], 
    //                           shouldSend, 
    //                           matchedBusiness[2], 
    //                           res)
    //               // then call next
    //               .then(function () {
    //                 ++count;
    //                 validYelpBusinesses = validYelpBusinesses.concat(matchedBusiness[2]);
    //                 _shouldSaveToDb(all_business_names[count], validYelpBusinesses);
    //               })

    //       } else { // invalid yelp or business
    //         // send if shouldSend === true
    //         // if not call next
    //         if (shouldSend) {
    //           res.status(201).send(matchedBusiness[2]);
    //         } else {
    //           // not last loop
    //           ++count;
    //           _handleYelpSaveAndRes(all_business_names, validYelpBusinesses);
    //         }
    //       }
    //     })
    //     .catch(function (err) {
    //       console.error('Error: In _shouldSaveToDb with ', all_business_names[count]);
    //     })
    // }

    // _handleYelpSaveAndRes(recNames, []);
        
  }
};