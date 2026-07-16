// Fallback seed list — used only for initial render before the first live price tick arrives.
// Actual live prices/percent/isDown are overwritten by the Socket.io price engine.
export const watchlist = [
  { name: "INFY", price: 1555.45, percent: "0.00%", isDown: false },
  { name: "ONGC", price: 116.8, percent: "0.00%", isDown: false },
  { name: "TCS", price: 3194.8, percent: "0.00%", isDown: false },
  { name: "KPITTECH", price: 266.45, percent: "0.00%", isDown: false },
  { name: "QUICKHEAL", price: 308.55, percent: "0.00%", isDown: false },
  { name: "WIPRO", price: 577.75, percent: "0.00%", isDown: false },
  { name: "M&M", price: 779.8, percent: "0.00%", isDown: false },
  { name: "RELIANCE", price: 2112.4, percent: "0.00%", isDown: false },
  { name: "HUL", price: 512.4, percent: "0.00%", isDown: false },
];