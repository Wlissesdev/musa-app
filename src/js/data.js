/**
 * MUSA — dados estáticos
 * Todo o conteúdo fixo do app: humores, tags, frases, rituais, livros, respiração, abas e citações.
 * Nenhuma dependência: este módulo só exporta constantes.
 */

export const STORAGE_KEY = "musa.v2";
export const IMG = "icons/nise.jpg";

// Criptografia disponível? (necessário para o PIN — só em contextos seguros)
export const SEC = !!(typeof crypto !== "undefined" && crypto.subtle);

// Humor e rótulos
export const MOODS = ["😢", "😕", "😐", "🙂", "😊"];
export const MOOD_LABELS = ["Muito mal", "Mal", "Neutra", "Bem", "Muito bem"];

// O que você sente
export const TAGS = [
  "Ansiosa", "Cansada", "Irritada", "Triste", "Calma", "Grata",
  "Sobrecarregada", "Sozinha", "Motivada", "Insônia", "Com medo", "Esperançosa"
];

// Sugestões de escrita
export const PROMPTS = [
  "O que meu corpo está tentando me dizer hoje?",
  "Qual silêncio eu carreguei esta semana e posso nomear?",
  "Quem eu era aos 10 anos e o que ela diria para mim agora?",
  "Uma coisa que fiz por mim hoje, mesmo pequena.",
  "O que eu gostaria de ouvir de alguém neste momento?",
  "Qual desejo meu eu deixei de lado e por quê?",
  "Escreva uma carta curta para a mulher que você será em um ano."
];

// Provocações para o ateliê
export const AP = [
  "Desenhe como o seu dia está por dentro, sem se preocupar com o resultado.",
  "Escolha uma cor para o que você sente agora e deixe a mão se mover.",
  "Faça linhas, formas ou manchas. Não precisa ser “bonito”.",
  "Desenhe um lugar onde você se sente segura."
];

// Frases curtas que rotacionam na tela de hoje
export const QS = [
  ["Não se curem além da conta. Gente curada demais é gente chata.", "Frase atribuída a Nise da Silveira"],
  ["Sentir não é fraqueza. É informação sobre o que importa para você.", "MUSA"],
  ["Descansar também é cuidar. Você não precisa merecer uma pausa.", "MUSA"],
  ["Pedir ajuda é uma forma de coragem, não de fracasso.", "MUSA"],
  ["Hoje basta um passo pequeno. Ele ainda conta.", "MUSA"]
];

// Rituais de cuidado
export const RIT = [
  ["agua", "💧", "Água"],
  ["sono", "🌙", "Dormir bem"],
  ["corpo", "🚶‍♀️", "Mover o corpo"],
  ["sol", "☀️", "Sol ou ar livre"],
  ["gente", "💬", "Falar com alguém"],
  ["arte", "🎨", "Momento de arte"]
];

// Leituras que abrem conversa
export const BOOKS = [
  ["A Redoma de Vidro", "Sylvia Plath", "Quando tudo parece certo por fora e pesado por dentro: o que você ainda não disse em voz alta?"],
  ["Garota, Interrompida", "Susanna Kaysen", "Quem decide o que é “normal”? Como você se trata quando foge do esperado?"],
  ["As Virgens Suicidas", "Jeffrey Eugenides", "Quem ouve quem está em silêncio ao seu redor?"],
  ["A Bolsa Amarela", "Lygia Bojunga", "Que desejos você guarda na sua “bolsa”?"],
  ["Olhos d'água", "Conceição Evaristo", "Que memórias de mulheres da sua família ainda moram em você?"],
  ["Ciranda de Pedra", "Lygia Fagundes Telles", "Que afeto faltou e como você pode oferecê-lo a si mesma?"]
];

// Respiração guiada: [nome, [[passo, segundos, escala], ...]]
export const BR = [
  ["Relaxar · 4-2-6", [["Inspire", 4, 1.3], ["Segure", 2, 1.3], ["Solte", 6, 1]]],
  ["Quadrada · 4-4-4-4", [["Inspire", 4, 1.3], ["Segure", 4, 1.3], ["Solte", 4, 1], ["Segure", 4, 1]]],
  ["Sono · 4-7-8", [["Inspire", 4, 1.3], ["Segure", 7, 1.3], ["Solte", 8, 1]]]
];

