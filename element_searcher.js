(function () {

  var selector = {};
  
  selector["google_search"]   = "#pnnext";
  selector["arstechnica"]     = "span.next";
  selector["pcmag"]           = "a.next-btn";
  selector["blogspot"]        = "a.blog-pager-older-link";
  selector["wordpress"]       = "div.navigation a";
  selector["digitaltrends"]   = "a.next"; // also: ebay search
  selector["tumblr"]          = "ul.pagination li.older a";
  selector["wordpress_1"]     = "div.wp-pagenavi a:last-of-type"; // like: http://www.webappers.com/
  selector["php_bb"]          = "a.left";
  selector["yahoo_search"]    = "a#pg-next";
  selector["gawker_net_more"] = "span.js_show-more-stories";
  selector["amazon_search"]   = "a#pagnNextLink";
  selector["flavorwire"]      = "a.next-page-link";
  selector["reuters_more"]    = "div#moreHeadlinesButtonSmall";
  selector["reuters_next"]    = "a.pageNext";
  selector["bing_search"]     = "a.sb_pagN";
  selector["youtube_search"]  = "a[data-link-type~=next]";
  selector["youtube_plylist"] = "a[title~=Next]";

  
  // keep these always last
  // in some sites these move to the next article, and the
  // more specific above move to next page (if exists)
  selector["html_rel_a"]      = "a[rel~=next]";
  selector["html_rel_link"]   = "link[rel~=next]";
  selector["html_rel_area"]   = "area[rel~=next]";
  
  var found = false;
  
  for (site in selector) {
    if (selector.hasOwnProperty(site)) {
      var query = selector[site];
      if (document.querySelector(query) !== null) {
        found = true;
        chrome.runtime.sendMessage(query);
        break;
      }
    }
  }
  
  if (!found)
    chrome.runtime.sendMessage("none");
  
})();