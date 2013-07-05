// Mobile AJAX routine, based on AjaMyAjax.com core js library
var $ = function(url, container) {
  // two arguments: your file and the div or span tag
  var myAjax = new simpleMobileAjax();
  myAjax.ajaxRequest(url, container);
  myAjax = null;
};

var simpleMobileAjax = function() {
  // main ajaxRequest, processResponse, getXmlNodeText only
  this.ajaxRequest = function(url, container) {
    var xhrRequest = null;

    if (window.XMLHttpRequest) {
      xhrRequest = new XMLHttpRequest();
    }

    xhrRequest.open('GET', url);

    if (window.XMLHttpRequest) {
      xhrRequest.source = this;
      xhrRequest.onreadystatechange = function() {
        xhrRequest.source.processResponse(xhrRequest, url, container); };
    }

    if (xhrRequest) {
      xhrRequest.send(null);
    }
  }

  this.processResponse = function(xhrResp, url, container) {
    if (!xhrResp || xhrResp.readyState < 4) {
      return;
    }
    if (xhrResp.readyState == 4) {
      if (xhrResp.status == 200) {
        if (url && container) {
          url = url.toLowerCase();

          try {
            if (url.indexOf('.xml') == -1) {
              // display results as-is
              document.getElementById(container).innerHTML =
                xhrResp.responseText;
            }
            else {
              var xmlDoc = xhrResp.responseXML;
              var allnodes = xmlDoc.getElementsByTagName('*').item(0);

              // for xml, do simple node text display
              var nodetext = this.getXmlNodeText(allnodes);

              if (!window.XMLHttpRequest) {
                // note: no \r\n between some browser node values, only a space.
                // if your xml is simple enough, this replace might work...
                // (if not, AjaMobileAjax has a complete parent/child/cdata
                //  XML node parsing routine)
                nodetext = nodetext.replace(/\s/g, '<br\>');
              }
              else {
                // Mozilla etc support this
                nodetext = nodetext.replace(/\r|\n|\r\n/g, '<br\>');
              }

              document.getElementById(container).innerHTML = nodetext;

              // clean up after:
              xmlDoc = null;
              allnodes = null;
              nodetext = null;
            }
          }
          catch (e) {
            alert('Mobile Ajax.js error with ' + url + '\r\n' +
                  'check url and container ' + container);
          }
        }
        else {
          alert('Mobile Ajax.js error: required parameters are missing');
        }
      }
      else {
        alert('Mobile Ajax.js error with ' + url);
      }
    }
  }

  this.getXmlNodeText = function(xmlnode) {
    try {
      // Mozilla, etc.
      if (xmlnode.textContent) {
        return xmlnode.textContent;
      }
      else {
        return xmlnode.text;
      }
    }
    catch (e) {
      alert(e.description);
      return null;
    }
  }
};
// eop
