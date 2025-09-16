import * as React from 'react';
import {
  Button,
  Checkbox,
  FileUpload,
  Modal,
  ModalVariant,
  Title,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

interface ImportPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportPipelineModal: React.FunctionComponent<ImportPipelineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [filename, setFilename] = React.useState('');
  const [value, setValue] = React.useState('');
  const [importMissingRepos, setImportMissingRepos] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>,
    file: File
  ) => {
    setFilename(file.name);
  };

  const handleTextOrDataChange = (value: string) => {
    setValue(value);
  };

  const handleClear = () => {
    setFilename('');
    setValue('');
  };

  const handleReviewAndFinish = () => {
    console.log('Review and finish clicked');
    // Handle the import logic here
    onClose();
  };

  const handleCancel = () => {
    handleClear();
    onClose();
  };

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={handleCancel}
      hasNoBodyWrapper
    >
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '24px'
        }}>
          <Title headingLevel="h1" size="xl">
            Import pipeline
          </Title>
          <InfoCircleIcon style={{ fontSize: '1rem', color: '#666' }} />
        </div>

        {/* Import missing repositories checkbox */}
        <div style={{ marginBottom: '24px' }}>
          <Checkbox
            id="import-missing-repos"
            isChecked={importMissingRepos}
            onChange={(event, checked) => setImportMissingRepos(checked)}
            label="Import missing custom repositories after file upload."
          />
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: '16px' }}>
          <FileUpload
            id="pipeline-file-upload"
            type="text"
            value={value}
            filename={filename}
            filenamePlaceholder="Drag and drop a file or upload one"
            onFileInputChange={handleFileInputChange}
            onDataChange={handleTextOrDataChange}
            onTextChange={handleTextOrDataChange}
            onClearClick={handleClear}
            isLoading={isLoading}
            allowEditingUploadedText={false}
            browseButtonText="Upload"
            clearButtonText="Clear"
            style={{
              '--pf-c-file-upload__file-select-button--Color': '#151515',
              '--pf-c-file-upload__file-select-button--BackgroundColor': '#f0f0f0',
              '--pf-c-file-upload__file-select-button--BorderColor': '#8a8d90',
            } as React.CSSProperties}
          />
        </div>

        {/* Help text */}
        <p style={{ 
          fontSize: '14px', 
          color: '#666',
          marginBottom: '32px',
          margin: '0 0 32px 0'
        }}>
          Upload your blueprint file. Supported formats: JSON, TOML.
        </p>

        {/* Action buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '16px',
          justifyContent: 'flex-start'
        }}>
          <Button
            variant="primary"
            onClick={handleReviewAndFinish}
            isDisabled={!filename && !value}
          >
            Review and finish
          </Button>
          <Button
            variant="link"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { ImportPipelineModal };
