// 🚀 Mapeamento inicial rápido com tokens mais usados
window.simbolosParaIds = {
  ada: 'cardano',
  apt: 'aptos',
  arb: 'arbitrum',
  avax: 'avalanche-2',
  bch: 'bitcoin-cash',
  bnb: 'binancecoin',
  btc: 'bitcoin',
  doge: 'dogecoin',
  dot: 'polkadot',
  eth: 'ethereum',
  iclua: 'iclea',
  link: 'chainlink',
  ltc: 'litecoin',
  makerdown: 'maker',
  matic: 'polygon',
  near: 'near',
  shib: 'shiba-inu',
  sol: 'solana',
  solana: 'solana',
  stx: 'stacks',
  sui: 'sui',
  trx: 'tron',
  uni: 'uniswap',
  xlm: 'stellar',
  xrp: 'ripple'
};

let tokensAdicionaisCarregados = false;

// 🔄 Carregamento de todos os tokens em segundo plano
async function carregarTokensAdicionais() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
    const data = await res.json();

    data.forEach(coin => {
      const simbolo = coin.symbol.toLowerCase();
      const id = coin.id;
      if (!window.simbolosParaIds[simbolo]) {
        window.simbolosParaIds[simbolo] = id;
      }
    });

    tokensAdicionaisCarregados = true;
    console.log('✅ Tokens adicionais carregados:', Object.keys(window.simbolosParaIds).length, 'símbolos disponíveis');
  } catch (error) {
    console.error('❌ Erro ao carregar tokens adicionais:', error);
  }
}

carregarTokensAdicionais();

// 🧪 Função principal de análise RSI
async function analisar() {
  const entradaRaw = document.getElementById('coin').value.trim();
  const entrada = entradaRaw.toLowerCase();
  const resultado = document.getElementById('resultado');

  if (!entrada) {
    resultado.innerText = 'Por favor, digite o símbolo da moeda.';
    resultado.style.background = 'orange';
    return;
  }

  const coin = window.simbolosParaIds[entrada];

  if (!coin) {
    const aguardando = tokensAdicionaisCarregados
      ? 'Token não encontrado. Verifique a sigla digitada.'
      : 'Token ainda está sendo carregado. Aguarde alguns segundos...';
    resultado.innerText = aguardando;
    resultado.style.background = 'gray';
    return;
  }

  resultado.innerText = 'Carregando dados do token...';
  resultado.style.background = 'lightyellow';

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=14`);
    if (!res.ok) throw new Error(`Moeda não encontrada: ${coin}`);

    const data = await res.json();
    const prices = data.prices?.map(p => p[1]);

    if (!prices || prices.length < 14) {
      resultado.innerText = 'Não há dados suficientes para análise.';
      resultado.style.background = 'gray';
      return;
    }

    // 📈 Cálculo simplificado do RSI
    let gains = 0, losses = 0;
    for (let i = 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff > 0) gains += diff;
      else losses -= diff;
    }

    const avgGain = gains / prices.length;
    const avgLoss = losses / prices.length;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    resultado.innerText = `RSI atual de ${entradaRaw.toUpperCase()}: ${rsi.toFixed(2)}`;

    if (rsi < 30) {
      resultado.style.background = 'lightgreen';
      resultado.innerText += "\n💚 Boa hora para comprar!";
    } else if (rsi > 70) {
      resultado.style.background = 'tomato';
      resultado.innerText += "\n🚨 Hora de considerar vender!";
    } else {
      resultado.style.background = 'lightgray';
      resultado.innerText += "\n⚖️ Situação neutra.";
    }

  } catch (error) {
    resultado.innerText = 'Erro ao buscar dados: moeda inválida ou API indisponível.';
    resultado.style.background = 'gray';
    console.error('❌ Erro na análise:', error);
  }
}
