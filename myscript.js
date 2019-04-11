var extensionUrl =
  "https://chrome.google.com/webstore/detail/amazon-global-shipping-fi/alfkindkahgpcihepceidgnbpolhhmmk";

$(document).ready(function() {

  chrome.storage.sync.get("disabled", function(itemz) {
    var disabled = itemz.disabled;
    if (disabled == null || disabled == false) {
      var removeCount = 0;
      var currentTimerIndex = 0;
      var currentTimerIndex2 = 0;
      var listType = "regular";
      MutationObserver =
        window.MutationObserver || window.WebKitMutationObserver;

      var observer = new MutationObserver(function(mutations, observer) {
        // fired when a mutation occurs
        currentTimerIndex++;
        hideNonDeliverables(true, currentTimerIndex);
      });

      function hideNonDeliverables(checkStuff, currentTimeriIndexCompare) {
        $("#amazon-helper-notifications").hide();
        setTimeout(function() {
          observer.disconnect();
          if (currentTimerIndex == currentTimeriIndexCompare) {
            if (checkStuff) {
              removeCount = 0;
              $notificationArea = $("#s-result-count");
              if ($("#amazon-helper-notifications").length == 0) {
                $notificationArea.append(
                  '<span id="amazon-helper-notifications"></span>'
                );
              } else {
                $("#amazon-helper-notifications").show();
              }
              observer.disconnect();
              var containerClass = ".s-result-item";
              var linkClass = ".s-result-item h5 .a-link-normal:first-of-type, a-carousel-card .a-link-normal:first-of-type";
              if (listType == "asin") {
                containerClass = ".asin_container";
                linkClass = ".asin-faceout-link";
              }
              $(linkClass).each(function(index) {
                if (!$(this).hasClass("checked-by-filter")) {
                  var $el = $(this);
                  var link = $el.attr("href").replace("http:", "https:");

                  //link = link.replace("https:","");
                  $.get(link, function(data) {
                  if (data.indexOf('duct Dimension') > -1)
                    { let dims = getTextBetween(
                      data.replace(/ /g, ""),
                      "ductDimensions:<br/>",
                      "cm"
                    ).replace("x", ",").split(',');
                    }
                    if (
                      data.match(
                        /Questo articolo non può essere consegnato in|Aucun vendeur ne peut exp|>Dieser Artikel kann nicht nach <|El vendedor que has elegido para este producto no realiza|special handling and doesn't ship to your location|special handling and don't ship to your location|special handling and dont ship to your location|Questo prodotto non può essere spedito in|Nessun venditore spedisce attualmente questo prodotto in|Ce vendeur ne peut pas expédier l’article sélectionné en|Este producto no puede ser enviado a|Cet article ne peut pas être expédié en|venditore selezionato per questo prodotto non spedisce|Lo sentimos, no podemos enviar este producto|Kein Verkäufer liefert diesen Artikel aktuell nac|Dieser Verkäufer liefert den von Ihnen gewählten Artikel nicht nach|Siamo spiacenti, ma questo venditore non consegna in|este vendedor no envía a|ce vendeur ne livre pas|Leider kann dieser Artikel nicht|Please check other sellers who may ship internationally|いてこの出品者は海外への配送に対応しておりません|This seller does not deliver to|This item does not ship to|Seller doesn’t deliver to|No sellers are currently delivering|seller does not deliver to|Leider versendet dieser|we can not deliver this item|we can't deliver this item/i
                      )
                    ) {
                      console.log('we in this')
                      //$el.closest(containerClass).fadeOut();
                      if (
                        !$el
                        .closest('div')
                          .hasClass("irelandFilterHidden")
                      ) {
                        $el
                        .closest('div')
                          .addClass("irelandFilterHidden");
                      //$el.closest('div').css({"background": "red"});
                      //$el.closest(containerClass).css({"border": "1px solid #edd1e5"});
                      }
                      removeCount++;
                      updateNotificationText();
                    } else if (
                      data.match(
                        / No disponible temporal|We do not know When or if this item will be back in stock|Temporarily out of stock.|ただいま在庫はありません| Derzeit nicht auf Lager/i
                      )
                    ) {
                      $el.closest('div').addClass("ifOutofStock");
                    } else if (data.match(/ In stock on|In stock on r/i)) {
                      var delStr =
                        '<div class="out-of-stock-filter">I' +
                        getTextBetween(data, "In stock on", "<") +
                        "</div>";
                      $el
                        .closest('div')
                        .attr("data-content", delStr.trim());
                      $el.addClass("ifOutofStock");
                      $el
                        .closest('div')
                        .append(delStr.trim());
                    } else if (data.match(/font color="#C40000/i)) {
                      var message = $("#holidayDeliveryMessage font").text();
                      $el.closest('div').addClass("delayedDelivery");
                    }
                  });
                  $(this).addClass("checked-by-filter");
                }
              });
            }
            // define what element should be observed by the observer
            // and what types of mutations trigger the callback
            if ($("#rightResultsATF").length != 0) {
              observer.observe(document.getElementById("rightResultsATF"), {
                subtree: true,
                attributes: false,
                characterData: true
              });
              listType = "regular";
            } else if ($("#asin_list").length != 0) {
              observer.observe(document.getElementById("asin_list"), {
                subtree: true,
                attributes: false,
                characterData: true
              });
              listType = "asin";
            }
            $("#rightResultsATF").bind("DOMNodeInserted", function(event) {
              $("#rightResultsATF").unbind("DOMNodeInserted");
              currentTimerIndex++;

              hideNonDeliverables(true, currentTimerIndex);
            });
          }
        }, 500);
      }

      var myLinkHtml =
        "<a target='_blank' style='float:right;margin-right:12px;' class='bul-but rate-me-btn bulgeani' href='https://chrome.google.com/webstore/detail/amazon-shipping-filter/alfkindkahgpcihepceidgnbpolhhmmk/reviews'>[Rate Me!]</a>";

      if (Math.floor(Math.random() * 5) < 3){
      myLinkHtml =
        "<a target='_blank' style='float:right;margin-right:12px;' class='bul-but play-geogee-btn bulgeani' href='https://geogee.me'>[Play Geogee!]</a>";
      }

      function updateNotificationText() {

        let txt = "Hide non-deliverable items in all listings?";
        if (localStorage.autohide && localStorage.autohide == 1) {
          txt = "Show non-deliverable items in all listings";
        }
        $("#amazon-helper-notifications").show();
        $("#amazon-helper-notifications").html(
          "<div class='ifilterinfo'>" +
            removeCount +
            " items. <a class='ifreveal'>" +
            txt +
            "</a><span class='ifwarnx'>x</span>" +
            myLinkHtml +
            "</div>"
        );
        $(".ifwarnx").on("click", function() {
          $("#amazon-helper-notifications").fadeOut();
        });
        $(".ifreveal").on("click", function() {
          if (localStorage.autohide && localStorage.autohide == 1) {
            localStorage.autohide = 0;
            $(this).html("Hide non-deliverable items in all listings?");
            $(".irelandFilterHidden").fadeIn();
          } else {
            localStorage.autohide = 1;
            $(this).html("Show non-deliverable items all listings?");
            $(".irelandFilterHidden").fadeOut();
          }
        });

        if (localStorage.autohide && localStorage.autohide == 1) {
          $(".irelandFilterHidden").hide();
        }
      }

      hideNonDeliverables(true, currentTimerIndex);
      if (Math.floor(Math.random() * 20) > 12) {
        $("bul-but").removeClass("bulgeani");
      }
    }
  });

  function getTextBetween(str, tag1, tag2) {
    var start_pos = str.indexOf(tag1) + 1;
    var end_pos = str.indexOf(tag2, start_pos);
    var text_to_get = str.substring(start_pos, end_pos);
    return text_to_get;
  }
});

