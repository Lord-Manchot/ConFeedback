// main.js

document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const submitBtn = document.getElementById('submit-feedback-btn');
    const feedbackMessage = document.getElementById('feedback-message');
    let selectedRating = 0;

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
        if (selectedRating === 0) {
            feedbackMessage.textContent = "Veuillez sélectionner une note avant de soumettre.";
            feedbackMessage.style.color = "red";
            return;
        }

        try {
            await db.collection("feedbacks").add({
                rating: selectedRating,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            feedbackMessage.textContent = "Merci pour votre feedback !";
            feedbackMessage.style.color = "green";

            // Réinitialiser la sélection des étoiles
            selectedRating = 0;
            updateStars(selectedRating);
        } catch (e) {
            console.error("Erreur lors de l'envoi du feedback : ", e);
            feedbackMessage.textContent = "Erreur lors de l'envoi. Veuillez réessayer.";
            feedbackMessage.style.color = "red";
        }
    });
});
