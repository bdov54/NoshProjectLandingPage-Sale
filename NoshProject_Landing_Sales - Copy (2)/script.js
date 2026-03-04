/* NoshProject Landing - Sales interactions (v3) */

(function(){
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

  // Mobile nav
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  if(navToggle && navMenu){
    navToggle.addEventListener("click", ()=>{
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("#navMenu a").forEach(a=>{
      a.addEventListener("click", ()=> navMenu.classList.remove("is-open"));
    });
  }

  // Countdown + stock (simple client-side urgency)
  let seconds = 15 * 60; // 15:00
  const stockBase = 37;
  let stock = stockBase;

  const els = {
    stockLeft: $("#stockLeft"),
    stockInline: $("#stockInline"),
    stockSticky: $("#stockSticky"),
    countdown: $("#countdown"),
    countdownInline: $("#countdownInline"),
    countdownSticky: $("#countdownSticky")
  };

  function fmt(t){
    const m = Math.floor(t/60).toString().padStart(2,"0");
    const s = Math.floor(t%60).toString().padStart(2,"0");
    return `${m}:${s}`;
  }
  function render(){
    const cd = fmt(seconds);
    ["countdown","countdownInline","countdownSticky"].forEach(k=>{
      if(els[k]) els[k].textContent = cd;
    });
    ["stockLeft","stockInline","stockSticky"].forEach(k=>{
      if(els[k]) els[k].textContent = stock.toString();
    });
  }

  // Subtle stock drift
  let tick = 0;
  setInterval(()=>{
    seconds = Math.max(0, seconds - 1);
    tick++;
    // every ~90s, drop 1 stock, but never below 7
    if(tick % 90 === 0 && stock > 7){
      stock -= 1;
    }
    render();
  }, 1000);
  render();

  // Product pick -> update form
  const sumFlavor = $("#sumFlavor");
  const segBtns = $$("#flavorSeg .seg__btn");
  const pPicks = $$(".pPick");
  const miniBtns = $$(".mini");

  function setFlavor(name){
    if(sumFlavor) sumFlavor.textContent = name || "Chưa chọn";
    segBtns.forEach(b=> b.classList.toggle("is-active", b.dataset.flavor === name));
  }
  segBtns.forEach(btn=>{
    btn.addEventListener("click", ()=> setFlavor(btn.dataset.flavor));
  });
  pPicks.forEach(btn=>{
    btn.addEventListener("click", ()=> {
      setFlavor(btn.dataset.pick);
      document.getElementById("order")?.scrollIntoView({behavior:"smooth"});
    });
  });
  miniBtns.forEach(btn=>{
    btn.addEventListener("click", ()=> setFlavor(btn.dataset.flavor));
  });

  // Pack selection from pricing cards
  const packSelect = $("#packSelect");
  const sumPack = $("#sumPack");
  const sumPrice = $("#sumPrice");

  const PACKS = {
    "Trial": {label: "Túi Dùng Thử", price: "25.000đ"},
    "Combo": {label: "Combo “Ghiền Busan”", price: "110.000đ"},
    "Box": {label: "Thùng “Tiệc Văn Phòng”", price: "400.000đ"}
  };

  function setPack(code){
    if(packSelect) packSelect.value = code;
    if(sumPack) sumPack.textContent = PACKS[code]?.label || "Combo “Ghiền Busan”";
    if(sumPrice) sumPrice.textContent = PACKS[code]?.price || "110.000đ";
  }

  $$("[data-pack]").forEach(a=>{
    a.addEventListener("click", ()=>{
      const code = a.getAttribute("data-pack");
      setPack(code);
    });
  });
  if(packSelect){
    packSelect.addEventListener("change", ()=> setPack(packSelect.value));
  }
  setPack("Combo");

  // KOC mini carousel (text + image swaps)
  const kocThumb = $(".kocThumb img");
  const quote = $(".quote");
  const kocMeta = $(".kocMeta");
  const kocPrev = $("#kocPrev");
  const kocNext = $("#kocNext");

  const REVIEWS = [
    {text: "“Bẻ cái rộp một cái nghe đã tai. Giòn kiểu không cần dầu nên ăn không bị ngấy.”", meta: "Review 1/3 • KOC", img: "assets/illu_happy_eating.png"},
    {text: "“Vị Spicy cay tê đúng kiểu Busan, ăn 2–3 miếng là ‘tỉnh’ liền.”", meta: "Review 2/3 • KOC", img: "assets/pack_spicy.png"},
    {text: "“Socola mặn nhẹ mà cuốn. Lạ nhưng ăn xong lại thèm.”", meta: "Review 3/3 • KOC", img: "assets/pack_peanut.png"},
  ];
  let r = 0;
  function renderReview(){
    const it = REVIEWS[r];
    if(quote) quote.textContent = it.text;
    if(kocMeta) kocMeta.childNodes[0].textContent = it.meta;
    if(kocThumb) kocThumb.src = it.img;
  }
  function prev(){ r = (r + REVIEWS.length - 1) % REVIEWS.length; renderReview(); }
  function next(){ r = (r + 1) % REVIEWS.length; renderReview(); }
  kocPrev?.addEventListener("click", prev);
  kocNext?.addEventListener("click", next);
  renderReview();

  // Marquee inject
  const marqueeInner = $("#marqueeInner");
  const names = ["Nguyễn An", "Trần Linh", "Phương Anh", "Minh Khoa", "Thảo Nhi", "Hải Yến", "Quang Huy", "Mai Anh"];
  const actions = [
    "vừa đặt 1 Combo 5 gói",
    "vừa mua 2 thùng văn phòng",
    "vừa chốt 1 túi dùng thử",
    "vừa đặt 1 Combo + chọn vị Spicy",
    "vừa đặt 1 Combo + chọn vị Gạo lứt"
  ];
  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  if(marqueeInner){
    const items = [];
    for(let i=0;i<12;i++){
      items.push(`• ${rand(names)} ${rand(actions)}`);
    }
    // Duplicate for smooth loop
    marqueeInner.innerHTML = [...items, ...items].map(t=>`<span>${t}</span>`).join("");
  }

  // Form submit (demo)
  const form = $("#leadForm");
  const msg = $("#formMsg");
  if(form){
    form.addEventListener("submit", (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const phone = String(fd.get("phone") || "").trim();
      // Basic VN phone validation: 0 + 9 digits
      if(!/^0\d{9}$/.test(phone)){
        alert("Số điện thoại chưa đúng định dạng (VD: 09xxxxxxxx).");
        return;
      }
      const flavor = $("#sumFlavor")?.textContent || "Chưa chọn";
      const pack = $("#packSelect")?.value || "Combo";
      // Update summary
      setPack(pack);
      if(msg){
        msg.style.display = "block";
        msg.style.color = "rgba(16,185,129,.95)";
        msg.textContent = "✅ Đã ghi nhận! Team NoshProject sẽ gọi xác nhận đơn cho bạn trong thời gian sớm nhất.";
      }
      // (Bạn có thể nối API/Google Sheet ở đây)
      console.log("Lead:", Object.fromEntries(fd.entries()), "flavor:", flavor);
      form.reset();
    });
  }

  // Sticky bar show/hide based on scroll (hide near order)
  const sticky = $("#stickyBuy");
  const order = $("#order");
  if(sticky && order){
    const io = new IntersectionObserver((entries)=>{
      const inView = entries.some(e => e.isIntersecting);
      sticky.style.opacity = inView ? "0" : "1";
      sticky.style.pointerEvents = inView ? "none" : "auto";
    }, {threshold: 0.2});
    io.observe(order);
  }
})(); 
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('#kocCarousel .kocSlide');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    
    function autoChangeSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    // Tự động chuyển sau 5000ms (5 giây)
    setInterval(autoChangeSlide, 5000);
  }
});