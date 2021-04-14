window.addEventListener('load', cargando);

var db = openDatabase("myDB", "1.0", "Registro de Cotizaciones", 2 * 1024 * 1024);

function cargando() {
    document.getElementById('btn-guardar').addEventListener('click', guardar);
    document.getElementById('btn-exportar').addEventListener('click', exportar);
    document.getElementById('btn-eliminar').addEventListener('click', eliminar);

    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS registross (ID INTEGER PRIMARY KEY, NOMBRE TEXT, TELEFONO TEXT, DIRECCION TEXT, ARTICULO TEXT, PRECIO NUMBER, CANTIDAD NUMBER, SUBTOTAL NUMBER, ITBIS NUMBER, TOTAL NUMBER )");
    });

    mostrar();
}

function guardar() {
    var id = document.getElementById('id').value;
    var nombre = document.getElementById('inputcliente').value;
    var telefono = document.getElementById('inputtelefono').value;
    var direccion = document.getElementById('inputdireccion').value;
    var articulo = document.getElementById('inputarticulo').value;
    var precio = document.getElementById('inputprecio').value;
    var cantidad = document.getElementById('inputcantidad').value;
    var subtotal = Number(precio) * Number(cantidad);
    var itbis = 0.18;
    var total = "$" + (subtotal * itbis + subtotal);

    db.transaction(function(tx) {
        if (id) {
            tx.executeSql('UPDATE registross SET NOMBRE=?,  TELEFONO=?, DIRECCION=?, ARTICULO=?, PRECIO=?, CANTIDAD=?, SUBTOTAL=?, ITBIS=?, TOTAL=? WHERE ID =?', [nombre, telefono, direccion, articulo, precio, cantidad, subtotal, itbis, total, id], null)
        } else {
            tx.executeSql("INSERT INTO registross (NOMBRE, TELEFONO, DIRECCION, ARTICULO, PRECIO, CANTIDAD, SUBTOTAL, ITBIS,TOTAL) VALUES(?,?,?,?,?,?,?,?,?)", [nombre, telefono, direccion, articulo, precio, cantidad, subtotal, itbis, total]);
        }
    });
    mostrar();
    limpiar();
}

function mostrar() {
    var table = document.getElementById('tbody-regis');

    db.transaction(function(tx) {
        tx.executeSql('select * from registross', [], function(tx, resultado) {
            var rows = resultado.rows;
            var tr = '';
            for (var i = 0; i < rows.length; i++) {
                tr += '<tr>';
                tr += '<td onClick="editar(' + rows[i].ID + ')">' + rows[i].NOMBRE + '</td>';
                tr += '<td>' + rows[i].TELEFONO + '</td>';
                tr += '<td>' + rows[i].DIRECCION + '</td>';
                tr += '<td>' + rows[i].ARTICULO + '</td>';
                tr += '<td>' + rows[i].PRECIO + '</td>';
                tr += '<td>' + rows[i].CANTIDAD + '</td>';
                tr += '<td>' + rows[i].SUBTOTAL + '</td>';
                tr += '<td>' + rows[i].ITBIS + '</td>';
                tr += '<td>' + rows[i].TOTAL + '</td>';
                tr += '</tr>';

            }


            table.innerHTML = tr;
        });
    }, null);
}


function eliminar() {
    var id = document.getElementById('id').value;

    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM registross WHERE ID=?", [id]);
    });

    mostrar();
    limpiar();
}

function exportar() {
    var ttable = document.getElementById('tt').innerHTML;

    var style = "<style>";
    style = style + "table {width: 100%; font: 17px Calibri;}";
    style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px; text-align: center;}";
    style = style + "</style>";

    var win = window.open('', '', 'height=700, width=700');

    win.document.write('<html><head>');
    win.document.write('<title>Cotizaciones</title>');
    win.document.write(style);
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(ttable);
    win.document.write('</body></html>');

    win.document.close();
    win.print();
}