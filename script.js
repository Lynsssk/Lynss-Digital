/*
 */
const CONFIG = {
  whatsapp: "5581999972907", //
  brand: "Lynss Digital",
  prices: {
    site: "R$ 149",
    menu: "R$ 89",
    dashboard: "R$ 59",
    catalog: "R$ 99"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Atualize o ano automaticamente.
  document.getElementById("year").textContent = new Date().getFullYear();

  // Menu mobile.
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  // Barra de progresso de leitura.
  const progress = document.getElementById("scrollProgress");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Animações de entrada, respeitando preferência por movimento reduzido.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Preços editáveis em CONFIG.
  document.querySelectorAll("[data-price]").forEach(el => {
    const key = el.dataset.price;
    if (CONFIG.prices[key]) el.textContent = CONFIG.prices[key];
  });

  // Links de serviço já selecionam a opção correspondente no formulário.
  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      const select = document.getElementById("clientService");
      const desired = link.dataset.service;
      const option = Array.from(select.options).find(item => item.text === desired);
      if (option) select.value = option.value;
    });
  });

  // Formulário monta a mensagem para o WhatsApp.
  const form = document.getElementById("quoteForm");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("clientName").value.trim();
    const service = document.getElementById("clientService").value;
    const budget = document.getElementById("clientBudget").value || "Ainda não definido";
    const details = document.getElementById("clientDetails").value.trim() || "Ainda vou explicar melhor pelo WhatsApp.";
    if (!name || !service) return;

    const message = [
      `Olá! Vim pelo site da ${CONFIG.brand} e gostaria de solicitar um orçamento.`,
      "",
      `*Nome:* ${name}`,
      `*Serviço:* ${service}`,
      `*Faixa de investimento:* ${budget}`,
      `*Detalhes:* ${details}`
    ].join("\n");

    const number = CONFIG.whatsapp.replace(/\D/g, "");
    // Evita abrir conversa no número fictício se a pessoa esquecer de configurar.
    if (number === "5581999999999" || number.length < 12) {
      const toast = document.getElementById("toast");
      toast.textContent = "Antes de publicar, edite seu número do WhatsApp no arquivo script.js.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 4500);
      return;
    }
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
