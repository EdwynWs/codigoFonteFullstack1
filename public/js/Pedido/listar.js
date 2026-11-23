document.addEventListener("DOMContentLoaded", function() {


    document.getElementById("btnFiltrar").addEventListener("click", carregarPedidos);

    document.getElementById("btnExcel").addEventListener("click", exportarExcel);

    document.getElementById("btnPdf").addEventListener("click", exportarPdf);

    //carregarPedidos();

    function exportarPdf() {
        window.print();
    }

    function exportarExcel() {
        let tabela = document.getElementById("tabelaPedidos");

        var wb = XLSX.utils.table_to_book(tabela);

        XLSX.writeFile(wb, "pedidos.xlsx");
    }

    function renderizarCorpoTabela(lista) {

        let html = "";

        for(let i = 0; i < lista.length; i++) {
            html += `<tr>
                        <td>${lista[i].pedidoId}</td>
                        <td>${new Date(lista[i].pedidoData).toLocaleString()}</td>
                        <td>${lista[i].pedidoValorTotal}</td>
                        <td>${lista[i].produtoNome}</td>
                        <td>${lista[i].itemQuantidade}</td>
                        <td>${lista[i].itemValorUnidade}</td>
                        <td>${lista[i].itemValorTotal}</td>
                    </tr>`;
        }

        document.querySelector("#tabelaPedidos > tbody").innerHTML = html;
    }

    function carregarPedidos() {

        let termo = document.getElementById("txtFiltro").value;

        fetch("/pedido/listar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",         
            },
            body: JSON.stringify({termo})
        })
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(corpo) {
            renderizarCorpoTabela(corpo);
        })
    }
})