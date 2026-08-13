
const hamb = document.querySelector('#header .header .nav-bar .nav-list .hamb');
const mobile_menu = document.querySelector('#header .header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('#header .header .nav-bar .nav-list ul li a');
const header = document.querySelector('#header .header');

// --- MOBILE HAMBURGER TOGGLE ---
// Hamburger icon click par toggle transition apply karega aur mobile menu open/close hoga
hamb.addEventListener('click', () => {
    hamb.classList.toggle('active');
    mobile_menu.classList.toggle('active');
});

// --- SCROLL BACKGROUND CHANGE ---
// Window scroll karne par header ka background tint change hoga (250px vertical scroll threshold)
document.addEventListener('scroll', () => {
    let scroll_position = window.scrollY;
    if (scroll_position > 250) {
        header.style.backgroundColor = '#29323c'; // Dark solid color on scroll
    } else {
        header.style.backgroundColor = 'rgba(31, 30, 30, 0.24)'; // Transparent initial overlay
    }
});

// --- MOBILE MENU AUTO-CLOSE ---
// Mobile view par jab user kisi link (jaise Home, About) par click karega, 
// toh menu automatic slide-back hokar close ho jayega
menu_item.forEach((item) => {
    item.addEventListener('click', () => {
        hamb.classList.toggle('active');
        mobile_menu.classList.toggle('active');
    });
});

// --- GOOGLE SHEET CONTACT FORM SUBMISSION SCRIPT ---
const scriptURL = 'https://script.google.com/macros/s/AKfycby7nfTnigOqNsyL0DwpBuu58beQONcE5BJxtnR7qgP5qehMToKaqG4QqqFjJDe1ZUJ7/exec'; // Hum step 4 me ye URL generate karenge
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById('form-status-msg');

form.addEventListener('submit', e => {
    e.preventDefault();
    msg.innerHTML = "Sending Message...";
    
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            msg.innerHTML = "Message sent successfully! Registered in database.";
            setTimeout(function(){
                msg.innerHTML = "";
            }, 5000);
            form.reset(); // Form fields automatically empty ho jayenge submit hone ke baad
        })
        .catch(error => {
            msg.innerHTML = "Error submitting entry. Please check connection.";
            console.error('Error!', error.message);
        });
});

// --- FORM SUBMIT HO KE 5 SECOND BAAD MESSAGE HAPATNE KA SCRIPT ---
const contactForm = document.getElementById('professional-contact-form');
const statusResponse = document.getElementById('form-status-msg');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Isse submit hone par page reload nahi hoga
        
        statusResponse.innerHTML = "Processing entry...";
        
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    // Success Message screen par dikhega
                    statusResponse.innerHTML = "Message sent successfully! Form registered.";
                    contactForm.reset(); // Saare input boxes automatic khaali ho jayenge
                } else {
                    statusResponse.innerHTML = res.message;
                }
            })
            .catch(error => {
                statusResponse.innerHTML = "Connection error. Please try again.";
            })
            .then(function() {
                // 🚨 MASTER TIMEOUT: Exact 5000 milliseconds (5 second) baad message ko clear kar dega
                setTimeout(() => {
                    statusResponse.innerHTML = "";
                }, 5000); 
            });
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll('.achievement-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Ek baar render hone ke baad observer disconnect ho jayega for faster performance
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.15 // Triggers faster right as card enters lower screen viewport bounds
    });

    cards.forEach(card => {
        observer.observe(card);
    });
});

/* =========================================================
   DYNAMIC MOBILE VIEWPORT & ORIENTATION FIX
   ========================================================= */

(function () {
  function fixMobileViewport() {
    // Calculates exact pixel height of current visible screen viewport
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Run on initial load
  fixMobileViewport();

  // Recalculate on screen resize and landscape/portrait rotation
  window.addEventListener('resize', fixMobileViewport);
  window.addEventListener('orientationchange', function() {
    setTimeout(fixMobileViewport, 100); // Small delay to let browser re-render frame
  });
})();