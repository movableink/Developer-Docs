/***************
 * Movable Ink
 * This code is for example purposes.
 * Please edit as needed.
 ****************/


  // this will allow us to choose a specific item from the website we are about to scrape
var ITEM_INDEX = CD.param('item_index') || '0';


/**
 * Self invoking function which starts our code
 */
(function init(){

  // this is the url of the website we would like to scrape from
  var url = 'https://s3.amazonaws.com/developer-examples/website/index.html';

  // options to use while making the ajax request
  var options = {
    method  : 'GET',
    headers : {},
    body    : null
  };

  // use Movable Ink's CORS proxy to make a cross-domain ajax requests
  CD.getCORS(url, options, getData)

})();

/**
 * This callback function gets automatically called when the ajax request is completed.
 *
 * It manipulates the raw HTML from scraped website
 * and builds a data object to be passed to the buildCard function.
 *
 * On error we call the fallback function
 * @param raw
 */
function getData(raw){
  try{

    // we sanitize the raw HTML response so that scripts don't automatically execute
    // and images don't automatically download
    raw = raw.replace(/<script src=/g, '<noscript class="mi-script-src" data-script-url=');
    raw = raw.replace(/<script/g, '<noscript class="mi-script-inline"');
    raw = raw.replace(/<\/script/g, "<\/noscript");
    raw = raw.replace(/onload=/g, "data-onload=");
    raw = raw.replace(/src=/g, "data-src=");

    // here we take the raw HTML document and "jquerify" it
    // so that we can more easily parse the DOM
    var $doc = $(raw);

    // this grabs all the elements with a class of "product"
    var items = $doc.find('.product');

    // this selects only the product we are interested in
    // the ?item_index=0 param can be incremented to move to the next product
    var selectedItem = items.eq(ITEM_INDEX);

    // once we have selected the product we want, we further extract info from it
    // in this case we care about the product image, title, and link.
    var info = {
      'img'   : 'https://s3.amazonaws.com/developer-examples/website/' + selectedItem.find('.product_image img').attr('data-src'),
      'title' : selectedItem.find('.product_description').text(),
      'link'  : selectedItem.find('.product_button a').attr('href')
    };

    // after we have gather all the info we want, we call the build function
    buildCard(info);

  } catch(error){
    buildDefaultCard(error);
  }

}

/**
 * Inserts data to DOM
 * @param info
 */
function buildCard(info){

  // we create an array with all the images we are using in this project
  // images from the website scrape, and any images used in the css "styles.css"
  var imagesToGet = [info.img];

  // this inserts data into the DOM so that we can "crop" it and generate a dynamic image from it
  // Movable Ink will crop the '#mi_size_container' element
  $('.title').html(info.title);
  $('.image').css({'background-image' : 'url("' + info.img + '")'});

  // associates dynamic content with matching clickthroughs
  // this will effectively serve as the link people will see when they click the generate dynamic image
  // read this for more details: https://github.com/movableink/cropduster#setting-custom-per-user-clickthrough-urls
  CD.setClickthrough(info.link);

  // ensures that we do not capture before images have fully loaded.
  // read this for more details: https://github.com/movableink/cropduster#fetching-images
  CD.getImages(imagesToGet, function(img){

    // after all the images fully load, we show everything by removing the "hidden" class
    $('#mi_size_container').removeClass('hidden');

  });

}

/***
 * Handles errors and responds accordingly
 * @param err
 */
function buildDefaultCard(error){

  // handle an error, possibly depending on the type of err
  console.log(error);

}