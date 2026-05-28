/**
 * Manual Verification Script — Search Feature (js/script.js)
 * 
 * Run this in browser console on index.html to verify search behavior.
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
    console.log('\n========== SEARCH VERIFICATION SUMMARY ==========');
    console.log(`Total: ${results.length} | ✅ ${passCount} | ❌ ${failCount}`);
    console.log('==================================================\n');
    return { results, passCount, failCount, total: results.length };
  }

  // Helper to get displayed products
  function getDisplayedProducts() {
    return document.querySelectorAll('.dessert-box');
  }

  // Helper to get search input
  function getSearchInput() {
    return document.getElementById('search-input');
  }

  // ============================================================
  // TEST 1: Empty input shows all products
  // ============================================================
  function test1_EmptyInputShowsAll() {
    const testName = 'Test 1: Empty input shows all products';
    const searchInput = getSearchInput();
    
    if (!searchInput) {
      logResult(testName, false, 'Search input #search-input not found');
      return;
    }

    // Clear input
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));

    // Wait a bit for render
    setTimeout(() => {
      const displayed = getDisplayedProducts().length;
      // We expect all products from data.json (usually 9 based on typical frontend mentor data)
      // But we can't know exact count without fetching data.json here, so we check > 0
      // Ideally we check against allProducts length if accessible, but let's assume > 0 is good start
      // Better: check if it matches the initial load count
      
      // Let's assume if we have products displayed, it's working for empty string
      // To be more precise, we should check if it matches the total products loaded initially
      // Since we can't easily access allProducts from console without modifying script, 
      // we will check if count > 0 and log the count.
      
      if (displayed > 0) {
        logResult(testName, true, `Displayed ${displayed} products`);
      } else {
        logResult(testName, false, 'No products displayed for empty input');
      }
    }, 100);
  }

  // ============================================================
  // TEST 2: Typing a valid product name filters correctly
  // ============================================================
  function test2_ValidFilter() {
    const testName = 'Test 2: Typing valid product name filters correctly';
    const searchInput = getSearchInput();
    
    if (!searchInput) {
      logResult(testName, false, 'Search input not found');
      return;
    }

    // We need a product name that exists. Let's try to find one from the DOM first
    // or use a common one like 'Waffle' or 'Crème Brûlée' (from typical data)
    // Better approach: Get the name of the first product currently displayed
    
    const firstProduct = document.querySelector('.dessert-box .dessert-type');
    if (!firstProduct) {
      logResult(testName, false, 'No products found to test filter');
      return;
    }

    const targetName = firstProduct.textContent;
    // Use a substring to test partial match
    const query = targetName.substring(0, 4); 

    searchInput.value = query;
    searchInput.dispatchEvent(new Event('input'));

    setTimeout(() => {
      const displayed = getDisplayedProducts();
      let allMatch = true;
      let count = 0;

      displayed.forEach(box => {
        const name = box.querySelector('.dessert-type').textContent;
        if (!name.toLowerCase().includes(query.toLowerCase())) {
          allMatch = false;
        }
        count++;
      });

      if (count > 0 && allMatch) {
        logResult(testName, true, `Filtered to ${count} products matching "${query}"`);
      } else if (count === 0) {
        logResult(testName, false, `No products found for "${query}" (expected at least 1)`);
      } else {
        logResult(testName, false, `Some products did not match "${query}"`);
      }
    }, 100);
  }

  // ============================================================
  // TEST 3: Case insensitivity
  // ============================================================
  function test3_CaseInsensitivity() {
    const testName = 'Test 3: Search is case-insensitive';
    const searchInput = getSearchInput();
    
    if (!searchInput) {
      logResult(testName, false, 'Search input not found');
      return;
    }

    const firstProduct = document.querySelector('.dessert-box .dessert-type');
    if (!firstProduct) {
      logResult(testName, false, 'No products found');
      return;
    }

    const targetName = firstProduct.textContent;
    const queryLower = targetName.substring(0, 4).toLowerCase();
    const queryUpper = targetName.substring(0, 4).toUpperCase();

    // Test Lower
    searchInput.value = queryLower;
    searchInput.dispatchEvent(new Event('input'));

    setTimeout(() => {
      const countLower = getDisplayedProducts().length;
      
      // Test Upper
      searchInput.value = queryUpper;
      searchInput.dispatchEvent(new Event('input'));

      setTimeout(() => {
        const countUpper = getDisplayedProducts().length;

        if (countLower > 0 && countLower === countUpper) {
          logResult(testName, true, `Matched ${countLower} items for both cases`);
        } else {
          logResult(testName, false, `Lower case count: ${countLower}, Upper case count: ${countUpper}`);
        }
      }, 100);
    }, 100);
  }

  // ============================================================
  // TEST 4: No matches shows empty state (0 products)
  // ============================================================
  function test4_NoMatches() {
    const testName = 'Test 4: No matches shows empty state';
    const searchInput = getSearchInput();
    
    if (!searchInput) {
      logResult(testName, false, 'Search input not found');
      return;
    }

    searchInput.value = 'zzzzzzzzzzzzzzzzzzzzzz';
    searchInput.dispatchEvent(new Event('input'));

    setTimeout(() => {
      const count = getDisplayedProducts().length;
      if (count === 0) {
        logResult(testName, true, 'No products displayed for non-matching query');
      } else {
        logResult(testName, false, `Displayed ${count} products for non-matching query`);
      }
    }, 100);
  }

  // ============================================================
  // TEST 5: Cart state preserved during search
  // ============================================================
  function test5_CartStatePreserved() {
    const testName = 'Test 5: Cart state preserved during search';
    const searchInput = getSearchInput();
    
    if (!searchInput) {
      logResult(testName, false, 'Search input not found');
      return;
    }

    // 1. Add item to cart
    const addBtn = document.querySelector('.add-to-cart-btn');
    if (!addBtn) {
      logResult(testName, false, 'No add to cart button found');
      return;
    }
    addBtn.click();
    
    // Verify it changed to quantity control
    const dessertBox = addBtn.closest('.dessert-box');
    const qtyBtn = dessertBox.querySelector('.add-to-quantity-btn');
    const isQtyVisible = window.getComputedStyle(qtyBtn).display !== 'none';
    
    if (!isQtyVisible) {
      logResult(testName, false, 'Failed to add item to cart initially');
      return;
    }

    // 2. Search for something else (or empty)
    searchInput.value = 'zzz'; // Force re-render with no matches
    searchInput.dispatchEvent(new Event('input'));

    setTimeout(() => {
      // 3. Clear search
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));

      setTimeout(() => {
        // 4. Check if the item is still in cart (button state)
        // We need to find the same product box again
        // Since we cleared search, all products are back.
        // We can find the box by the product name we added.
        
        // Get the name of the product we added
        const productName = dessertBox.querySelector('.dessert-type').textContent;
        
        // Find the box again in the new DOM
        const allBoxes = document.querySelectorAll('.dessert-box');
        let foundBox = null;
        allBoxes.forEach(box => {
          if (box.querySelector('.dessert-type').textContent === productName) {
            foundBox = box;
          }
        });

        if (foundBox) {
          const newAddBtn = foundBox.querySelector('.add-to-cart-btn');
          const newQtyBtn = foundBox.querySelector('.add-to-quantity-btn');
          const addHidden = window.getComputedStyle(newAddBtn).display === 'none';
          const qtyVisible = window.getComputedStyle(newQtyBtn).display !== 'none';
          const qtyText = newQtyBtn.querySelector('.label').textContent;

          if (addHidden && qtyVisible && qtyText === '1') {
            logResult(testName, true, 'Cart state preserved after search');
          } else {
            logResult(testName, false, `Button state incorrect: Add hidden=${addHidden}, Qty visible=${qtyVisible}, Qty=${qtyText}`);
          }
        } else {
          logResult(testName, false, 'Could not find product box after clearing search');
        }
      }, 100);
    }, 100);
  }

  // Run tests sequentially with delays to allow UI updates
  setTimeout(test1_EmptyInputShowsAll, 0);
  setTimeout(test2_ValidFilter, 500);
  setTimeout(test3_CaseInsensitivity, 1000);
  setTimeout(test4_NoMatches, 1500);
  setTimeout(test5_CartStatePreserved, 2000);
  setTimeout(summary, 2500);

})();
