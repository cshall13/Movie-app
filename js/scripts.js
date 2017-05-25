$(document).ready(function(){
	// All api calls go to this link
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	// All images use this link
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';
	
	const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key='+apiKey;
	// console.log(nowPlayingUrl);

	// Make AJAX request to the nowPlayingUrl
	$.getJSON(nowPlayingUrl,(nowPlayingData)=>{
		// console.log(nowPlayingData);
		var  nowPlayingHTML = getHTML(nowPlayingData);
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
				// open the modal
				$("#myModal").modal();
			});
		})
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
			})
		});


	});

	function getHTML(nowPlayingData){
		var newHTML = '';
			for(let i = 0; i < nowPlayingData.results.length; i++){
				var posterUrl = imageBaseUrl + 'w300' +nowPlayingData.results[i].poster_path;
				newHTML += '<div class="col-sm-6 col-md-3 movie-poster" movie-id='+nowPlayingData.results[i].id+'>';
					newHTML += `<img src="${posterUrl}">`;
				newHTML += `</div>`;
		}
		return newHTML;
	}

});