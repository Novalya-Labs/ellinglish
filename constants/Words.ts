export interface WordPair {
  word: string
  answer: string
  direction: 'en-fr' | 'fr-en'
}

export const WORDS: WordPair[] = [
  // English to French
  { word: 'cat', answer: 'chat', direction: 'en-fr' },
  { word: 'dog', answer: 'chien', direction: 'en-fr' },
  { word: 'house', answer: 'maison', direction: 'en-fr' },
  { word: 'water', answer: 'eau', direction: 'en-fr' },
  { word: 'book', answer: 'livre', direction: 'en-fr' },
  { word: 'car', answer: 'voiture', direction: 'en-fr' },
  { word: 'love', answer: 'amour', direction: 'en-fr' },
  { word: 'friend', answer: 'ami', direction: 'en-fr' },
  { word: 'food', answer: 'nourriture', direction: 'en-fr' },
  { word: 'tree', answer: 'arbre', direction: 'en-fr' },
  { word: 'sun', answer: 'soleil', direction: 'en-fr' },
  { word: 'moon', answer: 'lune', direction: 'en-fr' },
  { word: 'flower', answer: 'fleur', direction: 'en-fr' },
  { word: 'time', answer: 'temps', direction: 'en-fr' },
  { word: 'money', answer: 'argent', direction: 'en-fr' },
  { word: 'school', answer: 'ecole', direction: 'en-fr' },
  { word: 'family', answer: 'famille', direction: 'en-fr' },
  { word: 'music', answer: 'musique', direction: 'en-fr' },
  { word: 'color', answer: 'couleur', direction: 'en-fr' },
  { word: 'game', answer: 'jeu', direction: 'en-fr' },
  { word: 'heart', answer: 'coeur', direction: 'en-fr' },
  { word: 'hand', answer: 'main', direction: 'en-fr' },
  { word: 'eye', answer: 'oeil', direction: 'en-fr' },
  { word: 'smile', answer: 'sourire', direction: 'en-fr' },
  { word: 'dream', answer: 'reve', direction: 'en-fr' },

  // French to English
  { word: 'bonjour', answer: 'hello', direction: 'fr-en' },
  { word: 'merci', answer: 'thank you', direction: 'fr-en' },
  { word: 'oui', answer: 'yes', direction: 'fr-en' },
  { word: 'non', answer: 'no', direction: 'fr-en' },
  { word: 'rouge', answer: 'red', direction: 'fr-en' },
  { word: 'bleu', answer: 'blue', direction: 'fr-en' },
  { word: 'vert', answer: 'green', direction: 'fr-en' },
  { word: 'blanc', answer: 'white', direction: 'fr-en' },
  { word: 'noir', answer: 'black', direction: 'fr-en' },
  { word: 'pain', answer: 'bread', direction: 'fr-en' },
  { word: 'fromage', answer: 'cheese', direction: 'fr-en' },
  { word: 'pomme', answer: 'apple', direction: 'fr-en' },
  { word: 'orange', answer: 'orange', direction: 'fr-en' },
  { word: 'banane', answer: 'banana', direction: 'fr-en' },
  { word: 'poisson', answer: 'fish', direction: 'fr-en' },
  { word: 'oiseau', answer: 'bird', direction: 'fr-en' },
  { word: 'fenetre', answer: 'window', direction: 'fr-en' },
  { word: 'porte', answer: 'door', direction: 'fr-en' },
  { word: 'table', answer: 'table', direction: 'fr-en' },
  { word: 'chaise', answer: 'chair', direction: 'fr-en' },
  { word: 'jardin', answer: 'garden', direction: 'fr-en' },
  { word: 'ville', answer: 'city', direction: 'fr-en' },
  { word: 'mer', answer: 'sea', direction: 'fr-en' },
  { word: 'montagne', answer: 'mountain', direction: 'fr-en' },
  { word: 'etoile', answer: 'star', direction: 'fr-en' },
  { word: 'nuage', answer: 'cloud', direction: 'fr-en' },
  { word: 'pluie', answer: 'rain', direction: 'fr-en' },
  { word: 'neige', answer: 'snow', direction: 'fr-en' }
]

export const getRandomWord = (): WordPair => {
  const randomIndex = Math.floor(Math.random() * WORDS.length)
  return WORDS[randomIndex]
}

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}
