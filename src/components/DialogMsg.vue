<template>
<q-dialog class="" v-model="dialogShow" :persistent="dialogTitulo?true:false">
	<q-card class="" style="min-width:340px; height:auto">
		<div class="bg-indigo text-subtitle2 text-center text-white q-pa-xs" v-if="dialogTitulo">{{dialogTitulo}}</div>
		<q-card-section>
			<div class="text-center q-mt-md text-subtitle2" v-html="dialogTexto"></div>
		</q-card-section>
		<q-card-actions :align="alinha" v-if="dialogBotao">
			<q-btn flat autofocus size="15px" v-if="dialogBotaoOk"       color="green text-weight-bold" text @click="close('OK')" @keyup.enter="close('OK')" label="OK"/>
			<q-btn flat size="15px" v-if="dialogBotaoSim"      color="green text-weight-bold" text @click="close('SIM')" @keyup.enter="close('SIM')" label="SIM"/>
			<q-btn flat size="15px" v-if="dialogBotaoNao"      color="indigo text-weight-bold" text @click="close('NAO')" @keyup.enter="close('NAO')" label="NÃO"/>
			<q-btn flat size="15px" v-if="dialogBotaoExcluir"  color="red text-weight-bold" text @click="close('EXCLUIR')" @keyup.enter="close('EXCLUIR')" label="EXCLUIR"/>
			<q-btn flat size="15px" v-if="dialogBotaoCancelar" color="indigo text-weight-bold" text @click="close('CANCELAR')" @keyup.enter="close('CANCELAR')" label="CANCELAR"/>
		</q-card-actions>
	</q-card>
</q-dialog>
</template>
  
<script setup>

let alinha = $ref('right');
let dialogBotao = $ref(false);
let dialogBotaoOk = $ref(false);
let dialogBotaoSim = $ref(false);
let dialogBotaoNao = $ref(false);
let dialogBotaoExcluir = $ref(false);
let dialogBotaoCancelar = $ref(false);
let dialogShow = $ref(false);
let dialogTitulo = $ref("");
let dialogTexto = $ref("");
let resolve; // pointer para funcao resolver Promise (r)

defineExpose( {show} );

async function show(tipo,titulo,msg) {
	const tipoDialog = tipo.toLowerCase();

	dialogTitulo = "";
	dialogTexto = "";

	if (titulo) {
		dialogTitulo = titulo.toUpperCase();
	}
	if (msg) {
		dialogTexto = msg;
	}
	if (tipoDialog=="ok") {
		alinha='center';
		dialogBotao = true; 
		dialogBotaoOk=true; dialogBotaoSim=false; dialogBotaoNao=false; dialogBotaoExcluir=false; dialogBotaoCancelar=false;
		dialogShow  = true;
	}
	if (tipoDialog=="sn") { 
		alinha='right';
		dialogBotao = true; 
		dialogBotaoOk=false; dialogBotaoSim=true; dialogBotaoNao=true; dialogBotaoExcluir=false; dialogBotaoCancelar=false;
		dialogShow  = true;
	}
	if (tipoDialog=="ec") { 
		alinha='right';
		dialogBotao = true; 
		dialogBotaoOk=false; dialogBotaoSim=false; dialogBotaoNao=false; dialogBotaoExcluir=true; dialogBotaoCancelar=true;
		dialogShow  = true;
	}
	if (tipoDialog=="on") { 
		dialogBotao = false;
		dialogShow  = true;
		return;
	}
	if (tipoDialog=="off") { 
		dialogBotao = false;
		dialogShow  = false;
		return;
	}
	return new Promise((r) => {
		resolve = r;
	})
}

function close(tipo) {
	dialogShow = false;
	resolve(tipo);
}

</script>