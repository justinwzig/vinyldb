// Load the list of artists in Tabulator table using json.
var artistTable = document.getElementById('artist-table');
if (artistTable) {
    console.log('artistTable found on the page.' + artistTable);
    // Load the list of artists in Tabulator table using json.
    document.addEventListener('DOMContentLoaded', function () {
        fetch('/catalog/artists?isAjax=true', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
        })
            .then(response => {
                var responsepromise = response.json();
                console.log("responsepromise: " + responsepromise);
                return responsepromise;
            })
            .then(data => {
                if (data.errors) {
                    // Handle errors
                    console.error('Error:', error);
                } else {
                    console.log("data.artist_list: " + data.artist_list);
                    var table = new Tabulator("#artist-table", {
                        data: data.artist_list, // assign data to table
                        layout: "fitColumns", // fit columns to width of table
                        columns: [ // Define table columns
                            { title: "Name", field: "name" },
                            { title: "Schema Version", field: "schema_version" },
                            { title: "Revision", field: "revision" },
                            { title: "Date Created", field: "date_created" },
                            { title: "Discogs ID", field: "discogs_id" },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
} else {
    console.log('artistTable div not found on the page.');
}

// Handle the form submission
var loadUpdateArtistForm = document.getElementById('loadUpdateArtistForm');
if (loadUpdateArtistForm) {
    loadUpdateArtistForm.addEventListener('click', function () {
        document.getElementById('update-artist-form').addEventListener('submit', function (event) {
            event.preventDefault();

            var id = document.getElementById('access-artist-id').value;

            fetch('/artist/' + id + '/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.errors) {
                        // Handle errors
                        console.error('Error:', error);
                    } else {
                        // Update the table (EXAMPLE)
                        var table = new Tabulator("#artist-table", {
                            data: [data.artist], // assign data to table
                            layout: "fitColumns", // fit columns to width of table (optional)
                            columns: [ // Define table columns
                                { title: "Name", field: "name" },
                            ],
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    });
} else {
    console.log('loadFormBloadUpdateArtistFormutton form not found on the page.');
}

