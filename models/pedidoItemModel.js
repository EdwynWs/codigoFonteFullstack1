const Database = require("../db/database");

const banco = new Database();

class PedidoItemModel {

    #itemId;
    #pedidoId;
    #pedidoData;
    #pedidoValorTotal
    #produtoId;
    #produtoNome;
    #itemValorUnidade;
    #itemQuantidade;
    #itemValorTotal;

    get itemId() {
        return this.#itemId;
    }

    set itemId(value) {
        this.#itemId = value;
    }

    
    get pedidoId() {
        return this.#pedidoId;
    }

    set pedidoId(value) {
        this.#pedidoId = value;
    }

    
    get produtoId() {
        return this.#produtoId;
    }

    set produtoId(value) {
        this.#produtoId = value;
    }

    
    get itemValorUnidade() {
        return this.#itemValorUnidade;
    }

    set itemValorUnidade(value) {
        this.#itemValorUnidade = value;
    }

    get itemQuantidade() {
        return this.#itemQuantidade;
    }

    set itemQuantidade(value) {
        this.#itemQuantidade = value;
    }

    get itemValorTotal() {
        return this.#itemValorTotal;
    }

    set itemValorTotal(value) {
        this.#itemValorTotal = value;
    }

    get produtoNome() {
        return this.#produtoNome;
    }

    set produtoNome(value) {
        this.#produtoNome = value;
    }

    get pedidoData() {
        return this.#pedidoData;
    }

    set pedidoData(value) {
        this.#pedidoData = value;
    }

    get pedidoValorTotal() {
        return this.#pedidoValorTotal;
    }

    set pedidoValorTotal(value) {
        this.#pedidoValorTotal = value;
    }

    constructor(id, pedidoId, produtoId, quantidade, valorUnidade, valorTotal) {
        this.#itemId = id;
        this.#pedidoId = pedidoId;
        this.#produtoId = produtoId;
        this.#itemQuantidade = quantidade;
        this.#itemValorTotal = valorTotal;
        this.#itemValorUnidade = valorUnidade;
    }

    async gravar() {
        let sql = "insert into tb_pedidoitens (ped_id, prd_id, pit_quantidade, pit_valorunidade, pit_valortotal) values (?, ?, ?, ?, ?)";

        let valores = [this.#pedidoId, this.#produtoId, this.#itemQuantidade, this.#itemValorUnidade, this.#itemValorTotal];

        let result = await banco.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async listar(termoFiltragem) {

        let sqlWhere = "";
        
        if(termoFiltragem && termoFiltragem != ""){
            //foi enviado algum termo de busca
            //filtrar por nome (prd_nome) ou pedido (ped_id)
            if(isNaN(termoFiltragem)) {
                //prd_nome
                sqlWhere = " where pr.prd_nome like ? ";
                termoFiltragem = "%" + termoFiltragem + "%";
            }
            else {
                //ped_id
                sqlWhere = " where p.ped_id = ? ";
            }
        }

        let sql = `select p.ped_id, p.ped_data, p.ped_valortotal, 
                    pr.prd_nome, i.pit_quantidade, i.pit_valorunidade, i.pit_valortotal from tb_pedido p 
                    inner join tb_pedidoitens i on p.ped_id = i.ped_id
                    inner join tb_produto pr on pr.prd_id = i.prd_id
                    ${sqlWhere}`;

        let valores = [termoFiltragem];

        let rows = await banco.ExecutaComando(sql, valores);

        let lista = [];

        for(let i = 0; i<rows.length; i++) {
            let item = new PedidoItemModel();
            item.pedidoData = rows[i]["ped_data"];
            item.itemQuantidade = rows[i]["pit_quantidade"];
            item.itemValorTotal = rows[i]["pit_valortotal"];
            item.itemValorUnidade = rows[i]["pit_valorunidade"];
            item.pedidoId = rows[i]["ped_id"];
            item.pedidoValorTotal = rows[i]["ped_valortotal"];
            item.produtoNome = rows[i]["prd_nome"];
            lista.push(item);
        }

        return lista;
    }

    toJSON() {
        return {
            pedidoId: this.#pedidoId,
            pedidoData: this.#pedidoData,
            pedidoValorTotal: this.#pedidoValorTotal,
            produtoNome: this.#produtoNome,
            itemQuantidade: this.#itemQuantidade,
            itemValorUnidade: this.#itemValorUnidade,
            itemValorTotal: this.#itemValorTotal
        }
    }
}


module.exports = PedidoItemModel;