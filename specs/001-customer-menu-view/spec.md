# Feature Specification: Customer Digital Menu View

**Feature Branch**: `001-customer-menu-view`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "بناء الميزة الأساسية لعرض قائمة الطعام الرقمية (Customer Digital Menu View) للعملاء عبر الموبايل: (1) عرض معلومات المطعم الأساسية في الأعلى — الاسم، الشعار، زر تبديل اللغة عربي/إنجليزي. (2) شريط فئات أفقي ثابت (Sticky Categories Bar) للتنقل السريع بين الأقسام. (3) عرض بطاقات الأصناف (Menu Item Cards) داخل كل فئة — صورة الصنف، الاسم، وصف مختصر، السعر، شارات توضيحية (حار، نباتي، الأكثر مبيعاً)، حالة التوفر. (4) شريط بحث فوري (Search) لتصفية الأصناف بالاسم أو الوصف. (5) نافذة تفاصيل الصنف (Item Detail Modal) عند الضغط على البطاقة لعرض الوصف الكامل، مسببات الحساسية، والسعرات الحرارية."

## User Scenarios & Testing

### User Story 1 - Browse Categorized Menu (Priority: P1)

A customer arrives at the restaurant, scans a QR code on the table (or
opens a direct link on their phone), and immediately sees the
restaurant's identity (name and logo) at the top, followed by a
horizontal category bar and the menu items grouped by section. They can
scroll through all items or tap a category chip to jump directly to
that section.

**Why this priority**: This is the absolute core of the product. Without
categorized menu browsing, the application delivers zero value. Every
other story builds on top of this one.

**Independent Test**: Open the menu URL on a mobile device. Verify that
the restaurant header (name + logo) is visible, categories are listed
horizontally, and tapping a category scrolls to or filters to the
corresponding section with its item cards.

**Acceptance Scenarios**:

1. **Given** a customer opens the menu link or scans the QR code,
   **When** the page loads, **Then** the restaurant header displays the
   restaurant name and logo, followed by a horizontal category bar
   listing all active categories (e.g., Beverages, Appetizers, Main
   Courses, Desserts).
2. **Given** the menu is loaded, **When** the customer scrolls down,
   **Then** menu items are displayed grouped under their category
   headings, each card showing the item image, name, short description,
   price, applicable badges, and availability status.
3. **Given** a menu item is marked as unavailable, **When** it is
   displayed, **Then** it appears visually muted with a clear
   "Unavailable" indicator and cannot be interacted with as if it were
   available.
4. **Given** a menu item has one or more badges (e.g., Spicy,
   Vegetarian, Best Seller), **When** the card is displayed, **Then**
   the badges appear as small visual indicators on the card.

---

### User Story 2 - Navigate via Sticky Categories Bar (Priority: P1)

While scrolling through a long menu, the horizontal category bar
remains pinned at the top of the viewport so the customer can tap any
category at any time to jump to that section without scrolling back to
the top.

**Why this priority**: Menus can be long. Without sticky navigation,
customers must scroll extensively to switch between sections — this
degrades the core browsing experience significantly, so it is essential
for the P1 browsing flow.

**Independent Test**: Scroll past the first screen of items and verify
the category bar stays fixed at the top. Tap a different category and
verify the view jumps to that section. Verify the active category is
visually highlighted.

**Acceptance Scenarios**:

1. **Given** a customer has scrolled past the restaurant header,
   **When** they look at the top of the screen, **Then** the category
   bar remains visible and fixed (sticky).
2. **Given** the category bar is visible, **When** the customer taps
   a category (e.g., "Desserts"), **Then** the page smoothly scrolls
   to the Desserts section.
3. **Given** the customer is scrolling through items, **When** a new
   category section enters the viewport, **Then** the corresponding
   category chip in the sticky bar is highlighted as the active
   category.

---

### User Story 3 - Switch Language (Arabic / English) (Priority: P2)

A customer taps the language toggle button in the restaurant header to
switch the entire menu between Arabic and English. All text content
(restaurant name, category names, item names, descriptions, UI labels)
changes language, and the page layout direction flips between RTL and
LTR.

**Why this priority**: Bilingual support (AR + EN) is a constitutional
requirement from the first feature. The menu is still usable in a
single language, but the toggle is essential for the target market.

