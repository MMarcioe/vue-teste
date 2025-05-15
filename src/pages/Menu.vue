<template>

<q-header>
<!-- barra superior -->
<q-toolbar :class="corToolBar" style="min-height:31px;height:auto">
	<q-btn flat round dense icon="menu" class="q-mr-sm" @mouseenter="$q.screen.gt.xs?drawer=true:''" @click="drawer=!drawer"/>
	<q-btn flat to="/" class="text-weight-bold">Teste {{ Sessao.anoLetivo() + msgTeste}}</q-btn>
	<q-space />
	<q-btn flat dense icon="person" class="q-mr-sm text-caption desktop-only" :label="Sessao.usuario()"/>
	<q-btn q-small flat dense icon="logout" class="q-mr-sm text-caption desktop-only" to="/login"  @mouseenter="drawerConfig=false">
		<q-tooltip class="bg-green">Sair</q-tooltip>
	</q-btn>
	<q-btn flat round dense icon="more_vert" @mouseenter="$q.screen.gt.xs?drawerConfig=true:''">
		<q-menu class="bg-grey-2" style="width: 150px;" v-model="drawerConfig" @mouseleave="drawerConfig=false">
			<q-list v-for="item in menuSettings">
				<q-item clickable v-close-popup :to="item.to" v-if="verificarPerfil(item.perfil)">
					<q-item-section avatar><q-icon size="xs" :name="item.icone" /></q-item-section>
					<q-item-section class="text-caption">{{item.label}}</q-item-section>
				</q-item>
			</q-list>
		</q-menu>
	</q-btn>
</q-toolbar>
	
<!-- menu desktop -->
<q-toolbar :class="corToolBar" style="min-height:31px;height:31px;padding:0px 0px 0px 55px" v-if="$q.screen.gt.xs">
	<div class="dropdown" v-for="item in menu">
	  <q-btn flat square class="text-indigo-2" size="12px" :label="item.label" @mouseenter="alterarMenu(true)" :to="item.itens[0].to"/>
		<div class="dropdown-content bg-grey-2 text-black" :class="showMenu ? 'flex' : 'hidden'">
			<q-list v-for="sub in item.itens">
				<q-item clickable v-close-popup active-class="text-indigo-14" :to="sub.to" v-if="verificarPerfil(sub.perfil)">
					<q-item-section class="text-caption" @click="alterarMenu(false,item)" >{{sub.label}}</q-item-section>
				</q-item>
			</q-list>
		</div>
	</div> 
</q-toolbar>
</q-header>

<!-- menu mobile -->
<q-drawer elevated overlay v-model="drawer" :width="230" @mouseleave="drawer=false">
	<q-scroll-area class="fit bg-grey-2">
		<q-toolbar :class="corToolBar" v-if="$q.screen.lt.md">
			<q-btn flat dense icon="menu" class="q-mr-sm"/>
			<q-btn flat dense icon="person" class="q-mr-sm" to="/" :label="Sessao.usuario()"/>
			<q-space />
			<q-btn q-small flat dense icon="logout" class="q-mr-sm" to="/login"/>
		</q-toolbar>
		<q-list dense class="text-blue-grey-8" style="font-size: 14px">
			<q-item clickable v-ripple @click="novoCliente()">
				<q-item-section avatar><q-icon name="person_add" /></q-item-section>
				<q-item-section><q-item-label>Novo Cliente</q-item-label></q-item-section>
			</q-item>
			<q-item clickable v-ripple @click="novoPedido()">
				<q-item-section avatar><q-icon name="list_alt" /></q-item-section>
				<q-item-section><q-item-label>Novo Pedido</q-item-label></q-item-section>
			</q-item>
			<q-separator />
		</q-list>
		<q-expansion-item v-for="item in menu"
			v-model="item.ativo"
			class="text-blue-grey-8 text-uppercase text-weight-bold" 
			style="font-size: 14px"
			dense
			group="menu"
			:icon="item.icone"
			:label="item.label">
			<q-list v-for="sub in item.itens">
				<q-item dense clickable v-close-popup active-class="text-indigo-14" :to="sub.to" v-if="verificarPerfil(sub.perfil)">
					<q-item-section avatar></q-item-section>
					<q-item-section style="font-size: 14px" class="text-caption text-capitalize" @click="alterarMenu(false)">{{sub.label}}</q-item-section>
				</q-item>
			</q-list>
		</q-expansion-item>
	</q-scroll-area>
</q-drawer>

</template>
	
