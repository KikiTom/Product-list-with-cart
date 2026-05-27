/**
 * Manual Verification Script — Cart Feature (js/script.js)
 * 
 * Run this in browser console on index.html to verify cart behavior.
 * Each test logs PASS/FAIL with details.
 * 
 * Usage: Buka index.html di browser, buka DevTools Console, paste script ini.
 */

(function () {
  'use strict';

  const results = [];
  let passCount = 0;
  let failCount = 0;

  function logResult(testName, passed, detail) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    results.push({ testName, passed, detail });
    if (passed) passCount++;
    else failCount++;
    console.log(`${status} | ${testName}${detail ? ' — ' + detail : ''}`);
  }

  function summary() {
    console.log('\n========== VERIFICATION SUMMARY ==========');
    console.log(`Total: ${results.length} | ✅ ${passCount} | ❌ ${failCount}`);
    console.log('===========================================\n');
    return { results, passCount, failCount, total: results.length };
  }

  // ============================================================
  // TEST 1: Klik 'Add to Cart' → tombol berubah jadi quantity control (+/-)
  // ============================================================
  function test1_AddToCartTogglesButton() {
    const testName = 'Test 1: Add to Cart → button changes to quantity control (+/-)';

    // Find first product's Add to Cart button
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    if (addToCartBtns.length === 0) {
      logResult(testName, false, 'No .add-to-cart-btn elements found in DOM');
      return;
    }

    const firstBtn = addToCartBtns[0];
    const dessertBox = firstBtn.closest('.dessert-box');
    const quantityBtn = dessertBox.querySelector('.add-to-quantity-btn');

    // Check initial state
    const addBtnVisibleBefore = window.getComputedStyle(firstBtn).display !== 'none';
    const qtyBtnVisibleBefore = quantityBtn ? window.getComputedStyle(quantityBtn).display !== 'none' : false;

    // Click Add to Cart
    firstBtn.click();

    // Check after click
    const addBtnVisibleAfter = window.getComputedStyle(firstBtn).display !== 'none';
    const qtyBtnVisibleAfter = quantityBtn ? window.getComputedStyle(quantityBtn).display !== 'none' : false;

    if (!addBtnVisibleAfter && qtyBtnVisibleAfter) {
      logResult(testName, true, 'Button correctly toggled to quantity control');
    } else {
      logResult(testName, false,
        `Add to Cart visible: ${addBtnVisibleAfter} (expected false), Quantity control visible: ${qtyBtnVisibleAfter} (expected true). ` +
        `BUG: No toggle logic exists in script.js — .add-to-cart-btn and .add-to-quantity-btn visibility is never switched.`
      );
    }
  }

  // ============================================================
  // TEST 2: Klik '+' → quantity naik, cart update
  // ============================================================
  function test2_PlusIncreasesQuantity() {
    const testName = 'Test 2: Click "+" → quantity increases, cart updates';

    const quantityBtns = document.querySelectorAll('.add-to-quantity-btn');
    if (quantityBtns.length === 0) {
      logResult(testName, false, 'No .add-to-quantity-btn elements found (may be hidden)');
      return;
    }

    // Find a visible quantity button, or use the first one
    const qtyBtn = quantityBtns[0];
    const plusBtn = qtyBtn.querySelector('box-icon[name="plus-circle"]');
    const qtyLabel = qtyBtn.querySelector('.label');

    if (!plusBtn) {
      logResult(testName, false, 'Plus button (box-icon plus-circle) not found inside .add-to-quantity-btn');
      return;
    }

    const qtyBefore = qtyLabel ? parseInt(qtyLabel.textContent.trim()) : 0;

    // Click plus
    plusBtn.click();

    const qtyAfter = qtyLabel ? parseInt(qtyLabel.textContent.trim()) : qtyBefore;

    if (qtyAfter === qtyBefore + 1) {
      logResult(testName, true, `Quantity increased from ${qtyBefore} to ${qtyAfter}`);
    } else {
      logResult(testName, false,
        `Quantity before: ${qtyBefore}, after: ${qtyAfter}. ` +
        `BUG: No click event listener on plus-circle button. The .add-to-quantity-btn has no event handlers.`
      );
    }
  }

  // ============================================================
  // TEST 3: Klik '-' → quantity turun; if 0 → item hilang, button kembali ke 'Add to Cart'
  // ============================================================
  function test3_MinusDecreasesQuantity() {
    const testName = 'Test 3: Click "-" → quantity decreases; if 0 → item removed, button back to Add to Cart';

    const quantityBtns = document.querySelectorAll('.add-to-quantity-btn');
    if (quantityBtns.length === 0) {
      logResult(testName, false, 'No .add-to-quantity-btn elements found');
      return;
    }

    const qtyBtn = quantityBtns[0];
    const minusBtn = qtyBtn.querySelector('box-icon[name="minus-circle"]');
    const qtyLabel = qtyBtn.querySelector('.label');

    if (!minusBtn) {
      logResult(testName, false, 'Minus button (box-icon minus-circle) not found');
      return;
    }

    const qtyBefore = qtyLabel ? parseInt(qtyLabel.textContent.trim()) : 1;

    minusBtn.click();

    const qtyAfter = qtyLabel ? parseInt(qtyLabel.textContent.trim()) : qtyBefore;

    if (qtyBefore > 1 && qtyAfter === qtyBefore - 1) {
      logResult(testName, true, `Quantity decreased from ${qtyBefore} to ${qtyAfter}`);
    } else if (qtyBefore === 1) {
      // Should have removed item and toggled back to Add to Cart
      const dessertBox = qtyBtn.closest('.dessert-box');
      const addBtn = dessertBox.querySelector('.add-to-cart-btn');
      const addBtnVisible = window.getComputedStyle(addBtn).display !== 'none';
      const qtyBtnVisible = window.getComputedStyle(qtyBtn).display !== 'none';

      if (addBtnVisible && !qtyBtnVisible) {
        logResult(testName, true, 'Item removed, button toggled back to Add to Cart');
      } else {
        logResult(testName, false,
          `BUG: Minus button has no event listener. Quantity unchanged (${qtyBefore}). ` +
          `No logic to remove item at quantity 0 or toggle button visibility.`
        );
      }
    } else {
      logResult(testName, false,
        `BUG: Minus button has no event listener. Quantity unchanged (${qtyBefore}).`
      );
    }
  }

  // ============================================================
  // TEST 4: Klik 'Remove' di cart → item hilang, cart update
  // ============================================================
  function test4_RemoveFromCart() {
    const testName = 'Test 4: Click "Remove" in cart → item removed, cart updates';

    // Check if removeFromCart function exists
    if (typeof window.removeFromCart !== 'function' && typeof removeFromCart !== 'function') {
      logResult(testName, false,
        'BUG: removeFromCart() function is NOT DEFINED anywhere in script.js. ' +
        'The onclick="removeFromCart(...)" in updateCartDisplay will throw ReferenceError when clicked.'
      );
      return;
    }

    // If function exists, test it
    const cartBefore = (window.cart || []).length;
    const removeBtns = document.querySelectorAll('.cart-item button');
    if (removeBtns.length === 0) {
      logResult(testName, false, 'No remove buttons found in cart (cart may be empty or not rendered)');
      return;
    }

    removeBtns[0].click();
    const cartAfter = (window.cart || []).length;

    if (cartAfter === cartBefore - 1) {
      logResult(testName, true, 'Item removed from cart');
    } else {
      logResult(testName, false, `Cart count before: ${cartBefore}, after: ${cartAfter}`);
    }
  }

  // ============================================================
  // TEST 5: Klik 'Confirm Order' → modal muncul dengan list item + total
  // ============================================================
  function test5_ConfirmOrderModal() {
    const testName = 'Test 5: Click "Confirm Order" → modal appears with item list + total';

    const confirmBtn = document.querySelector('.confirm-order-btn');
    if (!confirmBtn) {
      logResult(testName, false, '.confirm-order-btn not found in DOM');
      return;
    }

    // Check if modal exists before click
    const modalBefore = document.querySelector('.order-confirmation-modal');
    confirmBtn.click();
    const modalAfter = document.querySelector('.order-confirmation-modal');

    if (modalAfter && !modalBefore) {
      // Check modal content
      const hasItems = modalAfter.querySelector('.modal-items') !== null || modalAfter.textContent.includes('$');
      const hasTotal = modalAfter.textContent.includes('Total') || modalAfter.textContent.includes('$');
      logResult(testName, hasItems && hasTotal,
        hasItems && hasTotal ? 'Modal appeared with items and total' :
        'Modal appeared but missing items or total'
      );
    } else if (!modalAfter) {
      logResult(testName, false,
        'BUG: No modal appears. .confirm-order-btn has NO click event listener. ' +
        'No modal creation logic exists in script.js.'
      );
    } else {
      logResult(testName, true, 'Modal appeared');
    }
  }

  // ============================================================
  // TEST 6: Klik 'Start New Order' di modal → cart kosong, modal hilang, tampilan reset
  // ============================================================
  function test6_StartNewOrderInModal() {
    const testName = 'Test 6: Click "Start New Order" in modal → cart cleared, modal hidden, display reset';

    const modal = document.querySelector('.order-confirmation-modal');
    if (!modal) {
      logResult(testName, false,
        'BUG: No modal exists, so no "Start New Order" button in modal. ' +
        'Modal creation logic is completely missing from script.js.'
      );
      return;
    }

    const startNewBtn = modal.querySelector('.start-new-order-btn') ||
      Array.from(modal.querySelectorAll('button')).find(b => b.textContent.includes('Start New Order'));

    if (!startNewBtn) {
      logResult(testName, false, 'No "Start New Order" button found inside modal');
      return;
    }

    startNewBtn.click();
    const modalGone = !document.querySelector('.order-confirmation-modal');
    const cartEmpty = (window.cart || []).length === 0;

    logResult(testName, modalGone && cartEmpty,
      modalGone && cartEmpty ? 'Cart cleared and modal hidden' :
      `Modal gone: ${modalGone}, Cart empty: ${cartEmpty}`
    );
  }

  // ============================================================
  // TEST 7: Klik 'Start New Order' (reset button) → cart kosong, tampilan reset
  // ============================================================
  function test7_ResetButton() {
    const testName = 'Test 7: Click "Start New Order" (reset button in cart) → cart cleared, display reset';

    const resetBtn = document.querySelector('.reset-order-btn');
    if (!resetBtn) {
      logResult(testName, false, '.reset-order-btn not found in DOM');
      return;
    }

    // Check if it has event listener by checking if clicking does anything
    const cartBefore = (window.cart || []).length;
    resetBtn.click();
    const cartAfter = (window.cart || []).length;

    if (cartAfter === 0) {
      logResult(testName, true, 'Cart cleared after reset');
    } else {
      logResult(testName, false,
        `BUG: .reset-order-btn has NO click event listener. Cart unchanged (${cartBefore} items). ` +
        'No reset logic exists in script.js.'
      );
    }
  }

  // ============================================================
  // TEST 8: Empty state muncul kembali saat cart kosong
  // ============================================================
  function test8_EmptyStateReappears() {
    const testName = 'Test 8: Empty state reappears when cart is empty';

    const cartEmpty = document.querySelector('.cart-empty');
    const cartItems = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');

    if (!cartEmpty) {
      logResult(testName, false, '.cart-empty element not found');
      return;
    }

    const emptyVisible = window.getComputedStyle(cartEmpty).display !== 'none';
    const itemsHidden = cartItems ? window.getComputedStyle(cartItems).display === 'none' : true;
    const summaryHidden = cartSummary ? window.getComputedStyle(cartSummary).display === 'none' : true;

    // Also check cart count badge
    const cartCount = document.querySelector('#info-cart');
    const countCorrect = cartCount ? cartCount.textContent === '(0)' : true;

    if (emptyVisible && itemsHidden && summaryHidden) {
      logResult(testName, countCorrect,
        countCorrect ? 'Empty state correctly displayed' :
        'Empty state displayed but cart count badge not updated to (0)'
      );
    } else {
      logResult(testName, false,
        `Empty visible: ${emptyVisible}, Items hidden: ${itemsHidden}, Summary hidden: ${summaryHidden}. ` +
        'BUG: updateCartDisplay may not properly restore empty state.'
      );
    }
  }

  // ============================================================
  // TEST 9: Cart count badge updates correctly
  // ============================================================
  function test9_CartCountBadge() {
    const testName = 'Test 9: Cart count badge (#info-cart) reflects total items';

    const cartCount = document.querySelector('#info-cart');
    if (!cartCount) {
      logResult(testName, false, '#info-cart element not found');
      return;
    }

    const totalItems = (window.cart || []).reduce((sum, item) => sum + item.quantity, 0);
    const badgeText = cartCount.textContent.trim();
    const expectedText = `(${totalItems})`;

    if (badgeText === expectedText) {
      logResult(testName, true, `Badge shows ${badgeText}, matches cart total ${totalItems}`);
    } else {
      logResult(testName, false,
        `BUG: Badge shows "${badgeText}" but cart has ${totalItems} items (expected "${expectedText}"). ` +
        'updateCartDisplay() never updates #info-cart.'
      );
    }
  }

  // ============================================================
  // TEST 10: Cart items use valid HTML elements
  // ============================================================
  function test10_CartItemValidHTML() {
    const testName = 'Test 10: Cart items use valid HTML elements (not custom tags)';

    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) {
      // Cart might be empty, check the code pattern instead
      // The code creates <cart-items> which is invalid
      logResult(testName, false,
        'BUG: updateCartDisplay creates <cart-items> elements (document.createElement("cart-items")) ' +
        'which is an invalid custom HTML tag. Should be <div> or <li>. This may cause styling and DOM issues.'
      );
      return;
    }

    const firstItem = cartItems[0];
    if (firstItem.tagName.toLowerCase() === 'cart-items') {
      logResult(testName, false, 'Cart items use invalid <cart-items> tag instead of <div>');
    } else {
      logResult(testName, true, 'Cart items use valid HTML elements');
    }
  }

  // ============================================================
  // RUN ALL TESTS
  // ============================================================
  console.log('========== CART FEATURE MANUAL VERIFICATION ==========\n');

  test1_AddToCartTogglesButton();
  test2_PlusIncreasesQuantity();
  test3_MinusDecreasesQuantity();
  test4_RemoveFromCart();
  test5_ConfirmOrderModal();
  test6_StartNewOrderInModal();
  test7_ResetButton();
  test8_EmptyStateReappears();
  test9_CartCountBadge();
  test10_CartItemValidHTML();

  const finalSummary = summary();

  // Return summary for programmatic use
  window.__cartVerificationResults = finalSummary;
  console.log('Results also available at window.__cartVerificationResults');

})();
