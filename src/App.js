import React, { useState, useEffect, useRef, useMemo } from "react";
import config from "./config";
const { categoryTree, categoryColors } = config;

import { getDocument } from "pdfjs-dist";
import Papa from "papaparse";
import "pdfjs-dist/build/pdf.worker.entry";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE || "";

// ---- helpers (top-level) ----
const parseDocNumber = (filename) => {
  const m = filename?.match(/_(\d+)\.pdf$/i);
  return m ? m[1] : (filename?.replace(/\.pdf$/i, "") || "");
};

// NEW: link field keys used in categoryTree but handled at app level
const LINK_FIELD_KEYS = ["direct_duplicate", "expansion"];
const isLinkField = (k) => LINK_FIELD_KEYS.includes((k || "").toString().toLowerCase());

// Filter link fields out of code-prefixed CSV columns
const getAllCodePrefixedKeys = (categoryTree) => {
  const keys = new Set();
  Object.values(categoryTree).forEach(mesoMap => {
    Object.values(mesoMap).forEach(microMap => {
      Object.values(microMap).forEach(({ code, form }) => {
        form.forEach(field => {
          if (!isLinkField(field.key)) {
            keys.add(`${code}_${field.key}`);
          }
        });
      });
    });
  });
  return Array.from(keys);
};