**Independent Test**: Load the menu in the default language. Tap the
language toggle. Verify all visible text changes language, the layout
direction flips, and no content is clipped, overlapping, or misaligned.

**Acceptance Scenarios**:

1. **Given** the menu is displayed in English (LTR), **When** the
   customer taps the language toggle in the header, **Then** all
   category names, item names, descriptions, prices, badges, and UI
   labels switch to Arabic and the layout direction changes to RTL.
2. **Given** the menu is displayed in Arabic (RTL), **When** the
   customer taps the language toggle, **Then** everything switches to
   English (LTR).
3. **Given** a customer switches language, **When** they scroll,
   navigate categories, or open an item detail modal, **Then** the
   selected language is preserved throughout the session.
4. **Given** a customer switches language, **When** the toggle
   activates, **Then** the switch happens instantly on the client side
   without a full page reload.

---

### User Story 4 - View Item Details in Modal (Priority: P2)

A customer taps on a menu item card to open a detail modal (overlay)
that shows the full item information: large image, full description,
allergen information, and calorie count. They can close the modal to
return to browsing.

**Why this priority**: The card view shows only a summary. Customers
with dietary restrictions or allergies need access to full details
before ordering — this is critical for safety and trust but not needed
for basic browsing.

**Independent Test**: Tap any menu item card and verify a modal opens
showing the large image, full description, allergens, and calories.
Close the modal and verify the menu state is preserved (scroll position,
active category).

**Acceptance Scenarios**:

1. **Given** a customer is browsing the menu, **When** they tap on a
   menu item card, **Then** a modal overlay opens displaying: a larger
   version of the item image, the full item name, the complete
   description (not truncated), the price, allergen information, and
   calorie count.
2. **Given** the item detail modal is open, **When** the customer taps
   the close button or the backdrop area, **Then** the modal closes and
   the customer returns to the menu at the same scroll position.
3. **Given** an item has no allergen data or calorie information,
   **When** the modal is displayed, **Then** those fields are omitted
   gracefully (not shown as empty or "N/A").
4. **Given** the menu language is Arabic (RTL), **When** the modal
   opens, **Then** the modal content is also displayed in Arabic RTL
   layout.

---

### User Story 5 - Search Menu Items (Priority: P3)

A customer uses the search bar to type a keyword and instantly filter
the visible menu items by name or description. The search works across
all categories and updates results as the customer types.

**Why this priority**: Search is a convenience feature that enhances
discoverability — especially for large menus. The menu is fully
browsable without it, so it ranks behind core browsing and details.

**Independent Test**: Type a known item name (or partial name) into the
search bar and verify that only matching items are shown. Clear the
search and verify the full categorized menu returns.

**Acceptance Scenarios**:

1. **Given** a customer is viewing the menu, **When** they tap the
   search bar and type a keyword (e.g., "chicken"), **Then** the menu
   filters in real time to show only items whose name or description
   (in the current language) contains the keyword.
2. **Given** the search has active results, **When** the customer
   clears the search field, **Then** the full categorized menu is
   restored.
3. **Given** a search query matches no items, **When** the results are
   displayed, **Then** a friendly "No items found" message is shown
   with a suggestion to clear the search.
4. **Given** the customer is searching, **When** they type, **Then**
   the filtering happens on the client side with no perceptible delay
   (instant feedback).

---

### User Story 6 - Responsive Across Devices (Priority: P3)

A customer or restaurant owner views the menu on different screen sizes
(phone, tablet, desktop). The layout adapts: single-column cards on
phones, multi-column grid on wider screens, with touch targets always
meeting the 44 × 44 px minimum.

**Why this priority**: Mobile is the primary use case, but the menu
should not break on other devices. This is a polish story that ensures
the constitutional mobile-first + progressive enhancement principles.

**Independent Test**: Resize the browser from 320 px to 1440 px and
verify the layout adapts without horizontal overflow, broken cards, or
inaccessible elements.

**Acceptance Scenarios**:

1. **Given** a customer opens the menu on a phone (320 px width),
   **When** they browse, **Then** item cards are displayed in a
   single-column layout, fully readable with one-handed navigation.
2. **Given** the menu is viewed on a tablet or desktop (≥ 768 px),
   **When** the items are displayed, **Then** the layout uses a
   multi-column grid to utilize the available space.
