window.onload = function () {
  document.onkeypress = keypress;
}

var column = 0;
var line = 0;



function keypress(e) {
  if (e.keyCode == 13) {
    // enter
    // find number of spaces
    var code = document.getElementById("codeDoc").innerHTML;
    var lines = code.split('\n');
    //alert('enter');
  }
  if (e.keyCode == 9) {
    // TAB
    if (e.preventDefault) {
      e.preventDefault();
    }
    printBeforeCursor("  ");
  }
  
  // update position
  // run text hilighter
  
  
  setTimeout("getCursorPos()",0);
}



function printBeforeCursor(text) {
  
}

/******************************** SANITY PARSE ********************************\
| This function goes through and parses the code doing all the important thigs |
| like code hilighing and deomination managing (\n vs <br> and &nbsp; vs " "   |
| as well as moving the cursor position when nessassary                        |
\******************************************************************************/
function backgroundFormat (){
  var savespot;
  var saveoffset;

  // Save the current cursor anchor position in node-offset form
  if (window.getSelection) {
    var sel = window.getSelection();
    savespot = sel.anchorNode;
    saveoffset = sel.anchorOffset;
  }



  // GET THE DOCUMENT IN QUESTION
  var nodes = codeChildren();
  var sampleNode = nodes[0];
  for (var i = 0; i < nodes.length; i++) {
    // If the object is not a text object do not search it
    if (nodes[i].toString() != "[object Text]") continue;
    
    // Split text objects on newlines seperated by a break
    while (nodes[i].nodeValue.indexOf("\n") != -1) {
      var tempv = nodes[i].nodeValue;
      var second = tempv.substring(tempv.indexOf("\n")+1,tempv.length);
      tempv = tempv.substring(0,tempv.indexOf("\n"));
      nodes[i].nodeValue = tempv;
      
      // create a new break element
      var newBR = document.createElement('br');
      // Create a new text node filled with the remainder of the text
      var newTXT = document.createTextNode(second);
      
      // set the new text element equal to the remainder of the string
      nodes[i].parentNode.appendChild(newBR);
      nodes[i].parentNode.appendChild(newTXT);
    }
    
    // Replace non-breaking spaces with spaces
    nodes[i].nodeValue = nodes[i].nodeValue.replace("&nbsp;"," ");
  }

  
  // Place the cursor once again
  if (window.getSelection) {
    var sel = window.getSelection();
    var range = document.createRange();
    
    range.setStart(savespot,saveoffset);
    range.collapse(true);
    
    sel.removeAllRanges();  
    sel.addRange(range);
    
  }
}
/******************************** CODECHILDREN ********************************\
| A simple function to return the children of the <pre> that contains the code |
\******************************************************************************/
function codeChildren () {
  return document.getElementById("codeDoc").childNodes;
}
/********************************** FOCUSCODE *********************************\
| A simple function to bring focus to the code block
\******************************************************************************/
function focusCode() {
  document.getElementById("codeDoc").focus();
}


function getFullString


/***************************** GET CURSOR POSITION ****************************\
| the cursor position (via column and line) are obtained and set to the line   |
| and collumn variables                                                        |
\******************************************************************************/
function getCursorPos() {
  backgroundFormat();
  var cursorPos;
  if (window.getSelection) {
    var selObj = window.getSelection();
    var selRange = selObj.getRangeAt(0);
    column = selObj.anchorOffset;
    line =  findNode(selObj.anchorNode.parentNode.childNodes, selObj.anchorNode) / 2 + 1;
    displayLineInfo();
  }
}

function findNode(list, node) {
  var retval = -1;
  var nodes = "";
  var lines = 0;
  for (var i = 0; i < list.length; i++) {
    
    //alert(list[i].toString());
    
    var nodename = list[i].toString();
    nodes += nodename;
    if (nodename == "[object Text]") {
      nodename = list[i].nodeValue;
      if (i == 2) {
        //list[i].style.color="#FF0000";
      }
      //nodename= "<br />" + showchildren(list[i],2);
    }
    else if (nodename == "[object HTMLPreElement]") {
      nodename= "<br />" + showchildren(list[i],2);
    }
    else {
      nodename = "";
    }
    if (list[i] == node) {
      retval = i;
      nodes+="*";
    }
    nodes += nodename;
    nodes += '<br />';
  }
  document.getElementById("extrainfo").innerHTML = nodes;
  return retval;
}

function showchildren (parent, indent) {
  var list = parent.childNodes;
  var output = "";
  for (var i = 0; i < list.length; i++) {
    for (var j = 0; j < indent; j++) {
      output += "&nbsp;";
    }
    output+=list[i].toString();
    if (column == i) {
      output+="*";
    }
    output+="<br />";
  }
  return output;
}



