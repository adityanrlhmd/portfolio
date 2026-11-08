// Back keeps the visitor's scroll spot on the portfolio; only when they came from it,
// otherwise (opened directly, from another site, or from another tool) the link just goes home.
export const backToPortfolio = (event: React.MouseEvent) => {
  try {
    const from = new URL(document.referrer);
    if (from.origin !== window.location.origin || from.pathname !== '/') return;
  } catch {
    return; // no referrer
  }
  event.preventDefault();
  window.history.back();
};
