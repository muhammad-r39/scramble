// dragndrop.js
document.addEventListener("DOMContentLoaded", function () {
  // Clean up any potential leftover drag elements
  cleanupDragElements();

  // Initialize drag and drop functionality
  initDragAndDrop();

  // If letters are generated dynamically, set up a mutation observer to watch for changes
  setupMutationObserver();
});

// Initialize drag and drop
function initDragAndDrop() {
  // Get all existing letter wrappers
  setupDraggableLetters();

  // Set up drop targets
  setupDropTargets();
}

// Set up event listeners for draggable letters
function setupDraggableLetters() {
  const draggables = document.querySelectorAll(".letter-wrapper");
  draggables.forEach((draggable) => {
    if (!draggable.hasAttribute("data-drag-initialized")) {
      draggable.setAttribute("data-drag-initialized", "true");

      // Mouse events
      draggable.addEventListener("dragstart", handleDragStart);
      draggable.addEventListener("dragend", handleDragEnd);

      // Touch events
      draggable.addEventListener("touchstart", handleTouchStart);
      draggable.addEventListener("touchmove", handleTouchMove);
      draggable.addEventListener("touchend", handleTouchEnd);
    }
  });
}

// Set up event listeners for drop targets
function setupDropTargets() {
  // Set up word assembly slots
  const wordAssemblySlots = document.querySelectorAll(".word-assembly .slot");
  wordAssemblySlots.forEach((slot) => {
    if (!slot.hasAttribute("data-drop-initialized")) {
      slot.setAttribute("data-drop-initialized", "true");

      // Mouse events
      slot.addEventListener("dragover", handleDragOver);
      slot.addEventListener("dragenter", handleDragEnter);
      slot.addEventListener("dragleave", handleDragLeave);
      slot.addEventListener("drop", handleDropInWordAssembly);
    }
  });

  // Set up letter generator slots
  const letterGeneratorSlots = document.querySelectorAll(
    ".letter-generator .slot"
  );
  letterGeneratorSlots.forEach((slot) => {
    if (!slot.hasAttribute("data-drop-initialized")) {
      slot.setAttribute("data-drop-initialized", "true");

      // Mouse events
      slot.addEventListener("dragover", handleDragOver);
      slot.addEventListener("dragenter", handleDragEnter);
      slot.addEventListener("dragleave", handleDragLeave);
      slot.addEventListener("drop", handleDropInLetterGenerator);
    }
  });
}

// Set up mutation observer to watch for dynamically added letters
function setupMutationObserver() {
  const letterGeneratorContainer = document.querySelector(".letter-generator");
  if (!letterGeneratorContainer) return;

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList" || mutation.type === "subtree") {
        // When new letters are added, set up drag and drop again
        setupDraggableLetters();
      }
    });
  });

  observer.observe(letterGeneratorContainer, {
    childList: true,
    subtree: true,
  });
}

// Track the current drag operation
let draggedElement = null;
let dragSourceContainer = null;
let dragSourceSlot = null;
let dragSourceIndex = -1;
let touchDragging = false;
let touchClone = null;
let touchStartX = 0;
let touchStartY = 0;

// ======== MOUSE EVENTS ========

// Handle drag start
function handleDragStart(e) {
  draggedElement = this;
  dragSourceSlot = this.parentElement;
  dragSourceContainer = dragSourceSlot.closest(".slot-wrapper");

  // Store the index for reordering
  if (dragSourceContainer.classList.contains("word-assembly")) {
    const wordAssemblySlots = Array.from(
      document.querySelectorAll(".word-assembly .slot")
    );
    dragSourceIndex = wordAssemblySlots.indexOf(dragSourceSlot);
  }

  // Add dragging class for visual feedback
  setTimeout(() => {
    this.classList.add("dragging");
  }, 0);

  // Required for Firefox
  e.dataTransfer.setData("text/plain", "");
  e.dataTransfer.effectAllowed = "move";
}

// Handle drag end
function handleDragEnd() {
  this.classList.remove("dragging");
  draggedElement = null;
  dragSourceContainer = null;
  dragSourceSlot = null;
  dragSourceIndex = -1;
}

