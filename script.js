/* ============================================================
   THIAGO VIGLIONI — ADVOCACIA CRIMINAL
   Interações: header, menu, accordion, reveal, contador,
   depoimentos, whatsapp flutuante, formulário, botão magnético
   ============================================================ */
(function () {
  "use strict";

  var whatsappNumber = "5538999388492"; // único ponto de configuração do número
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: encolher ao rolar ---------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Menu mobile ---------- */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  menuToggle.addEventListener("click", function () {
    var open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    mobileNav.classList.toggle("open", !open);
    menuToggle.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
  });
  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("open");
    });
  });

  /* ---------- Accordion de áreas de atuação ---------- */
  var triggers = document.querySelectorAll(".practice-trigger");
  function setPanel(trigger, open) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    trigger.setAttribute("aria-expanded", String(open));
    panel.style.maxHeight = open ? panel.scrollHeight + "px" : 0;
  }
  triggers.forEach(function (trigger) {
    var startsOpen = trigger.getAttribute("aria-expanded") === "true";
    setPanel(trigger, startsOpen);
    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      triggers.forEach(function (t) { if (t !== trigger) setPanel(t, false); });
      setPanel(trigger, !isOpen);
    });
  });
  window.addEventListener("resize", function () {
    triggers.forEach(function (t) {
      if (t.getAttribute("aria-expanded") === "true") setPanel(t, true);
    });
  });

  /* ---------- Reveal ao rolar ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Contador dos números reais ---------- */
  var statNumbers = document.querySelectorAll(".stat-number");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (el) { statObserver.observe(el); });
  }

  /* ---------- Slider de depoimentos ---------- */
  var track = document.getElementById("testimonial-track");
  var slides = track ? Array.prototype.slice.call(track.children) : [];
  var dotsWrap = document.getElementById("testimonial-dots");
  var prevBtn = document.getElementById("testimonial-prev");
  var nextBtn = document.getElementById("testimonial-next");
  var current = 0;
  var autoTimer;

  if (track && slides.length) {
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Depoimento " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + current * 100 + "%)";
      dotsWrap.querySelectorAll("button").forEach(function (d, i) {
        d.classList.toggle("active", i === current);
      });
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    nextBtn.addEventListener("click", function () { next(); resetAuto(); });
    prevBtn.addEventListener("click", function () { prev(); resetAuto(); });

    function startAuto() {
      if (prefersReduced) return;
      autoTimer = setInterval(next, 6500);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }
    startAuto();

    var slider = document.querySelector(".testimonial-slider");
    slider.addEventListener("mouseenter", function () { clearInterval(autoTimer); });
    slider.addEventListener("mouseleave", startAuto);
    slider.addEventListener("focusin", function () { clearInterval(autoTimer); });
    slider.addEventListener("focusout", startAuto);
  }

  /* ---------- WhatsApp flutuante ---------- */
  var floatingWa = document.getElementById("floating-wa");
  function toggleFloating() {
    if (window.scrollY > 480) floatingWa.classList.add("visible");
    else floatingWa.classList.remove("visible");
  }
  window.addEventListener("scroll", toggleFloating, { passive: true });
  toggleFloating();

  /* ---------- Formulário de contato -> WhatsApp ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var nome = form.nome.value.trim();
      var telefone = form.telefone.value.trim();
      var mensagem = form.mensagem.value.trim();
      if (!nome || !telefone || !mensagem) return; // deixa a validação HTML nativa atuar

      e.preventDefault();
      var texto =
        "Olá, meu nome é " + nome +
        ". Telefone para contato: " + telefone +
        ". Mensagem: " + mensagem;
      var url = "https://api.whatsapp.com/send?phone=" + whatsappNumber +
        "&text=" + encodeURIComponent(texto);
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Botão magnético (hero, apenas desktop com mouse) ---------- */
  var magneticTarget = document.getElementById("wa-hero");
  var canMagnetic = window.matchMedia("(pointer: fine)").matches && !prefersReduced;
  if (magneticTarget && canMagnetic) {
    var bounds;
    magneticTarget.addEventListener("mouseenter", function () {
      bounds = magneticTarget.getBoundingClientRect();
    });
    magneticTarget.addEventListener("mousemove", function (e) {
      if (!bounds) bounds = magneticTarget.getBoundingClientRect();
      var relX = e.clientX - bounds.left - bounds.width / 2;
      var relY = e.clientY - bounds.top - bounds.height / 2;
      magneticTarget.style.transform = "translate(" + relX * 0.12 + "px," + relY * 0.22 + "px)";
    });
    magneticTarget.addEventListener("mouseleave", function () {
      magneticTarget.style.transform = "translate(0,0)";
    });
  }
})();
