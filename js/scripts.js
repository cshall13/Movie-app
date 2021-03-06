$(document).ready(function(){
	// All api calls go to this link
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	// All images use this link
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';
	
	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+apiKey;
	// console.log(nowPlayingUrl);

	var buttonsHTML = ' ';
	for(let i=0; i<genreArray.length; i++){
		buttonsHTML +=`<button class="btn btn-default genre-button">${genreArray[i].name}</button>`;
	}
	$('#genre-buttons').html(buttonsHTML);

	// Make AJAX request to the nowPlayingUrl
	$.getJSON(nowPlayingUrl,function(nowPlayingData){
		// console.log(nowPlayingData);
		var nowPlayingHTML = getHTML(nowPlayingData);
		$('#movie-grid').html(nowPlayingHTML);
		$('.movie-poster').click(function(){
			// change the html inside the modal
			var thisMovieId = $(this).attr('movie-id');
			console.log(thisMovieId)
			var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
			$.getJSON(thisMovieUrl,(thisMovieData)=>{
				console.log(thisMovieData);
				$('#myModalLabel').html(thisMovieData.title);
				$('.modal-body').html(thisMovieData.overview);				
				// $('.modal-content').html(thisMovieData.tagline);
				// open the modal
				$("#myModal").modal();
			});
		});
		$grid = $('#movie-grid').isotope({
			itemSelector: '.movie-poster'
		});
		$grid.imagesLoaded().progress( function() {
  			$grid.isotope('layout');
		});
		$('.genre-button').click(function(){
			console.log(this.innerText)
			$grid.isotope({filter: '.'+this.innerText})
		});
		$('#all-genres').click(function(){
			$grid.isotope({filter: ''})
		});
	});
	$('#movie-form').submit((event)=>{
		// dont submit form! JS will handle
		event.preventDefault();
		var userInput = $('#search-input').val();
		$('#search-input').val('');
		var safeUserInput = encodeURI(userInput);
		var searchUrl = apiBaseUrl + '/search/movie?query='+safeUserInput+'&api_key='+apiKey;
		console.log(searchUrl);
		$.getJSON(searchUrl,(searchMovieData)=>{
			var searchMovieHTML = getHTML(searchMovieData);
			$('#movie-grid').html(searchMovieHTML)
			$('.movie-poster').click(function(){
			// change the html inside the modal
		var thisMovieId = $(this).attr('movie-id');
		console.log(thisMovieId)
		var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
		$.getJSON(thisMovieUrl,(thisMovieData)=>{
			console.log(thisMovieData);
			$('#myModalLabel').html(thisMovieData.title);
			$('.modal-body').html(thisMovieData.overview);
			// open the modal
			$("#myModal").modal();
				});
			});
		});
	});

	function getHTML(nowPlayingData){
		var newHTML = '';
			for(let i = 0; i < nowPlayingData.results.length; i++){
				// set up 
				 // var for the genre ids for THIS movie
				var thisMovieGenres = nowPlayingData.results[i].genre_ids;
				var movieGenreClassList = " ";
				// loop through all known genres
				for(let j=0; j<genreArray.length; j++){
					// the genre that we are on (genreArray[j]), check to 
					// see if it in THIS movies genre id list
					if(thisMovieGenres.indexOf(genreArray[j].id)> -1){
						// HIT! This genre_id is in THIS movie's genre_id list
						// so we need to add the name to the class list
						movieGenreClassList += genreArray[j].name + " ";
					}
					console.log(genreArray[j].name);
				}
				// console.log(movieGenreClassList);
				var posterUrl = imageBaseUrl + 'w300' +nowPlayingData.results[i].poster_path;
				newHTML += '<div class="col-sm-6 col-md-3 movie-poster '+movieGenreClassList+'" movie-id='+nowPlayingData.results[i].id+'>';
					newHTML += `<img src="${posterUrl}">`;
				newHTML += `</div>`;
		}
		return newHTML;
	}

});












