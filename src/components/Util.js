import { date } from 'quasar';

export function retValor(campo) {
	if (!campo || campo==null || campo=='null' || campo=='undefined' || campo==undefined || campo=='') return '';
	return campo;
}

export function retValorInt(campo) {
	if (!campo || campo==null || campo=='null' || campo=='undefined' || campo==undefined || campo=='') return '';
	if (isNaN(campo)) return null;
	return parseInt(campo);
}

export function getIniciais(nome) {
	if (!nome) return "";
	let x = nome.split(" ");
	let a = nome.charAt(0);
	let b = "";
	if (x.length > 1) {
		b = x[x.length -1].charAt(0); 
	}
	let r = a + b;
	return r.toUpperCase();
}

export async function delay(tempo) {
	await new Promise(resolve => setTimeout(resolve, tempo));
}

export function setRouterParam(nome, params) {
	if (nome.charAt(0) === '/')	nome = nome.slice(1);
	const rota = "router." + nome.toLowerCase();
	sessionStorage.setItem(rota,JSON.stringify(params));
}

export function getRouterParam(nome) {
	if (nome.charAt(0) === '/')	nome = nome.slice(1);
	const rota = "router." + nome.toLowerCase();
	const params = JSON.parse(sessionStorage.getItem(rota));
	return params;
}

export function removeRouterParam(nome) {
	if (nome.charAt(0) === '/')	nome = nome.slice(1);
	const rota = "router." + nome.toLowerCase();
	sessionStorage.removeItem(rota);
}

export function formatData(data, mascara) {
	const formato = mascara ? mascara : 'DD/MM/YYYY';
	return data ? date.formatDate(data, formato) : '';
}

export function dataAtual() {
	const data = new Date();
	const formato = 'DD/MM/YYYY';
	return data ? date.formatDate(data, formato) : '';
}

export function formataNr(number,digitos,locale) {
	if (!number) return number;
	const tipo = (locale ? locale : 'pt-br');
	const dig  = (isNaN(digitos) ? 2: digitos);
	return(new Intl.NumberFormat(tipo,{minimumFractionDigits: dig, maximumFractionDigits: dig}).format(number));
}

export function formatValorToNum(valorStr) {
	if (!valorStr) return valorStr;
	let valor = valorStr.replaceAll(".","").replaceAll(",",".");
	let nr = parseFloat(valor).toFixed(2);
	return (nr);
}

export function formatValor(valorStr) {
	let valor, ponto1, ponto2;

	if (!valorStr) return null;
	ponto1 = valorStr[valorStr.length - 3];
	ponto2 = valorStr[valorStr.length - 2];
	if (ponto1==',' || ponto2==',') {
		valor = valorStr.replaceAll('.','').replaceAll(',', '.');
	}
	else {
		if (ponto1=='.' || ponto2=='.') {
			valor = valorStr.replaceAll(',','');
		}
		else {
			valor = valorStr.replaceAll('.','').replaceAll(',', '');
		}
	}
	let nr = +valor;
	return (nr.toFixed(2));
}

export function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}
