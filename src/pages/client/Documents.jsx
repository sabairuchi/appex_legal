import React, { useState, useEffect } from 'react';
import { fetchDocuments, uploadDocument, getDownloadUrl } from '../../services/clientApi';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Upload Modal State
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchDocuments();
      setDocuments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('[Documents Fetch Error]:', err);
      setError(err.message || 'Failed to load legal documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowed = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
      ];
      if (!allowed.includes(file.type)) {
        setModalError('Invalid document format. Allowed: PDF, DOC, DOCX, TXT, JPG, PNG');
        setSelectedFile(null);
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setModalError('Document file size exceeds maximum limit of 15MB');
        setSelectedFile(null);
        return;
      }
      setModalError(null);
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !title) {
      setModalError('Please select a file and enter a document title');
      return;
    }

    setUploading(true);
    setModalError(null);

    try {
      await uploadDocument(title, selectedFile);
      setShowModal(false);
      setTitle('');
      setSelectedFile(null);
      loadDocuments(); // Refresh documents list
    } catch (err) {
      console.error('[Upload Error]:', err);
      setModalError(err.message || 'Failed to upload legal document');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="portal-card" style={{ padding: '30px' }}>
        <div className="skeleton" style={{ height: '30px', width: '35%', marginBottom: '20px' }}></div>
        <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '15px' }}></div>
        <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '15px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Top Banner */}
      <div className="portal-card" style={{ borderTopColor: 'var(--gold-accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 className="portal-card-title" style={{ fontSize: '24px' }}>Confidential Legal Documents Vault</h2>
            <p style={{ color: 'var(--gray-pillar)', fontSize: '14px', margin: 0 }}>
              Encrypted repository for case filings, contracts, identity verification, and legal evidence.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontSize: '14px' }}
          >
            + Upload New Document
          </button>
        </div>
      </div>

      {error ? (
        <div style={{ padding: '16px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '6px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      ) : null}

      {/* Documents Table */}
      <div className="portal-card">
        {documents.length > 0 ? (
          <div className="portal-table-wrapper">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>File Format</th>
                  <th>Size</th>
                  <th>Uploaded Date</th>
                  <th>Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <strong style={{ color: 'var(--navy-primary)' }}>📜 {doc.title}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--gray-pillar)' }}>{doc.filename}</div>
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F1F5F9',
                        fontSize: '12px', fontWeight: '600', color: 'var(--navy-dark)'
                      }}>
                        {doc.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
                      </span>
                    </td>
                    <td>{formatFileSize(doc.fileSize)}</td>
                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="status-pill active" style={{ textTransform: 'capitalize' }}>
                        {doc.uploadedBy || 'Client'}
                      </span>
                    </td>
                    <td>
                      <a
                        href={getDownloadUrl(doc._id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: '6px 14px', fontSize: '12px', borderColor: 'var(--navy-primary)', color: 'var(--navy-primary)' }}
                      >
                        ⬇ Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '60px 20px' }}>
            <div className="empty-state-icon">📜</div>
            <h3 className="empty-state-title">No Legal Documents Available Yet</h3>
            <p className="empty-state-desc">
              Your confidential documents and firm files will appear here once uploaded.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              Upload Document to Vault
            </button>
          </div>
        )}
      </div>

      {/* Document Upload Modal */}
      {showModal ? (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--navy-primary)', margin: 0 }}>
                Upload Legal Document
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--gray-pillar)' }}
              >
                ×
              </button>
            </div>

            {modalError ? (
              <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                ⚠️ {modalError}
              </div>
            ) : null}

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '5px' }}>
                  Document Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Executed Service Agreement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--navy-primary)', marginBottom: '5px' }}>
                  Select File * (PDF, DOC, DOCX, TXT, JPG, PNG - Max 15MB)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '14px', backgroundColor: '#FAFAFA' }}
                />
              </div>

              {selectedFile ? (
                <div style={{ fontSize: '13px', color: 'var(--navy-primary)', backgroundColor: '#F1F5F9', padding: '10px', borderRadius: '4px' }}>
                  📄 Selected: <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
                </div>
              ) : null}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '14px', borderColor: '#CBD5E1', color: 'var(--gray-pillar)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '14px' }}
                >
                  {uploading ? 'Uploading File...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

    </div>
  );
}
