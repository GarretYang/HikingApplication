function search(){
    alert("search");
    input = document.getElementById("search-input").value.toUpperCase();
    reports = document.getElementsByClassName("report-box");

    for (i = 0; i < reports.length; i++) {
        reports_name = reports[i].getElementsByClassName("report-description")[0].innerHTML;
        if (reports_name.toUpperCase().indexOf(input) > -1) {
            reports[i].style.display = "";
        } else {
            reports[i].style.display = "none";
        }
    }
}


document.querySelector('#search-input').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      search();
    }
});
