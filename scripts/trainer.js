window.onload = () => {

	var a,b,mod,answer,equals = [], equals_mod = [];

	sieve_of_eratosthenes = (max) => {
	
	let k,tmp;

	let sieve = [];
	sieve[1] = 0;

	for(k = 2; k <= max; k++){
		sieve[k] = 1;
	}

	for(k = 2; k*k <= max; k++){
		if(sieve[k] == 1){
			for(tmp = k*k; tmp <= max; tmp+=k){
				sieve[tmp] = 0;
			}
		}
	}

		return sieve;
	}

	powmod = (num,exp,module) => {

		let res = 1, tmp = num,i = 0;
		let bits = [];

		while(exp > 0) {
			bits[i] = exp % 2;
			exp = Math.floor(exp / 2);
			i+=1;
		}


		for(i = 0; i < bits.length; i++){
			if(bits[i] == 1) {
				res = (res * tmp) % module;
			}
			tmp = tmp**2 % module;
		}

		return res % module;
	}

	get_primitive_root = (num) => {
		let i, prim;
		let factors = [];
		let phi = num-1,  n = phi;

		for (i = 2; i*i <= n; i++){
			if (n % i == 0) {
				factors.push(i);
				while (n % i == 0)
					n /= i;
			}
		}

		if (n > 1)
			factors.push(n);
	 
		for (prim = 2; prim <= num; prim++) {
			let flag = true;
			for (i = 0; i < factors.length && flag; i++){
				flag &= powmod (prim, phi / factors[i], num) != 1;
			}
			if (flag) return prim;
		}
		return 0;
	}

	generate_answer = (primitive, p) => {
		
		let random_answer = Math.floor(Math.random() * 100);

		while((random_answer == 0) || (typeof random_answer == 'undefined')) {
			random_answer = Math.floor(Math.random() * 100);
		}

		random_answer = random_answer % p;

		return powmod(primitive,random_answer,p);
	}

	start_trainer = () =>{

		let show_calcs_qs = document.getElementById('calcs_qs'),
			show_table = document.getElementById('show_table'),
			div_help = document.getElementById('show_answer'),
			start_button = document.getElementById("start"),
			trainer_inner = document.getElementById("trainer_inner"),
			prime = document.getElementById('prime'),
			base = document.getElementById('base'),
			equal_inner = document.getElementById('equal'),
			array_of_primes = sieve_of_eratosthenes(100),
			random_index = Math.floor(Math.random() * 100),
			p,primitive,equal;

		equals = [];
		equals_mod = [];
		show_table.innerHTML = '';
		show_calcs_qs.innerHTML = '';


		for(let k = 0; k <= random_index; k++){
			if(array_of_primes[k] == 1) {
				p = k;
			}
		}

		primitive = get_primitive_root(p);
		equal = generate_answer(primitive,p);

		a = primitive;
		b = equal;
		mod = p;

		prime.innerHTML = mod;
		base.innerHTML = a;
		equal_inner.innerHTML = b;

		start_button.style.display = "none";
		trainer_inner.style.display = "block";
		div_help.style.display = "none";

		answer = pohlig_alg();

	}

	checkAnswer = () =>{
		let user_answer = document.getElementById('user_answer'),
			res = document.getElementById('result');

		if(user_answer.value == answer){
			alert("Верно");
			start_trainer();
			user_answer.value = "";
		} else {
			alert("Неверно");
			user_answer.value = "";
		}
	}

	factorise = (n) => {
		let factors = [],
			i;

		for (i = 2; i*i <= n; i++){
			if (n % i == 0) {
				factors.push(i);
				n /= i;
				while (n % i == 0){
					factors.push(i);
					n /= i;
				}
			}
		}

		if (n > 1)
			factors.push(n);

		return factors;
	}

	get_qs = (n) => {
		
		let i;
		let qs = [];

		for (i = 2; i*i <= n; i++){
			if (n % i == 0) {
				qs.push(i);
				while (n % i == 0)
					n /= i;
			}
		}

		if (n > 1)
			qs.push(n);

		return qs;
	} 

	get_alphaq = (q,arr) =>{

		let alpha = 0;

		for(let i = 0; i < arr.length; i++){
			if (arr[i] == q) alpha +=1;
		}

		return alpha;
	}

	calc_table_for_q = (q) => {
		let table = [],exp;

		for(let i = 0; i < q; i++){
			exp = ((mod - 1) / q) * i;
			table[i] = powmod(a,exp,mod);
		}

		return table;
	}

	find_in_table = (num,table) => {
		for(let i = 0; i < table.length; i++){
			if (num == table[i]) return i;
		}
	}

	get_reverse_num = (num, m) => {

		let numerator = 1;

		while((numerator % num) != 0){
			numerator+=m;
		}

		return numerator / num;
	}

	calc_res_for_q = (q,alpha,table_q) => {

		let exp, tmp, prev_x,rev, res = 0,module, sum_prev = 0;

		exp = (mod - 1) / (q);
		tmp = powmod(b,exp,mod);
		prev_x = find_in_table(tmp, table_q)
		sum_prev+=prev_x;

		res = prev_x;

		for(let i = 1; i < alpha; i++){
			exp = (mod - 1) / (q ** (i+1));
			rev = get_reverse_num(powmod(a,sum_prev,mod),mod);
			tmp = powmod((b*rev % mod),exp,mod);
			prev_x = find_in_table(tmp, table_q);
			sum_prev = sum_prev  + (prev_x * q**i);
			res = res + prev_x * (q ** i);
		}

		module = q ** alpha;

		return {res: res, module: module};
	}

	chinese_remainder_theorem = () => {
		let x = 0,M = 1, Mis = [],keys = [],values = [], Mis_neg = [];

		for(let i = 0; i < equals_mod.length; i++){
			M*=equals_mod[i];
		}


		for(let i = 0; i < equals.length; i++){
			Mis[i] = M / equals_mod[i];
		}

		for(let i = 0; i < equals.length; i++){
			Mis_neg[i] = get_reverse_num(Mis[i], equals_mod[i]);
		}

		for(let i = 0; i < equals.length; i++){
			x = x + equals[i] * Mis[i] * Mis_neg[i];
		}

		return x % M;

	}

	pohlig_alg = () => {

		let phi,factors = [], qs = [],table = [],i,calcs, tmp1,tmp2;

		phi = mod - 1;

		factors = factorise(phi);

		qs = get_qs(phi);

		for(i = 0; i < qs.length; i++){
			table = calc_table_for_q(qs[i]);
			tmp1 = calc_res_for_q(qs[i], get_alphaq(qs[i],factors),table).res;
			equals.push(tmp1);
			tmp2 = calc_res_for_q(qs[i], get_alphaq(qs[i],factors),table).module;
			equals_mod.push(tmp2);
		}

		calcs = chinese_remainder_theorem();

		return calcs;
	}

	Show_help = () => {
		let wolfram = document.getElementById('wolfram'),
			div_help = document.getElementById('show_answer'),
			param_a = document.getElementById('show_a'),
			param_b = document.getElementById('show_b'),
			param_p = document.getElementById('show_mod'),
			factors = document.getElementById('show_factors'),
			div_table = document.getElementById('show_table'),
			div_qs = document.getElementById('calcs_qs'),
			param_answer = document.getElementById('get_answer'),
			table,qs = [],factors_arr,alphas = [], eqv = new Map(),vals = [],keys = [],link = '';

			factors_arr = factorise(mod-1);

			qs = get_qs(mod-1);

			for(let i = 0; i < qs.length; i++){
				table = calc_table_for_q(qs[i]);
				alphas = get_alphaq(qs[i] , factors_arr);

				for(let j = 0; j < table.length; j++){
					let paragraph = document.createElement("p");
					paragraph.innerHTML = 'R[' + qs[i]+ ',' + j + "]" + ' = ' + table[j];
					div_table.appendChild(paragraph);
				}
				
			}

			for(let i = 0; i < qs.length; i++){

				let h3 = document.createElement("h3");
				let paragraph = document.createElement("p");

				h3.innerHTML = "Для q = " + qs[i] + ":";
				paragraph.innerHTML = "x = " + equals[i] + " (mod " + equals_mod[i] + ")";

				div_qs.appendChild(h3);
				div_qs.appendChild(paragraph);
			}

			param_a.innerHTML = a;
			param_b.innerHTML = b;
			param_p.innerHTML = mod;
			factors.innerHTML = factors_arr.toString();
			div_help.style.display = "block";

			param_answer.innerHTML = answer;
			link = "https://www.wolframalpha.com/input/?i=" + a + "%5Ex+%3D" + b +"mod+" + mod;
			wolfram.setAttribute("href", link);
	} 

}