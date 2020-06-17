window.onload = () => {

	var primitive_g, p_g, a_g, b_g, A_g, B_g,
		logging = document.getElementById('logging');

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

	generate_params = () => {
		
		let input_p = document.getElementById('param_p_alice'),
			input_g = document.getElementById('param_g_alice'),
			send_button = document.getElementById('send'),
			generate_button = document.getElementById('generate_button'),
			bob_p = document.getElementById('param_p_bob'),
			bob_g = document.getElementById('param_g_bob');
		let p, k, primitive;
		let array_of_primes = sieve_of_eratosthenes(100);
		let random_index = Math.floor(Math.random() * 100);
		let paragraph = document.createElement("p");

		paragraph.textContent = "Алиса сгенерировала параметры p и g!";

		logging.appendChild(paragraph);

		for(k = 0; k <= random_index; k++){
			if(array_of_primes[k] == 1) {
				p = k;
			}
		}

		generate_button.style.display = "none";
		send_button.style.display = "inline";

		input_p.value = p;
		bob_p.value = p;
		primitive = get_primitive_root(p);
		input_g.value = primitive;
		bob_g.value = primitive;

		p_g = p;
		primitive_g = primitive;
	}

	send_params = () => {
		let params = document.getElementById('bobs_params'),
			button = document.getElementById('send'),
			button1 = document.getElementById('generate_private_keys');
		let paragraph = document.createElement("p");

		paragraph.textContent = "Алиса отправила Бобу параметры p и g!";
		logging.appendChild(paragraph);

		params.style.display = "block";
		button.style.display = "none";
		button1.style.display = "inline";
	}

	generate_private_keys = () => {
		let input_alice = document.getElementById('private_alice'),
			input_bob = document.getElementById('private_bob'),
			random_num1 = Math.floor(Math.random() * 100),
		 	random_num2 = Math.floor(Math.random() * 100),
		 	private_bob_key_inp = document.getElementById('private_bob_inp'),
		 	private_alice_key_inp = document.getElementById('private_alice_inp'),
		 	button = document.getElementById('generate_private_keys'),
		 	button1 = document.getElementById('generate_public_keys');
		let paragraph = document.createElement("p");

		paragraph.textContent = "Обе стороны сгенерировали приватные ключи!";

		logging.appendChild(paragraph);

		input_alice.style.display = "block";
		input_bob.style.display = "block";

		private_alice_inp.value = random_num1;
		private_bob_inp.value = random_num2;
		button.style.display = "none";
		button1.style.display = "inline";

		a_g = random_num1;
		b_g = random_num2;
	}

	calculate_public_keys = () => {
		let input_alice = document.getElementById('private_bob_inp_a'),
			input_bob = document.getElementById('private_alice_inp_b'),
			button = document.getElementById('generate_public_keys'),
			show1 = document.getElementById('public_bob'),
			show2 = document.getElementById('public_alice'),
			show3 = document.getElementById('calculate_final_key');
		let paragraph = document.createElement("p");

		paragraph.textContent = "Обе стороны вычислили и обменялись публичными ключами!";
		logging.appendChild(paragraph);


		A_g = powmod(primitive_g,a_g,p_g);
		B_g = powmod(primitive_g,b_g,p_g);

		button.style.display = "none";
		show1.style.display = "block";
		show2.style.display = "block";
		show3.style.display = "inline";
		input_alice.value = B_g;
		input_bob.value = A_g;
	}

	calculate_final_key = () => {
		let alice_final = powmod(B_g,a_g,p_g);
			bob_final = powmod(A_g,b_g,p_g);
			button = document.getElementById('calculate_final_key'),
			show1 = document.getElementById('final_alice'),
			show2 = document.getElementById('final_bob'),
			inp1 = document.getElementById('final_b'),
			inp2 = document.getElementById('final_a'),
			button_show = document.getElementById('refresh');
		let paragraph = document.createElement("p");

		paragraph.textContent = "Работа завершена обе стороны получили финальный ключ!";

		logging.appendChild(paragraph);

			button.style.display = "none";
			button_show.style.display = "inline";
			show1.style.display = "block";
			show2.style.display = "block";
			inp1.value = bob_final;
			inp2.value = alice_final;
	}

	refresh = () =>{
		let clear1 = document.getElementById('param_p_alice'),
			clear2 = document.getElementById('param_g_alice'),
			clear3 = document.getElementById('param_p_bob'),
			clear4 = document.getElementById('param_g_bob'),
			hide1 = document.getElementById('bobs_params'),
			hide2 = document.getElementById('private_alice'),
			hide3 = document.getElementById('final_alice'),
			hide4 = document.getElementById('public_bob'),
			hide5 = document.getElementById('private_bob'),
			hide6 = document.getElementById('public_alice'),
			hide7 = document.getElementById('final_bob'),
			show1 = document.getElementById('generate_button'),
			refresh_button = document.getElementById('refresh'),
			p = document.querySelectorAll('#logging p');

		clear1.value = "";
		clear2.value = "";
		clear3.value = "";
		clear4.value = "";
		hide5.value = "";
		hide6.value = "";
		hide7.value = "";

		hide1.style.display = "none";
		hide2.style.display = "none";
		hide3.style.display = "none";
		hide4.style.display = "none";
		hide5.style.display = "none";
		hide6.style.display = "none";
		hide7.style.display = "none";

		refresh_button.style.display = "none";

		show1.style.display = "inline";

		for(let i = 0, len = p.length; i < len; i++){
			p[i].parentNode.removeChild(p[i]);
		}

		primitive_g = 0;
		p_g = 0;
		a_g = 0;
		b_g = 0;
		A_g = 0;
		B_g = 0;
	}
}
