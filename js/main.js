// js/main.js

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBACDSdCgEozm2oGtg86I3XdipfOf31SV4",
    authDomain: "confeedback-9c989.firebaseapp.com",
    projectId: "confeedback-9c989",
    storageBucket: "confeedback-9c989.appspot.com",
    messagingSenderId: "532157861887",
    appId: "1:532157861887:web:336fab0e99cf720d61e1ca"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Fonction pour ajouter un feedback
  async function addFeedback(sessionId, rating) {
    try {
      await db.collection("feedbacks").add({
        sessionId: sessionId,
        rating: rating,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { sessionId, rating };
    } catch (e) {
      console.error("Erreur lors de l'envoi du feedback : ", e);
      throw e;
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-feedback-btn');
    const feedbackMessage = document.getElementById('feedback-message');
    const sessionTitle = document.getElementById('session-title');
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;
    let sessionId = '';
  
    // Fonction pour obtenir les paramètres de l'URL
    function getURLParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }
  
    // Fonction pour charger les détails de la session
    async function loadSessionDetails(sessionId) {
      try {
        const sessionDoc = await db.collection('sessions').doc(sessionId).get();
        if (sessionDoc.exists) {
          const session = sessionDoc.data();
          sessionTitle.textContent = `Feedback pour : ${session.title}`;
        } else {
          sessionTitle.textContent = "Session non trouvée.";
          submitBtn.disabled = true;
          feedbackMessage.textContent = "La session spécifiée n'existe pas.";
          feedbackMessage.style.color = "red";
        }
      } catch (e) {
        console.error("Erreur lors du chargement de la session : ", e);
        sessionTitle.textContent = "Erreur de chargement de la session.";
        submitBtn.disabled = true;
        feedbackMessage.textContent = "Erreur lors du chargement de la session. Veuillez réessayer plus tard.";
        feedbackMessage.style.color = "red";
      }
    }
  
    // Fonction pour mettre à jour l'affichage des étoiles
    function updateStars(rating) {
      stars.forEach(star => {
        if (star.getAttribute('data-value') <= rating) {
          star.classList.add('selected');
        } else {
          star.classList.remove('selected');
        }
      });
    }
  
    // Ajouter les événements de survol et de clic aux étoiles
    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const hoverValue = parseInt(star.getAttribute('data-value'));
        updateStars(hoverValue);
      });
  
      star.addEventListener('mouseout', () => {
        updateStars(selectedRating);
      });
  
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-value'));
        updateStars(selectedRating);
      });
    });
  
    // Gérer la soumission du feedback
    submitBtn.addEventListener('click', async () => {
      if (!sessionId) {
        feedbackMessage.textContent = "Aucune session spécifiée.";
        feedbackMessage.style.color = "red";
        return;
      }
  
      if (selectedRating === 0) {
        feedbackMessage.textContent = "Veuillez sélectionner une note avant de soumettre.";
        feedbackMessage.style.color = "red";
        return;
      }
  
      try {
        const feedback = await addFeedback(sessionId, selectedRating);
        feedbackMessage.textContent = "Merci pour votre feedback !";
        feedbackMessage.style.color = "green";
  
        // Réinitialiser la sélection des étoiles
        selectedRating = 0;
        updateStars(selectedRating);
      } catch (e) {
        feedbackMessage.textContent = "Erreur lors de l'envoi. Veuillez réessayer.";
        feedbackMessage.style.color = "red";
      }
    });
  
    // Charger la session au chargement du DOM
    sessionId = getURLParameter('sessionId');
    if (sessionId) {
      loadSessionDetails(sessionId);
    } else {
      sessionTitle.textContent = "Aucune session spécifiée.";
      submitBtn.disabled = true;
      feedbackMessage.textContent = "Aucune session spécifiée pour soumettre un feedback.";
      feedbackMessage.style.color = "red";
    }
  });
  
  // Exporter la fonction addFeedback pour les tests
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { addFeedback };
  }
  