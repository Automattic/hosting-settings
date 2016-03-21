var serviceNames = {
	email: "E-mail MX settings"
};

function getServiceName( name ) {
	return serviceNames[ name ];
}

function parsePlaceholders( content ) {
	return content.replace( /\[domainname\]/ig, '<span class="placeholder">your domain</span>' );
}

function hostTemplate( host ) {
	var t = "<div class='host'>";
	t += "<h2><a href='" + host.url + "' target='_blank'>" + host.host + "</a></h2>";
	for ( var serviceID in host.services ) {
		var service = host.services[ serviceID ];
		var doc = service.doc ? " <a href='" + service.doc + "'' target='_blank'>( " + host.host + " support docs )</a>" : "";
		t += "<div class='service'>";
		t += "<h4>" + getServiceName( serviceID ) + doc + "</h4>";
		t += "<table>";
		t += "<tr><th>Type</th><th>Name</th><th>Priority</th><th>Content</th></tr>";

		service.dns.forEach( function( record ) {
			t += "<tr class='record'>";
			t += "<td class='type'>" + record.type + "</td>";
			t += "<td class='name'>" + ( record.name || "" ) + "</td>";
			t += "<td class='priority'>" + ( record.priority || "" ) + "</td>";
			t += "<td class='content'>" + parsePlaceholders( record.content || "" ) + "</td>";
			t += "</tr>";
		} );
		t += "</table>";
		t += "</div>";
	}

	t += "</div>";
	return t;
}

function getHosts( hosts ) {
	var searchField = document.querySelector( "#host-search" );
	var hostList = document.querySelector( "#hosts" );
	var searchDebounce = null;

	hosts.forEach( function( host ) {
		host.element = jQuery( hostTemplate( host ) ).appendTo( hostList );
	} );

	function findHost( q ) {
		hosts.forEach( function( host ) {
			if ( q === "" || host.host.toLowerCase().indexOf( q.toLowerCase() ) !== -1 ) {
				host.element.show();
			} else {
				host.element.hide();
			}
		} );
	}

	function parseHash() {
			var key = window.location.hash.replace( "#", "" );
			searchField.value = key;
			findHost( key );
	}

	searchField.addEventListener( "keydown", function( event ) {
		window.clearTimeout( searchDebounce );
		searchDebounce = window.setTimeout( function() {
			window.location.hash = "#" + searchField.value;
		}, 800 );
	} );

	window.addEventListener( "hashchange", parseHash );
	parseHash();
};
jQuery.getJSON( "./data.json", getHosts );