// Handle drag over
function handleDragOver(e) {
  e.preventDefault();
  return false;
}

// Handle drag enter
function handleDragEnter(e) {
  e.preventDefault();
  this.classList.add("drag-over");
}

// Handle drag leave
function handleDragLeave() {
  this.classList.remove("drag-over");
}

// ======== TOUCH EVENTS ========

// Handle touch start
function handleTouchStart(e) {
  if (touchDragging) return;

  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;

  // Delay setting touchDragging to true to allow for scrolling
  setTimeout(() => {
    draggedElement = this;
    dragSourceSlot = this.parentElement;
    dragSourceContainer = dragSourceSlot.closest(".slot-wrapper");

    // Store the index for reordering
    if (dragSourceContainer.classList.contains("word-assembly")) {
      const wordAssemblySlots = Array.from(
        document.querySelectorAll(".word-assembly .slot")
      );
      dragSourceIndex = wordAssemblySlots.indexOf(dragSourceSlot);
    }
  }, 100);
}

// Handle touch move
// Update your handleTouchMove function where you create the clone
function handleTouchMove(e) {
  if (!draggedElement) return;

  const touch = e.touches[0];
  const moveX = touch.clientX - touchStartX;
  const moveY = touch.clientY - touchStartY;

  // Only start dragging if moved more than 10px
  if ((!touchDragging && Math.abs(moveX) > 10) || Math.abs(moveY) > 10) {
    touchDragging = true;

    // Clean up any existing clones first
    document.querySelectorAll(".touch-dragging").forEach((el) => {
      el.remove();
    });

    // Create clone for dragging visual
    touchClone = draggedElement.cloneNode(true);
    touchClone.classList.add("touch-dragging");

    // Get the computed style of the original element
    const originalStyle = window.getComputedStyle(draggedElement);

    // Apply the same dimensions to the clone
    touchClone.style.width = originalStyle.width;
    touchClone.style.height = originalStyle.height;
    touchClone.style.boxSizing = "border-box"; // Ensure padding/border are included in dimensions

    // Copy other relevant styles if needed
    // For example, you might want to preserve font size, padding, etc.
    touchClone.style.fontSize = originalStyle.fontSize;
    touchClone.style.padding = originalStyle.padding;
    touchClone.style.margin = "0"; // Reset margin to avoid positioning issues

    document.body.appendChild(touchClone);

    // Make original semi-transparent
    draggedElement.classList.add("dragging");

    // Prevent default to disable scrolling while dragging
    e.preventDefault();
  }

  if (touchDragging && touchClone) {
    // Move the clone with the finger
    touchClone.style.position = "absolute";
    touchClone.style.left = `${touch.clientX - touchClone.offsetWidth / 2}px`;
    touchClone.style.top = `${touch.clientY - touchClone.offsetHeight / 2}px`;
    touchClone.style.zIndex = "1000";

    // Check if we're over a slot
    const elemBelow = getTouchElementBelow(touch.clientX, touch.clientY);

    // Clear previous highlights
    document.querySelectorAll(".drag-over").forEach((el) => {
      el.classList.remove("drag-over");
    });

    // Highlight current slot if any
    if (elemBelow && elemBelow.classList.contains("slot")) {
      elemBelow.classList.add("drag-over");
    }
  }
}

