document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('code-input');
    const keys = document.querySelectorAll('.key');
    const correctCode = '2007';

    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (key.classList.contains('clear')) {
                codeInput.value = '';
            } else if (key.classList.contains('enter')) {
                checkCode();
            } else {
                if (codeInput.value.length < 4) {
                    codeInput.value += key.textContent;
                }
            }
        });
    });

    function checkCode() {
        if (codeInput.value === correctCode) {
            // Add success animation
            document.getElementById('entry-section').classList.add('success');
            
            // Transition to next section after animation
            setTimeout(() => {
                transitionToSection('floating-heart-section');
            }, 1000);
        } else {
            // Add error animation
            codeInput.classList.add('error');
            setTimeout(() => {
                codeInput.classList.remove('error');
                codeInput.value = '';
            }, 500);
        }
    }

    function transitionToSection(sectionId) {
        // Hide current section
        document.querySelector('.section.active').classList.remove('active');
        
        // Show new section
        const newSection = document.getElementById(sectionId);
        newSection.classList.add('active');
    }

    // Add new section transition handlers
    function initFloatingHeart() {
        const heart = document.querySelector('.floating-heart');
        heart.addEventListener('click', () => {
            heart.style.transform = 'scale(1.5)';
            setTimeout(() => {
                transitionToSection('puzzle-section');
            }, 500);
        });
    }

    function handlePieceClick(e) {
        const piece = e.target;
        if (!piece.classList.contains('puzzle-piece')) return;
        
        const currentContainer = piece.parentElement;
        const emptySlot = document.querySelector('.puzzle-slot:empty');
        
        if (emptySlot) {
            emptySlot.appendChild(piece);
            checkPuzzleComplete();
        }
    }

    function showWinMessage() {
        const winMessage = document.querySelector('.win-message');
        winMessage.classList.remove('hidden');
        winMessage.classList.add('show');
        
        // Add confetti effect
        createConfetti();
        
        // Transition to next section after delay
        setTimeout(() => {
            transitionToSection('balloon-section');
        }, 2500);
    }

    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    function checkPuzzleComplete() {
        const slots = document.querySelectorAll('.puzzle-slot');
        const isComplete = Array.from(slots).every(slot => {
            const piece = slot.children[0];
            return piece && piece.dataset.piece === slot.dataset.index;
        });
        
        if (isComplete) {
            showWinMessage();
        }
    }

    function initPuzzle() {
        const puzzleGrid = document.querySelector('.puzzle-grid');
        const pieces = Array.from({length: 9}, (_, i) => i);
        let shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);
        
        puzzleGrid.innerHTML = '';
        
        // Create puzzle board (target slots)
        pieces.forEach(index => {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.index = index;
            puzzleGrid.appendChild(slot);
        });
        
        // Create draggable pieces container
        const piecesContainer = document.createElement('div');
        piecesContainer.className = 'pieces-container';
        puzzleGrid.parentNode.appendChild(piecesContainer);
        
        // Create draggable pieces
        shuffledPieces.forEach((piece, index) => {
            const div = document.createElement('div');
            div.className = 'puzzle-piece';
            div.draggable = true;
            div.dataset.piece = piece;
            
            div.style.backgroundImage = 'url(images/puzzle-image.jpg)';
            div.style.backgroundPosition = `${(piece % 3) * 50}% ${Math.floor(piece / 3) * 50}%`;
            
            // Add drag events
            div.addEventListener('dragstart', dragStart);
            div.addEventListener('dragend', dragEnd);
            div.addEventListener('click', handlePieceClick);
            
            piecesContainer.appendChild(div);
        });
        
        // Add drop events to slots
        document.querySelectorAll('.puzzle-slot').forEach(slot => {
            slot.addEventListener('dragover', e => e.preventDefault());
            slot.addEventListener('drop', handleDrop);
        });
        
        // Initialize hint button
        initHintButton();
    }

    function dragStart(e) {
        e.target.classList.add('dragging');
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDrop(e) {
        e.preventDefault();
        const slot = e.target.closest('.puzzle-slot');
        if (!slot) return;
        
        const piece = document.querySelector('.puzzle-piece.dragging');
        if (!piece) return;
        
        // If slot already has a piece, swap them
        if (slot.children.length > 0) {
            const existingPiece = slot.children[0];
            const oldSlot = piece.parentElement;
            
            // Only swap if dropping into a slot (not the pieces container)
            if (oldSlot.classList.contains('puzzle-slot')) {
                slot.appendChild(piece);
                oldSlot.appendChild(existingPiece);
            }
        } else {
            slot.appendChild(piece);
        }
        
        checkPuzzleComplete();
    }

    function initBalloons() {
        const balloons = document.querySelectorAll('.balloon');
        const messagesContainer = document.querySelector('.messages-container');
        let poppedCount = 0;

        balloons.forEach(balloon => {
            balloon.addEventListener('click', () => {
                if (!balloon.classList.contains('popped')) {
                    balloon.classList.add('popped');
                    
                    const message = document.createElement('div');
                    message.className = 'message';
                    message.textContent = balloon.dataset.message;
                    messagesContainer.insertBefore(message, messagesContainer.firstChild);
                    
                    requestAnimationFrame(() => {
                        message.style.opacity = '1';
                        message.style.transform = 'translateY(0)';
                    });
                    
                    poppedCount++;
                    if (poppedCount === balloons.length) {
                        setTimeout(() => {
                            // Reset any existing letter section state
                            const envelope = document.querySelector('.envelope');
                            const letterPaper = document.querySelector('.letter-paper');
                            if (envelope && letterPaper) {
                                envelope.classList.remove('open');
                                letterPaper.style.opacity = '0';
                                letterPaper.style.zIndex = '1';
                            }
                            
                            // Transition to letter section
                            transitionToSection('letter-section');
                        }, 1500);
                    }
                }
            });
        });
    }

    function initLetter() {
        const envelope = document.querySelector('.envelope');
        const letterPaper = document.querySelector('.letter-paper');
        
        // Ensure initial state
        if (envelope && letterPaper) {
            envelope.style.opacity = '1';
            envelope.style.visibility = 'visible';
            letterPaper.style.opacity = '0';
            letterPaper.style.zIndex = '1';
        }
        
        envelope.addEventListener('click', () => {
            if (!envelope.classList.contains('open')) {
                envelope.classList.add('open');
                setTimeout(() => {
                    letterPaper.style.opacity = '1';
                    letterPaper.style.zIndex = '5';
                }, 300);
            } else {
                letterPaper.style.opacity = '0';
                setTimeout(() => {
                    letterPaper.style.zIndex = '1';
                    envelope.classList.remove('open');
                }, 300);
            }
        });
    }

    // Initialize all sections
    initFloatingHeart();
    initPuzzle();
    initBalloons();
    initLetter();

    function checkImages() {
        // Check main photo
        const mainPhoto = document.querySelector('.main-photo');
        mainPhoto.onerror = () => {
            mainPhoto.parentElement.classList.add('error');
        };
        
        // Check puzzle image
        const puzzleImage = new Image();
        puzzleImage.src = 'images/puzzle-image.jpg';
        puzzleImage.onerror = () => {
            document.querySelectorAll('.puzzle-piece').forEach(piece => {
                piece.classList.add('error');
            });
        };
    }

    checkImages();

    function initHintButton() {
        const hintButton = document.querySelector('.hint-button');
        
        hintButton.addEventListener('click', () => {
            // Find pieces in wrong positions
            const slots = document.querySelectorAll('.puzzle-slot');
            const wrongPieces = Array.from(slots).filter(slot => {
                const piece = slot.children[0];
                return piece && piece.dataset.piece !== slot.dataset.index;
            });
            
            if (wrongPieces.length > 0) {
                // Pick a random wrong piece
                const randomSlot = wrongPieces[Math.floor(Math.random() * wrongPieces.length)];
                const piece = randomSlot.children[0];
                
                // Find its correct slot
                const correctSlot = document.querySelector(`.puzzle-slot[data-index="${piece.dataset.piece}"]`);
                
                // Highlight the piece and its correct slot
                piece.style.transform = 'scale(1.1)';
                piece.style.boxShadow = '0 0 20px var(--primary-color)';
                correctSlot.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                correctSlot.style.borderColor = 'var(--primary-color)';
                
                // Remove highlight after 2 seconds
                setTimeout(() => {
                    piece.style.transform = '';
                    piece.style.boxShadow = '';
                    correctSlot.style.backgroundColor = '';
                    correctSlot.style.borderColor = '';
                }, 2000);
            }
        });
    }
}); 