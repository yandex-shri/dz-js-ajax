function Searcher(container) {
  this.container = container;
  this.url = 'http://api.flickr.com/services/rest/',
  this.api = {
    'method':'flickr.photos.search',
      'api_key':'7a8595db357aadcdf7bc2f906d720795',

      'per_page':30,
      'format':'json',
      'nojsoncallback':1,

      'tags':'',
      'page':1
  }
}

Searcher.prototype.load = function (text, page, callback) {
  var self = this;
  self.api.tags = text || self.api.tags;
  self.api.page = page || self.api.page;

  if (self.api.tags.length) {
    $.ajax({
      url:self.url,
      dataType:'json',
      data:$.param(self.api),
      success: function(data) {
        self.addPhotos(data);
      }
    }).done(function() {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
}

Searcher.prototype.next = function (callback) {
  var self = this;
  self.api.page++;
  self.load(self.api.tags, self.api.page, callback);
}

Searcher.prototype.addPhotos = function (data) {
  var self = this;

  if (data.stat === 'ok') {
    for (var i = 0, max = data.photos.photo.length; i < max; i++) {
      self.addPhoto(data.photos.photo[i]);
    }
  }
}

/*
   s : Small
   t : Thumbnail
   - : Medium
   b : Large
   o :Original
*/
Searcher.prototype.addPhoto = function (photo) {
  var self = this,
      image_url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';

  $('<img/>', {
    src:image_url,
    title:photo.title
  }).appendTo(self.container);
}