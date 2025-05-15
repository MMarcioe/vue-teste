<template>
	<q-layout view="hHh lpR fFf">
		<Menu v-if="usuario()"></Menu>
		<q-page-container>
			<router-view></router-view>	
		</q-page-container>
		<q-footer v-if="usuario()">
			<q-toolbar class="bg-grey-5" style="min-height:20px;height:20px">
				<q-space />
				<q-btn q-small flat dense size="12px" class="text-capitalize text-left">Marcio Eliseu&copy;&nbsp;Versão {{ versao }}
					<q-tooltip class="bg-blue">Cloud: {{cloud}}<br>Api: {{ api }}</q-tooltip>
				</q-btn>
			</q-toolbar>
		</q-footer>
	</q-layout>
</template>

<script setup>
import Menu        from './pages/Menu.vue'
import { usuario } from './components/Sessao.js';

const versao = import.meta.env.VITE_VERSAO;
const cloud = import.meta.env.VITE_CLOUD;
const api = import.meta.env.VITE_API;
</script>
  