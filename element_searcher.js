(function () {   // namespace protection

  //============================================================================
  var selector = {};
  
  selector["google_search"]   = "a#pnnext";
  selector["arstechnica"]     = "span.next";
  selector["pcmag"]           = "a.next-btn";
  selector["blogspot"]        = "a.blog-pager-older-link";
  selector["wordpress"]       = "div.navigation a";
  selector["digitaltrends"]   = "a.next"; // also: ebay search
  selector["tumblr"]          = "ul.pagination li.older a";
  selector["wordpress_1"]     = "div.wp-pagenavi a:last-of-type"; // like: http://www.webappers.com/
  selector["php_bb"]          = "form#viewtopic a.left";
  selector["yahoo_search"]    = "a#pg-next";
  selector["gawker_net_more"] = "span.js_show-more-stories";
  selector["amazon_search"]   = "a#pagnNextLink";
  selector["flavorwire"]      = "a.next-page-link";
  selector["reuters_more"]    = "div#moreHeadlinesButtonSmall";
  selector["reuters_next"]    = "a.pageNext";
  selector["bing_search"]     = "a.sb_pagN";
  selector["youtube_search"]  = "a[data-link-type~=next]";
  selector["youtube_plylist"] = "a[title~=Next]";
  selector["aliexpress"]      = "a.page-next";
  selector["ars_older"]       = "div.older > a";
  selector["rhn_docs"]        = ".next > a";
  selector["tldp"]            = "a[accesskey=N]";
  selector["drdobbs"]         = "div.nav1 > center> a:nth-last-child(1)";
 // selector["mail_archives"]   = "tbody > tr > td[align=right] > a";
  selector["instagram_blog"]  = "li.paging-older > a";
  selector["scnsrc_me"]       = "a.nextpostslink";
  selector["rlslog_net"]      = "div#content > p a:nth-last-child(1)";
  selector["rlsdd_com"]       = "div.nav-previous > a";
  selector["django"]          = "div.browse-horizontal > div.right > a";
  selector["piratebay"]       = "a > img[alt=Next]";
  selector["imdb_search"]     = "div.leftright > div#right > span.pagination > a:nth-last-child(1)";
  selector["dabapps"]         = "a.btn > i.icon-arrow-right";
  selector["gcs"]             = "div.gsc-cursor-current-page ~ div";
  selector["yandex"]          = "a.b-pager__next";
  selector["geektime"]        = "div.next-page > a";
  
  // keep these always last
  // in some sites these move to the next article, and the
  // more specific above move to next page (if exists)
  selector["html_rel_a"]      = "body a[rel~=next]";
  selector["html_rel_link"]   = "body link[rel~=next]"; // really? link inside body?
  selector["html_rel_area"]   = "body area[rel~=next]";

  //============================================================================
  
  var next = {};
  
  //============================================================================
 
  function search_next_special() {
    // check for next link in head element
    var head_next_link = document.querySelector("head link[rel~=next]");
    if ((head_next_link !== null) &&
        (head_next_link.href !== undefined)) {
      next = {type: 'url', url: head_next_link.href};
      return true;
    }
    return false;
  }
  
  //============================================================================
  
  function check_click_element(element, query_string) {
    if (element.click === null)
      return true;
      
    next = {type: 'query', query: query_string};
    return true;
  }

  //============================================================================
 
  function check_href_element(element) {
    if (element.href === undefined)
      return false;
      
    // check that the url doesn't point to the current page
    if (element.href === window.location.toString())
      return false;
      
    next = {type: 'url', url: element.href};
    return true;
      
  }

  //============================================================================

  function search_next() {
    
    if (search_next_special()) {
      return true;
    }

    for (site in selector) {
      if (selector.hasOwnProperty(site)) {
        var query_string = selector[site];
        var element = document.querySelector(query_string);
        if (element !== null) {
          if ((check_href_element(element)) ||
              (check_click_element(element, query_string))) {
            return true;
          }
        }
      }
    }
    
    return false;
    
    /*
    if (found) {
      console.log("registering keypress");
      document.querySelector("body").addEventListener("keypress", function(event) {
        if((e.keyCode == 39) && e.ctrlKey) {
          console.log("got a keypress");
          element.click();
        }
      }, true);
    }
    */
  }
  
  //============================================================================
    
  // register for changes in DOM
  function register_for_changes() {
    var target = document.querySelector("body");
    
    var observer = new MutationObserver(function(mutations) {
      // we don't care which mutation happened, if something changed, just look
      // for the next button again
      if (search_next())
        register_for_execution();
    });
    
    var config = { childList: true, subtree: true };
    
    observer.observe(target, config);
  }

  //============================================================================

  // register for message from background about execution
  function register_for_execution() {
    // register for notification from background script
    chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
      console.log("got message " + JSON.stringify(message));
      if (next.type === "url") {
        console.log("moving to url " + next.url);
        window.location = next.url;
      } else if (next.type === "query") {
        element = document.querySelector(next.query);
        if ((element !== undefined) && (element.click !== undefined)) {
          console.log("found clickable element, clicking...");
          element.click();
        }
      }
    });
    // notify background script that it can show the "next" button
    chrome.runtime.sendMessage(true);
  }

  //============================================================================

  register_for_changes();
  if (search_next())
    register_for_execution();

})();  // namespace protection end
