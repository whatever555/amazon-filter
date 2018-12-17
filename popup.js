$(document).ready(function(){
    $('.togglebutton').on('click', function(){
        $('.togglebutton').removeClass('selected');
        if($(this).attr('data-toggle')=='on')
        {
            chrome.storage.sync.set({"disabled": false}, function() {
                $('.onbutton').addClass('selected');
                    chrome.browserAction.setIcon({'path': 'icon128.png'});
            });
        }
        else if($(this).attr('data-toggle')=='off')
        {
            chrome.storage.sync.set({"disabled": true}, function() {
                $('.offbutton').addClass('selected');
                    chrome.browserAction.setIcon({'path': 'inactive.png'});
            });
        }
    })

    chrome.storage.sync.get('disabled', function(itemz) {
        disabled = itemz.disabled;
        if (disabled==null || disabled == false) {
            $('.onbutton').addClass('selected');
        }else if (disabled==true){
            $('.offbutton').addClass('selected');
        }else{
            chrome.storage.sync.set({"disabled": false}, function() {
                $('.onbutton').addClass('selected');
            });
        }
    });
})
