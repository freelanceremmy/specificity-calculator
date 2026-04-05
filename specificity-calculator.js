// Calculate specificity for a single selector string
function calculateSpecificity(selector) {
  // Remove strings inside :not() because they don't add specificity themselves
  // but their contents do count, so we keep them for calculation.
  // For simplicity, we won't parse :not deeply here, but treat it as normal selector.

  // Specificity format: (a, b, c, d)
  // a = inline styles (not applicable here)
  // b = number of ID selectors
  // c = number of class selectors, attributes selectors, and pseudo-classes
  // d = number of element names and pseudo-elements

  let a = 0; // inline styles (not handled here)
  let b = 0; // ID selectors (#id)
  let c = 0; // Classes (.class), attributes ([attr]), pseudo-classes (:hover)
  let d = 0; // Elements (div), pseudo-elements (::before)

  // Regex patterns
  const idRegex = /#[\w-]+/g;
  const classRegex = /\.[\w-]+/g;
  const attributeRegex = /$$[^$$]+$$/g;
  const pseudoClassRegex = /:(?!:)[\w-]+($[^$]*$)?/g; // single colon but not double colon
  const pseudoElementRegex = /::[\w-]+/g;
  const elementRegex = /(^|[\s>+~])([a-zA-Z][\w-]*)/g;

  // Count ID selectors
  const ids = selector.match(idRegex);
  if (ids) b += ids.length;

  // Count class selectors
  const classes = selector.match(classRegex);
  if (classes) c += classes.length;

  // Count attribute selectors
  const attributes = selector.match(attributeRegex);
  if (attributes) c += attributes.length;

  // Count pseudo-classes
  const pseudoClasses = selector.match(pseudoClassRegex);
  if (pseudoClasses) c += pseudoClasses.length;

  // Count pseudo-elements
  const pseudoElements = selector.match(pseudoElementRegex);
  if (pseudoElements) d += pseudoElements.length;

  // Count element selectors
  // We match element names that are not preceded by #, ., :, [, or *
  // The regex captures element names after space or combinators
  let match;
  while ((match = elementRegex.exec(selector)) !== null) {
    const elName = match[2];
    if (elName !== "*" && elName !== "") {
      d += 1;
    }
  }

  return { a, b, c, d };
}

// Format specificity as a string
function formatSpecificity(spec) {
  return `(${spec.a}, ${spec.b}, ${spec.c}, ${spec.d})`;
}

// Provide a human-readable breakdown
function specificityBreakdown(spec) {
  return `Inline styles: ${spec.a}, IDs: ${spec.b}, Classes/Attributes/Pseudo-classes: ${spec.c}, Elements/Pseudo-elements: ${spec.d}`;
}

// Main function to process input and display results
function processSelectors() {
  const input = document.getElementById("selectorsInput").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!input) {
    resultsDiv.textContent = "Please enter one or more CSS selectors.";
    return;
  }

  const selectors = input.split("\n").map(s => s.trim()).filter(s => s.length > 0);

  selectors.forEach(selector => {
    const spec = calculateSpecificity(selector);

    // Create result item
    const item = document.createElement("div");
    item.className = "result-item";

    const selectorText = document.createElement("div");
    selectorText.className = "selector-text";
    selectorText.textContent = selector;

    const specText = document.createElement("div");
    specText.className = "specificity";
    specText.textContent = `Specificity: ${formatSpecificity(spec)}`;

    const breakdownText = document.createElement("div");
    breakdownText.className = "breakdown";
    breakdownText.textContent = specificityBreakdown(spec);

    item.appendChild(selectorText);
    item.appendChild(specText);
    item.appendChild(breakdownText);

    resultsDiv.appendChild(item);
  });
}

// Add event listener to button
document.getElementById("calculateBtn").addEventListener("click", processSelectors);

// Optional: calculate on Enter key in textarea (with Shift+Enter for new line)
document.getElementById("selectorsInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    processSelectors();
  }
});