import axios from "axios";

let sessao = $ref({
	usuario: '',
	email: '',
	perfil: '',
	token: '',
});

export function restaura() {   
	if (!sessao.token) {
		sessao.usuario   		= sessionStorage.getItem('usuario');
		sessao.email     		= sessionStorage.getItem('email');
		sessao.perfil    		= sessionStorage.getItem('perfil');
		sessao.token     		= sessionStorage.getItem('token');
		axios.defaults.headers.common['Authorization'] =  sessao.token;
	}     
};

export function limpa() {
	sessao.usuario   = '';
	sessao.email     = '';
	sessao.perfil    = '';
	sessao.token	 = '';
	sessionStorage.clear();
	axios.defaults.headers.common['Authorization'] =  '';
};

export function usuario(vlr) {
	if (vlr) {
		sessao.usuario = vlr;
		sessionStorage.setItem('usuario',vlr);
	}
	if (!sessao.usuario) {
		sessao.usuario = sessionStorage.getItem('usuario');
	}
	return sessao.usuario;
};

export function token(vlr) {
	if (vlr) {
		sessao.token = vlr;
		sessionStorage.setItem('token',vlr);
		axios.defaults.headers.common['Authorization'] = vlr;
	}
	if (!sessao.token) {
		sessao.token = sessionStorage.getItem('token');
		axios.defaults.headers.common['Authorization'] = sessao.token;
	}
	return sessao.token;
};

export function email(vlr) {
	if (vlr) {
		sessao.email = vlr;
		sessionStorage.setItem('email',vlr);
	}
	if (!sessao.email) {
		sessao.email = sessionStorage.getItem('email');
	}
	return sessao.email;
};

export function perfil(vlr) {
	if (vlr) {
		sessao.perfil = vlr;
		sessionStorage.setItem('perfil',vlr);
	}
	if (!sessao.perfil) {
		sessao.perfil = sessionStorage.getItem('perfil');
	}
	return sessao.perfil.toLowerCase();
};
