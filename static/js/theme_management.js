
function searchFilter(){
    input = document.getElementById("search-input").value.toUpperCase();
    themes = document.getElementsByClassName("theme-box");

    for (i = 0; i < themes.length; i++) {
        themes_name = themes[i].getElementsByClassName("theme-name")[0].innerHTML;
        if (themes_name.toUpperCase().indexOf(input) > -1) {
            themes[i].style.display = "";
        } else {
            themes[i].style.display = "none";
        }
    }
}

function clearFilter() {
    input = document.getElementById("search-input").value.toUpperCase();
    if (input.length === 0) {
        themes = document.getElementsByClassName("theme-box");
        for (i = 0; i < themes.length; i++) {
            themes[i].style.display = "";
        }
    }
}

document.querySelector('#search-input').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      // code for enter
      searchFilter();
    }
});