3. **Given** any viewport size, **When** interactive elements are
   rendered, **Then** all buttons, chips, and tappable areas meet the
   44 × 44 px minimum touch target.

---

### Edge Cases

- What happens when a category has zero available items? The category
  is still shown in the sticky bar but its section displays a message
  like "No items currently available in this category."
- What happens when a menu item has no image? A styled, branded
  placeholder image is displayed instead of a broken image icon.
- What happens when menu data fails to load (network error or server
  error)? A full-screen friendly error state is shown with a "Try
  Again" button that re-fetches the data.
- What happens when item names or descriptions are very long? Card text
  is truncated with an ellipsis; the full text is visible in the detail
  modal.
- What happens when the customer's device has JavaScript disabled or
  loading slowly? The page SHOULD degrade gracefully, showing at least
  a loading skeleton or static content.
- What happens when a customer searches in Arabic while the display
  language is English (or vice versa)? The search operates only on the
  currently displayed language's text.
- What happens when the customer opens a detail modal and switches
  language? The modal content updates to the newly selected language.
- What happens when there are many categories (> 8)? The sticky bar is
  horizontally scrollable so all categories remain accessible.

## Requirements

### Functional Requirements

- **FR-001**: System MUST display a restaurant header containing the
  restaurant name, logo image, and a language toggle button
  (Arabic / English).
- **FR-002**: System MUST display a horizontal, sticky category bar
  below the restaurant header that remains pinned to the top of the
  viewport during scroll.
- **FR-003**: Tapping a category chip in the sticky bar MUST smoothly
  scroll the page to the corresponding category section.
- **FR-004**: The active category in the sticky bar MUST be visually
  highlighted and automatically updated as the customer scrolls through
  sections (scroll-spy behavior).
- **FR-005**: The sticky category bar MUST be horizontally scrollable
  when the number of categories exceeds the viewport width.
- **FR-006**: System MUST display menu items as cards within their
  category sections. Each card MUST show: item image (or placeholder),
  name, short description (truncated if necessary), price, applicable
  badges, and availability status.
- **FR-007**: System MUST support the following badge types on item
  cards: Spicy, Vegetarian, and Best Seller. Badges MUST be displayed
  as compact visual indicators. Badge labels MUST be bilingual.
- **FR-008**: Unavailable items MUST be visually distinct (e.g., muted
  or grayed out) with a clear "Unavailable" label.
- **FR-009**: Tapping a menu item card MUST open a detail modal
  displaying: larger item image, full name, complete description
  (untruncated), price, allergen information (if available), and
  calorie count (if available). The system MUST reflect the open item
  in the URL hash (e.g., `#item-<id>`), enabling direct linking/sharing
  and allowing the browser's Back button to close the modal.
- **FR-010**: The detail modal MUST be dismissible by tapping a close
  button or tapping outside the modal. Closing the modal MUST preserve
  the customer's scroll position in the menu.
- **FR-011**: Fields without data in the detail modal (e.g., no
  allergens, no calories) MUST be omitted entirely rather than shown
  as empty.
- **FR-012**: System MUST provide a search input that filters menu
  items in real time (client-side) by matching the typed keyword
  against item names and descriptions in the current display language.
  For Arabic search, the system MUST normalize text (strip diacritics/
  tashkeel, normalize alef variants أ/إ/آ → ا, normalize taa marbuta
  ة → ه, and normalize yaa/alif maqsura ي → ى) for both query and
  content before matching.
- **FR-013**: When search is active and yields no results, the system
  MUST display a friendly empty-state message.
- **FR-014**: Clearing the search input MUST restore the full
  categorized menu view.
- **FR-015**: The language toggle MUST switch all UI text, content, and
  layout direction (LTR ↔ RTL) instantly without a full page reload.
- **FR-016**: The customer's language preference MUST be persisted
  within the browser session.
- **FR-017**: System MUST lazy-load images for items outside the initial
  viewport.
- **FR-018**: All item images MUST be served in WebP or AVIF format,
  compressed and responsively sized.
- **FR-019**: System MUST display a user-friendly error state with a
  retry action when menu data fails to load.
- **FR-021**: System MUST display animated skeleton placeholders
  mimicking the restaurant header, category bar, and item cards during
  the initial data load to prevent layout shift (CLS < 0.1).
