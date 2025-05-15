<template>
<DialogMsg ref="dialogMsg"/>

<div class="row q-ma-xs">
	<div class="col-grow text-h6">{{(id==0 ? 'Novo Cliente': 'Editar Cliente')}}</div>
	<div class="col-auto q-gutter-x-xs">
		<q-btn class="q-ma-xs col-auto" push color="green"   label="salvar" size="13px" @click="editarCliente()"/>
		<q-btn class="q-ma-xs col-auto" push color="primary" label="voltar" size="13px" @click="voltar()"/>
	</div>
</div>

<q-form ref="form" class="q-mt-md">
	<div class="row q-ma-xs q-gutter-x-xs">
		<q-input stack-label class="col-grow col-md-grow"
			label="Nome"
			v-model="dadosCliente.nomeCliente" :rules="[regraObrigatorio]" hide-bottom-space
		/>
		<q-input stack-label class="col-3 col-md-1"
			label="Nome Curto"
			v-model="dadosCliente.nomeCurto"
		/>
		<q-input stack-label class="col-12 col-md-3" type="email"
			label="Email"
			v-model="dadosCliente.email" :rules="[regraObrigatorio,regraEmail]" hide-bottom-space
		/>
		<q-input stack-label class="col-4 col-md-1" type="tel"
			label="Celular"
			v-model="dadosCliente.celular"
			@blur="(val)=> dadosCliente.celular = Util.formatTelefone(val.target.value)"
		/>
		<q-input stack-label class="col-3 col-md-1" type="tel"
			label="Telefone"
			v-model="dadosCliente.telefone"
			@blur="(val)=> dadosCliente.telefone = Util.formatTelefone(val.target.value)"
		/>
		<q-input stack-label class="col-4 col-md-1"
			label="CPF"
			v-model="dadosCliente.cpf"
			mask="###.###.###-##"
		/>
	</div>
	<div class="row q-ma-xs q-gutter-x-xs">
		<q-input stack-label class="col-12 col-md-grow" 
			label="Endereço"
			v-model="dadosCliente.endereco"
		/>
		<q-input stack-label class="col-3 col-md-1" type="tel"
			label="CEP"
			v-model="dadosCliente.cep"
			mask="#####-###"
		/>
		<q-select class="col-grow col-md-2" :popup-content-style="{ backgroundColor: '#f5f5f5' }"
			stack-label map-options emit-value options-dense hide-bottom-space rounded options-cover
			label="Escola Principal"
			v-model="dadosCliente.cdEscola"
			behavior="menu"
			:options="escolasItens"
			option-label="nomeEscola"
			option-value="idEscola"
		/>
		<q-select class="col-grow col-md-2" :popup-content-style="{ backgroundColor: '#f5f5f5' }"
			stack-label options-dense hide-bottom-space rounded options-cover clearable
			label="Categoria"
			v-model="dadosCliente.categoria"
			behavior="menu"
			:options="categoriaItens"
		/>
		<div></div>
	</div>
	<div class="row q-ma-xs q-gutter-x-xs">
		<q-input stack-label class="col-12 col-md-grow"
			label="Observação"
			v-model="dadosCliente.observacao"
		/>
		<div class="row q-gutter-x-xs col-12 col-md-3">
			<q-input stack-label class="col-4" readonly
				label="Data Cadastro"
				:model-value="Util.formatData(dadosCliente.dataInclusao)"
			/>
			<q-input stack-label class="col-5" readonly
				label="Data Atualização"
				:model-value="Util.formatData(dadosCliente.dataAtualizacao)"
			/>
			<div class="col-1" style="margin-top: 7px;">
				<span class="row text-center text-caption text-grey-7">Pedidos</span>
				<q-avatar class="q-ml-md q-md-xs" size="25px" color="green" text-color="white">{{ dadosCliente.totalPedidos ? dadosCliente.totalPedidos : 0 }}</q-avatar>
			</div>
		</div>
		<div class="row q-gutter-x-xs col-12 col-md-2">
			<q-select stack-label options-dense hide-bottom-space class="col-5" :popup-content-style="{ backgroundColor: '#f5f5f5' }"
				label="Filhos"
				behavior="menu"
				v-model="dadosCliente.qtdeFilhos" 
				:options="qtdeFilhosItens"
				@update:model-value="alterarFilhos"
			/>
			<q-select stack-label options-dense hide-bottom-space class="col-grow" :popup-content-style="{ backgroundColor: '#f5f5f5' }" :disable="dadosCliente.qtdeFilhos<1"
				label="Ano Escolar"
				behavior="menu"
				v-model="dadosFilhos.anoEscolar" 
				:options="anoEscolarItens" 
				:rules="dadosCliente.qtdeFilhos>0 ? [regraObrigatorio] : []"
			/>
			<div></div>
		</div>
	</div>
	<div class="row q-ma-xs q-gutter-x-xs">		
		<q-select v-for="filho in dadosFilhos.nomes" class="col-12 col-md-3" :popup-content-style="{ backgroundColor: '#f5f5f5' }"
			stack-label map-options emit-value options-dense hide-bottom-space rounded options-cover
			:label="filho.nomeFilho"
			v-model="filho.cdEscolaLista"
			behavior="menu"
			:options="escolasListasItens"
			option-label="nomeEscolaLista"
			option-value="idEscolaLista"
			:rules="dadosCliente.qtdeFilhos>0 ? [regraObrigatorio] : []"
		/>
	</div>
