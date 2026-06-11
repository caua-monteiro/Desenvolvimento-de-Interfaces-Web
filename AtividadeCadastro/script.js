// Validações básicas do front-end
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('cadForm');
  const toggle = document.getElementById('togglePwd');
  const pwd = document.getElementById('senha');
  const result = document.getElementById('result');

  toggle.addEventListener('click', ()=>{
    if(pwd.type === 'password'){ pwd.type = 'text'; toggle.textContent = 'Ocultar'; }
    else { pwd.type = 'password'; toggle.textContent = 'Mostrar'; }
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    clearErrors();
    result.textContent = '';
    const data = new FormData(form);
    const values = Object.fromEntries(data.entries());

    let valid = true;

    // Campos obrigatórios simples
    ['nome','sobrenome','mae','rg','cpf','endereco','ingresso','login','senha','telefone','email'].forEach(key=>{
      if(!values[key] || values[key].trim() === ''){
        showError(key,'Campo obrigatório');
        valid = false;
      }
    });

    // CPF: remover não dígitos e checar tamanho 11
    if(values.cpf){
      const cpf = values.cpf.replace(/\D/g,'');
      if(cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)){
        showError('cpf','CPF inválido (11 dígitos)'); valid = false;
      }
    }

    // RG: exigir entre 7 e 12 dígitos (validação simples)
    if(values.rg){
      const rg = values.rg.replace(/\D/g,'');
      if(rg.length < 7 || rg.length > 12){ showError('rg','RG inválido'); valid = false; }
    }

    // Telefone: 10 ou 11 dígitos
    if(values.telefone){
      const t = values.telefone.replace(/\D/g,'');
      if(t.length < 10 || t.length > 11){ showError('telefone','Telefone inválido'); valid = false; }
    }

    // Email: regex simples
    if(values.email){
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!re.test(values.email)){ showError('email','Email inválido'); valid = false; }
    }

    // Senha: 8-16, upper, lower, special
    if(values.senha){
      const s = values.senha;
      if(s.length < 8 || s.length > 16){ showError('senha','Senha deve ter 8-16 caracteres'); valid = false; }
      if(!/[A-Z]/.test(s) || !/[a-z]/.test(s) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(s)){
        showError('senha','Senha precisa de maiúscula, minúscula e caractere especial'); valid = false;
      }
    }

    if(valid){
      result.style.color = 'green';
      result.textContent = 'Validação OK — (apenas front-end). Pronto para envio.';
      // Aqui poderíamos enviar via fetch para uma API se existisse
      // form.reset();
    } else {
      result.style.color = 'crimson';
      result.textContent = 'Existem erros no formulário. Corrija e tente novamente.';
    }
  });

  function showError(field, msg){
    const el = document.querySelector('.error[data-for="'+field+'"]');
    if(el) el.textContent = msg;
  }
  function clearErrors(){
    document.querySelectorAll('.error').forEach(e=>e.textContent='');
  }
});
