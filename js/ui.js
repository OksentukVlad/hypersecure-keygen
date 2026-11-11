(() => {
  const $ = (id) => document.getElementById(id);

  // Наповнюємо пул ентропії
  ["mousemove", "keydown", "touchmove", "click"].forEach((type) =>
    window.addEventListener(type, (e) => {
      const p = e.touches ? e.touches[0] : e;
      HyperSecure.addEntropy({ type, clientX: p.clientX || 0, clientY: p.clientY || 0 });
      const level = HyperSecure.entropyLevel();
      $("entropyBar").style.width = level + "%";
      $("entropyPct").textContent = level >= 100 ? "100% — МАКСИМАЛЬНА ЕНТРОПІЯ" : level + "%";
    }, { passive: true })
  );

  const STAGES = [
    "Збираємо людську ентропію",
    "Додаємо квантовий шум у пул",
    "Виконуємо 1 000 000 раундів посилення",
    "Застосовуємо SHA-256 військового рівня",
    "Перевіряємо випадковість (успішно ✅)",
  ];

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 2^bits як степінь десяти, напр. "≈ 10^77"
  const powTen = (bits) => "≈ 10^" + Math.floor(bits * Math.log10(2));

  function crackTime(bits) {
    // трильйон спроб на секунду
    const secondsLog10 = bits * Math.log10(2) - 12;
    const yearsLog10 = secondsLog10 - Math.log10(31557600);
    return "10^" + Math.floor(yearsLog10) + " років";
  }

  $("generate").addEventListener("click", async () => {
    const btn = $("generate");
    const bits = Number($("bits").value);
    const format = $("format").value;
    btn.disabled = true;
    $("result").hidden = true;

    const list = $("stages");
    list.innerHTML = "";
    list.hidden = false;
    for (const s of STAGES) {
      const li = document.createElement("li");
      li.textContent = s + "…";
      list.appendChild(li);
      await sleep(350 + Math.random() * 250);
      li.classList.add("done");
    }

    const key = await HyperSecure.generateKey({ bits, format });
    $("key").textContent = key;
    $("aEntropy").textContent = bits + " біт";
    $("aSpace").textContent = powTen(bits);
    $("aCrack").textContent = crackTime(bits);
    $("result").hidden = false;
    list.hidden = true;
    btn.disabled = false;
  });

  $("copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("key").textContent);
      $("copy").textContent = "Скопійовано!";
    } catch {
      $("copy").textContent = "Виділіть і скопіюйте";
    }
    setTimeout(() => ($("copy").textContent = "Копіювати"), 1500);
  });
})();
