import React, { useState, useEffect, useMemo } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import {
  SidePanel,
  TextSection,
  PhotosSection,
  ElementsSection,
  UploadSection,
  BackgroundSection,
  LayersSection,
  SizeSection,
} from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';
import Ico from './Ico.jsx';
import { CanvaTemplatesSection } from './CanvaTemplatesSection.jsx';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'polotno/polotno.blueprint.css';
import 'polotno/ui.css';

const SECTIONS = [
  CanvaTemplatesSection,
  TextSection,
  PhotosSection,
  ElementsSection,
  UploadSection,
  BackgroundSection,
  LayersSection,
  SizeSection,
];

export default function BrochureEditor({ onBack }) {
  const [menu, setMenu] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const store = useMemo(() => {
    const key =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_POLOTNO_KEY) ||
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_POLOTNO_KEY) ||
      '';
    const s = createStore({
      key,
      showCredit: false,
    });
    // Start with a clean blank canvas (1123 x 794)
    if (!s.pages || s.pages.length === 0) {
      s.addPage();
    }
    s.setSize(1123, 794);
    return s;
  }, []);

  useEffect(() => {
    if (store && (!store.pages || store.pages.length === 0)) {
      store.addPage();
      store.setSize(1123, 794);
    }
  }, [store]);

  useEffect(() => {
    if (!store) return;
    const handleKeyDown = (e) => {
      // If user is editing text or in an input, let normal typing / backspacing work
      if (
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName) ||
        e.target.isContentEditable ||
        e.target.closest?.('[contenteditable="true"]') ||
        e.target.closest?.('.polotno-text-input') ||
        e.target.closest?.('.polotno-panel-container')
      ) {
        return;
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const selected = store.selectedElements || [];
        if (selected.length > 0) {
          const ids = selected.filter((el) => el.removable !== false).map((el) => el.id);
          if (ids.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            store.deleteElements(ids);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [store]);

  const handleDownloadImage = async () => {
    setMenu(false);
    try {
      setDownloading(true);
      await store.saveAsImage({
        fileName: 'brochure.png',
        mimeType: 'image/png',
        pixelRatio: 2,
      });
    } catch (err) {
      console.error('Failed to export image:', err);
      alert('Error exporting PNG: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setMenu(false);
    try {
      setDownloading(true);
      await store.saveAsPDF({
        fileName: 'brochure.pdf',
        dpi: 300,
      });
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Error exporting PDF: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const DownloadActionComponent = () => (
    <div className="menu-wrap" style={{ display: 'inline-block' }}>
      <button
        className="btn primary"
        onClick={() => setMenu(!menu)}
        disabled={downloading}
        style={{ fontSize: '13px', padding: '6px 14px' }}
      >
        <Ico name="download" /> {downloading ? 'Exporting...' : 'Download'}
      </button>
      {menu && (
        <div className="menu" role="menu" style={{ right: 0, top: 'calc(100% + 4px)' }}>
          <button role="menuitem" onClick={handleDownloadImage}>
            PNG image
          </button>
          <button role="menuitem" onClick={handleDownloadPDF}>
            PDF document
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="app" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Header matching Brochure Studio */}
      <header className="top">
        <div className="brand">Brochure Studio</div>
        {onBack && (
          <button className="btn" onClick={onBack} title="Return to Brochure Studio">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back to Studio
          </button>
        )}
        <div
          className="name"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            width: 'auto',
            padding: '6px 14px',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          Design Studio
        </div>
        <div className="grow" />
        <div className="menu-wrap">
          <button
            className="btn primary"
            onClick={() => setMenu(!menu)}
            disabled={downloading}
          >
            <Ico name="download" /> {downloading ? 'Exporting...' : 'Download'}
          </button>
          {menu && (
            <div className="menu" role="menu">
              <button role="menuitem" onClick={handleDownloadImage}>
                PNG image
              </button>
              <button role="menuitem" onClick={handleDownloadPDF}>
                PDF document
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Polotno SDK Canvas Layout */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--desk)' }}>
        <PolotnoContainer style={{ width: '100%', height: '100%' }}>
          <SidePanelWrap>
            <SidePanel store={store} sections={SECTIONS} defaultSection="templates" />
          </SidePanelWrap>
          <WorkspaceWrap>
            <Toolbar
              store={store}
              downloadButtonEnabled={false}
              components={{
                Action: DownloadActionComponent,
              }}
            />
            <Workspace store={store} />
            <ZoomButtons store={store} />
          </WorkspaceWrap>
        </PolotnoContainer>
      </div>
    </div>
  );
}
