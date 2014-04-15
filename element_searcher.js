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
  selector["crn"]             = "li.pager-next > a";
  selector["theverge"]        = "li.next > a";
  
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

    for (var site in selector) {
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

  function handle_prev_request(event, combi) {
    history.back();
  }

  //============================================================================

  function handle_next_request(event, combi) {
    if (next.type === "url") {
      console.log("moving to url " + next.url);
      window.location = next.url;
    } else if (next.type === "query") {
      var element = document.querySelector(next.query);
      if ((element !== undefined) && (element.click !== undefined)) {
        console.log("found clickable element, clicking...");
        element.click();
      }
    }
  }

  //============================================================================

  function register_keyboard_shortcuts() {
    Mousetrap.bind('mod+right', handle_next_request);
    Mousetrap.bind('mod+left', handle_prev_request);
  }

  //============================================================================

  // register for message from background about execution
  function register_for_execution() {
    // register keyboard shortcuts
    register_keyboard_shortcuts();
    // register for notification from background script (icon click)
    chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
      console.log("got message " + JSON.stringify(message));
      handle_next_request(undefined);
    });
    // notify background script that it can show the "next" button
    chrome.runtime.sendMessage(true);
  }

  //============================================================================
  
  var contextElement = null;
  
  function getPathTo(element) {
    if (element.id!=='')
      return 'id("'+element.id+'")';
    if (element===document.body)
      return element.tagName;
    
    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
      var sibling= siblings[i];
      if (sibling===element)
        return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
      if (sibling.nodeType===1 && sibling.tagName===element.tagName)
        ix++;
    }
  }
  
  function getElementByXpath(path) {
    return document.evaluate(path, document, null, 
      XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  
  document.addEventListener("contextmenu", function(event) {
    contextElement = event.target;
    contextElement.style.backgroundColor = "#FDFF47";
    console.log(getPathTo(contextElement));
  });
  
  //============================================================================

  register_for_changes();
  if (search_next())
    register_for_execution();

})();  // namespace protection end
