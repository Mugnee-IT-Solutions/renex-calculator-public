// ===============================
// src/data/models.js
// ===============================

// ---- Tiered module pricing (per-module) ----
// NOTE: প্রতি Type-এর তিনটি প্রাইস = [Gold, Platinum, Diamond] 

// ✅ Technology based model groups
export const MODEL_GROUPS = {
  smd: {
    indoor: [
      { id: "smd-in-p1_25", name: "P1.25", prices: { gold: 9300, platinum: 10500, diamond: 11500 } },
      { id: "smd-in-p1_53", name: "P1.53", prices: { gold: 6082, platinum: 7115, diamond: 9478 } },
      { id: "smd-in-p1_86", name: "P1.86", prices: { gold: 4020, platinum: 4850, diamond: 5400 } },
      { id: "smd-in-p2", name: "P2", prices: { gold: 3000, platinum: 3400, diamond: 3800 } },
      { id: "smd-in-p2_5", name: "P2.5", prices: { gold: 2250, platinum: 2600, diamond: 2900 } },
      { id: "smd-in-p3", name: "P3", prices: { gold: 1445, platinum: 1840, diamond: 2550 } },
    ],
    outdoor: [
      { id: "smd-out-p2_5", name: "P2.5", prices: { gold: 6500, platinum: 7200, diamond: 8100 } },
      { id: "smd-out-p3", name: "P3", prices: { gold: 2618, platinum: 3237, diamond: 3627 } },

      // ✅ P3.91 outdoor
      { id: "smd-out-p3.91", name: "P3.91", prices: { gold: 3500, platinum: 4250, diamond: 5020 } },

      { id: "smd-out-p4", name: "P4", prices: { gold: 2503, platinum: 2939, diamond: 3214 } },
      { id: "smd-out-p5", name: "P5", prices: { gold: 2200, platinum: 2550, diamond: 2950 } },
      { id: "smd-out-p6", name: "P6", prices: { gold: 1860, platinum: 1998, diamond: 2227 } },
      { id: "smd-out-p6_67", name: "P6.67", prices: { gold: 2205, platinum: 2365, diamond: 2640 } },
      { id: "smd-out-p8", name: "P8", prices: { gold: 1929, platinum: 2044, diamond: 2227 } },
      { id: "smd-out-p10", name: "P10", prices: { gold: 1677, platinum: 1746, diamond: 1883 } },
    ],
  },

  // ✅ GOB (ONLY indoor)
  gob: {
    indoor: [
      { id: "gob-in-p1_25", name: "P1.25", prices: { gold: 5800, platinum: 6450, diamond: 7600 } },
      { id: "gob-in-p1_53", name: "P1.53", prices: { gold: 4600, platinum: 5350, diamond: 6320 } },
      { id: "gob-in-p1_86", name: "P1.86", prices: { gold: 3973, platinum: 4825, diamond: 5676 } },
      { id: "gob-in-p2", name: "P2", prices: { gold: 3618, platinum: 4393, diamond: 5168 } },
      { id: "gob-in-p2.5", name: "P2.5", prices: { gold: 3200, platinum: 3800, diamond: 4500 } },
    ],
  },

  // ✅ COB (ONLY indoor)
  cob: {
    indoor: [
      { id: "cob-in-p1_25", name: "P1.25", prices: { gold: 11550, platinum: 12700, diamond: 8900 } },
      { id: "cob-in-p1_53", name: "P1.53", prices: { gold: 6550, platinum: 7350, diamond: 7800 } },
      { id: "cob-in-p1_86", name: "P1.86", prices: { gold: 4820, platinum: 6050, diamond: 6650 } },
    ],
  },
};

// ---- Controllers / Processors / Control Cards ----
export const CONTROLLERS = [
  // Control cards
  { id: "WF1", label: "Control Card WF1", price: 562 },
  { id: "WF2", label: "Control Card WF2", price: 687 },
  { id: "WF4", label: "Control Card WF4", price: 1109 },



  // Asynchronous
  { id: "A3L", label: "Crontoller: HD-A3L", price: 19500 },
  { id: "A5L", label: "Crontoller: HD-A5L", price: 25800 },
  { id: "A6L", label: "Crontoller: HD-A6L", price: 39900 },

  // Synchronous (video processor)
 
  { id: "C16L", label: "C16L Controller", price: 19500 },
  { id: "VP210H", label: "Video Processor: HD VP210H", price: 23500 },
  { id: "VP410H", label: "Video Processor: HD VP410H", price: 28500 },
  { id: "VP630", label: "Video Processor: HD-VP630 ", price: 66500 },
  { id: "VP830", label: "Video Processor: HD VP830", price: 91200 },
  { id: "VP1240A", label: "HD VP1240A", price: 114845 },
  { id: "VP1220S", label: "HD VP1220S", price: 85025 },
  { id: "VP1620S", label: "HD VP1620S", price: 94965 },
  { id: "VP1640A", label: "HD VP1640A", price: 139500 },
];

// Power supply (all models)
export const POWER_SUPPLY_PRICE = 1650;
