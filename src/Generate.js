module.exports = function(){
    var faker = require("faker");
    var _ = require("lodash");
    return {
        Employees:_.times(15, function (n){
            return {
                "EmpId":n,
                "EmpTagNumber": faker.random.alphaNumeric,
                "FirstName": faker.name.findName(),
                "LastName":faker.LastName,
                "EmailAdress": faker.internet.email,
                "Department": faker.commerce.department,
                "Birthdate": "14-05-1995",
                "Designation": "Software Developer"
            }
        })
    }
}