<style scoped>
.dropdown-content {
  display: none;
  position: absolute;
  box-shadow: 0px 2px 2px 1px rgba(0,0,0,0.3);
  z-index:999;
}
.dropdown:hover .dropdown-content {
  display:block;
}
</style>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import * as Sessao   from '../components/Sessao.js';
//const { getPaletteColor } = colors;

const router = useRouter();
const $q = useQuasar();
const msgTeste = (import.meta.env.VITE_TESTE == "SIM" ? ' *** TESTE *** ' : ''); 
const corToolBar = (import.meta.env.VITE_TESTE == "SIM" ? "bg-blue-grey-10 text-indigo-2" : "bg-indigo-7 text-indigo-2");
//console.log(getPaletteColor('grey-2'));

onMounted(async ()=> {
	Sessao.restaura();
})

let drawer = $ref(false);
let drawerConfig = $ref(false);
let showMenu = $ref(true);

let menu = $ref([ 
	{
	ativo: false,
	label: "Home", 
	icone: "home", 
	itens: [ 
			{ label: "Inicio", to: "/"}, 
			{ label: "Resumo", to: "/resumo", perfil: ['admin']},
		   ],
	},
	{
		ativo: false,
	label: "Clientes", 
	icone: "group",
	itens: [ 
			{ label: "Cadastro", to: "/clientes"}, 
			{ label: "Filhos", to: "/filhos"},
			{ label: "Mala Direta", to: "/maladireta", perfil: ['admin']},
			{ label: "Total Pedidos", to: "/clientestotalpedidos", perfil: ['admin']},
		],
	},
	{
	ativo: false,
	label: "Livros",
	icone: "library_books",
	itens: [ 
		{ label: "Cadastro", to: "/livros", perfil: ['admin']}, 
		{ label: "Editoras", to: "/editoras", perfil: ['admin']},
		{ label: "Fornecedores", to: "/fornecedores"},
		{ label: "Carga", to: "/livroscarga", perfil: ['admin']},
		],
	},
	{
	ativo: false,
	label: "Estoque",
	icone: "inventory_2",
	itens: [ 
		{ label: "Cadastro", to: "/estoque"}, 
		{ label: "Reservado", to: "/estoquereservado"}, 
		],
	},
	{
	ativo: false,
	label: "Escolas",
	icone: "store",
	itens: [ 
		{ label: "Cadastro", to: "/escolas"}, 
		{ label: "Listas", to: "/escolasListas"},
		{ label: "Livros", to: "/escolasListasLivros"},
		],
	},
	{
	ativo: false,
	label: "Pedidos",
	icone: "list_alt",
	itens: [ 
		{ label: "Cadastro", to: "/pedidos"}, 
		{ label: "Conferência", to: "/pedidosconferencia"}, 
		{ label: "Entrega", to: "/pedidosentrega"}, 
		{ label: "Pendentes", to: "/pedidospendentes"}, 
		{ label: "Email", to: "/pedidosemail"}, 
		],
	},
	{
	ativo: false,
	label: "Remessas",
	icone: "ballot",
	itens: [ 
		{ label: "Cadastro", to: "/remessas"}, 
		{ label: "Livros Indisponivel/Reimpressão", to: "/remessalivrosesgotados"}, 
		{ label: "Pedidos Livros", to: "/remessalivros"}, 
		{ label: "Total Pedidos", to: "/remessatotalpedidos"}, 
		],
	},
	{
	ativo: false,
	label: "Compras",
	icone: "toc",
	itens: [ 
		{ label: "Cadastro", to: "/compras"},
		{ label: "Fornecedor", to: "/comprasfornecedor"},
		{ label: "Resumo", to: "/comprasfornecedorresumo", perfil: ['admin']},
		],
	},
])

let menuSettings = $ref([ 
	{ label: "Parametros", icone: "settings", to: "/parametros", perfil: ['admin'] },
	{ label: "Templates",  icone: "article",  to: "/templates",  perfil: ['admin'] },
	{ label: "Usuarios",   icone: "group",    to: "/usuarios",   perfil: ['admin'] },
])

function novoCliente() {
	router.push({ name: "cliente", state: {id: 0} });
}

function novoPedido() {
	router.push({ name: "pedido", state: {id: 0} });
}

function alterarMenu(ativa,x) {
	showMenu = ativa;
	if (x) x.ativo = true;
}

function verificarPerfil(perfilMenu) {
	if (!perfilMenu) return true; // menu sem perfil
	const perfil = Sessao.perfil();
	if (perfilMenu.includes(perfil)) return true; // tem perfil
	return false;    // nao tem perfil
}

</script>
