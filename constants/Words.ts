export interface WordPair {
  word: string
  answer: string
  direction: 'en-fr' | 'fr-en'
}

export const WORDS: WordPair[] = [
  // English to French
  { word: 'Cat', answer: 'Chat', direction: 'en-fr' },
  { word: 'Dog', answer: 'Chien', direction: 'en-fr' },
  { word: 'House', answer: 'Maison', direction: 'en-fr' },
  { word: 'Water', answer: 'Eau', direction: 'en-fr' },
  { word: 'Book', answer: 'Livre', direction: 'en-fr' },
  { word: 'Car', answer: 'Voiture', direction: 'en-fr' },
  { word: 'Love', answer: 'Amour', direction: 'en-fr' },
  { word: 'Friend', answer: 'Ami', direction: 'en-fr' },
  { word: 'Food', answer: 'Nourriture', direction: 'en-fr' },
  { word: 'Tree', answer: 'Arbre', direction: 'en-fr' },
  { word: 'Sun', answer: 'Soleil', direction: 'en-fr' },
  { word: 'Moon', answer: 'Lune', direction: 'en-fr' },
  { word: 'Flower', answer: 'Fleur', direction: 'en-fr' },
  { word: 'Time', answer: 'Temps', direction: 'en-fr' },
  { word: 'Money', answer: 'Argent', direction: 'en-fr' },
  { word: 'School', answer: 'Ecole', direction: 'en-fr' },
  { word: 'Family', answer: 'Famille', direction: 'en-fr' },
  { word: 'Music', answer: 'Musique', direction: 'en-fr' },
  { word: 'Color', answer: 'Couleur', direction: 'en-fr' },
  { word: 'Game', answer: 'Jeu', direction: 'en-fr' },
  { word: 'Heart', answer: 'Coeur', direction: 'en-fr' },
  { word: 'Hand', answer: 'Main', direction: 'en-fr' },
  { word: 'Eye', answer: 'Oeil', direction: 'en-fr' },
  { word: 'Smile', answer: 'Sourire', direction: 'en-fr' },
  { word: 'Dream', answer: 'Reve', direction: 'en-fr' },
  { word: 'Phone', answer: 'Telephone', direction: 'en-fr' },
  { word: 'Computer', answer: 'Ordinateur', direction: 'en-fr' },
  { word: 'Window', answer: 'Fenetre', direction: 'en-fr' },
  { word: 'Door', answer: 'Porte', direction: 'en-fr' },
  { word: 'Wall', answer: 'Mur', direction: 'en-fr' },
  { word: 'Sky', answer: 'Ciel', direction: 'en-fr' },
  { word: 'Ocean', answer: 'Ocean', direction: 'en-fr' },
  { word: 'Mountain', answer: 'Montagne', direction: 'en-fr' },
  { word: 'River', answer: 'Riviere', direction: 'en-fr' },
  { word: 'Forest', answer: 'Foret', direction: 'en-fr' },

  // French to English
  { word: 'Bonjour', answer: 'Hello', direction: 'fr-en' },
  { word: 'Merci', answer: 'Thank You', direction: 'fr-en' },
  { word: 'Oui', answer: 'Yes', direction: 'fr-en' },
  { word: 'Non', answer: 'No', direction: 'fr-en' },
  { word: 'Rouge', answer: 'Red', direction: 'fr-en' },
  { word: 'Bleu', answer: 'Blue', direction: 'fr-en' },
  { word: 'Vert', answer: 'Green', direction: 'fr-en' },
  { word: 'Blanc', answer: 'White', direction: 'fr-en' },
  { word: 'Noir', answer: 'Black', direction: 'fr-en' },
  { word: 'Pain', answer: 'Bread', direction: 'fr-en' },
  { word: 'Fromage', answer: 'Cheese', direction: 'fr-en' },
  { word: 'Pomme', answer: 'Apple', direction: 'fr-en' },
  { word: 'Orange', answer: 'Orange', direction: 'fr-en' },
  { word: 'Banane', answer: 'Banana', direction: 'fr-en' },
  { word: 'Poisson', answer: 'Fish', direction: 'fr-en' },
  { word: 'Oiseau', answer: 'Bird', direction: 'fr-en' },
  { word: 'Fenetre', answer: 'Window', direction: 'fr-en' },
  { word: 'Porte', answer: 'Door', direction: 'fr-en' },
  { word: 'Table', answer: 'Table', direction: 'fr-en' },
  { word: 'Chaise', answer: 'Chair', direction: 'fr-en' },
  { word: 'Jardin', answer: 'Garden', direction: 'fr-en' },
  { word: 'Ville', answer: 'City', direction: 'fr-en' },
  { word: 'Mer', answer: 'Sea', direction: 'fr-en' },
  { word: 'Montagne', answer: 'Mountain', direction: 'fr-en' },
  { word: 'Etoile', answer: 'Star', direction: 'fr-en' },
  { word: 'Nuage', answer: 'Cloud', direction: 'fr-en' },
  { word: 'Pluie', answer: 'Rain', direction: 'fr-en' },
  { word: 'Neige', answer: 'Snow', direction: 'fr-en' },
  { word: 'Soleil', answer: 'Sun', direction: 'fr-en' },
  { word: 'Lune', answer: 'Moon', direction: 'fr-en' },
  { word: 'Fleur', answer: 'Flower', direction: 'fr-en' },
  { word: 'Arbre', answer: 'Tree', direction: 'fr-en' },
  { word: 'Maison', answer: 'House', direction: 'fr-en' },
  { word: 'Voiture', answer: 'Car', direction: 'fr-en' },
  { word: 'Velo', answer: 'Bicycle', direction: 'fr-en' }
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
