<template>

<div class="row justify-center items-center" v-if="!Sessao.usuario()">
	<div class="col-11 col-md-4 q-mt-lg q-pa-lg">
		<q-card square class="">
			<q-toolbar :class="corToolBar" style="min-height:36px;height:36px">
				<div class="text-h6 fit text-center q-pa-xs">Login</div>
			</q-toolbar>
			<q-card-section>
				<q-form ref="form" class="q-gutter-md q-mt-xs q-pa-lg">
					<q-input autofocus square stack-label v-model="usuario" type="text" label="Usuário"
						:rules="[regraObrigatorio]" lazy-rules="ondemand"
						@focus="corIconeUsuario('indigo')" 
						@blur="corIconeUsuario('grey')" 
						@click="resetaMsg" @keydown="resetaMsg" 
						@keyup.enter="login()">
						<template v-slot:before><q-icon :color="iconeUsuario" name="person" /></template>
					</q-input>
					<q-input square stack-label v-model="senha" :type="isPwd ? 'password' : 'text'" label="Senha" 
						:rules="[regraObrigatorio]" lazy-rules="ondemand"
						@focus="corIconeSenha('indigo')" 
						@blur="corIconeSenha('grey')" 
						@click="resetaMsg" 
						@keydown="resetaMsg" 
						@keyup.enter="login()">
						<template v-slot:before><q-icon :color="iconeSenha" name="lock" /></template>
						<template v-slot:append>
							<q-icon
							:name="isPwd ? 'visibility_off' : 'visibility'"
							:color="iconeSenha"
							class="cursor-pointer"
							@click="isPwd = !isPwd" 
							/>
						</template>
					</q-input>
				</q-form>
				<q-banner dense class="text-red text-center" style="min-height: 40px;"><q-icon size="22px" name="error" v-if="mensagem"></q-icon>{{ mensagem }}</q-banner>
			</q-card-section>

			<q-card-actions class="q-pt-xs justify-center">
				<q-btn class="text-weight-bold" style="width: 100px;" unelevated type="submit" color="light-green-8" size="md" label="Login" @click="login" />
			</q-card-actions>
		</q-card>
	</div>
</div>

</template>

<style>
</style>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as Api    from '../components/Api.js';
import * as Sessao from '../components/Sessao.js';

let router = useRouter();
let usuario = $ref();
let senha = $ref();
let mensagem = $ref();
let iconeUsuario = $ref("indigo");
let iconeSenha = $ref("grey");
let isPwd = $ref(true);
let corToolBar = (import.meta.env.VITE_TESTE == "SIM" ? "bg-blue-grey-10 text-indigo-2" : "bg-indigo-7 text-indigo-2");
let form = $ref(null);
let regraObrigatorio = $ref(val => !!val || 'Obrigatório.');

onMounted(()=> {
	if (Sessao.usuario()) {
		logout();
	}
})

function corIconeUsuario(cor) {
	iconeUsuario = cor;
}

function corIconeSenha(cor) {
	iconeSenha = cor;
}

function resetaMsg() {
	mensagem = "";
}

async function login() {
	try {
		form.validate();
		if (!usuario || !senha) {
			return;
		}
		const dados = { usuario: usuario, senha: senha};
		const resposta = await Api.login(dados);
		if (resposta.msg!="OK") {
			mensagem = resposta.msg;
			return;
		}
		Sessao.token(resposta.dados.token);
		Sessao.usuario(resposta.dados.usuario);
		Sessao.email(resposta.dados.email);
		Sessao.perfil(resposta.dados.perfil);
		router.push("/");
	}
	catch (error) {
		const msg = (error.response != undefined && error.response.data.msg != undefined) ? error.response.data.msg : error;
		mensagem = msg;
	}
}

async function logout() {
	try {
		const dados = { usuario: Sessao.usuario()};
		await Api.enviar("/logout",dados);
		Sessao.limpa();
	}
	catch (error) {
		const msg = (error.response != undefined && error.response.data.msg != undefined) ? error.response.data.msg : error;
		mensagem = msg;
	}
}
</script>
