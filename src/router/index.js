import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{ path: '/', name: 'home', component: () => import('../pages/Home.vue') },
	{ path: '/login', name: 'login', component:  () => import('../pages/Login.vue') },
	{ path: '/clientes', name: 'clientes', component: () => import('../pages/Clientes.vue') },
	{ path: '/clientestotalpedidos', name: 'clientestotalpedidos', component: () => import('../pages/ClientesTotalPedidos.vue') },
	{ path: '/cliente', name: 'cliente', component: () => import('../pages/ClientesEdit.vue') },
	{ path: '/compras', name: 'compras', component: () => import('../pages/Compras.vue') },
	{ path: '/compra', name: 'compra', component: () => import('../pages/ComprasEdit.vue') },
	{ path: '/compradetalhe', name: 'compradetalhe', component: () => import('../pages/ComprasDetalhe.vue') },
	{ path: '/comprasfornecedor', name: 'comprasfornecedor', component: () => import('../pages/ComprasFornecedor.vue') },
	{ path: '/comprasfornecedorlivros', name: 'comprasfornecedorlivros', component: () => import('../pages/ComprasFornecedorLivros.vue') },
	{ path: '/comprasfornecedorresumo', name: 'comprasfornecedorresumo', component: () => import('../pages/ComprasFornecedorResumo.vue') },
	{ path: '/editoras', name: 'editoras', component: () => import('../pages/Editoras.vue') },
	{ path: '/editora', name: 'editora', component: () => import('../pages/EditorasEdit.vue') },
	{ path: '/escolas', name: 'escolas', component: () => import('../pages/Escolas.vue') },
	{ path: '/escola', name: 'escola', component: () => import('../pages/EscolasEdit.vue') },
	{ path: '/escolaslistas', name: 'escolaslistas', component: () => import('../pages/EscolasListas.vue') },
	{ path: '/escolaslista', name: 'escolaslista', component: () => import('../pages/EscolasListasEdit.vue') },
	{ path: '/escolaslistaslivros', name: 'escolaslistaslivros', component: () => import('../pages/EscolasListasLivros.vue') },
	{ path: '/estoque', name: 'estoque', component: () => import('../pages/Estoque.vue') },
	{ path: '/estoqueinclui', name: 'estoqueinclui', component: () => import('../pages/EstoqueInclui.vue') },
	{ path: '/estoquereservado', name: 'estoquereservado', component: () => import('../pages/EstoqueReservado.vue') },
	{ path: '/filhos', name: 'filhos', component: () => import('../pages/Filhos.vue') },
	{ path: '/fornecedores', name: 'fornecedores', component: () => import('../pages/Fornecedores.vue') },
	{ path: '/fornecedor', name: 'fornecedor', component: () => import('../pages/FornecedoresEdit.vue') },
	{ path: '/livros', name: 'livros', component: () => import('../pages/Livros.vue') },
	{ path: '/livroscarga', name: 'livroscarga', component: () => import('../pages/LivrosCarga.vue') },
	{ path: '/livro', name: 'livro', component: () => import('../pages/LivrosEdit.vue') },
	{ path: '/maladireta', name: 'maladireta', component: () => import('../pages/MalaDireta.vue') },
	{ path: '/maladiretahistorico', name: 'maladiretahistorico', component: () => import('../pages/MalaDiretaHistorico.vue') },
	{ path: '/parametros', name: 'parametros', component: () => import('../pages/Parametros.vue') },
	{ path: '/pedidos', name: 'pedidos', component: () => import('../pages/Pedidos.vue') },
	{ path: '/pedidosconferencia', name: 'pedidosconferencia', component: () => import('../pages/PedidosConferencia.vue') },
	{ path: '/pedidosentrega', name: 'pedidosentrega', component: () => import('../pages/PedidosEntrega.vue') },
	{ path: '/pedidospendentes', name: 'pedidospendentes', component: () => import('../pages/PedidosPendentes.vue') },
	{ path: '/pedidodetalhe', name: 'pedidodetalhe', component: () => import('../pages/PedidosDetalhe.vue') },
	{ path: '/pedidosemail', name: 'pedidosemail', component: () => import('../pages/PedidosEmail.vue') },
	{ path: '/pedido', name: 'pedido', component: () => import('../pages/PedidosEdit.vue') },
	{ path: '/remessas', name: 'remessas', component: () => import('../pages/Remessas.vue') },
	{ path: '/remessa', name: 'remessa', component: () => import('../pages/RemessasEdit.vue') },
	{ path: '/remessadetalhe', name: 'remessadetalhe', component: () => import('../pages/RemessasDetalhe.vue') },
	{ path: '/remessalivros', name: 'remessalivros', component: () => import('../pages/RemessasLivros.vue') },
	{ path: '/remessalivrosesgotados', name: 'remessalivrosesgotados', component: () => import('../pages/RemessasLivrosEsgotados.vue') },
	{ path: '/remessatotalpedidos', name: 'remessatotalpedidos', component: () => import('../pages/RemessasTotalPedidos.vue') },
	{ path: '/resumo', name: 'resumo', component: () => import('../pages/Resumo.vue')},
	{ path: '/templates', name: 'templates', component: () => import('../pages/Templates.vue')},
	{ path: '/usuarios', name: 'usuarios', component: () => import('../pages/Usuarios.vue')},
	{ path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

router.beforeEach((to, from, next) => {  
	const publicPages = ['/login'];
	const authRequired = !publicPages.includes(to.path);
	const autenticado = sessionStorage.getItem('token');
	if (authRequired && !autenticado) {
		return next('/login');
	} else {
		next();
	}
})

export default router