import { useState } from 'react';
import RefineConfirmModal from './RefineConfirmModal';
import ProfileBanner from './identity/ProfileBanner';
import ContactInfo from './identity/ContactInfo';
import StructuredView from './identity/StructuredView';
import RawView from './identity/RawView';
import EmptyState from './identity/EmptyState';

export default function IdentityTab({ cvData, onUploadCv, uploading, onRefineCv, refining }) {
  // eslint-disable-next-line no-unused-vars
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRefineModal, setShowRefineModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onUploadCv(file);
    }
  };

  const handleConfirmRefine = async () => {
    setShowRefineModal(false);
    if (onRefineCv) {
      await onRefineCv();
    }
  };

  const identity = cvData?.identity || {};
  const content = cvData?.content || {};
  const structured = cvData?.structured_profile;
  const isRefined = Boolean(structured);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <ProfileBanner cvData={cvData} isRefined={isRefined} uploading={uploading} refining={refining} onRefineClick={() => setShowRefineModal(true)} onFileChange={handleFileChange} />

      {cvData ? (
        <div className="space-y-8">
          <ContactInfo identity={identity} />

          {isRefined ? <StructuredView structured={structured} content={content} /> : <RawView content={content} />}
        </div>
      ) : (
        <EmptyState />
      )}

      <RefineConfirmModal isOpen={showRefineModal} onConfirm={handleConfirmRefine} onCancel={() => setShowRefineModal(false)} isRefining={refining} />
    </div>
  );
}
