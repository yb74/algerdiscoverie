function onClickBtnLike(event) {
    event.preventDefault();

    const url = this.href; // here, "this" refers to the like button link "a"
    const spanCount = this.querySelector('span.js-likes');
    const icon = this.querySelector('i');

    axios.get(url).then(function(response) {
        spanCount.textContent = response.data.likes;

        if(icon.classList.contains('fas')) {
            icon.classList.replace('fas', 'far');
        } else {
            icon.classList.replace('far', 'fas');
        }
    }).catch(function(error) {
        if(error.response.status === 403) {
            window.alert("You can't like an article if you're not logged in !")
        } else {
            window.alert("An error has occurred, please, try again later !") // error 404 (wrong url
        }
    });
}

document.querySelectorAll('a.js-like').forEach(function(link) {
    link.addEventListener('click', onClickBtnLike);
})