// Abas de navegação
export const TABS = [
  ["hoje", "🌸", "Hoje"],
  ["diario", "📚", "Diário"],
  ["ateli", "🎨", "Ateliê"],
  ["calma", "🌿", "Calma"],
  ["eu", "✨", "Eu"]
];

// Citações literárias da abertura (21)
export const QT = [
  ["Quem é feliz faz os outros felizes também.", "Lucy Maud Montgomery", ""],
  ["Grandes palavras são necessárias para expressar grandes ideias.", "Lucy Maud Montgomery", ""],
  ["É muito bom ler sobre tristezas e imaginar-se vivendo-as heroicamente, mas não é tão agradável quando você realmente as vivencia, não é?", "Lucy Maud Montgomery", ""],
  ["Pela minha experiência, quase sempre é possível desfrutar das coisas se você se decidir firmemente a fazê-lo.", "Lucy Maud Montgomery", ""],
  ["Devemos lamentar nossos erros e aprender com eles, mas nunca carregá-los conosco para o futuro.", "Lucy Maud Montgomery", ""],
  ["A inocência não dura a vida inteira\nBrinque de ser sério\nE leve a sério a brincadeira", "Rita Lee", ""],
  ["Não é sobre o que você diz, é sobre o que você faz.", "Rita Lee", ""],
  ["Enquanto estou viva e\nCheia de graça,\nTalvez ainda faça\nUm monte de gente feliz!", "Rita Lee", ""],
  ["Imaginação é quando a inteligência se diverte.", "Rita Lee", ""],
  ["A vida tem isso\nNo fim tudo faz sentido\nEntão até mais\nNão adianta olhar pra trás.", "Rita Lee", ""],
  ["Quem já não se perguntou: sou um monstro ou isto é ser um ser humano?", "Clarice Lispector", "A hora da estrela"],
  ["Olhou-se e levemente pensou: tão jovem e já com ferrugem", "Clarice Lispector", "A hora da estrela"],
  ["Não sou feia, mas nunca ganhei os homens pela beleza, então o humor sempre foi meu trunfo, mesmo que às vezes descambasse para a autodepreciação", "Paula Gicovate", "Notas sobre a impermanência"],
  ["gente apaixonada se apega a tão pouco, né?", "Paula Gicovate", "Notas sobre a impermanência"],
  ["é ruim ser devolvido em algum lugar para dormir sozinho de madrugada, é ruim ser devolvido em qualquer lugar", "Mariana Salomão Carrara", "É sempre a hora da nossa morte amém"],
  ["E quem salvará a mãe que deixa sua menina que não tem nem dois anos aos cuidados da vizinha triste, pessoas tristes não servem para olhar crianças", "Mariana Salomão Carrara", "É sempre a hora da nossa morte amém"],
  ["Mas achava também que qualquer vida era um risco e o risco maior era o de não tentar viver.", "Ana Davenga", ""],
  ["A corda bamba do tempo, varal no qual estava estendida a vida, era frágil, podendo se romper a qualquer hora.", "O cooper de Cida", ""],
  ["E quando a dor vem encostar-se a nós, enquanto um olho chora, o outro espia o tempo procurando a solução.", "Ayoluwa", "a alegria do nosso povo"],
  ["Se ao menos o medo me fizesse recuar, pelo contrário, avanço mais e mais na mesma proporção desse medo. É como se o medo fosse uma coragem ao contrário.", "A gente combinamos de não morrer", ""],
  ["até passou pela minha cabeça mudar de rumo aparecer na sala da Maria Antônia, contar tudo sobre o meu collant, meu náufrago, mas eu não queria que ela me visse assim tão líquida, talvez até pensasse que sou fraca.", "Aline Bei", "Pequena coreografia do adeus"]
];
