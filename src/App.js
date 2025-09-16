import React, { useState, useEffect, useRef, useMemo } from "react";
import config from "./config";
const { categoryTree, categoryColors } = config;

import { getDocument } from "pdfjs-dist";
import Papa from "papaparse";
import "pdfjs-dist/build/pdf.worker.entry";
import "./App.css";

// ---- helpers (top-level) ----
const parseDocNumber = (filename) => {
  const m = filename?.match(/_(\d+)\.pdf$/i);
  return m ? m[1] : (filename?.replace(/\.pdf$/i, "") || "");
};

const LINK_FIELD_KEYS = ["direct_duplicate", "expansion"];
const isLinkField = (k) => LINK_FIELD_KEYS.includes((k || "").toString().toLowerCase());

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
  side,
  report,
  setReport,
  reportsList,
  labelPrefix, setLabelPrefix,
  categoryTree, categoryColors,

  // cross-pane linking props
  onRequestLink,
  isPickMode,
  pickType,
  onPickTarget,
  onCancelPick,

  pendingLinkDuplicate,
  pendingLinkExpansion,
  onClearPendingLink
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

  // --- scaling controls ---
  const [shrinkBy, setShrinkBy] = useState(0.9);   // e.g., 0.9 = shrink 10%
  const [growBy, setGrowBy]     = useState(1.1);   // e.g., 1.1 = grow 10%
  const [onlyCurrentPage, setOnlyCurrentPage] = useState(true);

  // scales x/y/width/height proportionally; clamps to pane bounds
  const applyScale = (factor) => {
    if (!Number.isFinite(factor) || factor <= 0) return;

    const { w: cw, h: ch } = getPaneSize(); // your helper already exists

    setBoxes(prev =>
      prev.map(b => {
        // restrict to this report; optionally to current page
        if (b.report !== report) return b;
        if (onlyCurrentPage && b.page !== currentPage) return b;

        const isFraction =
          b.units === "fraction" ||
          (b.x <= 1 && b.y <= 1 && b.width <= 1 && b.height <= 1);

        let nx = b.x * factor;
        let ny = b.y * factor;
        let nw = b.width * factor;
        let nh = b.height * factor;

        if (isFraction) {
          // clamp to [0,1] and make sure box stays in-bounds
          nx = Math.max(0, Math.min(nx, 1));
          ny = Math.max(0, Math.min(ny, 1));
          nw = Math.max(0, Math.min(nw, 1 - nx));
          nh = Math.max(0, Math.min(nh, 1 - ny));
          return { ...b, x: nx, y: ny, width: nw, height: nh, units: "fraction" };
        } else {
          // pixel legacy boxes: clamp to current pane size
          nx = Math.max(0, Math.min(nx, cw));
          ny = Math.max(0, Math.min(ny, ch));
          nw = Math.max(0, Math.min(nw, cw - nx));
          nh = Math.max(0, Math.min(nh, ch - ny));
          return { ...b, x: nx, y: ny, width: nw, height: nh };
        }
      })
    );
  };


  // link checkbox watcher
  const prevDup = useRef(!!formData.fields?.direct_duplicate);
  const prevExp = useRef(!!formData.fields?.expansion);

  useEffect(() => {
    const dupNow = !!formData.fields?.direct_duplicate;
    const expNow = !!formData.fields?.expansion;

    if (!prevDup.current && dupNow && !pendingLinkDuplicate) onRequestLink?.(side, "duplicate");
    if (!prevExp.current && expNow && !pendingLinkExpansion) onRequestLink?.(side, "expansion");

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
  const legacyInputRef = useRef(null);
  const normalizedInputRef = useRef(null);
  const imgRef = useRef(null);

  // SAFE helper: no recursion, no state updates, consistent results
  function getPaneSize() {
    const img = imgRef.current;
    if (img && img.clientWidth > 0 && img.clientHeight > 0) {
      return { w: img.clientWidth, h: img.clientHeight };
    }
    const el = containerRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width || el.clientWidth || 0));
      const h = Math.max(1, Math.floor(r.height || el.clientHeight || 0));
      return { w, h };
    }
    return { w: 1, h: 1 };
  }

  const handleMouseDown = (e) => {
    if (isPickMode) return;
    if (!containerRef.current) return;
    // We still need offsets from the container rect for pointer math
    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    startCoords.current = { x, y };
    setDrawingBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (isPickMode) return;
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
    if (isPickMode) return;
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

    const { w: cw, h: ch } = getPaneSize();
    const nx = (pendingBox?.x ?? 0) / cw;
    const ny = (pendingBox?.y ?? 0) / ch;
    const nw = (pendingBox?.width ?? 0) / cw;
    const nh = (pendingBox?.height ?? 0) / ch;

    const filteredFields = Object.fromEntries(
      Object.entries(fields || {}).filter(([k]) => !isLinkField(k))
    );

    const newBox = {
      page: pendingBox?.page ?? currentPage,   // explicit page
      x: nx, y: ny, width: nw, height: nh,    // normalized fractions
      units: "fraction",
      boxNumber: labelCount,
      report,
      label: { macro, meso, micro, code, fields: filteredFields, labelCode },
      links: {
        duplicate: pendingLinkDuplicate || "",
        expansion: pendingLinkExpansion || ""
      }
    };

    setBoxes(prev => [...prev, newBox]);
    setLabelCount(c => c + 1);
    resetForm();

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

        allFieldKeys.forEach(k => { row[k] = ""; });

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
    const coordRows = boxes.map(box => {
      const isFraction = box.units === "fraction" || (box.x <= 1 && box.y <= 1 && box.width <= 1 && box.height <= 1);
      const { w: cw, h: ch } = getPaneSize();
      const nx = isFraction ? box.x : (box.x / cw);
      const ny = isFraction ? box.y : (box.y / ch);
      const nw = isFraction ? box.width : (box.width / cw);
      const nh = isFraction ? box.height : (box.height / ch);
      return {
        report: report || "",
        page: box.page,
        x_norm: nx, y_norm: ny, width_norm: nw, height_norm: nh,
        units: "fraction",
        boxNumber: box.boxNumber
      };
    });
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

  // (Old pixel loader kept for compatibility; normalizes on import)
  const handleLoadPreviousBoxes = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const { w: cw, h: ch } = getPaneSize();
        const importedBoxes = (results.data || []).map((row, idx) => {
          const x = parseFloat(row.x);
          const y = parseFloat(row.y);
          const width = parseFloat(row.width);
          const height = parseFloat(row.height);
          let page = parseInt(row.page);
          if (Number.isNaN(page) || page <= 0) page = currentPage;

          let boxNumber = parseInt(row.boxNumber);
          if (Number.isNaN(boxNumber)) {
            const existing = Array.isArray(boxes) ? boxes.length : 0;
            boxNumber = existing + idx + 1;
          }
          if ([x,y,width,height].some(Number.isNaN)) return null;
          return {
            x: x / cw, y: y / ch, width: width / cw, height: height / ch,
            units: "fraction",
            page,
            boxNumber,
            previous: true,
            report: report || row.report || ""
          };
        }).filter(Boolean);
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

  const handleUploadLegacyPixelsCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const doConvert = (rows, attempt = 0) => {
      const { w: cw, h: ch } = getPaneSize();

      if ((cw < 10 || ch < 10) && attempt < 10) {
        setTimeout(() => doConvert(rows, attempt + 1), 60);
        return;
      }

      const imported = rows.map((row, idx) => {
        const px = parseFloat(row.x);
        const py = parseFloat(row.y);
        const pw = parseFloat(row.width);
        const ph = parseFloat(row.height);

        if ([px, py, pw, ph].some(Number.isNaN)) return null;

        const nx = cw ? px / cw : 0;
        const ny = ch ? py / ch : 0;
        const nw = cw ? pw / cw : 0;
        const nh = ch ? ph / ch : 0;

        let page = parseInt(row.page);
        if (Number.isNaN(page) || page <= 0) page = currentPage;

        let boxNumber = parseInt(row.boxNumber);
        if (Number.isNaN(boxNumber)) boxNumber = (boxes?.length || 0) + idx + 1;

        return {
          x: nx, y: ny, width: nw, height: nh,
          units: "fraction",
          page,
          previous: true,
          boxNumber,
          report: report || row.report || "",
        };
      }).filter(Boolean);

      setBoxes((prev) => [...prev, ...imported]);
    };

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const rows = (results.data || []).filter(Boolean);
        doConvert(rows);
      },
    });

    e.target.value = "";
  };

  const handleUploadNormalizedCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const imported = (results.data || []).map((row, idx) => {
          let nx = parseFloat(row.x_norm);
          let ny = parseFloat(row.y_norm);
          let nw = parseFloat(row.width_norm);
          let nh = parseFloat(row.height_norm);
          if ([nx,ny,nw,nh].some(Number.isNaN)) {
            const lx = parseFloat(row.x);
            const ly = parseFloat(row.y);
            const lw = parseFloat(row.width);
            const lh = parseFloat(row.height);
            if (![lx,ly,lw,lh].some(Number.isNaN) && lx <= 1 && ly <= 1 && lw <= 1 && lh <= 1) {
              nx = lx; ny = ly; nw = lw; nh = lh;
            }
          }
          if ([nx,ny,nw,nh].some(Number.isNaN)) return null;
          let page = parseInt(row.page);
          if (Number.isNaN(page) || page <= 0) page = currentPage;
          let boxNumber = parseInt(row.boxNumber);
          if (Number.isNaN(boxNumber)) boxNumber = (boxes?.length || 0) + idx + 1;
          return {
            x: nx, y: ny, width: nw, height: nh,
            units: "fraction",
            page,
            previous: true,
            boxNumber,
            report: report || row.report || ""
          };
        }).filter(Boolean);
        setBoxes(prev => [...prev, ...imported]);
      }
    });
    e.target.value = "";
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

        {/* Upload buttons on their own row */}
        <div style={{
          width: "100%",
          marginTop: "0.5rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap"
        }}>
          <button type="button" onClick={() => legacyInputRef.current?.click()}>
            Upload LEGACY pixels CSV
          </button>
          <input
            ref={legacyInputRef}
            type="file"
            accept=".csv"
            onChange={handleUploadLegacyPixelsCSV}
            style={{ display: "none" }}
          />

          <button type="button" onClick={() => normalizedInputRef.current?.click()}>
            Upload NORMALIZED CSV
          </button>
          <input
            ref={normalizedInputRef}
            type="file"
            accept=".csv"
            onChange={handleUploadNormalizedCSV}
            style={{ display: "none" }}
          />
        </div>

        {/* Scaling controls */}
          <div
            style={{
              width: "100%",
              marginTop: "0.5rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={onlyCurrentPage}
                onChange={e => setOnlyCurrentPage(e.target.checked)}
              />
              Only current page
            </label>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span>Shrink ×</span>
              <input
                type="number"
                step="0.05"
                min="0.01"
                value={shrinkBy}
                onChange={(e) => setShrinkBy(parseFloat(e.target.value) || 0)}
                style={{ width: 90 }}
              />
              <button type="button" onClick={() => applyScale(parseFloat(shrinkBy))}>
                Apply
              </button>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span>Grow ×</span>
              <input
                type="number"
                step="0.05"
                min="0.01"
                value={growBy}
                onChange={(e) => setGrowBy(parseFloat(e.target.value) || 0)}
                style={{ width: 90 }}
              />
              <button type="button" onClick={() => applyScale(parseFloat(growBy))}>
                Apply
              </button>
            </div>
          </div>

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
            ref={imgRef}
            src={pageImage}
            alt={`Page ${currentPage} - ${report}`}
            style={{ display: "block", pointerEvents: "none", maxWidth: "100%" }}
          />

          {/* Existing boxes for this page */}
          {boxes.filter(b => b.page === currentPage).map((box, idx) => {
            if (![box.x, box.y, box.width, box.height].every(Number.isFinite)) return null;

            const isPrevious = box.previous;
            const macro = box.label?.macro;
            const color = isPrevious ? "gray" : (categoryColors[macro] || "black");

            const { w: cw, h: ch } = getPaneSize();
            const isFraction = box.units === "fraction" || (box.x <= 1 && box.y <= 1 && box.width <= 1 && box.height <= 1);
            const leftPct   = isFraction ? (box.x * 100)       : ((box.x / cw) * 100);
            const topPct    = isFraction ? (box.y * 100)       : ((box.y / ch) * 100);
            const widthPct  = isFraction ? (box.width * 100)   : ((box.width / cw) * 100);
            const heightPct = isFraction ? (box.height * 100)  : ((box.height / ch) * 100);

            const handleBoxClick = () => {
              if (isPickMode) {
                onPickTarget?.({ targetReport: report, targetBoxNumber: box.boxNumber });
                return;
              }
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
                    zIndex: 2,
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
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
                      zIndex: 3,
                      left: `calc(${leftPct}% + ${widthPct}% - 14px)`,
                      top: `calc(${topPct}% - 2px)`,
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
                zIndex: 4,
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
                .filter(f => !isLinkField(f.key))
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

  const [linkingRequest, setLinkingRequest] = useState(null);

  const [pendingLinks, setPendingLinks] = useState({
    left:   { duplicate: "", expansion: "" },
    right:  { duplicate: "", expansion: "" }
  });

  const handleRequestLink = (requesterSide, type) => {
    setLinkingRequest({ requesterSide, type });
  };

  const handlePickTarget = ({ targetReport, targetBoxNumber }) => {
    if (!linkingRequest) return;
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

    setLinkingRequest(null);
  };

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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
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
