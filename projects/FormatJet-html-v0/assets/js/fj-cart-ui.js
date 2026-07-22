'use strict';

window.fjCartUI = {
  isOpen: false,
  pendingItem: null,
  pendingDuplicate: null,

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

    // Duplicate modal buttons
    var increaseBtn = document.getElementById('duplicateIncrease');
    var addNewBtn = document.getElementById('duplicateAddNew');
    var cancelBtn = document.getElementById('duplicateCancel');
    if (increaseBtn) {
      increaseBtn.addEventListener('click', function () {
        if (self.pendingDuplicate) {
          self.pendingDuplicate.quantity += self.pendingItem.quantity;
          window.fjCart.update(self.pendingDuplicate.cartId, self.pendingDuplicate.quantity);
          self.closeDuplicateModal();
          self.openCart();
        }
      });
    }
    if (addNewBtn) {
      addNewBtn.addEventListener('click', function () {
        if (self.pendingItem) {
          window.fjCart.add(self.pendingItem);
          self.closeDuplicateModal();
          self.openCart();
        }
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () { self.closeDuplicateModal(); });
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
    var countEl = document.getElementById('fjCartCount');

    if (!itemsList) return;

    itemsList.innerHTML = '';

    // Update item count badge
    var itemCount = window.fjCart.items.reduce(function(sum, item) { return sum + (item.quantity || 1); }, 0);
    if (countEl) countEl.textContent = itemCount;

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
    // Render order summary from cart items
    this.renderCheckout();
  },

  renderCheckout: function () {
    var orderSummaryTitle = document.getElementById('orderSummaryTitle');
    var orderItems = document.getElementById('orderItems');

    if (!orderItems) return;

    // Clear previous items
    orderItems.innerHTML = '';

    var items = window.fjCart.items;
    var total = 0;

    items.forEach(function(item) {
      var itemDiv = document.createElement('div');
      itemDiv.className = 'order-line';
      var itemTotal = item.pricePerUnit * item.quantity;
      total += itemTotal;
      itemDiv.innerHTML =
        '<span>' + item.label + (item.quantity > 1 ? ' ×' + item.quantity : '') + '</span>' +
        '<strong>₺' + itemTotal.toLocaleString('tr-TR') + '</strong>';
      orderItems.appendChild(itemDiv);
    });

    // Update summary title
    if (orderSummaryTitle) {
      orderSummaryTitle.textContent = 'Sipariş Özeti (' + items.length + ' ürün)';
    }

    // Hide old plan fields
    var oldFields = document.querySelectorAll('#sumPlanLabel, #sumPlan, #sumPeriodLabel, #sumPeriod');
    oldFields.forEach(function(el) { el.style.display = 'none'; });

    // Update total (with VAT)
    var sumVat = document.getElementById('sumVat');
    var sumTotal = document.getElementById('sumTotal');
    var vatAmount = Math.round(total * 0.2 / 1.2);
    if (sumVat) {
      sumVat.textContent = '₺' + vatAmount.toLocaleString('tr-TR');
      sumVat.parentElement.style.display = 'flex';
    }
    if (sumTotal) sumTotal.textContent = '₺' + total.toLocaleString('tr-TR');

    // Show checkout section
    var checkoutSection = document.getElementById('checkoutSection');
    if (checkoutSection) {
      checkoutSection.classList.add('visible');
      setTimeout(function() {
        checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  },

  clearCart: function () {
    if (confirm('Sepeti tamamen temizlemek istediğinizden emin misiniz?')) {
      window.fjCart.clear();
    }
  },

  showDuplicateModal: function (item, existing) {
    this.pendingItem = item;
    this.pendingDuplicate = existing;
    var modal = document.getElementById('duplicateModal');
    var msgEl = document.getElementById('duplicateMsg');
    if (modal && msgEl) {
      msgEl.textContent = 'Bu ürünü aynı yapılandırmada zaten ' + existing.quantity + ' adet eklemişsiniz. Miktarı artırmak mı, yoksa yeni bir ürün olarak eklemek mi istersiniz?';
      modal.classList.add('visible');
    }
  },

  closeDuplicateModal: function () {
    var modal = document.getElementById('duplicateModal');
    if (modal) modal.classList.remove('visible');
    this.pendingItem = null;
    this.pendingDuplicate = null;
  }
};

document.addEventListener('DOMContentLoaded', function () {
  window.fjCartUI.init();
});
