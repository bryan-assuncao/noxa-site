// DDI + DDD + número, só dígitos
const WHATSAPP_NUMBER = "5551991924156";

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Links de WhatsApp: botões com data-servico já mandam a mensagem do serviço
document.querySelectorAll(".js-whatsapp").forEach((el) => {
  const servico = el.dataset.servico;
  const msg = servico
    ? `Olá, Noxa! Vim pelo site e tenho interesse em: *${servico}*. Pode me passar mais informações?`
    : "Olá, Noxa! Vim pelo site e gostaria de um orçamento.";
  el.href = waLink(msg);
  el.target = "_blank";
  el.rel = "noopener";
});

// Menu mobile
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");

const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
};

navToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// Logo sempre volta ao topo (e limpa o #âncora da URL)
document.querySelector(".logo").addEventListener("click", (e) => {
  e.preventDefault();
  setMenu(false);
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  history.replaceState(null, "", location.pathname + location.search);
});
window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => e.matches && setMenu(false));

// Borda no header ao rolar
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// O conteúdo fica visível mesmo se o navegador não oferecer animações.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = document.querySelectorAll(
  ".reveal, .hero__copy > *, .hero__visual, .section__head, .faq details, .footer__contact, .footer__inner > .btn"
);

if (!motionPreference.matches && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach((el) => {
    el.classList.add("reveal");
    // Sequências curtas por grupo, sem atrasar os blocos abaixo da dobra.
    const siblings = [...el.parentElement.children].filter((child) => child.matches(
      ".card, .hero__copy > *, .faq details"
    ));
    el.style.setProperty("--reveal-delay", `${Math.max(0, siblings.indexOf(el)) * 75}ms`);
    el.classList.add("is-pending");
    io.observe(el);
  });

  motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      io.disconnect();
      revealElements.forEach((el) => el.classList.add("is-visible"));
    }
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
