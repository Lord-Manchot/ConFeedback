// tests/main.test.js
const { addFeedback } = require('../js/main');

// Mock de 'firebase/compat/app'
jest.mock('firebase/compat/app', () => {
  const firestore = require('firebase/compat/firestore');
  return {
    initializeApp: jest.fn(),
    firestore: jest.fn(() => firestore),
  };
});

// Mock de 'firebase/compat/firestore'
jest.mock('firebase/compat/firestore', () => ({
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  add: jest.fn(),
  FieldValue: {
    serverTimestamp: jest.fn(),
  },
}));

describe('addFeedback', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('ajoute un feedback correctement', async () => {
    const firebaseApp = require('firebase/compat/app');
    const firestoreMock = firebaseApp.firestore();

    // Simuler la fonction add de Firestore
    firestoreMock.add.mockResolvedValueOnce({ id: 'feedback123' });

    // Appeler la fonction addFeedback
    const feedback = await addFeedback('abc123', 5);

    // Vérifier que Firestore a été appelé correctement
    expect(firebaseApp.initializeApp).toHaveBeenCalled();
    expect(firestoreMock.collection).toHaveBeenCalledWith('feedbacks');
    expect(firestoreMock.add).toHaveBeenCalledWith({
      sessionId: 'abc123',
      rating: 5,
      timestamp: expect.any(Function), // serverTimestamp
    });

    // Vérifier que la fonction retourne les bonnes valeurs
    expect(feedback.sessionId).toBe('abc123');
    expect(feedback.rating).toBe(5);
  });

  it('gère les erreurs lors de l\'ajout du feedback', async () => {
    const firebaseApp = require('firebase/compat/app');
    const firestoreMock = firebaseApp.firestore();

    // Simuler une erreur lors de l'ajout
    firestoreMock.add.mockRejectedValueOnce(new Error('Erreur d\'ajout'));

    // Vérifier que la fonction lance une erreur
    await expect(addFeedback('abc123', 5)).rejects.toThrow('Erreur d\'ajout');
  });
});
