var jiraTab;
var btnHelp = false;
var btnList = {};
var popWindow;
var reqs;


(function() {
  var hs_tracking = document.createElement('script');
  hs_tracking.type = 'text/javascript';
  hs_tracking.id = 'hs-script-loader';
  hs_tracking.async = true;
  hs_tracking.src = '//js.hs-scripts.com/6325919.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(hs_tracking, s);
})();
var _hsq = window._hsq = window._hsq || [];
_hsq.push(['setContentType', 'EXTENSION_LOADED']);


//var url = "https://f.hubspotusercontent10.net/hubfs/6325919/requirements.json";
var url = "https://edsil.github.io/JExtension/requirements.json";
//const proxyurl = "https://cors-anywhere.herokuapp.com/";
//fetch(proxyurl + url)
fetch(url)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
        response.status);
        return;
      }
      response.json().then(function(data){
        reqs = data;
        //console.log("Successfully load data");
      });
    }
  )
  .catch(() => console.log("Cant access " + url + " response. Blocked by browser?"));

//console.log("Adding click listener");
document.documentElement.addEventListener('click', clickedAnywhere);

function clickedAnywhere(){
  //console.log("clickedAnywhere");
  jiraTab = document.querySelector("div.ticket-editor a[data-tab-id='JIRA']");
  if (jiraTab){
    //console.log("Jira tab created");
    jiraTab.onClicked = clickJiraTab();
    document.documentElement.removeEventListener('click', clickedAnywhere);
  }
  else {
    //console.log("Jira tab not created yet");
  }
};

function clickJiraTab(){
  jiraTabOpen = true;
  //console.log("Jira tab open");
  //console.log(reqs);
  document.addEventListener('click',function(e){
      select = document.getElementById("jira-issue-help");
      if (select && !document.getElementById("jira-help")){
        btnHelp = document.createElement("BUTTON");
        btnHelp.id = "jira-help"
        btnHelp.innerHTML = "Jira Helper";
        popWindow = document.createElement("DIV");
        document.getElementById("jira-issue-help").appendChild(btnHelp);
        document.getElementById("jira-issue-help").appendChild(popWindow);
      }
   });
   document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'jira-help'){
          _hsq.push(['setContentType', 'EXTENSION_CLICKED']);
          renderPopup();
     }
   });
 }

function helpRequested(btnid){
  project = document.getElementById('jira-project');
  jiraIssue = document.getElementById('jira-issue');
  jiraIssue.value = "Project:"+project.innerText;
  if(btnList[btnid])
    jiraIssue.value="#jext (please don't remove this tag)\n"+btnList[btnid];
  jiraIssue.focus();
}

function renderPopup() {
  proj = document.getElementById('jira-project').innerText;
  var popup = popWindow;
  popup.innerHTML = '<link rel="stylesheet" href="popup.css">';
  if (reqs[proj]) {
    btnHelp.hidden = true;
    project = reqs[proj];
    for (issue in project) {
      title = document.createElement("p");
      title.innerHTML = issue;
      title.setAttribute("style", "font-size: 14; background-color: lightblue; color: #00f");
      title.setAttribute("font-weight", "bold");
      popup.appendChild(title);
      if (project[issue].description) {
        description=document.createElement("p");
        description.innerHTML = project[issue].description;
        popup.appendChild(description);
      }
      if (project[issue].resources) {
        resourcestitle = document.createElement("p");
        resourcestitle.innerHTML = "Resources";
        resourcestitle.setAttribute("style", "font-size: 14");
        resourcestitle.setAttribute("style", "color: #aaa");
        popup.appendChild(resourcestitle);
        resources=document.createElement("p");
        resources.innerHTML = "<ul>";
        for (resource in project[issue].resources){
          resources.innerHTML = resources.innerHTML + "<li><a href=\"" + project[issue].resources[resource] + "\" target=\"_blank\">" + resource + "</a></li>";
          resources.setAttribute("style", "font-size: 12")
        };
        resources.innerHTML += "<ul>";
        popup.appendChild(resources);
      }
      if (project[issue].steps) {
        stepstitle = document.createElement("p");
        stepstitle.innerHTML = "Additional Info";
        stepstitle.setAttribute("style", "font-size: 14");
        stepstitle.setAttribute("style", "color: #aaa");
        popup.appendChild(stepstitle);
        steps=document.createElement("p");
        steps.setAttribute("style", "font-size: 12");
        steps.innerText = project[issue].steps;
        popup.appendChild(steps);
        stepsbtn = document.createElement("BUTTON");
        stepsbtn.id = issue.substring(0,5);
        stepsbtn.innerHTML = "Copy Steps";
        popup.appendChild(stepsbtn);
        btnList[issue.substring(0,5)] = project[issue].steps;
        dismissbtn = document.createElement("BUTTON");
        dismissbtn.id = "dismisshelper";
        dismissbtn.innerHTML = "Close";
        popup.appendChild(dismissbtn);
      }
      if (project[issue].notes) {
        notes=document.createElement("p");
        notes.innerHTML = "<br><b>Notes:</b><br>"+project[issue].notes;
        popup.appendChild(notes);
      }
      blankline = document.createElement("p");
      blankline.innerHTML="<br>";
      popup.appendChild(blankline);
    }
  }
  else {
    jiraIssue = document.getElementById('jira-issue');
    jiraIssue.value = "Project: "+proj+" (no help available)";
  }
  document.addEventListener('click',btnClicked);
  popup.classList.toggle("show");
}


function btnClicked(e){
   if(e.target && btnList[e.target.id]){
     helpRequested(e.target.id);
     document.removeEventListener('click',btnClicked);
     popWindow.innerHTML = "";
     btnHelp.hidden = false;
   }
   if(e.target && e.target.id=="dismisshelper"){
     popWindow.innerHTML = "";
     btnHelp.hidden = false;
   }

}