</q-form>

</template>

<style scoped>
</style>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DialogMsg from '../components/DialogMsg.vue';
import * as Api  from '../components/Api.js'
import * as Util from '../components/Util.js';

const router = useRouter();

let anoLetivo = $ref();
let anoEscolarItens = $ref([]);
let categoriaItens = $ref(["Bronze","Prata","Ouro"]);
let qtdeFilhosItens = $ref([0,1,2,3,4,5,6]);
let id = $ref(0);
let dialogMsg = $ref(null);
let dadosCliente = $ref({});
let dadosFilhos = $ref({});
let escolasItens = $ref([]);
let escolasListasItens = $ref([]);
let form = $ref(null);
let regraObrigatorio = $ref(val => !!val || 'Obrigatório.');
let regraEmail = $ref(x => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(x) || 'e-mail invalido.'})

onMounted(async ()=> {
	await obterAnoLetivo();
	id = history.state.id;
	if (!id) {
		dadosCliente.qtdeFilhos = 0;
		dadosFilhos = { anoEscolar: anoLetivo, nomes: []};
	}
	await obterCliente();
	obterEscolas();
	obterEscolasListas();
})

async function obterCliente() {
	try {
		if (!id) return;
		const response = await Api.obter("/clientes",id);
		dadosCliente = response.dados.cliente;
		dadosFilhos = response.dados.filhos;
	}
	catch (erro)  {
		await dialogMsg.show("OK","Erro",erro);
		return;
	}
}

async function obterEscolas() {
	const response = await Api.obter("/escolas/nome");
	escolasItens = response.dados;
}

async function obterEscolasListas() {
	const response = await Api.obter("/escolaslistas/nome");
	escolasListasItens = response.dados;
}

async function obterAnoLetivo() {
	const response = await Api.obter("/parametros/anoletivo");
	anoLetivo = response.dados.anoLetivo;
	for (let ano = anoLetivo-2; ano < anoLetivo+2; ano++){
        anoEscolarItens.push(ano);
    }
}

async function editarCliente() {
	try {
		const ok = await form.validate();
		if (!ok) {
			await dialogMsg.show("Ok","Aviso","Campos Obrigatórios. Reentre.");
			return;
		}
		if (dadosCliente.cep && dadosCliente.cep.length < 9) {
			await dialogMsg.show("Ok","","CEP Inválido. Reentre.");
			return;
		}
		const dados = {cliente: dadosCliente, filhos: dadosFilhos};
		if (id==0) {
			const response = await Api.criar("/clientes",dados);
			id = response.dados.cliente;
			await dialogMsg.show("OK","Aviso","Cliente incluido: "+dadosCliente.nomeCliente);
		}
		else {
			const response = await Api.atualizar("/clientes",dados,id);
			await dialogMsg.show("OK","Aviso","Cliente alterado: "+dadosCliente.nomeCliente);
		}
		router.back();
	} 
	catch(erro) {
		await dialogMsg.show("OK","Erro",erro);
	}
}

function alterarFilhos(valor) {
	let total = valor;
	let totalAnt = dadosFilhos.nomes.length;
	let nomes = dadosFilhos.nomes;
	let dif = total - totalAnt;
	let i = 0;

	if (dif > 0) {
		for(i=0;i<dif;i++) nomes.push({idFilho: 0,nomeFilho: "Filho" + (totalAnt + i + 1), anoEscolar: anoLetivo, cdEscolaLista: null, nomeEscolaLista: ''});
	} else {
		for(i=dif;i<0;i++) nomes.pop();
	}
	dadosFilhos.nomes = nomes;
	if (dadosCliente.qtdeFilhos==0) dadosFilhos.anoEscolar='';
	if (dadosCliente.qtdeFilhos>0 && dadosFilhos.anoEscolar=='') dadosFilhos.anoEscolar = anoLetivo;
}

function voltar() { 
	router.back();
}
</script>