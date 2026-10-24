// Old URLs were /services.html#websites, #webapps and #ai. Servers never see the
// part after #, so the 301 lands here and this forwards to the right page.
(function () {
  var map = { '#websites': '/services/websites', '#webapps': '/services/web-apps', '#ai': '/services/ai-automation' };
  var to = map[location.hash];
  if (to) location.replace(to);
})();
