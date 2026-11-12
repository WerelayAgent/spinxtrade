(function () {
  function showToast(msg) {
    let toast = document.getElementById('spinx-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'spinx-toast';
      toast.className =
        'fixed bottom-5 right-5 z-50 rounded-xl border border-neon-pink/40 bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-lg transition-all duration-200';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
    }, 2400);
  }

  // Copy CA button
  document.querySelectorAll('[data-copy-ca]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = 'Coming soon · Launching on Solana (Pump.fun)';
      var parent = btn.closest('.flex');
      var span = parent ? parent.querySelector('span') : null;
      if (span && span.textContent.trim()) {
        text = span.textContent.trim();
      }
      if (text.toLowerCase().indexOf('coming soon') !== -1) {
        showToast('CA coming soon — launching on Solana (Pump.fun)');
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('Copied $SPINXT address');
        });
      } else {
        showToast('Copied: ' + text);
      }
    });
  });

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Interactive Mint Console (/app/mint)
  var mintRoot = document.getElementById('mint-console');
  if (mintRoot) {
    var qty = 1;
    var maxQty = 10;
    var unitSpin = 10000;
    var unitSol = 0.25;
    var mintedCount = 3888;
    var maxSupply = 7777;
    var walletConnected = false;

    var qtyEl = document.getElementById('mint-qty');
    var minusBtn = document.getElementById('qty-minus');
    var plusBtn = document.getElementById('qty-plus');
    var totalSpinEl = document.getElementById('mint-total-spinxt');
    var totalSolEl = document.getElementById('mint-total-sol');
    var mintedEl = document.getElementById('mint-count');
    var pctEl = document.getElementById('mint-pct');
    var barEl = document.getElementById('mint-bar');
    var actionBtn = document.getElementById('mint-action-btn');
    var walletBadge = document.getElementById('wallet-status');
    var previewCard = document.getElementById('mint-preview-card');
    var previewTitle = document.getElementById('mint-preview-title');
    var previewBadge = document.getElementById('mint-preview-rarity');
    var previewImg = document.getElementById('mint-preview-img');
    var previewWallet = document.getElementById('mint-preview-wallet');

    var rarities = [
      { name: 'Common', img: '/samples/common.png', cls: 'bg-raised text-text-dim border-edge', weight: 50 },
      { name: 'Uncommon', img: '/samples/uncommon.png', cls: 'bg-up/15 text-up border-up/30', weight: 25 },
      { name: 'Rare', img: '/samples/rare.png', cls: 'bg-neon-blue/15 text-neon-blue border-neon-blue/30', weight: 15 },
      { name: 'Epic', img: '/samples/epic.png', cls: 'bg-neon-pink/15 text-neon-pink border-neon-pink/30', weight: 8 },
      { name: 'Legendary', img: '/samples/legendary.png', cls: 'bg-neon-yellow/15 text-neon-yellow border-neon-yellow/30', weight: 2 }
    ];

    function pickRarity() {
      var r = Math.random() * 100;
      var acc = 0;
      for (var i = 0; i < rarities.length; i++) {
        acc += rarities[i].weight;
        if (r <= acc) return rarities[i];
      }
      return rarities[0];
    }

    function renderMint() {
      if (qtyEl) qtyEl.textContent = String(qty);
      if (minusBtn) minusBtn.disabled = qty <= 1;
      if (plusBtn) plusBtn.disabled = qty >= maxQty;
      if (totalSpinEl) totalSpinEl.textContent = (qty * unitSpin).toLocaleString('en-US') + ' $SPINXT';
      if (totalSolEl) totalSolEl.textContent = '≈ ' + (qty * unitSol).toFixed(2) + ' SOL';
      var pct = Math.min(100, (mintedCount / maxSupply) * 100);
      if (mintedEl) mintedEl.textContent = mintedCount.toLocaleString('en-US') + ' / ' + maxSupply.toLocaleString('en-US') + ' minted';
      if (pctEl) pctEl.textContent = Math.floor(pct) + '%';
      if (barEl) barEl.style.width = pct.toFixed(1) + '%';
      if (actionBtn) {
        actionBtn.textContent = walletConnected
          ? 'Mint ' + qty + ' Spinner' + (qty > 1 ? 's' : '') + ' (' + (qty * unitSpin).toLocaleString('en-US') + ' $SPINXT)'
          : 'Connect Phantom / Backpack to Mint';
      }
    }

    if (minusBtn) {
      minusBtn.addEventListener('click', function () {
        if (qty > 1) {
          qty -= 1;
          renderMint();
        }
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', function () {
        if (qty < maxQty) {
          qty += 1;
          renderMint();
        }
      });
    }

    if (actionBtn) {
      actionBtn.addEventListener('click', function () {
        if (!walletConnected) {
          walletConnected = true;
          if (walletBadge) {
            walletBadge.textContent = '7xK9...p9Q4 · Solana Mainnet';
            walletBadge.className = 'inline-flex items-center rounded-full border px-2.5 h-6 text-xs font-mono bg-up/15 text-up border-up/30';
          }
          showToast('Solana wallet connected');
          renderMint();
          return;
        }
        mintedCount = Math.min(maxSupply, mintedCount + qty);
        var rolled = pickRarity();
        var num = mintedCount;
        if (previewCard) previewCard.classList.remove('hidden');
        if (previewTitle) previewTitle.textContent = 'Spinner #' + num;
        if (previewBadge) {
          previewBadge.textContent = rolled.name;
          previewBadge.className = 'inline-flex items-center rounded-full border font-medium h-6 px-2 text-[11px] ' + rolled.cls;
        }
        if (previewImg) {
          previewImg.src = rolled.img;
          previewImg.alt = 'Spinner #' + num + ' (' + rolled.name + ')';
        }
        if (previewWallet) {
          var suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          previewWallet.textContent = 'PDA Vault: 7pda' + suffix + '...SPXT · Ready to brief';
        }
        showToast('Preview minted Spinner #' + num + ' (' + rolled.name + ')!');
        renderMint();
      });
    }

    renderMint();
  }
})();
