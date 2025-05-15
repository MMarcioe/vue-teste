<template>
<DialogMsg ref="dialogMsg"/>

<div class="row q-ma-xs q-gutter-x-xs">
	<div class="col-grow text-h6">Clientes</div>
	<q-select class="col-6 col-md-2" 
		dense clearable emit-value map-options options-dense hide-bottom-space rounded :popup-content-style="{ backgroundColor: '#f5f5f5' }"
		label="Filtrar"
		behavior="menu"
		v-model="filtro" 
		:options="filtroItens" 
		option-label="texto"
		option-value="valor"
		@update:model-value="filtrar"
	/>
	<q-input class="col-9 col-md-3" 
		dense rounded clearable 
		v-model="busca"
		standout="bg-grey" 
		placeholder="Pesquisar" 
		debounce="500"
		:hint="hintBusca">
		<template v-slot:append><q-icon name="search" /></template>
	</q-input>
	<q-btn class="q-ma-xs col-auto" push color="primary" label="novo" @click="editarCliente(0)"/>
</div>

<q-table class="row q-pa-none q-mt-md text-grey-10" v-if="carregou"
	dense flat hide-no-data
	row-key="idCliente"
	ref="tableRef"
	:rows="dados"
	:columns="colunas"
	:filter="busca"
	rows-per-page-label="Listar:"
	:pagination-label="textoPaginacao"
	binary-state-sort
	v-model:pagination="pagina"
	@request="atualizarPagina">

	<template v-slot:header="props">
		<q-th v-for="col in colunas" :key="col.name" :props="props"><span>{{ col.label }}</span>
			<q-btn flat round dense icon="filter_alt" size="xs" @click.stop="" :color="corFiltroCol(col.filtro)" v-if="col.filtro!='0'">
			<q-menu>
				<q-input dense filled clearable autofocus debounce="500" :hint="hintFiltro" v-model="col.filtro" @update:model-value="filtrarColunas"/>
			</q-menu>
			</q-btn>
		</q-th>
	</template>

	<template v-slot:body-cell-nomeCliente="props">
		<q-td :props="props" class="cursor-pointer" @click="editarCliente(props.row.idCliente)"><q-avatar size="25px" :color="corAvatar(props.row.categoria)" text-color="white"><span>{{Util.getIniciais(props.value)}}</span></q-avatar> {{ props.value }}</q-td>
	</template>

	<template v-slot:body-cell-qtdeFilhos="props">
		<q-td :props="props"><q-chip class="q-ma-none q-pa-sm" dense outline text-color="green" v-if="props.value">&nbsp;{{ props.value }}&nbsp;</q-chip></q-td>
	</template>

	<template v-slot:body-cell-totalPedidos="props">
		<q-td :props="props"><q-chip class="q-ma-none q-pa-sm" dense color="green" text-color="white" v-if="props.value">&nbsp;{{ props.value }}&nbsp;</q-chip></q-td>
	</template>
	
	<template v-slot:body-cell-actions="props">
		<q-td :props="props">
			<q-btn class="q-pa-none" flat dense color="indigo" size="12px" icon="mode_edit" @click="editarCliente(props.row.idCliente)"></q-btn>
			<q-btn class="q-pa-none" flat dense color="red"    size="12px" icon="delete"    @click="excluirCliente(props.row)" :disable="props.row.totalPedidos>0"></q-btn>
		</q-td>
	</template>
</q-table>

</template>

<style scoped>
</style>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DialogMsg from '../components/DialogMsg.vue';
import * as Api  from '../components/Api.js';
import * as Util from '../components/Util.js';

const router = useRouter();
const dialogMsg = $ref(null);
const tela = $ref("telaClientes");

