import React, { useState, useEffect, useRef, useMemo } from "react";
import config from "./config";
const { categoryTree, categoryColors } = config;

import { getDocument } from "pdfjs-dist";
import Papa from "papaparse";
import "pdfjs-dist/build/pdf.worker.entry";
import "./App.css";

const getAllCodePrefixedKeys = (categoryTree) => {
  const keys = new Set();
  Object.values(categoryTree).forEach(mesoMap => {
    Object.values(mesoMap).forEach(microMap => {
      Object.values(microMap).forEach(({ code, form }) => {
        form.forEach(field => keys.add(`${code}_${field.key}`));
      });
    });
  });
  return Array.from(keys);
};

// ---------- Reusable PDF pane (one side) ----------
const PdfPane = ({
  side,                         // "left" | "right" (for debug/classes)
  report,                       // filename selected (e.g. "A123.pdf")
  setReport,                    // setter for dropdown changes
  reportsList,                  // array of filenames
  labelPrefix, setLabelPrefix,  // shared across panes (optional)
  categoryTree, categoryColors  // provided by parent
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
      const loadingTask = getDocument(`/reports/${encodeURIComponent(report)}`);
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
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    startCoords.current = { x, y };
    setDrawingBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
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
    const newBox = {
      ...pendingBox,
      boxNumber: labelCount,
      label: { macro, meso, micro, code, fields, labelCode },
      report // attach report name for CSV
    };
    setBoxes(prev => [...prev, newBox]);
    setLabelCount(c => c + 1);
    resetForm();
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
        const { page, x, y, width, height, label } = box;
        const { macro, meso, micro, code, fields = {} } = label || {};
        const row = {
          report: report || "",
          page, x, y, width, height,
          boxNumber: box.boxNumber,
          macro, meso, micro, code
        };
        allFieldKeys.forEach(k => { row[k] = ""; });
        Object.entries(fields).forEach(([k, v]) => {
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
        const importedBoxes = (results.data || []).map(row => ({
          x: parseFloat(row.x),
          y: parseFloat(row.y),
          width: parseFloat(row.width),
          height: parseFloat(row.height),
          page: parseInt(row.page),
          boxNumber: parseInt(row.boxNumber),
          previous: true,
          report: report || row.report || ""
        })).filter(b => !Number.isNaN(b.x));
        setBoxes(prev => [...prev, ...importedBoxes]);
      }
    });
    // clear input
    e.target.value = "";
  };

  const handleClearCurrentReport = () => {
    if (!report) return;
    if (window.confirm(`Clear all boxes for "${report}"?`)) {
      setBoxes([]);                       // clear UI
      if (storageKey) localStorage.removeItem(storageKey); // clear storage
      setLabelCount(1);                   // reset numbering
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
                    cursor: isPrevious ? "pointer" : "default",
                    backgroundColor: isPrevious ? "rgba(100,100,100,0.05)" : "transparent"
                  }}
                  title={
                    isPrevious
                      ? "Click to label this box"
                      : `${box.label.macro} / ${box.label.meso} (${box.label.code})`
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

          {formData.macro && formData.meso && formData.micro && (
            <div className="dynamic-fields" style={{ marginTop: "0.5rem" }}>
              {categoryTree[formData.macro][formData.meso][formData.micro].form.map(f => (
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

          <div className="form-buttons" style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={handleSave} disabled={!formData.macro || !formData.meso || !formData.micro}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
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

  // fetch list of files once
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        setReportsList(data);
        // pick sensible defaults if present
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
        />
      </div>
    </div>
  );
};

export default App;