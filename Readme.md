# nextpage-chrome

Google webstore link: https://chrome.google.com/webstore/detail/quicken/bcnfaiaknkbbcmpeedkjjjcdmjlgbafo

## Tagline: Quicken - Surf faster than your mouse can handle

A Google Chrome extension giving quick access to the 'next page' button in 
various sites.

You can use a keyboard shortcut - Ctrl+Right (right arrow).

## Supported Sites
* Google search (www.google.com)
* Ars Technica (www.arstechnica.com)
* blogspot
* wordpress
* tumblr
* and many more ...

## Install
Install the extension using 'Developer mode' in the extensions page.
After enabling the 'Developer mode', select 'Load unpacked extension...' and 
select the directory where you've saved the files.

# TODO
* add support for: 
* move spinner in sites?
* add page transition animation
* add xpath support for other sites i can't support today

# Bugs
* Shortcut keys not working
* Youtube search not working - they switched to using inner navigation method without changing the page so we don't scan it as we should.(try MutationObserver?)
* Not working in general on first time or after some time when the tab is open
