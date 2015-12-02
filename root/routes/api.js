var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

EMPLOYEES_FILE = path.join(__dirname, '../', 'employee.json')
router.get('/employees', function(req, res) {
 fs.readFile(EMPLOYEES_FILE, function(err, data) {
   if (err) {
     console.error(err);
     process.exit(1);
   }
   res.setHeader('Cache-Control', 'no-cache');
   res.json(JSON.parse(data));
 });
});

// router.post('/employees', function(req, res) {
//   console.log(req)
//  fs.readFile(EMPLOYEES_FILE, function(err, data) {
//    if (err) {
//      console.error(err);
//      process.exit(1);
//    }
//    var employees = JSON.parse(data);
//    // NOTE: In a real implementation, we would likely rely on a database or
//    // some other approach (e.g. UUIDs) to ensure a globally unique id.

//    fs.writeFile(EMPLOYEES_FILE, JSON.stringify(employees_details, null, 4), function(err) {
//      if (err) {
//        console.error(err);
//        process.exit(1);
//      }
//      res.setHeader('Cache-Control', 'no-cache');
//      res.json(employees_details);
//    });
//  });
// });

module.exports = router;