let dados = $ref([]);
let filtro = $ref();
let filtroItens = $ref([{texto: 'clientes novos', valor: "1"}, {texto: 'com pedidos', valor: "2"}]);
let busca = $ref();
let hintBusca = $ref();
let hintFiltro = $ref();
let carregou = $ref(false);
let pagina = $ref({
	sortBy: 'nomeCliente',
	descending: false,
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 0,
})
let colunas = $ref([
	{ name: 'nomeCliente', align: 'left', label: 'Nome', field: 'nomeCliente', sortable: true, filtro: "", style: 'white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:300px; width: 90%' },
	{ name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true, filtro: "", style: 'width: auto' },
	{ name: 'cpf', align: 'center', label: 'CPF', field: 'cpf', sortable: true, filtro: "", style: 'width: auto' },
	{ name: 'celular', align: 'left', label: 'Celular', field: 'celular', sortable: true, filtro: "", style: 'width: auto' },
	{ name: 'cep', align: 'left', label: 'CEP', field: 'cep', sortable: true, filtro: "", style: 'width: auto' },
	{ name: 'qtdeFilhos', align: 'center', label: 'Filhos', field: 'qtdeFilhos', sortable: true, filtro: "0", style: 'width: auto' },
	{ name: 'totalPedidos', align: 'center', label: 'Pedidos', field: 'totalPedidos', sortable: true, filtro: "0", style: 'width: auto' },
	{ name: 'nomeEscola', align: 'left', label: 'Escola', field: 'nomeEscola', sortable: true, filtro: "", style: 'width: auto' },
	{ name: 'categoria', align: 'center', label: 'Categoria', field: 'categoria', sortable: true, filtro: "", style: 'width: auto' },
	{ name: 'actions', align: 'center', label: 'Opções', filtro: "0", style: 'width: auto' },
])

onMounted(async ()=> {
	await restaurarTela();
	await listarClientes();
	carregou = true;
})

function atualizarPagina(props) {
	if (busca!=null && busca.length>0 && busca.length<4) {
		hintBusca = "minimo 3 caracteres";
		return;
	}
	hintBusca = undefined;
	pagina.page = props.pagination.page;
	pagina.rowsPerPage = props.pagination.rowsPerPage;
	pagina.sortBy = props.pagination.sortBy;
	pagina.descending = props.pagination.descending;
	listarClientes();
}

function filtrar() {
	listarClientes();
}

function filtrarColunas() {
	for (const i in colunas) {
		if (colunas[i].filtro && colunas[i].filtro!='0' && colunas[i].filtro.length<4) {
			hintFiltro = "minimo 3 caracteres";
			return;
		}
	}
	hintFiltro = undefined;
	listarClientes();
}

function corFiltroCol(filtro) {
	return filtro ? "indigo" : "grey-5";
}

function corAvatar(categoria) {
	var cor = "grey-5";
	if (categoria=="Bronze") cor = "grey-8";
	if (categoria=="Prata")  cor = "indigo";
	if (categoria=="Ouro")   cor = "yellow-8";
	return cor;
}

function textoPaginacao() {
	const txt = " Página " + pagina.page + " de " + Math.ceil(pagina.rowsNumber / pagina.rowsPerPage) + " Total Registros: " + pagina.rowsNumber;
	return txt;
}

function salvarTela() {
	sessionStorage.setItem(tela+'_tela',"true");
	sessionStorage.setItem(tela+'_filtro',filtro ? filtro : "");
	sessionStorage.setItem(tela+'_busca',busca ? busca : "");
	sessionStorage.setItem(tela+'_pagina',JSON.stringify(pagina));
	sessionStorage.setItem(tela+'_colunas',JSON.stringify(colunas));
}

async function restaurarTela() {
	if (!sessionStorage.getItem(tela+'_tela')) {
		return;
	}
	sessionStorage.removeItem(tela+'_tela');
	filtro = sessionStorage.getItem(tela+'_filtro');
	busca = sessionStorage.getItem(tela+'_busca');
	pagina = JSON.parse(sessionStorage.getItem(tela+'_pagina'));
	colunas = JSON.parse(sessionStorage.getItem(tela+'_colunas'));
}

async function listarClientes() {
	try {
		const param = {pagina: pagina, busca: busca, colunas: colunas, filtro: {filtro: filtro}};
		const response = await Api.listar("/clientes",param);
		dados = response.dados;
		pagina.rowsNumber = response.total;
	}
	catch (erro)  {
		await dialogMsg.show("OK","Erro",erro);
		return;
	}
}

function editarCliente(id) {
	salvarTela();
	router.push({ name: "cliente", state: {id: id} });
}

async function excluirCliente(item) {
	try {
		const r = await dialogMsg.show("EC","EXCLUSÃO","Confirma a exclusão de <b>" + item.nomeCliente + "</b> ?");
		if (r!="EXCLUIR") return;
		await Api.excluir("/clientes",item.idCliente);
		await listarClientes();
	}
	catch(erro) {
		await dialogMsg.show("OK","Erro",erro);
	}
}

</script>
