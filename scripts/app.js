// shortened: only changes relevant modal init (everything else same as before)

const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>[...r.querySelectorAll(s)];

// ... all code up to modal section unchanged ...

/* ===== Register Modal (fixed) ===== */
const modal = $('#register-modal');
const modalClose = $('.modal-close');
const openReg = $('#openRegister');
const openRegMobile = $('#openRegisterMobile');

function openModal(){
    if (!modal) return;
    modal.hidden = false;
    openOverlay();
    trapFocus(modal);
    const first = $('#registerForm input[name="email"]');
    if (first) first.focus();
}
function closeModal(){
    if (!modal) return;
    modal.hidden = true;
    closeOverlay();
    releaseFocus();
}

if (openReg) openReg.addEventListener('click', e=>{ e.preventDefault(); openModal(); });
if (openRegMobile) openRegMobile.addEventListener('click', e=>{ e.preventDefault(); closeMobile(); openModal(); });
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });

// ensure modal/overlay hidden on load
window.addEventListener('DOMContentLoaded', () => {
    if (modal) modal.hidden = true;
    const ov = document.querySelector('[data-overlay]');
    if (ov) ov.hidden = true;
});

// ... rest of your JS remains identical ...
