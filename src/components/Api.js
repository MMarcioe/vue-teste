import axios from "axios";
import * as Util from "./Util.js";
import * as Sessao from '../components/Sessao.js';

const GET=1, POST=2, PUT=3, DELETE=4

export async function listar(servico,param) {
	try {
		let filtroApi = "";
		let carac = "?";

		if (param.pagina) {
			filtroApi = filtroApi + carac +
			"itemsPerPage=" + param.pagina?.rowsPerPage +
			"&page=" + param.pagina?.page +
			"&sortBy=" + param.pagina?.sortBy +
			"&sortDesc=" + param.pagina?.descending;
			carac = "&";
		}
		if (param.busca) {
			filtroApi = filtroApi + carac + "search=" + Util.retValor(param.busca);
			carac = "&";
		}
		if (param.filtro) {
			for (const [chave, valor] of Object.entries(param.filtro)) {
				const valor2 = Util.retValor(valor);
				if (valor2) {
					filtroApi = filtroApi + carac + chave + "=" + valor2;
					carac = "&";
				}
			}		
		}
		if (param.colunas) {
			for (const i in param.colunas) {
				if (param.colunas[i].filtro && param.colunas[i].filtro!='0') filtroApi = filtroApi + carac + param.colunas[i].field + "=" + param.colunas[i].filtro;
				carac = "&";
			}
		}
		let url = import.meta.env.VITE_API + servico + filtroApi;
		let response = await api(GET,url);
		return response.data;
	}
	catch (error) {
		const msg = (error.response && error.response.data.msg) ? error.response.data.msg : error;
		throw msg;
	}
}

export async function obter(servico,id,param) {
	try {
		let url = import.meta.env.VITE_API + servico + retId(id) + retParam(param);
		let response = await api(GET,url);
		return response.data;
	}
	catch (error) {
		const msg = (error.response && error.response.data.msg) ? error.response.data.msg : error;
		throw msg;
	}
}

export async function atualizar(servico,dados,id) {
	try {
		let dadosObj = Object.assign({}, dados);
		let url = import.meta.env.VITE_API + servico + retId(id);
		let response = await api(PUT,url,dadosObj);
		return response.data;
	}
	catch (error) {
		const msg = (error.response && error.response.data.msg) ? error.response.data.msg : error;
		throw msg;
	}
}

export async function criar(servico,dados) {
	try {
		const dadosObj = Object.assign({}, dados);
		let url = import.meta.env.VITE_API + servico;
		let response = await api(POST,url,dadosObj);
		return response.data;
	}
	catch (error) {
		const msg = (error.response && error.response.data.msg) ? error.response.data.msg : error;
		throw msg;
	}
}

export async function enviar(servico,dados,id) {
	try {
		const dadosObj = Object.assign({}, dados);
		let url = import.meta.env.VITE_API + servico + retId(id);
		let response = await api(POST,url,dadosObj);
		return response.data;
	}
	catch (error) {
		const msg = (error.response && error.response.data.msg) ? error.response.data.msg : error;
		throw msg;
	}
}

export async function excluir(servico,id,id2) {
	try {
		let url = import.meta.env.VITE_API + servico + retId(id) + retId(id2);
		let response = await api(DELETE,url);
		return response.data;
	}
	catch (error) {
		const msg = (error.response && error.response.data.msg) ? error.response.data.msg : error;
		throw msg;
	}
}

export async function login(dados) {
	try {
		let dadosObj = Object.assign({}, dados);
		let url = import.meta.env.VITE_API + "/login"
		axios.defaults.withCredentials = true;
		let response = await axios.post(url,dadosObj,{timeout: 3000});
		return response.data;
	}
	catch (error) {
		if (error.code == "ERR_NETWORK" || error.code=="ECONNABORTED" ) throw ("Erro de rede/conexão");
		throw (error);
	}
}

export async function refresh() {
	try {
		let url = import.meta.env.VITE_API + "/refreshtoken"
		axios.defaults.withCredentials = true;
		let response = await axios.post(url,{timeout: 3000});
		Sessao.token(response.data.dados.token);
		return response.data;
	}
	catch (error) {
		throw (error);
	}
}

async function api(tipo,url,dados) {
	let response;

	try {
		if (tipo==POST) response = await axios.post(url,dados);
		else if (tipo==PUT) response = await axios.put(url,dados);
		else if (tipo==DELETE) response = await axios.delete(url);
		else response = await axios.get(url);
		return response;	
	}
	catch (error) {
		/*
		if (error.response.status == 403) {
			try {
				await refresh();
				if (tipo==POST) response = await axios.post(url,dados);
				else if (tipo==PUT) response = await axios.put(url,dados);
				else if (tipo==DELETE) response = await axios.delete(url);
				else response = await axios.get(url);
				return response;
			}
			catch (error) {
				throw (error);	
			}
		} */
		throw (error);
	}
}

function retId(id) {
	const id2 = Util.retValor(id);
	const retorno = id2 ? "/" + id2 : "";
	return retorno;
}

function retParam(param) {
	let retorno = "";
	let carac = "?";

	if (!param) return(retorno);

	for (const [chave, valor] of Object.entries(param)) {
		const valor2 = Util.retValor(valor);
		if (valor2) {
			retorno = retorno + carac + chave + "=" + valor2;
			carac = "&";
		}
	}
	return retorno;
}