- **FR-020**: The menu MUST be accessible at a clean, shareable URL
  suitable for QR code encoding.

### Key Entities

- **Restaurant**: The establishment whose menu is being displayed.
  Attributes: name (AR/EN), logo image URL, default language (Arabic),
  currency (EGP).
- **Category**: A grouping of related menu items (e.g., Appetizers,
  Main Courses). Attributes: name (AR/EN), display order, active
  status.
- **MenuItem**: A single dish or beverage on the menu. Attributes:
  name (AR/EN), short description (AR/EN), full description (AR/EN),
  price, image URL, display order, availability status, calorie count
  (optional), allergen list (optional).
- **Badge**: A visual tag applied to a menu item. Types: Spicy,
  Vegetarian, Best Seller. Each badge has a label (AR/EN) and an icon
  or color indicator.
- **Allergen**: A dietary allergen associated with a menu item (e.g.,
  nuts, dairy, gluten). Attributes: name (AR/EN), icon (optional).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Customers can see the restaurant header, category bar,
  and first category's item cards within 3 seconds of opening the menu
  link on a standard mobile connection.
- **SC-002**: Tapping a category chip scrolls to the corresponding
  section within 500 milliseconds (perceived as instant).
- **SC-003**: Switching language updates all visible content and layout
  direction within 1 second, with no page reload.
- **SC-004**: Typing in the search bar filters visible items with no
  perceptible delay (under 200 milliseconds per keystroke).
- **SC-005**: Initial page payload remains under 500 KB (compressed),
  as verified by browser DevTools or Lighthouse.
- **SC-006**: 100% of interactive elements (buttons, category chips,
  cards, search input, language toggle, modal close) meet the
  44 × 44 px minimum touch target.
- **SC-007**: The menu renders correctly across viewports from 320 px
  to 1440 px with no horizontal overflow, overlapping elements, or
  broken layouts.
- **SC-008**: All directional styling uses logical CSS properties; zero
  instances of physical `left`/`right` directional CSS classes in the
  feature's source code.
- **SC-009**: The detail modal opens within 300 milliseconds of tapping
  a card and displays all available item data (description, allergens,
  calories).

## Clarifications

### Session 2026-11-08

- Q: ما هي العملة التي ستُعرض بجانب أسعار الأصناف؟ → A: الجنيه المصري (EGP / ج.م)
- Q: ما هي اللغة الافتراضية عند فتح المنيو لأول مرة؟ → A: العربية (RTL)
- Q: كيف يتعامل شريط البحث مع الحروف والتشكيل العربي؟ → A: تطبيع ذكي (توحيد الهمزات، التاء المربوطة، الياء، وإزالة التشكيل)
- Q: هل يدعم رابط تفاصيل الصنف المشاركة المباشرة؟ → A: نعم، عبر URL hash (`#item-<id>`) مع دعم زر رجوع المتصفح للإغلاق
- Q: كيف يُعرض المحتوى أثناء التحميل الأولي؟ → A: شاشات هيكلية (Skeleton Loading) تحاكي شريط الفئات وبطاقات الأصناف لمنع الـ Layout Shift

## Assumptions

- The restaurant's data (name, logo, categories, items with bilingual
  text, images, prices, badges, allergens, calories) is pre-populated
  in the database. Admin CRUD for managing this data is a
  separate future feature.
- This feature is read-only for customers. There is no ordering, cart,
  or payment functionality in this scope.
- One restaurant per deployment; multi-tenancy is out of scope.
- Currency is Egyptian Pound (EGP / ج.م), fixed at the application level
  and configured once — not per item. Prices display as "45 ج.م" in
  Arabic and "45 EGP" in English.
- The QR code itself is generated externally; this feature only needs
  a clean, stable URL.
- No authentication is required to view the menu — it is publicly
  accessible.
- The allergen list is drawn from a predefined set of common allergens
  (e.g., nuts, dairy, gluten, eggs, soy, shellfish, wheat) rather than
  free-text entry.
- Calorie and allergen data are optional per item — not all items will
  have them.
- Badge types (Spicy, Vegetarian, Best Seller) are a fixed set for this
  feature; adding custom badge types is a future enhancement.
- The search operates on the currently displayed language only; cross-
  language search is out of scope.
