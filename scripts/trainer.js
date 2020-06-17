window.onload = () => {

	var a,b,mod,answer;

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

		return powmod(primitive,random_answer,p);
	}

	start_trainer = () =>{

		let start_button = document.getElementById("start"),
			trainer_inner = document.getElementById("trainer_inner"),
			prime = document.getElementById('prime'),
			base = document.getElementById('base'),
			equal_inner = document.getElementById('equal'),
			array_of_primes = sieve_of_eratosthenes(100),
			random_index = Math.floor(Math.random() * 100),
			p,primitive,equal;

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
	
		answer = pohlig_alg();

	}

	checkAnswer = () =>{
		let user_answer = document.getElementById('user_answer'),
			res = document.getElementById('result');

		if(user_answer.value == answer){
			res.innerHTML = "Верно!";
			start_trainer();
			user_answer.value = "";
		} else {
			res.innerHTML = "Неверно!";
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

		let r = [];
		r[0] = 0;

		r[1] = 1;

		num = num % m;

		for (let i = 2; i < m; i++)
			r[i] = (m - Math.floor(m/i) * r[m%i] % m) % m;

		return r[num];
	}

	calc_res_for_q = (q,alpha,table_q) => {

		let exp, tmp, prev_x,rev, res = 0,module;

		exp = (mod - 1) / (q);
		tmp = powmod(b,exp,mod);
		prev_x = find_in_table(tmp, table_q)

		res = prev_x;


		for(let i = 1; i < alpha; i++){
			exp = (mod - 1) / (q ** (i+1));
			rev = get_reverse_num(powmod(a,prev_x,mod),mod);
			tmp = powmod((b*rev % mod),exp,mod);
			prev_x = find_in_table(tmp, table_q);
			res = res + prev_x * (q ** i);
		}

		module = q ** alpha;

		return {res: res, module: module};
	}

	chinese_remainder_theorem = (eqv) => {
		let x = 0,M = 1, Mis = [],keys = [],values = [], Mis_neg = [];

		for(let key of eqv.keys()){
			keys.push(key);
		}

		for(let val of eqv.values()){
			M*=val;
			values.push(val);
		}

		for(let i = 0; i < eqv.size; i++){
			Mis[i] = M / values[i];
		}

		for(let i = 0; i < eqv.size; i++){
			Mis_neg[i] = get_reverse_num(Mis[i], values[i]);
		}

		for(let i = 0; i < eqv.size; i++){
			x = x + keys[i] * Mis[i] * Mis_neg[i];
		}

		return x % M;

	}

	pohlig_alg = () => {

		let phi,factors = [], qs = [],table = [],i, eqv = new Map(), answer,calcs;

		phi = mod - 1;

		factors = factorise(phi);
		qs = get_qs(phi);

		for(i = 0; i < qs.length; i++){
			table = calc_table_for_q(qs[i]);
			eqv.set(calc_res_for_q(qs[i],get_alphaq(qs[i],factors),table).res, calc_res_for_q(qs[i],get_alphaq(qs[i],factors),table).module);
		}

		calcs = chinese_remainder_theorem(eqv);

		return calcs;
	}

}