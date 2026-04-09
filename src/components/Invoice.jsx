// ===============================
// src/components/Invoice.jsx
// ===============================
import { forwardRef, useMemo } from "react";
import { toBDT, bdtToWords, generateRef } from "../lib/calc.js";
import { CONTROLLERS } from "../data/models.js";

const Invoice = forwardRef(function Invoice({ calc, snapshot, orderDate = new Date() }, ref) {
  const { model, customer, display, items } = snapshot;
  const { totals, unitPrices } = calc;

  const dateStr = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(orderDate);

  const refNo = useMemo(() => generateRef(), []);

  const unitModule = unitPrices?.unitModule ?? 0;
  const unitCtrl = unitPrices?.unitCtrl ?? (items.controllerPrice ?? 0);
  const unitRC = unitPrices?.unitRC ?? 0;
  const unitPS = unitPrices?.unitPS ?? 0;

  // ✅ Cabinet unit price (from calc.js)
  const unitCabinet = unitPrices?.unitCabinet ?? 0;

  const sizeStr = `${display.widthFt || "—"}ft × ${display.heightFt || "—"}ft`;

  // controller label human-readable (Huidu + Novastar)
  const controllerLabel =
    items?.controllerLabel ||
    (items?.controllerId
      ? CONTROLLERS.find((c) => c.id === items.controllerId)?.label || items.controllerId.replace(/^NS_/, "")
      : "");

  // ---- Dynamic rows (SL auto) ----
  const rows = [];
  let sl = 1;

  // ✅ Module (NO Technology here)
  rows.push({
    sl: sl++,
    name: `Module: ${model.name} LED Display Module`,
    unit: "Pcs",
    qty: items.modulesQty,
    unitPrice: unitModule,
    total: totals.totalModules,
    brand: items.brands?.module,
  });

  // Controller – only when qty>0 and id exists
  if (items.controllerQty > 0 && items.controllerId) {
    rows.push({
      sl: sl++,
      name: controllerLabel,
      unit: "Pcs",
      qty: items.controllerQty,
      unitPrice: unitCtrl,
      total: totals.controllerTotal,
      brand: items.brands?.controller,
    });
  }

  // Receiving card
  const rcLabel = items.receivingPicked?.label || "Receiving Card";
  rows.push({
    sl: sl++,
    name: rcLabel,
    unit: "Pcs",
    qty: items.rcQty,
    unitPrice: unitRC,
    total: totals.totalRC,
    brand: items.brands?.receiving,
  });

  // Power supply
  rows.push({
    sl: sl++,
    name: "Power Supply",
    unit: "Pcs",
    qty: items.psQty,
    unitPrice: unitPS,
    total: totals.totalPS,
    brand: items.brands?.psu,
  });

  // ✅ Cabinet Case (only when cabinet enabled) — must be under Power Supply
  if (items?.cabinetEnabled && (items?.cabinetQty || 0) > 0) {
    rows.push({
      sl: sl++,
      name: " Die Cast Aluminum Cabinet (640 × 480)mm",
      unit: "Pcs",
      qty: items.cabinetQty,
      unitPrice: unitCabinet,
      total: totals.totalCabinet || 0,
    });
  }

  // Structure & Accessories (if any)
  if (totals.accessories) {
    rows.push({
      sl: sl++,
      name: "Structure & Accessories",
      unit: "Lot",
      qty: 1,
      unitPrice: unitPrices?.accessories ?? totals.accessories,
      total: totals.accessories,
    });
  }

  // Installation
  rows.push({
    sl: sl++,
    name: "Installation, Testing & Commissioning",
    unit: "Make",
    qty: 1,
    unitPrice: totals.installation,
    total: totals.installation,
  });

  // ✅ Note should show only for Outdoor
  const showOutdoorNote = items?.dispType === "outdoor";

  const showDiscountBlock = !!snapshot?.discountEnabled; // only when enabled

  return (
    <div ref={ref}>
      {/* PDF-only header (kept hidden in preview UI via CSS) */}
      <div className="pdf-only pdf-header">
        <div className="pdf-header-left">
          <div className="pdf-brand">
            <div className="pdf-brand-name">RENEX DIGITAL</div>
            <div className="pdf-brand-sub">LED Display Solution • Sales • Installation • Support</div>
          </div>
        </div>

        <div className="pdf-header-right">
          <div className="pdf-doc-title">QUOTATION</div>
          <div className="pdf-doc-sub">LED Display System</div>
          <div className="pdf-contact">
            <div className="pdf-contact-pill">+8801600-007242</div>
            <div className="pdf-contact-pill">www.renex.com.bd</div>
            <div className="pdf-contact-pill">renex.digitalbd@gmail.com</div>
          </div>
        </div>
      </div>

      {/* Ref + Date */}
      <div className="ref-row tidy">
        <div className="ref-left ref-quote">QUOTATION</div>
        <div className="ref-right ref-stack">
          <div>
            <strong>Date:</strong> {dateStr}
          </div>
          <div>
            <strong>Ref:</strong> {refNo}
          </div>
        </div>
      </div>

      {/* Customer box */}
      <div className="info-box">
        <div className="info-title">Client Details</div>

        <div className="info-grid">
          <div>
            <span>Name:</span> {customer.name || "—"}
          </div>

          <div>
            <span>Designation:</span> {customer.position || "—"}
          </div>

          <div>
            <span>Organization Name:</span> {customer.company || "—"}
          </div>

          <div>
            <span>Mobile Number:</span> {customer.mobile || "—"}
          </div>

          {/* ✅ Address (FULL WIDTH, natural wrapping) */}
          <div className="info-line info-full">
            <span className="info-label">Address:</span>
            <span className="info-value">{customer.address || "—"}</span>
          </div>
        </div>
      </div>

      {/* Invoice content panel */}
      <div className="invoice-panel">
        <div className="price-title">
          <div className="price-title-left">
            <strong>
              <span className="price-title-prefix">Quotation for:</span>{" "}
              {model.name} <span className="tech-badge"> ({items.technology?.toUpperCase()})</span> LED Display. ({sizeStr}) |
            </strong>

            <span className="sft-cal"> Sft:</span>{" "}
            <span className="sft-cal-">({display.sft || "—"}) </span>
          </div>
        </div>

        <div className="quote-items" role="list" aria-label="Quotation items">
          {rows.map((r) => (
            <div key={r.sl} className="qi-row" role="listitem">
              <div className="qi-main">
                <div className="qi-block">
                  <span className="qi-sl">{r.sl}.</span>
                  <div className="qi-body">
                    <div className="qi-name">{r.name}</div>
                    <div className="qi-meta">
                      <span>
                        {r.qty} {r.unit}
                      </span>
                      <span className="qi-dot" aria-hidden="true">
                        •
                      </span>
                      <span>
                        Unit: <b>{toBDT(r.unitPrice)}</b>
                      </span>
                      {r.brand ? (
                        <>
                          <span className="qi-dot" aria-hidden="true">
                            •
                          </span>
                          <span>Brand: {r.brand}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="qi-amt">{toBDT(r.total)}</div>
            </div>
          ))}
        </div>

        <div className="quote-totals" aria-label="Totals">
          {totals?.vatEnabled ? (
            <>
              <div className="qt-row">
                <div className="qt-label">Total</div>
                <div className="qt-value">{toBDT(totals.totalBeforeVat)}</div>
              </div>
              <div className="qt-row">
                <div className="qt-label">VAT ({Math.round((totals.vatRate || 0.1) * 100)}%)</div>
                <div className="qt-value">{toBDT(totals.vatAmount)}</div>
              </div>
            </>
          ) : null}

          {showDiscountBlock ? (
            <div className="qt-row">
              <div className="qt-label">Special Discount</div>
              <div className="qt-value">-{toBDT(totals.discount || 0)}</div>
            </div>
          ) : null}

          <div className="qt-row qt-grand">
            <div className="qt-label">{showDiscountBlock ? "Payable" : "Grand Total"}</div>
            <div className="qt-value">{toBDT(showDiscountBlock ? totals.payable ?? totals.grandTotal : totals.grandTotal)}</div>
          </div>
        </div>

        <div className="in-words">
          <b>Amount in Words:</b>{" "}
          {bdtToWords(showDiscountBlock ? (totals.payable ?? totals.grandTotal) : totals.grandTotal)}
        </div>

        {/* ✅ Note shows only when Outdoor selected */}
        {showOutdoorNote ? (
          <div className="quote-note">
            <span className="label">[Note:</span>
            The above-mentioned quoted amount is excluding all civil works, GI pipes, and the main electrical line.
            <span className="label">]</span>
          </div>
        ) : null}

        {/* ✅ seal/signature */}
        <div className="signatures lift">
          <div className="sig-block">
            <div className="sig-title">Sincerely</div>

            <img src="/signature.png" alt="Authorized Signature" className="sign-img" />

            <div className="profile-name">
              <span style={{ fontWeight: 700 }}>Sharif Uddin</span>
              <span>Chief Technology Officer</span>
              <span>Renex Digital</span>
              <span>Cell: +8801600-007242</span>
              <span>E-mail: sharif.renex@gmail.com</span>
            </div>
          </div>

          <img src="/seal.png" alt="Company Seal" className="seal-img" />
        </div>
      </div>
    </div>
  );
});

export default Invoice;