// ---------- Reusable PDF pane (one side) ----------
const PdfPane = ({
  side,                         // "left" | "right"
  report,                       // filename selected (e.g. "A123.pdf")
  setReport,                    // setter for dropdown changes
  reportsList,                  // array of filenames
  labelPrefix, setLabelPrefix,  // shared across panes (optional)
  categoryTree, categoryColors, // provided by parent

  // cross-pane linking props
  onRequestLink,             // (side, "duplicate"|"expansion")
  isPickMode,                // boolean: this pane is the TARGET to pick on
  pickType,                  // "duplicate" | "expansion" | null
  onPickTarget,              // ({ targetReport, targetBoxNumber })
  onCancelPick,              // () => void

  // pending link tokens for THIS pane (used when saving)
  pendingLinkDuplicate,      // string like "12345#7"
  pendingLinkExpansion,      // string like "67890#2"
  onClearPendingLink         // (side, "duplicate"|"expansion")
}) => {
  const [pdf, setPdf] = useState(null);
  const [pageImage, setPageImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pendingBox, setPendingBox] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ macro: "", meso: "", micro: "", fields: {} });
  const [labelCount, setLabelCount] = useState(1);

  // LocalStorage key per report
  const storageKey = useMemo(() => report ? `savedBoxes:${report}` : null, [report]);

  const [boxes, setBoxes] = useState(() => {
    if (!storageKey) return [];
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Watch the two link checkboxes and trigger pick-mode on the OTHER pane
  const prevDup = useRef(!!formData.fields?.direct_duplicate);
  const prevExp = useRef(!!formData.fields?.expansion);

  useEffect(() => {
    const dupNow = !!formData.fields?.direct_duplicate;
    const expNow = !!formData.fields?.expansion;

    // only enter pick-mode when flipping ON and no token exists yet
    if (!prevDup.current && dupNow && !pendingLinkDuplicate) {
      onRequestLink?.(side, "duplicate");
    }
    if (!prevExp.current && expNow && !pendingLinkExpansion) {
      onRequestLink?.(side, "expansion");
    }

    prevDup.current = dupNow;
    prevExp.current = expNow;
  }, [
    formData.fields?.direct_duplicate,
    formData.fields?.expansion,
    pendingLinkDuplicate,
    pendingLinkExpansion,
    side,
    onRequestLink
  ]);

  useEffect(() => {
    // when report changes, load its saved boxes
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(storageKey);
      setBoxes(saved ? JSON.parse(saved) : []);
      setCurrentPage(1);
      setLabelCount(1);
    } catch {
      setBoxes([]);
    }
  }, [storageKey]);

  useEffect(() => {
    // persist per report
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(boxes));
  }, [boxes, storageKey]);

  // Load the selected PDF
  useEffect(() => {
    const loadPDF = async () => {
      if (!report) return;
      const loadingTask = getDocument(`${API_BASE}/reports/${encodeURIComponent(report)}`);
      const loadedPdf = await loadingTask.promise;
      setPdf(loadedPdf);
      setNumPages(loadedPdf.numPages);
      setCurrentPage(1);
    };
    loadPDF();
  }, [report]);

  // Render current page to image
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf) return;
      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
      setPageImage(canvas.toDataURL());
    };
    renderPage();
  }, [pdf, currentPage]);

  // Draw a box
  const [drawingBox, setDrawingBox] = useState(null);
  const containerRef = useRef(null);
  const startCoords = useRef(null);

  const handleMouseDown = (e) => {
    if (isPickMode) return;            // 🔒 don't start drawing while picking
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    startCoords.current = { x, y };
    setDrawingBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (isPickMode) return;            // 🔒
    if (!startCoords.current || !containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const startX = startCoords.current.x;
    const startY = startCoords.current.y;
    setDrawingBox({
      x: Math.min(startX, x),
      y: Math.min(startY, y),
      width: Math.abs(x - startX),
      height: Math.abs(y - startY)
    });
  };

  const handleMouseUp = () => {
    if (isPickMode) return;            // 🔒
    if (drawingBox) {
      setPendingBox({ ...drawingBox, page: currentPage });
      setShowForm(true);
    }
    startCoords.current = null;
    setDrawingBox(null);
  };

  // Form handlers
  const handleMacroChange = e => {
    setFormData({ macro: e.target.value, meso: "", micro: "", fields: {} });
  };
  const handleMesoChange = e => {
    setFormData(data => ({ ...data, meso: e.target.value, micro: "", fields: {} }));
  };
  const handleMicroChange = e => {
    setFormData(data => ({ ...data, micro: e.target.value, fields: {} }));
  };
  const updateField = (key, value) => {
    setFormData(data => ({ ...data, fields: { ...data.fields, [key]: value } }));
  };

  const handleSave = () => {
    const { macro, meso, micro, fields } = formData;
    if (!macro || !meso || !micro) return;
    const code = categoryTree[macro][meso][micro].code;
    const labelCode = labelPrefix ? `${labelPrefix}_${labelCount}` : `${labelCount}`;

    // strip link fields from saved per-form fields
    const filteredFields = Object.fromEntries(
      Object.entries(fields || {}).filter(([k]) => !isLinkField(k))
    );

    const newBox = {
      ...pendingBox,
      boxNumber: labelCount,
      report,
      label: { macro, meso, micro, code, fields: filteredFields, labelCode },
      // store link tokens (global CSV columns)
      links: {
        duplicate: pendingLinkDuplicate || "",
        expansion: pendingLinkExpansion || ""
      }
    };

    setBoxes(prev => [...prev, newBox]);
    setLabelCount(c => c + 1);
    resetForm();

    // optional: clear tokens after saving
    onClearPendingLink?.(side, "duplicate");
    onClearPendingLink?.(side, "expansion");
  };

  const handleCancel = () => resetForm();
  const resetForm = () => {
    setPendingBox(null);
    setShowForm(false);
    setFormData({ macro: "", meso: "", micro: "", fields: {} });
  };

  const goToPrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const goToNextPage = () => setCurrentPage(p => Math.min(p + 1, numPages));

  // CSV downloads (per pane, scoped to current report)
  const handleDownloadCSV = () => {
    const allFieldKeys = getAllCodePrefixedKeys(categoryTree);

    const rows = boxes
      .filter(box => !box.previous)
      .map(box => {
        const { page, x, y, width, height, label, links } = box;
        const { macro, meso, micro, code, fields = {} } = label || {};

        const row = {
          report: report || "",
          page, x, y, width, height,
          boxNumber: box.boxNumber,
          macro, meso, micro, code,
          "Direct duplicate": links?.duplicate || "",
          "Expansion":        links?.expansion || ""
        };

        // initialize all per-form columns (excluding link fields)
        allFieldKeys.forEach(k => { row[k] = ""; });

        // write form fields (skip link fields defensively)
        Object.entries(fields).forEach(([k, v]) => {
          if (isLinkField(k)) return;
          const fullKey = `${code}_${k}`;
          row[fullKey] = v;
        });

        return row;
      });

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `labels_${report || "unknown"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCoordsCSV = () => {
    const coordRows = boxes.map(box => ({
      report: report || "",
      page: box.page, x: box.x, y: box.y, width: box.width, height: box.height, boxNumber: box.boxNumber
    }));
    const csv = Papa.unparse(coordRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `box_coordinates_${report || "unknown"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadPreviousBoxes = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedBoxes = (results.data || []).map((row, idx) => {
          const x = parseFloat(row.x);
          const y = parseFloat(row.y);
          const width = parseFloat(row.width);
          const height = parseFloat(row.height);
          const page = parseInt(row.page);
          let boxNumber = parseInt(row.boxNumber);
          if (Number.isNaN(boxNumber)) {
            const existing = Array.isArray(boxes) ? boxes.length : 0;
            boxNumber = existing + idx + 1; // fallback numbering if missing
          }
          return {
            x, y, width, height, page,
            boxNumber,
            previous: true,
            report: report || row.report || ""
          };
        }).filter(b => !Number.isNaN(b.x) && !Number.isNaN(b.y));
        setBoxes(prev => [...prev, ...importedBoxes]);
      }
    });
    e.target.value = "";
  };

  const handleClearCurrentReport = () => {
    if (!report) return;
    if (window.confirm(`Clear all boxes for "${report}"?`)) {
      setBoxes([]);
      if (storageKey) localStorage.removeItem(storageKey);
      setLabelCount(1);
    }
  };

  return (
    <div className="pane" style={{ flex: 1, padding: "0.75rem", borderLeft: side === "right" ? "1px solid #eee" : "none" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
        <strong>{side === "left" ? "Panel A" : "Panel B"}</strong>
        <select
          value={report || ""}
          onChange={(e) => setReport(e.target.value || null)}
          style={{ minWidth: 240, padding: "0.3rem" }}
        >
          <option value="">Select report…</option>
          {reportsList.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <label style={{ marginLeft: "auto" }}>
          Label Prefix:&nbsp;
          <input
            type="text"
            value={labelPrefix}
            onChange={(e) => {
              setLabelPrefix(e.target.value);
              setLabelCount(1);
            }}
            style={{ width: 80, padding: "0.3rem" }}
          />
        </label>
      </div>

      {isPickMode && (
        <div style={{ marginBottom: "0.5rem", padding: "0.5rem", background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 6 }}>
          Pick a box to link as <strong>{pickType === "duplicate" ? "Direct duplicate" : "Expansion"}</strong> for Panel {side === "left" ? "B" : "A"}.
          You may change report or page before clicking.
          <button onClick={onCancelPick} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      )}

      <div className="controls" style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setCurrentPage(1)} disabled={!pdf || currentPage === 1}>⏮ First</button>
        <button onClick={goToPrevPage} disabled={!pdf || currentPage === 1}>⬅ Prev</button>
        <span style={{ margin: "0 0.5rem" }}>
          Page {pdf ? currentPage : "-"} of {pdf ? numPages : "-"}
        </span>
        <button onClick={goToNextPage} disabled={!pdf || currentPage === numPages}>Next ➡</button>
        <button onClick={() => setCurrentPage(numPages)} disabled={!pdf || currentPage === numPages}>Last ⏭</button>

        <input
          type="number"
          min="1"
          max={numPages || 1}
          placeholder="Go to page"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = parseInt(e.target.value);
              if (pdf && val >= 1 && val <= numPages) {
                setCurrentPage(val);
                e.target.value = "";
              }
            }
          }}
          style={{ width: 90, padding: "0.3rem", marginLeft: "0.25rem" }}
        />

        <button onClick={handleDownloadCSV} disabled={!report}>Download CSV</button>
        <button onClick={handleDownloadCoordsCSV} disabled={!report}>Download Coords</button>
        <button onClick={handleClearCurrentReport} disabled={!report}>Clear Boxes (this report)</button>

        <label style={{ marginLeft: "auto" }}>
          Load previous boxes (CSV):
          <input type="file" accept=".csv" onChange={handleLoadPreviousBoxes} style={{ marginLeft: "0.5rem" }} />
        </label>
      </div>

      {/* Viewer */}
      {pageImage ? (
        <div
          className="pdf-viewer"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={containerRef}
          style={{ position: "relative", display: "inline-block", userSelect: "none" }}
        >
          <img
            src={pageImage}
            alt={`Page ${currentPage} - ${report}`}
            style={{ display: "block", pointerEvents: "none", maxWidth: "100%" }}
          />

          {/* Existing boxes for this page */}
          {boxes.filter(b => b.page === currentPage).map((box, idx) => {
            const isPrevious = box.previous;
            const macro = box.label?.macro;
            const color = isPrevious ? "gray" : (categoryColors[macro] || "black");

            const handleBoxClick = () => {
              if (isPickMode) {
                // 🎯 while picking, ANY box click selects the target (no form opens)
                onPickTarget?.({ targetReport: report, targetBoxNumber: box.boxNumber });
                return;
              }
              // Normal behavior only when NOT picking
              if (isPrevious) {
                setPendingBox({ ...box, label: undefined });
                setFormData({ macro: "", meso: "", micro: "", fields: {} });
                setShowForm(true);
              }
            };

            return (
              <React.Fragment key={idx}>
                <div
                  onClick={handleBoxClick}
                  style={{
                    position: "absolute",
                    left: box.x,
                    top: box.y,
                    width: box.width,
                    height: box.height,
                    border: `2px ${isPrevious ? "dotted" : "solid"} ${color}`,
                    cursor: isPickMode ? "crosshair" : (isPrevious ? "pointer" : "default"),
                    backgroundColor: isPrevious ? "rgba(100,100,100,0.05)" : "transparent",
                    boxShadow: isPickMode ? "0 0 0 2px rgba(24,144,255,0.35)" : "none"
                  }}
                  title={
                    isPickMode
                      ? "Click to choose this as the link target"
                      : (isPrevious
                          ? "Click to add a new label to this box"
                          : `${box.label?.macro} / ${box.label?.meso} (${box.label?.code})`)
                  }
                />
                {box.boxNumber && (
                  <div
                    style={{
                      position: "absolute",
                      left: box.x + box.width - 14,
                      top: box.y - 2,
                      fontSize: 12,
                      background: "white",
                      color: "black",
                      padding: "0 3px",
                      borderRadius: 2,
                      border: "1px solid #aaa",
                      pointerEvents: "none"
                    }}
                  >
                    {box.boxNumber}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* In-progress box */}
          {drawingBox && (
            <div
              style={{
                position: "absolute",
                left: drawingBox.x,
                top: drawingBox.y,
                width: drawingBox.width,
                height: drawingBox.height,
                border: "2px dashed blue"
              }}
            />
          )}
        </div>
      ) : (
        <div style={{ padding: "1rem", color: "#666" }}>
          {report ? "Loading…" : "Select a report to begin"}
        </div>
      )}

      {/* Sidebar form */}
      {showForm && (
        <div className="form-container" style={{ marginTop: "0.75rem", borderTop: "1px solid #eee", paddingTop: "0.75rem" }}>
          <select value={formData.macro} onChange={handleMacroChange}>
            <option value="">Select Macro</option>
            {Object.keys(categoryTree).map(macro => (
              <option key={macro}>{macro}</option>
            ))}
          </select>

          {formData.macro && (
            <select value={formData.meso} onChange={handleMesoChange}>
              <option value="">Select Meso</option>
              {Object.keys(categoryTree[formData.macro]).map(meso => (
                <option key={meso}>{meso}</option>
              ))}
            </select>
          )}

          {formData.macro && formData.meso && (
            <select value={formData.micro} onChange={handleMicroChange}>
              <option value="">Select Micro</option>
              {Object.keys(categoryTree[formData.macro][formData.meso]).map(micro => (
                <option key={micro}>{micro}</option>
              ))}
            </select>
          )}

          {/* APP-LEVEL LINK CHECKBOXES (drive pick-mode, not saved as code-prefixed fields) */}
          {(formData.macro && formData.meso && formData.micro) && (
            <div style={{ margin: "0.5rem 0", padding: "0.5rem", border: "1px dashed #ddd", borderRadius: 6 }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginRight: 16 }}>
                <input
                  type="checkbox"
                  checked={!!formData.fields.direct_duplicate}
                  onChange={e => updateField("direct_duplicate", e.target.checked)}
                />
                Direct duplicate
              </label>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <input
                  type="checkbox"
                  checked={!!formData.fields.expansion}
                  onChange={e => updateField("expansion", e.target.checked)}
                />
                Expansion
              </label>

              {(formData.fields?.direct_duplicate || pendingLinkDuplicate) && (
                <div style={{ marginTop: 8 }}>
                  <small>Direct duplicate target: {pendingLinkDuplicate || <em>waiting…</em>}</small>
                  {pendingLinkDuplicate && (
                    <button
                      type="button"
                      onClick={() => onClearPendingLink?.(side, "duplicate")}
                      style={{ marginLeft: 8 }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
              {(formData.fields?.expansion || pendingLinkExpansion) && (
                <div style={{ marginTop: 6 }}>
                  <small>Expansion target: {pendingLinkExpansion || <em>waiting…</em>}</small>
                  {pendingLinkExpansion && (
                    <button
                      type="button"
                      onClick={() => onClearPendingLink?.(side, "expansion")}
                      style={{ marginLeft: 8 }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {formData.macro && formData.meso && formData.micro && (
            <div className="dynamic-fields" style={{ marginTop: "0.5rem" }}>
              {categoryTree[formData.macro][formData.meso][formData.micro].form
                .filter(f => !isLinkField(f.key)) // HIDE app-level link fields
                .map(f => (
                  <div key={f.key} style={{ marginBottom: "0.4rem" }}>
                    <label>
                      {f.label}
                      {f.type === 'textarea' ? (
                        <textarea
                          value={formData.fields[f.key] || ''}
                          onChange={e => updateField(f.key, e.target.value)}
                        />
                      ) : f.type === 'checkbox' ? (
                        <input
                          type="checkbox"
                          checked={!!formData.fields[f.key]}
                          onChange={e => updateField(f.key, e.target.checked)}
                        />
                      ) : f.type === 'select' ? (
                        <select
                          value={formData.fields[f.key] || ''}
                          onChange={e => updateField(f.key, e.target.value)}
                        >
                          <option value="">Select...</option>
                          {f.options.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.type}
                          value={formData.fields[f.key] || ''}
                          onChange={e => updateField(f.key, e.target.value)}
                        />
                      )}
                    </label>
                  </div>
                ))}
            </div>
          )}

          <div className="form-buttons" style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={handleSave} disabled={!formData.macro || !formData.meso || !formData.micro}>Save</button>
            <button onClick={handleCancel}>Cancel</button>

            {(formData.fields?.direct_duplicate || pendingLinkDuplicate) && (
              <div style={{ marginTop: 8 }}>
                <small>Direct duplicate target: {pendingLinkDuplicate || <em>waiting…</em>}</small>
                {pendingLinkDuplicate && (
                  <button
                    type="button"
                    onClick={() => onClearPendingLink?.(side, "duplicate")}
                    style={{ marginLeft: 8 }}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
            {(formData.fields?.expansion || pendingLinkExpansion) && (
              <div style={{ marginTop: 4 }}>
                <small>Expansion target: {pendingLinkExpansion || <em>waiting…</em>}</small>
                {pendingLinkExpansion && (
                  <button
                    type="button"
                    onClick={() => onClearPendingLink?.(side, "expansion")}
                    style={{ marginLeft: 8 }}
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- App with two panels ----------
const App = () => {
  const [reportsList, setReportsList] = useState([]);
  const [leftReport, setLeftReport] = useState(null);
  const [rightReport, setRightReport] = useState(null);
  const [labelPrefix, setLabelPrefix] = useState("");

  // global pick mode request
  const [linkingRequest, setLinkingRequest] = useState(null);
  // shape: { requesterSide: "left"|"right", type: "duplicate"|"expansion" }

  // pending link tokens per pane
  const [pendingLinks, setPendingLinks] = useState({
    left:   { duplicate: "", expansion: "" },
    right:  { duplicate: "", expansion: "" }
  });

  // When a pane ticks a checkbox -> request pick mode
  const handleRequestLink = (requesterSide, type) => {
    setLinkingRequest({ requesterSide, type });
  };

  // Target pane clicked a box while in pick mode
  const handlePickTarget = ({ targetReport, targetBoxNumber }) => {
    if (!linkingRequest) return; // safety
    const { requesterSide, type } = linkingRequest;
    const docNumber = parseDocNumber(targetReport);
    const token = `${docNumber}#${targetBoxNumber}`;

    setPendingLinks(prev => ({
      ...prev,
      [requesterSide]: {
        ...prev[requesterSide],
        [type]: token
      }
    }));

    setLinkingRequest(null); // exit pick mode
  };

  // Allow either pane to clear its pending link token
  const handleClearPendingLink = (side, type) => {
    setPendingLinks(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        [type]: ""
      }
    }));
  };

  const cancelPickMode = () => setLinkingRequest(null);

  // fetch list of files once
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reports`);
        const ct = res.headers.get("content-type") || "";
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`GET /api/reports -> ${res.status}. Body: ${body.slice(0,200)}`);
        }
        if (!ct.includes("application/json")) {
          const body = await res.text();
          throw new Error(`Expected JSON but got "${ct}". Body: ${body.slice(0,200)}`);
        }
        const data = await res.json();
        setReportsList(data);

        if (data.length > 0 && !leftReport) setLeftReport(data[0]);
        if (data.length > 1 && !rightReport) setRightReport(data[1]);
      } catch (e) {
        console.error("Failed to fetch /api/reports", e);
      }
    };
    fetchReports();
  }, []); // eslint-disable-line
  return (
    <div style={{ padding: "1rem" }}>
      <h1>PDF Label App (Two-Panel)</h1>
      <p style={{ color: "#666", marginTop: "-0.5rem" }}>
        Choose any two reports to compare side-by-side. Boxes & CSVs are saved per report.
      </p>

      <div className="main-layout" style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <PdfPane
          side="left"
          report={leftReport}
          setReport={setLeftReport}
          reportsList={reportsList}
          labelPrefix={labelPrefix}
          setLabelPrefix={setLabelPrefix}
          categoryTree={categoryTree}
          categoryColors={categoryColors}
          onRequestLink={handleRequestLink}
          isPickMode={!!linkingRequest && linkingRequest.requesterSide !== "left"}
          pickType={linkingRequest?.type || null}
          onPickTarget={handlePickTarget}
          onCancelPick={cancelPickMode}
          pendingLinkDuplicate={pendingLinks.left.duplicate}
          pendingLinkExpansion={pendingLinks.left.expansion}
          onClearPendingLink={handleClearPendingLink}
        />

        <PdfPane
          side="right"
          report={rightReport}
          setReport={setRightReport}
          reportsList={reportsList}
          labelPrefix={labelPrefix}
          setLabelPrefix={setLabelPrefix}
          categoryTree={categoryTree}
          categoryColors={categoryColors}
          onRequestLink={handleRequestLink}
          isPickMode={!!linkingRequest && linkingRequest.requesterSide !== "right"}
          pickType={linkingRequest?.type || null}
          onPickTarget={handlePickTarget}
          onCancelPick={cancelPickMode}
          pendingLinkDuplicate={pendingLinks.right.duplicate}
          pendingLinkExpansion={pendingLinks.right.expansion}
          onClearPendingLink={handleClearPendingLink}
        />
      </div>
    </div>
  );
};

export default App;
