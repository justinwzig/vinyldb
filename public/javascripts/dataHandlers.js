//Create Date Editor
var dateEditor = function (cell, onRendered, success, cancel) {
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass thesuccessfully updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell

    //create and style input
    var cellValue = luxon.DateTime.fromFormat(cell.getValue(), "dd/MM/yyyy").toFormat("yyyy-MM-dd"),
        input = document.createElement("input");

    input.setAttribute("type", "date");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue;

    onRendered(function () {
        input.focus();
        input.style.height = "100%";
    });

    function onChange() {
        if (input.value != cellValue) {
            success(luxon.DateTime.fromFormat(input.value, "yyyy-MM-dd").toFormat("dd/MM/yyyy"));
        } else {
            cancel();
        }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function (e) {
        if (e.keyCode == 13) {
            onChange();
        }

        if (e.keyCode == 27) {
            cancel();
        }
    });

    return input;
};




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
                        index: "id", // set the table's index to the id field
                        height: "90%", // set the table's height to 97% of the container.
                        //responsiveLayout: "collapse", // collapse columns that no longer fit on the table into a list under the row
                        resizableColumnGuide: true,
                        resizableRows: true,
                        resizableRowGuide: true,

                        rowHeader:{resizable: false, frozen: true, minWidth: 0, width:18, maxWidth: 32, hozAlign:"center", formatter: "rownum", cssClass:"range-header-col"},

                        //enable range selection
                        selectableRange: 1,
                        selectableRangeColumns: true,
                        selectableRangeRows: true,
                        selectableRangeClearCells: true,

                        //change edit trigger mode to make cell navigation smoother
                        editTriggerEvent: "dblclick",

                        //configure clipboard to allow copy and paste of range format data
                        clipboard: true,
                        clipboardCopyStyled: false,
                        clipboardCopyConfig: {
                            rowHeaders: false,
                            columnHeaders: false,
                        },
                        clipboardCopyRowRange: "range",
                        clipboardPasteParser: "range",
                        clipboardPasteAction: "range",

                        //setup cells to work as a spreadsheet
                        columnDefaults: {
                            headerSort: false,
                            headerHozAlign: "center",
                            editor: "input",
                            resizable: "header",
                            width: 100,
                        },

                        history: true, //enable edit history
                        columns: [ // Define table columns
                            { title: "Name", field: "name", minWidth: 120, editor: "input", validator: "required" },
                            // { title: "Schema Version", field: "schema_version" },
                            // { title: "Revision", field: "revision" },
                            // { title: "Date Created", field: "date_created" },
                            {
                                title: "Discogs Link", field: "discogs_url", minWidth: 50, editor: "input", editor: 'input', validator: "", editorParams: {
                                    mask: "99999",
                                    elementAttriutes: {
                                        maxlength: "5"
                                    },
                                    verticalNavigation: "editor", //navigate cursor around text area without leaving the cell
                                    shiftEnterSubmit: true, //submit cell value on shift enter
                                }
                            },
                        ],
                    });
                    //handle cell/row selection
                    table.on("cellClick", function (e, cell) {
                        //handle cell click event
                        console.log("Cell clicked:", cell);
                        var selectedRowData = cell.getRow().getData();
                        console.log("Selected Artist ID:", selectedRowData._id);
                        // Display the artist ID in the sidebar
                        var artistInfoDiv = document.getElementById('artist-info');
                        artistInfoDiv.textContent = "Selected Artist ID: " + selectedRowData._id;

                        console.log("sending GET to", '/artist/' + selectedRowData._id + '/update')
                        fetch('/artist/' + selectedRowData._id, {
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
                                    console.log("data.artist_info: " + data.artist_info);
                                    var artistInfoDiv = document.getElementById('artist-info');
                                    artistInfoDiv.textContent = "Artist Info: " + JSON.stringify(data.artist_info);
                                }
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                    });

                    table.on("rowClick", function (e, row) {
                        //handle row click event
                        console.log("Row clicked:", row);
                    });
                    //handle validation failure
                    table.on("validationFailed", function (cell, value, validators) {
                        //cell - cell component for the edited cell
                        //value - the value that failed validation
                        //validatiors - an array of validator objects that failed

                        //take action on validation fail
                        console.log("validationFailed: " + cell + " value: " + value + " validators: " + validators);
                    });
                    table.on("cellEdited", function (cell) {
                        //cell - cell component
                        var row = cell.getRow();
                        var rowData = row.getData();



                        console.log('Sending update request for row:', rowData, ' with ROW ID: ', rowData._id);

                        fetch('/artist/' + rowData._id + '/update', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(rowData),
                        })
                        .then(response => {
                            console.log('Received response:', response);
                            return response.json();
                        })
                        .then(data => {
                            console.log('Received data:', data);
                            if (data.errors) {
                                // Handle errors
                                console.error('Error:', data.errors);
                            } else {
                                console.log('Update successful');
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    });
                    //Add row on "Add Row" button click
                    document.getElementById("artist-table-add-row").addEventListener("click", function () {
                        table.addRow({});
                    });

                    //undo button
                    document.getElementById("artist-table-undo").addEventListener("click", function () {
                        table.undo();
                    });

                    //redo button
                    document.getElementById("artist-table-redo").addEventListener("click", function () {
                        table.redo();
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

