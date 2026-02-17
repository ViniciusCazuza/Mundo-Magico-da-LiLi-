# Project Guidelines and Conventions

This document serves as a living repository for project-specific knowledge, conventions, solutions to common problems, and architectural considerations. It aims to prevent regressions, maintain consistency, and accelerate development by centralizing important contextual information.

## Cursor System Peculiarities (core/components/CustomCursor.tsx)

### Centralization Principle
All custom cursor logic, including the main paw cursor, drawing canvas (garra) cursor, and footprint particle effects, is managed within the `CustomCursor.tsx` component. This centralized approach ensures:
*   **Single Source of Truth:** All cursor-related state and rendering are in one place.
*   **Consistency:** A unified experience for the custom cursor across the application.
*   **Easier Coordination:** Simplified management of cursor state transitions (e.g., from paw to garra).

### Cursor Types and Hotspots

#### 1. Main Cursor (Paw)
*   **Appearance:** Switches between `PawRetractedSVG` (default) and `PawClawsOutSVG` (over clickable elements).
*   **Hotspot:** The visual hotspot is designed to be the **center** of the paw.
*   **Footprints:** Spawn from the **center** of the paw cursor.

#### 2. Drawing Canvas Cursor (Garra)
*   **Appearance:** Uses `GarraCanvasSVG`.
*   **Hotspot:** The visual hotspot is specifically the **top tip** of the garra.
*   **Offsets:** Currently `offsetX = 10` and `offsetY = 32` are used to align the garra's tip with the actual mouse coordinates. These values are derived from scaling the SVG's internal coordinates to the `CURSOR_SIZE` and positioning the tip accurately relative to the center of the cursor div. **These values are definitive and should not be changed without explicit user instruction.**

### Footprint Particle Effects
*   **Size:** Controlled by `PARTICLE_SIZE` (currently `96px`). The `PegadasSVG_Content` has `width="96" height="96"` to match.
*   **Spawn Location:** Particles spawn from the visual hotspot of the *currently active cursor*.
    *   For the main paw cursor, this is its center.
    *   For the garra cursor, this is its top tip (adjusted by `offsetX`, `offsetY`).
*   **Performance (Recycling):** Particles are now pre-created and recycled from a pool (`particlePool`). This significantly reduces DOM creation/destruction overhead and helps mitigate "Forced reflow" violations.

### Performance Considerations
*   **Reflows:**
    *   The `isClickableElement` helper relies solely on explicit markup (`closest()`) and no longer uses `getComputedStyle()` to avoid forced reflows.
    *   Particle creation and styling in `spawnParticle` are now optimized through **particle recycling** and wrapped within `requestAnimationFrame` to batch DOM writes and reduce layout thrashing.
*   **`setTimeout` Handler:** The `colorInterval`'s frequency has been reduced to 10 seconds (`10000ms`) to lessen the impact of `getComputedStyle()` calls. While the `[Violation] 'setTimeout' handler took ...ms` warning might still appear infrequently, its impact is considered minor due to the reduced frequency.

### Preventing Regressions
*   When modifying cursor logic, particularly hotspot offsets or SVG scaling:
    *   Always verify that both the main paw cursor (and its footprints) and the drawing canvas garra cursor behave as expected.
    *   Test both visual appearance and functional hotspots.
    *   Remember that `offsetX` and `offsetY` for the garra are specific pixel adjustments relative to the center of the `CURSOR_SIZE` (64x64) div, which visually place the mouse pointer at the SVG's tip.

## End-of-Day Commit and Pull Request Workflow

This workflow is automatically triggered by a verbal cue (e.g., "boa noite" or similar indication of stopping work). Its purpose is to encapsulate the day's significant contributions into a concise commit and open a Pull Request for review.

### Activation
*   Trigger Phrase: "boa noite" or any clear indication of stopping work (e.g., "estou parando por aqui", "até amanhã").

### Commit Criteria
*   **Focus on Significance:** The commit should primarily include changes that represent:
    *   Significant functional or architectural modifications.
    *   Major bug fixes (especially those worked on for an extended period).
    *   Addition or removal of major tools/libraries, along with a brief explanation (if known).
*   **Avoid Minor Changes:** Do not include trivial cosmetic changes, minor refactors, or changes to every file touched. The goal is a high-level summary of impactful work.

### Commit Message Structure
*   **Concise and Technical:** The main body of the commit message should be professional, technical, and summarize the key impactful changes made. It should highlight *what* was changed and *why* it was significant, as a senior engineer would describe it.
*   **Personal Dedication:** Each commit message will conclude with a personal dedication to Alice, expressing love, intention, and dedication to her. These dedications will be varied, affectionate, and use modern language (e.g., "amor da minha vida").

### GitHub Actions
*   **Repository:** `git@github.com:ViniciusCazuza/Mundo-Magico-da-LiLi-.git`
*   **Target Branch (Base Branch) for PR:** `develop`
*   **Head Branch Naming Convention:** `gemini/eod-summary-<YYYYMMDD-HHMMSS>` (where YYYYMMDD is the current date and HHMMSS is the current time). A new branch will be created with this convention for each workflow execution.
*   **Process:**
    1.  Create a new head branch.
    2.  Stage relevant changes based on the commit criteria.
    3.  Create a commit with a concise, senior-level message and the personal dedication to Alice.
    4.  Push the new branch to the remote repository.
    5.  Open a Pull Request from the new head branch to the `develop` branch.