'use strict';

window.fjCartUI = {
  isOpen: false,

  init: function () {
    var container = document.getElementById('fjCartContainer');
    if (!container) return;

    var self = this;
    var toggle = document.getElementById('fjCartToggle');
    if (toggle) {
      toggle.addEventListener('click', function () { self.toggleCart(); });
    }

    var checkoutBtn = document.getElementById('fjCartCheckout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () { self.proceedToCheckout(); });
    }

    var clearBtn = document.getElementById('fjCartClear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () { self.clearCart(); });
    }

    this.render();
  },

  toggleCart: function () {
    var panel = document.getElementById('fjCartPanel');
    if (panel) {
      this.isOpen = !this.isOpen;
      panel.classList.toggle('open', this.isOpen);
    }
  },

  openCart: function () {
    var panel = document.getElementById('fjCartPanel');
    if (panel && !this.isOpen) {
      this.isOpen = true;
      panel.classList.add('open');
    }
  },

  render: function () {
    var itemsList = document.getElementById('fjCartItemsList');
    var totalEl = document.getElementById('fjCartTotal');
    var emptyMsg = document.getElementById('fjCartEmpty');

    if (!itemsList) return;

    itemsList.innerHTML = '';

    if (window.fjCart.isEmpty()) {
      if (emptyMsg) emptyMsg.style.display = 'block';
      if (totalEl) totalEl.textContent = '₺0';
      return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';

    var items = window.fjCart.items;
    var self = this;

    items.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'cart-item';

      var labelDiv = document.createElement('div');
      labelDiv.className = 'cart-item-label';
      labelDiv.textContent = self._formatLabel(item);

      var priceDiv = document.createElement('div');
      priceDiv.className = 'cart-item-price';
      priceDiv.textContent = '₺' + (item.pricePerUnit * item.quantity).toLocaleString('tr-TR');

      var qtyDiv = document.createElement('div');
      qtyDiv.className = 'cart-item-qty';
      var minusBtn = document.createElement('button');
      minusBtn.className = 'qty-btn';
      minusBtn.dataset.action = 'minus';
      minusBtn.dataset.cartId = item.cartId;
      minusBtn.textContent = '−';
      var qtyVal = document.createElement('span');
      qtyVal.className = 'qty-val';
      qtyVal.textContent = item.quantity;
      var plusBtn = document.createElement('button');
      plusBtn.className = 'qty-btn';
      plusBtn.dataset.action = 'plus';
      plusBtn.dataset.cartId = item.cartId;
      plusBtn.textContent = '+';
      qtyDiv.appendChild(minusBtn);
      qtyDiv.appendChild(qtyVal);
      qtyDiv.appendChild(plusBtn);

      var removeBtn = document.createElement('button');
      removeBtn.className = 'cart-item-remove';
      removeBtn.dataset.cartId = item.cartId;
      removeBtn.textContent = '✕';

      row.appendChild(labelDiv);
      row.appendChild(priceDiv);
      row.appendChild(qtyDiv);
      row.appendChild(removeBtn);
      itemsList.appendChild(row);
    });

    // Event listeners
    itemsList.querySelectorAll('.qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cartId = this.dataset.cartId;
        var item = window.fjCart.items.find(i => i.cartId === cartId);
        var action = this.dataset.action;
        if (item) {
          var newQty = action === 'plus' ? item.quantity + 1 : item.quantity - 1;
          if (newQty >= 1) {
            window.fjCart.update(cartId, newQty);
          }
        }
      });
    });

    itemsList.querySelectorAll('.cart-item-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cartId = this.dataset.cartId;
        window.fjCart.remove(cartId);
      });
    });

    if (totalEl) {
      totalEl.textContent = '₺' + window.fjCart.getTotal().toLocaleString('tr-TR');
    }
  },

  _formatLabel: function (item) {
    if (item.type === 'plan') {
      var planName = item.plan === 'pro' ? 'Pro' : 'Business';
      var period = item.period === 'yearly' ? '/yıl' : '/ay';
      var users = item.users ? ' (' + item.users + ' kullanıcı)' : '';
      return planName + ' Planı' + users + period;
    } else if (item.type === 'jetCredit') {
      return 'Jet Kredisi - ₺' + item.amount.toLocaleString('tr-TR');
    } else if (item.type === 'donation') {
      return 'Destek Ol - ₺' + item.amount.toLocaleString('tr-TR');
    }
    return item.label || 'Ürün';
  },

  proceedToCheckout: function () {
    if (window.fjCart.isEmpty()) {
      alert('Sepet boş. Lütfen bir ürün ekleyin.');
      return;
    }
    // Sepet items'ı URL parametre olarak gönder (later)
    // For now, redirect to payment method selection
    window.location.href = 'pro.html?step=checkout';
  },

  clearCart: function () {
    if (confirm('Sepeti tamamen temizlemek istediğinizden emin misiniz?')) {
      window.fjCart.clear();
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  window.fjCartUI.init();
});