// Handle touch end
function handleTouchEnd(e) {
  if (!touchDragging) {
    draggedElement = null;
    dragSourceContainer = null;
    dragSourceSlot = null;
    dragSourceIndex = -1;
    return;
  }

  // Get the element below the touch point
  const touch = e.changedTouches[0];
  const elemBelow = getTouchElementBelow(touch.clientX, touch.clientY);

  // If we found a valid drop target
  if (elemBelow && elemBelow.classList.contains("slot")) {
    // Determine which container we're dropping into
    const targetContainer = elemBelow.closest(".slot-wrapper");

    if (
      targetContainer &&
      targetContainer.classList.contains("word-assembly")
    ) {
      // Make sure dragSourceSlot is still valid
      if (dragSourceSlot) {
        performTouchDropInWordAssembly(elemBelow);
      }
    } else if (
      targetContainer &&
      targetContainer.classList.contains("letter-generator")
    ) {
      performTouchDropInLetterGenerator(elemBelow);
    }
  }

  // Clean up
  if (touchClone) {
    touchClone.remove();
    touchClone = null;
  }

  if (draggedElement) {
    draggedElement.classList.remove("dragging");
  }

  // Clean up any other touch-dragging elements that might be leftover
  document.querySelectorAll(".touch-dragging").forEach((el) => {
    el.remove();
  });

  document.querySelectorAll(".drag-over").forEach((el) => {
    el.classList.remove("drag-over");
  });

  touchDragging = false;
  draggedElement = null;
  dragSourceContainer = null;
  dragSourceSlot = null;
  dragSourceIndex = -1;
}

// Add this function to clean up any leftover drag elements
function cleanupDragElements() {
  // Remove any touch-dragging elements
  document.querySelectorAll(".touch-dragging").forEach((el) => {
    el.remove();
  });

  // Remove dragging class from any elements
  document.querySelectorAll(".dragging").forEach((el) => {
    el.classList.remove("dragging");
  });

  // Remove drag-over class from any elements
  document.querySelectorAll(".drag-over").forEach((el) => {
    el.classList.remove("drag-over");
  });

  // Reset global variables
  touchDragging = false;
  draggedElement = null;
  dragSourceContainer = null;
  dragSourceSlot = null;
  dragSourceIndex = -1;
  touchClone = null;
}

// Get the element below touch point
function getTouchElementBelow(x, y) {
  // Hide all dragging elements temporarily
  touchClone.style.display = "none";
  document.querySelectorAll(".touch-dragging").forEach((el) => {
    el.style.display = "none";
  });

  // Get element at point
  let elemBelow = document.elementFromPoint(x, y);

  // Show dragging elements again
  touchClone.style.display = "block";
  document.querySelectorAll(".touch-dragging").forEach((el) => {
    el.style.display = "block";
  });

  // If the element below isn't a slot but it's inside one, find the parent slot
  if (elemBelow && !elemBelow.classList.contains("slot")) {
    const slotParent = elemBelow.closest(".slot");
    if (slotParent) {
      elemBelow = slotParent;
    }
  }

  return elemBelow;
}

// Perform touch drop in word assembly
function performTouchDropInWordAssembly(targetSlot) {
  // Coming from letter generator - place in first empty slot
  if (dragSourceContainer.classList.contains("letter-generator")) {
    const firstEmptySlot = findFirstEmptySlot();
    if (firstEmptySlot) {
      firstEmptySlot.appendChild(draggedElement);
    }
  }
  // Coming from word assembly - enable reordering
  else if (dragSourceContainer.classList.contains("word-assembly")) {
    const targetIndex = Array.from(
      document.querySelectorAll(".word-assembly .slot")
    ).indexOf(targetSlot);

    // If target slot is empty, we can directly move the letter
    if (!targetSlot.hasChildNodes()) {
      targetSlot.appendChild(draggedElement);
      reorganizeWordAssembly();
    }
    // If target slot is not empty and not the source slot itself, swap the letters
    else if (targetSlot.hasChildNodes() && targetSlot !== dragSourceSlot) {
      // Use the same swap function that works for mouse drag
      handleLetterSwap(targetSlot);
    }
  }
}

// Perform touch drop in letter generator
function performTouchDropInLetterGenerator(targetSlot) {
  // Only allow drops from word assembly to letter generator
  if (dragSourceContainer.classList.contains("word-assembly")) {
    // Check if this slot is empty
    if (!targetSlot.hasChildNodes()) {
      targetSlot.appendChild(draggedElement);

      // Reorganize word assembly slots
      reorganizeWordAssembly();
    }
  }
}

// ======== SHARED FUNCTIONALITY ========

