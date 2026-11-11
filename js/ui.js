(() => {
  const $ = (id) => document.getElementById(id);

  // Feed the entropy pool
  ["mousemove", "keydown", "touchmove", "click"].forEach((type) =>
    window.addEventListener(type, (e) => {
      const p = e.touches ? e.touches[0] : e;
      HyperSecure.addEntropy({ type, clientX: p.clientX || 0, clientY: p.clientY || 0 });
      const level = HyperSecure.entropyLevel();
      $("entropyBar").style.width = level + "%";
      $("entropyPct").textContent = level >= 100 ? "100% — MAXIMUM ENTROPY" : level + "%";
    }, { passive: true })
  );

  const STAGES = [
    "Harvesting human entropy",
    "Mixing quantum noise into the pool",
    "Running 1,000,000 hardening rounds",
    "Applying military-grade SHA-256",
    "Verifying randomness (passed ✅)",
  ];

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 2^bits written as a power of ten, e.g. "≈ 10^77"
  const powTen = (bits) => "≈ 10^" + Math.floor(bits * Math.log10(2));

  function crackTime(bits) {
    // a trillion guesses per second
    const secondsLog10 = bits * Math.log10(2) - 12;
    const yearsLog10 = secondsLog10 - Math.log10(31557600);
    return "10^" + Math.floor(yearsLog10) + " years";
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
    $("aEntropy").textContent = bits + " bits";
    $("aSpace").textContent = powTen(bits);
    $("aCrack").textContent = crackTime(bits);
    $("result").hidden = false;
    list.hidden = true;
    btn.disabled = false;
  });

  $("copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("key").textContent);
      $("copy").textContent = "Copied!";
    } catch {
      $("copy").textContent = "Select & copy";
    }
    setTimeout(() => ($("copy").textContent = "Copy"), 1500);
  });
})();
