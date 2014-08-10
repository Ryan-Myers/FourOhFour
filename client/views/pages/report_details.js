Template.reportDetails.pageErrors = function () {
  return this.fetch();
};

Template.reportDetails.siteName = function () {
  return this.fetch()[0].siteName;
};

Template.reportDetails.page = function () {
  return this.fetch()[0].page;
};