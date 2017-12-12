const app = angular.module('MyBlogApp', []);

app.controller('JenBlogController', ['$http', function($http){
  const controller = this;
  this.articles = ['this blog works'];

  this.createdArticles = function(){
    $http({
      method: 'POST',
      url: '/articles',
      data: {
        author: this.author,
        article: this.article
      }
    }).then(function(response){
      controller.getArticles();
    },function(){

    });
  }


}]);
