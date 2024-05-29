import { Tabulator, FormatModule, EditModule, AjaxModule  } from 'tabulator-tables';

Tabulator.registerModule([FormatModule, EditModule, AjaxModule]);

Tabulator.extendModule("ajax", "defaultConfig", {
    //define request defaults: https://tabulator.info/docs/6.2/modules#module-ajax
});

var table = new Tabulator("#example-table", {
    //height: "311px",
    //columns defs: see https://tabulator.info/docs/6.2/columns#definition
    columns: [
        { title: "Id", field: "id", width: 40, hozAlign: "center"},
        { title: "Name", field: "name", width: 200 },
        {
            title: "colGroup", // https://tabulator.info/docs/6.2/columns#groups
            columns: [
            { title: "Age", field: "age", hozAlign: "left", formatter: "progress" },
            { title: "Favourite Color", field: "col" },
            ],
        },
        { title: "Date Of Birth", field: "dob", hozAlign: "center" },
        { title: "Rating", field: "rating", hozAlign: "center", formatter: "star" },
        { title: "Passed?", field: "passed", hozAlign: "center", formatter: "tickCross" },
    ],
});

table.on("tableBuilt", () => {
    table.setPage(1);
  });
