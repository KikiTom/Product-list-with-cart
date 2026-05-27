# Smoke Test Checklist — Product List with Cart

**Tanggal**: 2025-07-15  
**Commit**: pending  
**Tester**: QA Engineer  

---

## Test Environment
- **Browser**: Chrome (latest), Firefox (latest)
- **Resolution**: 1920×1080 (desktop)
- **Data source**: `data.json` (9 produk)

---

## 1. Add to Cart

| ID | Test Case | Steps | Expected Result | Status | Notes |
|----|-----------|-------|-----------------|--------|-------|
| TC-01 | Add single product to cart | Klik 'Add to Cart' pada "Waffle with Berries" | Tombol berubah jadi quantity selector (+/-), cart menampilkan item, cart count badge update | **FAIL** | `add-to-quantity-btn` tetap `display: none`, tidak ada logic untuk toggle visibility. Cart count badge (`#info-cart`) tidak di-update. |
| TC-02 | Add multiple different products | Klik 'Add to Cart' pada 3 produk berbeda | Cart menampilkan 3 item berbeda, masing-masing quantity 1 | **FAIL** | Cart items ditampilkan tapi menggunakan `<cart-items>` (invalid element). Quantity selector tidak muncul. |
| TC-03 | Add same product twice | Klik 'Add to Cart' pada "Waffle with Berries" 2x | Quantity waffle = 2 di cart dan di tombol produk | **PARTIAL** | Logic `addToCart` increment quantity benar, tapi UI quantity selector tidak muncul. |

---

## 2. Quantity Increment

| ID | Test Case | Steps | Expected Result | Status | Notes |
|----|-----------|-------|-----------------|--------|-------|
| TC-04 | Increment quantity via '+' | Klik '+' pada quantity selector | Quantity di cart dan di tombol produk bertambah 1 | **FAIL** | Quantity selector (`add-to-quantity-btn`) tidak pernah ditampilkan. Tidak ada event listener untuk tombol '+'. |
| TC-05 | Increment multiple times | Klik '+' 5x | Quantity = 5, total harga update | **FAIL** | Fitur belum diimplementasikan. |

---

## 3. Quantity Decrement

| ID | Test Case | Steps | Expected Result | Status | Notes |
|----|-----------|-------|-----------------|--------|-------|
| TC-06 | Decrement quantity via '-' | Klik '-' pada quantity selector | Quantity berkurang 1 | **FAIL** | Fitur belum diimplementasikan. |
| TC-07 | Decrement to 0 | Klik '-' sampai quantity = 0 | Item hilang dari cart, tombol kembali ke 'Add to Cart' | **FAIL** | Fitur belum diimplementasikan. |

---

## 4. Remove from Cart

| ID | Test Case | Steps | Expected Result | Status | Notes |
|----|-----------|-------|-----------------|--------|-------|
| TC-08 | Remove item via 'Remove' button | Klik 'Remove' pada cart item | Item hilang dari cart, tombol produk reset ke 'Add to Cart' | **FAIL** | `removeFromCart()` dipanggil di `updateCartDisplay` tapi fungsi tidak didefinisikan → **ReferenceError** saat render cart. |
| TC-09 | Remove last item | Remove satu-satunya item di cart | Cart kembali ke empty state, empty message muncul | **FAIL** | Fungsi `removeFromCart` tidak ada. |

---

## 5. Cart Count Badge

| ID | Test Case | Steps | Expected Result | Status | Notes |
|----|-----------|-------|-----------------|--------|-------|
| TC-10 | Badge reflects total quantity | Add 2 Waffle + 1 Cake | `#info-cart` menampilkan `(3)` | **FAIL** | `#info-cart` tidak pernah di-update; selalu `(0)`. |
| TC-11 | Badge updates on remove | Remove 1 item dari cart | `#info-cart` menampilkan quantity terbaru | **FAIL** | Tidak ada logic update badge. |
| TC-12 | Badge shows 0 on empty cart | Cart kosong | `#info-cart` menampilkan `(0)` | **PASS** | Default state benar. |

---

## 6. Confirm Order Modal

| ID | Test Case | Steps | Expected Result | Status | Notes |
|----|-----------|-------|-----------------|--------|-------|
| TC-13 | Confirm order with items | Add item → klik 'Confirm Order' | Modal muncul dengan daftar item + total | **FAIL** | Tidak ada modal implementation. Tombol 'Confirm Order' tidak memiliki event listener. |
| TC-14 | Start New Order from modal | Klik 'Start New Order' di modal | Cart kosong, modal hilang | **FAIL** | Modal belum ada. |
| TC-15 | Confirm order with empty cart | Cart kosong → klik 'Confirm Order' | Tidak bisa / tidak ada efek | **FAIL** | Tombol 'Confirm Order' tersembunyi saat cart kosong (`cart-summary` display:none), tapi tidak ada guard tambahan. |

---

## 7. Start New Order

