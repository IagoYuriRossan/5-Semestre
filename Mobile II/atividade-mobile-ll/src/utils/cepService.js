export const buscarEnderecoPorCep = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  if (!response.ok) {
    throw new Error('Não foi possível consultar o CEP. Tente novamente.');
  }

  const data = await response.json();
  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    rua: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade ?? '',
    uf: data.uf ?? '',
  };
};
