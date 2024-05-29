



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
    console.Log('loadFormBloadUpdateArtistFormutton form not found on the page.');
}