// Handle drop in word assembly
function handleDropInWordAssembly(e) {
  e.preventDefault();
  this.classList.remove("drag-over");

  // Check if we have a valid element to drop
  if (!draggedElement) return false;

  // Coming from letter generator - place in first empty slot
  if (
    dragSourceContainer &&
    dragSourceContainer.classList.contains("letter-generator")
  ) {
    const firstEmptySlot = findFirstEmptySlot();
    if (firstEmptySlot) {
      firstEmptySlot.appendChild(draggedElement);
    }
  }
  // Coming from word assembly - enable reordering
  else if (
    dragSourceContainer &&
    dragSourceContainer.classList.contains("word-assembly")
  ) {
    const currentSlot = this;
    const targetIndex = Array.from(
      document.querySelectorAll(".word-assembly .slot")
    ).indexOf(currentSlot);

    // If target slot is empty, we can directly move the letter
    if (!currentSlot.hasChildNodes()) {
      currentSlot.appendChild(draggedElement);
      reorganizeWordAssembly();
    }
    // If target slot is not empty and not the source slot itself, swap the letters
    else if (targetIndex !== dragSourceIndex) {
      handleLetterSwap(currentSlot);
    }
  }

  return false;
}

// Handle letter swapping for reordering
function handleLetterSwap(targetSlot) {
  // Only swap if target slot has a letter and is different from source
  if (
    targetSlot.hasChildNodes() &&
    dragSourceSlot &&
    targetSlot !== dragSourceSlot
  ) {
    const targetLetter = targetSlot.firstChild;
    const sourceLetter = draggedElement;

    // Safety check to ensure we have valid elements
    if (!targetLetter || !sourceLetter) return;

    // Temporarily store the target element
    const tempHolder = document.createElement("div");
    tempHolder.appendChild(targetLetter);

    // Place source element in target
    targetSlot.appendChild(sourceLetter);

    // Place target element in source slot
    // If source slot is now empty (might have been reorganized), find new position
    if (dragSourceSlot.hasChildNodes()) {
      dragSourceSlot.innerHTML = "";
    }
    dragSourceSlot.appendChild(tempHolder.firstChild);

    // Ensure proper organization
    reorganizeWordAssembly();
  }
}

// Handle drop in letter generator
function handleDropInLetterGenerator(e) {
  e.preventDefault();
  this.classList.remove("drag-over");

  // Check if we have a valid element to drop
  if (!draggedElement) return false;

  // Only allow drops from word assembly to letter generator
  if (
    dragSourceContainer &&
    dragSourceContainer.classList.contains("word-assembly")
  ) {
    // Check if this slot is empty
    if (!this.hasChildNodes()) {
      this.appendChild(draggedElement);

      // Reorganize word assembly slots
      reorganizeWordAssembly();
    }
  }

  return false;
}

// Find the first empty slot in word assembly
function findFirstEmptySlot() {
  const wordAssemblySlots = document.querySelectorAll(".word-assembly .slot");
  for (const slot of wordAssemblySlots) {
    if (!slot.hasChildNodes()) {
      return slot;
    }
  }
  return null;
}

// Reorganize word assembly slots - ensure no gaps
function reorganizeWordAssembly() {
  const wordAssemblySlots = document.querySelectorAll(".word-assembly .slot");
  const letters = [];

  // Collect all letters from word assembly
  wordAssemblySlots.forEach((slot) => {
    if (slot.hasChildNodes()) {
      const letter = slot.firstChild;
      letters.push(letter);
      slot.removeChild(letter);
    }
  });

  // Redistribute letters into slots from the beginning
  letters.forEach((letter, index) => {
    wordAssemblySlots[index].appendChild(letter);
  });
}

// Public method to reinitialize drag and drop
// This can be called after dynamically generating letters
function reinitializeDragAndDrop() {
  initDragAndDrop();
}

// Add these event listeners to your initialization
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    cleanupDragElements();
  }
});

window.addEventListener("pageshow", function () {
  cleanupDragElements();
});

// Expose the reinitialization function globally
window.reinitializeDragAndDrop = reinitializeDragAndDrop;
