document.addEventListener('DOMContentLoaded', function () {
    
    var successfull = document.querySelector('.success')
    if (successfull.innerHTML !== '') {
        setTimeout(function () {
            successfull.innerHTML = '';
        }, 3000);

    }
});