| ID | Test Case | Steps | Expected Result | Status | Notes |
|----|-----------|-------|-----------------|--------|-------|
| TC-16 | Reset cart via 'Start New Order' | Add items → klik 'Start New Order' | Cart reset, semua tombol produk kembali ke 'Add to Cart' | **FAIL** | Tombol 'Start New Order' tidak memiliki event listener. |
| TC-17 | Reset empty cart | Cart kosong → klik 'Start New Order' | Tidak ada efek (tombol tidak terlihat) | **PASS** | Tombol tersembunyi saat cart kosong. |

---

## 8. Keyboard Navigation

| ID | Test Case | Steps | Expected Result | Status | Notes |
|----|-----------|-------|-----------------|--------|-------|
| TC-18 | Tab through interactive elements | Tekan Tab berulang kali | Focus ring terlihat pada semua elemen interaktif | **PARTIAL** | CSS memiliki `:focus-visible` tapi tidak ada style explicit untuk focus ring. Tombol 'Add to Cart' bisa di-focus. |
| TC-19 | Trigger button with Enter | Focus pada 'Add to Cart' → tekan Enter | Produk masuk cart | **PASS** | Native `<button>` behavior. |
| TC-20 | Trigger button with Space | Focus pada 'Add to Cart' → tekan Space | Produk masuk cart | **PASS** | Native `<button>` behavior. |
| TC-21 | Tab through quantity selector | Focus pada '+' dan '-' | Bisa di-trigger dengan Enter/Space | **FAIL** | Quantity selector tidak pernah muncul. |

---

## 9. Edge Cases

| ID | Test Case | Steps | Expected Result | Status | Notes |
|----|-----------|-------|-----------------|--------|-------|
| TC-22 | Double-click rapid Add to Cart | Klik 2x cepat pada 'Add to Cart' | Quantity = 2 (bukan duplicate item) | **PASS** | Logic `addToCart` menggunakan find + increment, jadi double-click aman. |
| TC-23 | Multiple different products | Add 3 produk berbeda | Masing-masing tampil sebagai item terpisah | **PARTIAL** | Logic benar tapi render menggunakan `<cart-items>` invalid. |
| TC-24 | Cart empty + Confirm Order | Cart kosong, inspect tombol | Tombol tidak terlihat/disabled | **PASS** | `cart-summary` di-set `display: none` saat cart kosong. |
| TC-25 | Rapid add/remove | Add → remove → add produk sama | State konsisten | **FAIL** | `removeFromCart` tidak ada. |
| TC-26 | Scroll lazy load | Scroll ke bawah | 3 produk pertama load, lalu 3 berikutnya | **PASS** | Logic `loadMoreProducts` dengan `productsPerLoad = 6` (9 total produk, jadi 6 + 3). |
| TC-27 | All 9 products loaded | Scroll sampai habis | 9 produk tertampil | **PASS** | Scroll listener di-remove setelah semua produk load. |

---

## Summary

| Kategori | PASS | FAIL | PARTIAL |
|----------|------|------|---------|
| Add to Cart | 0 | 2 | 1 |
| Quantity Increment | 0 | 2 | 0 |
| Quantity Decrement | 0 | 2 | 0 |
| Remove from Cart | 0 | 2 | 0 |
| Cart Count Badge | 1 | 2 | 0 |
| Confirm Order Modal | 0 | 3 | 0 |
| Start New Order | 1 | 1 | 0 |
| Keyboard Navigation | 2 | 1 | 1 |
| Edge Cases | 3 | 1 | 1 |
| **TOTAL** | **7** | **16** | **3** |

**Overall**: **FAIL** — Mayoritas fitur belum diimplementasikan atau memiliki bug blocking.

---

## Critical Bugs Found

1. **`removeFromCart` is not defined** (`js/script.js:47`) — Dipanggil di `updateCartDisplay` via inline `onclick` tapi fungsi tidak ada. Menyebabkan `ReferenceError` saat render cart item dengan tombol Remove.

2. **`<cart-items>` invalid HTML element** (`js/script.js:42`) — `document.createElement('cart-items')` membuat invalid custom element. Seharusnya `document.createElement('div')`.

3. **Quantity selector never shown** — `add-to-quantity-btn` memiliki `display: none` di CSS dan tidak ada JavaScript yang mengubahnya. Fitur increment/decrement tidak berfungsi.

4. **Cart count badge never updated** — `#info-cart` selalu `(0)`. Tidak ada `document.getElementById('info-cart')` atau `document.querySelector('#info-cart')` di seluruh `script.js`.

5. **No Confirm Order modal** — Tidak ada HTML modal, tidak ada JavaScript untuk modal. Tombol 'Confirm Order' dan 'Start New Order' tidak memiliki event listener.

6. **No event delegation for cart buttons** — `confirm-order-btn` dan `reset-order-btn` tidak memiliki handler. Decision menyebutkan "event delegation for confirm/reset buttons via DOMContentLoaded" tapi tidak ada di kode.

7. **`boxicons` CDN unused** — Quantity buttons menggunakan `<box-icon>` tapi tidak pernah dirender. CDN tetap di-load, menambah overhead.
