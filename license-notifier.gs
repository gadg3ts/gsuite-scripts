// https://stackoverflow.com/questions/29961154/google-api-for-getting-maximum-number-of-licenses-in-a-google-apps-domain
// 2019-02-25 smeacher
// If you're already using GAM, then it might help to run this under the same account, as that user will then 
// already have all the required permissions and API access...
// this works for the Gsuite Business SKU, if you're using another, you may want to change the accounts: parameters
 
function getNumberOfLicenses() {
  var tryDate = new Date();
  // var dateString = tryDate.getFullYear().toString() + "-" + (tryDate.getMonth() + 1).toString() + "-" + tryDate.getDate().toString();
  // var dateString = tryDate.getFullYear().toString() + "-" + tryDate.getMonth().toString() + "-" + tryDate.getDate().toString();
   //var dateYear = tryDate.getFullYear().toString();
   //var dateMonth = (tryDate.getMonth() +1 ).toString() ;
   //var dateDay = tryDate.getDate().toString();
   var daysBefore = 2;
   var dateBefore =  new Date(tryDate - (daysBefore*(24*3600*1000)));
   var dateString = Utilities.formatDate(dateBefore, "GMT", "yyyy-MM-dd");
   // the number below is the number of free licenses below which you want an alert.
   var alertLimit = 45;
 
   
   // var dateString = dateYear + "-" + dateMonth + "-" + dateDay ;
   // var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
 
  while (true) {
    try {
      var response = AdminReports.CustomerUsageReports.get(dateString,{parameters : "accounts:gsuite_unlimited_total_licenses,accounts:gsuite_unlimited_used_licenses"});
      break;
    } catch(e) {
      Logger.log(e.warnings.toString());
      tryDate.setDate(tryDate.getDate()-1);
      dateString = tryDate.getFullYear().toString() + "-" + (tryDate.getMonth() + 1).toString() + "-" + tryDate.getDate().toString();
      continue;
    }
  };
  var totalLicenseCount = response.usageReports[0].parameters[0].intValue;
  var usedLicenseCount = response.usageReports[0].parameters[1].intValue;
  var availLicenseCount = totalLicenseCount - usedLicenseCount ;
  //Logger.log("Year:" + dateYear);
  //Logger.log("Month:" + dateMonth);
  //Logger.log("Day:" + dateDay);
  Logger.log("Date:" + dateString.toString());
  //Logger.log("MyDate:" + dateStringMe.toString());
  Logger.log("Total licenses:" + totalLicenseCount.toString());
  Logger.log("Used licenses:" + usedLicenseCount.toString());
  Logger.log("Available licenses:" + availLicenseCount.toString());
  if ( availLicenseCount < alertLimit ) {
    Logger.log("Available GSuite licenses is " + availLicenseCount) ;
    MailApp.sendEmail({
    to: "myemail@example.com",
      cc: "otherimportantperson@example.com",
      subject: "WARNING: GSuite has " + availLicenseCount + " remaining licenses",
    htmlBody: "We need to order more Gsuite licenses as we are down to " + availLicenseCount + " spare<br>" +
              "We currently have a total of " + totalLicenseCount + " as of " + dateString + "<br>" +
              "This message will disappear once the new licenses are applied"
    
  });
    Logger.log("Email sent");
               };
  return availLicenseCount;
}
