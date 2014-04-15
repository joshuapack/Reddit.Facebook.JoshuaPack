// ==UserScript==
// @name       Reddit Facebook Plugin
// @namespace  http://www.joshuapack.com/reddit.facebook.joshuapack.user.js
// @version    0.1
// @description  Puts reddit in Facebook
// @include      http*://*.facebook.com/?*
// @include      http*://*.facebook.com/
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @copyright  2014+, Joshua Pack
// ==/UserScript==

var redditURL = "http://www.reddit.com/r/all/"; // must have trailing forward slash /

// Don't change anything after this
var numberOfDoms = 0;
var numberOfPosts = 0;
var numberOfReadPosts = 0;
var finishedRedditLoad = false;
var redditFeed = new Array();

$(document).ready(function(){
	GM_xmlhttpRequest({
			method:"GET",
			url: redditURL+".rss",
			data: "",
			headers:{
				"User-Agent":"monkeyagent",
				"Accept":"text/monkey,text/xml",
				"Content-Type": "application/x-www-form-urlencoded"
			},
				onload:function(details) {
                    if (details.readyState == 4) {
                        
                        xmlDoc = $.parseXML( details.responseText );
                        $xml = $( xmlDoc );
                        $xml.find("item").each(function(){
                            redditFeed[numberOfPosts] = "<a href='"+redditURL+"' target='_blank' style='text-indent: -9999px;background-image: url(http://www.redditstatic.com/sprite-reddit.c-jYCiurVNk.png);background-position: 0px -313px;background-repeat: no-repeat;height: 40px;width: 120px;display: block;vertical-align: bottom;margin-bottom: 3px;'>";
                            console.log($(this).find('media\\:thumbnail').attr('url'));
                            if ($(this).find('media\\:thumbnail').length > 0) {
                                redditFeed[numberOfPosts] += "<br/><img src=\""+$(this).find('media\\:thumbnail').attr("url")+"\" style=\"max-width:450px;\">"; 
                            }
                            redditFeed[numberOfPosts] += "<br/><a href=\""+$(this).find("link").text()+"\">"+$(this).find("title").text()+"</a><br/><br/>"+$(this).find("description").text();
                            numberOfPosts++;
                        });
                        finishedRedditLoad = true;
                    }
            }
    });
    
    setTimeout( checkDOMChange, 100 );

});

function checkDOMChange()
{
    var $domElements = $("#contentArea > div:last-child > div:not(#pagelet_megaphone):not(#pagelet_composer) > div").children();
    if ($domElements.length != numberOfDoms && finishedRedditLoad) {
        numberOfDoms = $domElements.length;
        $domElements.each(function(){
            if ($(this).find(".JoshuasBox").length == 0) {
                $(this).prepend("<div class='JoshuasBox'>"+redditFeed[numberOfReadPosts]+"</div>");
                numberOfReadPosts++;
            }
        });
        
        $(".JoshuasBox").css( "width", "100%" );
        $(".JoshuasBox").css( "background-color", "#FFFFFF" );
        $(".JoshuasBox").css( "min-height", "100px" );
        $(".JoshuasBox").css( "max-width", "474px" );
        $(".JoshuasBox").css( "margin-bottom", "14px" );
        $(".JoshuasBox").css( "border", "#DADADA solid 1px" );
        $(".JoshuasBox").css( "padding", "10px" );
    }
    setTimeout( checkDOMChange, 500 );
}
