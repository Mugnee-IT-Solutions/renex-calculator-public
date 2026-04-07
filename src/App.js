// src/App.js
import { useEffect, useRef, useState } from "react";
import PriceForm from "./components/PriceForm";
import Invoice from "./components/Invoice";
import TermsPage from "./components/TermsPage";
import PDFButton from "./components/PDFButton";
import DisplaySize from "./components/DisplaySize";
import { toBDT } from "./lib/calc.js";
import { makeTransparentWatermarkDataUrl } from "./lib/watermark.js";

export default function App() {
  const [snapshot, setSnapshot] = useState(null);
  const [calc, setCalc] = useState(null);
  const [view, setView] = useState("invoice"); // invoice | terms
  const [watermarkUrl, setWatermarkUrl] = useState("/renex_watermark.png");

  const invoiceRef = useRef(null);
  const termsRef = useRef(null);

  useEffect(() => {
    let alive = true;
    makeTransparentWatermarkDataUrl()
      .then((url) => {
        if (alive && typeof url === "string" && url.startsWith("data:image/")) setWatermarkUrl(url);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      {/* Topbar / Header */}
      <header className="topbar">
        <div className="inner">
          <img src="/logo.png" alt="Renex" className="topbar-logo" />
          <div className="topbar-title">LED Display Builder</div>

          <nav className="topbar-nav">
            <a href="https://mugnee.com/" className="top-link">
              Home
            </a>
          </nav>
      
          <div className="topbar-right">
             <a href="https://www.mugnee.com/product-category/led-display/" className="top-link">LED Display</a>
          </div>
        </div>

      

      </header>

      <div className="app-shell">
        <div className="container-xxl">
          {/* Left: Form */}
          <div className="card">
            <div className="brand-row" style={{ marginBottom: 10 }}>
              <div className="brand-left"></div>
            </div>

            <PriceForm
              onChange={(snap) => setSnapshot(snap)}
              onCalculated={(result, snap) => {
                setCalc(result);
                setSnapshot(snap);
              }}
            />

            {calc && (
              <div className="summary">
                <div className="sum-card">
                  <div className="sum-label">Grand Total</div>
                  <div className="sum-value">{toBDT(calc.totals.grandTotal)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Preview + Download */}
          <div className="card">
            <div className="inline" style={{ justifyContent: "space-between", marginBottom: 8 }}>
              <div className="inline" style={{ gap: 8 }}>
                <h3 style={{ marginRight: 10 }}>Preview</h3>

                <button
                  className={`btn ${view === "invoice" ? "btn-primary" : "btn-light"}`}
                  onClick={() => setView("invoice")}
                  type="button"
                >
                  Invoice
                </button>

                <button
                  className={`btn ${view === "terms" ? "btn-primary" : "btn-light"}`}
                  onClick={() => setView("terms")}
                  type="button"
                >
                  Terms
                </button>
              </div>

              {/* ✅ One click download => 2 pages */}
              <PDFButton
                targetIds={["pdf-page-1", "pdf-page-2"]}
                filename="Renex_Quotation.pdf"
                exportData={snapshot}
              />
            </div>

            {!calc || !snapshot ? (
              <div className="brand-sub">
                Fill the form and click <b>Calculate</b> to preview.
              </div>
            ) : view === "invoice" ? (
              <div id="invoice-root" className="invoice-wrap invoice-dark preview-mode invoice--pdf-scale">
                {/* Use template only as A4 header/footer strips */}
                <div className="pdf-template-strip pdf-template-header" aria-hidden="true">
                  <img className="pdf-template-img" src="/Renex_Invoice.png" alt="" />
                </div>
                <div className="pdf-template-strip pdf-template-footer" aria-hidden="true">
                  <img className="pdf-template-img" src="/Renex_Invoice.png" alt="" />
                </div>
                {/* Watermark (all pages) */}
                <img className="pdf-watermark" src={watermarkUrl} alt="" aria-hidden="true" />
                <div className="pdf-doc-label" aria-hidden="true">
                  QUOTATION
                </div>
                <div className="invoice-inner pad-safe">
                  <div className="invoice-panel">
                    <Invoice ref={invoiceRef} calc={calc} snapshot={snapshot} />
                  </div>
                </div>
              </div>
            ) : (
              <div id="terms-root" className="invoice-wrap invoice-dark preview-mode terms-page invoice--pdf-scale">
                {/* Use template only as A4 header/footer strips */}
                <div className="pdf-template-strip pdf-template-header" aria-hidden="true">
                  <img className="pdf-template-img" src="/Renex_Invoice.png" alt="" />
                </div>
                <div className="pdf-template-strip pdf-template-footer" aria-hidden="true">
                  <img className="pdf-template-img" src="/Renex_Invoice.png" alt="" />
                </div>
                {/* Watermark (all pages) */}
                <img className="pdf-watermark" src={watermarkUrl} alt="" aria-hidden="true" />
                {/* ✅ IMPORTANT: terms-inner class added */}
                <div className="invoice-inner pad-safe terms-inner">
                  {/* ✅ IMPORTANT: terms-panel class added */}
                  <div className="invoice-panel terms-panel">
                    <TermsPage ref={termsRef} calc={calc} snapshot={snapshot} />
                  </div>
                </div>
              </div>
            )}

            {/* ✅ Hidden printable pages (always rendered, not display:none) */}
            {calc && snapshot ? (
              <div
                style={{
                  position: "absolute",
                  left: "-10000px",
                  top: 0,
                  width: "794px", // ✅ IMPORTANT: match A4 width (same as invoice-wrap)
                  pointerEvents: "none",
                  opacity: 1, // keep renderable for html2canvas
                }}
              >
                {/* Page-1 (Invoice) */}
                <div id="pdf-page-1" className="invoice-wrap invoice-dark preview-mode invoice--pdf-scale">
                  {/* Use template only as A4 header/footer strips */}
                  <div className="pdf-template-strip pdf-template-header" aria-hidden="true">
                    <img className="pdf-template-img" src="/Renex_Invoice.png" alt="" />
                  </div>
                  <div className="pdf-template-strip pdf-template-footer" aria-hidden="true">
                    <img className="pdf-template-img" src="/Renex_Invoice.png" alt="" />
                  </div>
                  {/* Watermark (all pages) */}
                  <img className="pdf-watermark" src={watermarkUrl} alt="" aria-hidden="true" />
                  <div className="pdf-doc-label" aria-hidden="true">
                    QUOTATION
                  </div>
                  <div className="invoice-inner pad-safe">
                    <div className="invoice-panel">
                      <Invoice calc={calc} snapshot={snapshot} />
                    </div>
                  </div>
                </div>

                {/* Page-2 (Terms) */}
                <div id="pdf-page-2" className="invoice-wrap invoice-dark preview-mode terms-page invoice--pdf-scale">
                  {/* Use template only as A4 header/footer strips */}
                  <div className="pdf-template-strip pdf-template-header" aria-hidden="true">
                    <img className="pdf-template-img" src="/Renex_Invoice.png" alt="" />
                  </div>
                  <div className="pdf-template-strip pdf-template-footer" aria-hidden="true">
                    <img className="pdf-template-img" src="/Renex_Invoice.png" alt="" />
                  </div>
                  {/* Watermark (all pages) */}
                  <img className="pdf-watermark" src={watermarkUrl} alt="" aria-hidden="true" />
                  {/* ✅ IMPORTANT: terms-inner class added */}
                  <div className="invoice-inner pad-safe terms-inner">
                    {/* ✅ IMPORTANT: terms-panel class added */}
                    <div className="invoice-panel terms-panel">
                      <TermsPage calc={calc} snapshot={snapshot} />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ✅ Display Size section (Footer এর উপরে) */}
      <DisplaySize onPick={() => {}} />

      {/* Footer */}
      <footer className="calc-footer">
        <div className="calc-footer-inner">
          <img src="/logo.png" alt="Renex" className="calc-footer-logo" />
          <div className="calc-footer-text">Developed by Renex IT Solutions</div>
        </div>
      </footer>
    </>
  );
}
