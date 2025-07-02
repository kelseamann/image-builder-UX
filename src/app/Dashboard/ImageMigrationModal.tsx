import * as React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
  Alert,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Divider,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Title,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

interface ImageInfo {
  name: string;
  tag: string;
  currentRelease: string;
  currentEnvironment: string;
}

interface MigrationData {
  targetRelease: string;
  targetEnvironment: string;
}

interface ImageMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageInfo?: ImageInfo;
  onConfirm: (migrationData: MigrationData) => Promise<void>;
}

const ImageMigrationModal: React.FunctionComponent<ImageMigrationModalProps> = ({
  isOpen,
  onClose,
  imageInfo,
  onConfirm,
}) => {
  const [targetRelease, setTargetRelease] = React.useState('');
  const [targetEnvironment, setTargetEnvironment] = React.useState('');
  const [isReleaseSelectOpen, setIsReleaseSelectOpen] = React.useState(false);
  const [isEnvironmentSelectOpen, setIsEnvironmentSelectOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    targetRelease?: string;
    targetEnvironment?: string;
  }>({});

  // Mock data for releases and environments
  const availableReleases = [
    'Red Hat Enterprise Linux 10',
    'Red Hat Enterprise Linux 9',
    'Red Hat Enterprise Linux 8',
  ];

  const availableEnvironments = [
    'AWS',
    'GCP',
    'Azure',
    'Bare metal',
    'VMWare',
  ];

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setTargetRelease('');
      setTargetEnvironment('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!targetRelease) {
      newErrors.targetRelease = 'Target release is required';
    }
    
    if (!targetEnvironment) {
      newErrors.targetEnvironment = 'Target environment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm({
        targetRelease,
        targetEnvironment,
      });
      onClose();
    } catch (error) {
      console.error('Migration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const onReleaseSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    setTargetRelease(String(selection));
    setIsReleaseSelectOpen(false);
    if (errors.targetRelease) {
      setErrors(prev => ({ ...prev, targetRelease: undefined }));
    }
  };

  const onEnvironmentSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    setTargetEnvironment(String(selection));
    setIsEnvironmentSelectOpen(false);
    if (errors.targetEnvironment) {
      setErrors(prev => ({ ...prev, targetEnvironment: undefined }));
    }
  };

  if (!imageInfo) {
    return null;
  }

  return (
    <Modal
      variant={ModalVariant.medium}
      title="Migrate Image to New Environment"
      isOpen={isOpen}
      onClose={handleCancel}
    >
      <div style={{ padding: '24px' }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '32px' }}>
          <Title headingLevel="h1" size="xl" style={{ marginBottom: '16px' }}>
            Migrate
          </Title>
          <p style={{ 
            fontSize: '16px', 
            lineHeight: '1.5',
            marginBottom: '0'
          }}>
            Move your image to a new release and target environment. 
            This process will update your image configuration while maintaining all essential data and settings.
          </p>
        </div>

        <Alert
          variant="info"
          isInline
          title="Do you need to keep a copy of this image?"
          customIcon={<InfoCircleIcon />}
          style={{ marginBottom: '24px' }}
        >
          <p>
            Use the duplication button, and then migrate a copy of this image in order to preserve your current configuration settings.
          </p>
        </Alert>

        {/* Grouped from/to layout */}
        <Form>
          {/* Release Group */}
          <FormGroup
            label="Release"
            fieldId="release-group"
          >
            <div style={{ marginBottom: '8px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 500, 
                marginBottom: '4px',
                color: '#495057'
              }}>
                From
              </label>
              <TextInput
                id="from-release"
                value={imageInfo.currentRelease}
                readOnly
                style={{ 
                  backgroundColor: '#f8f9fa',
                  color: '#495057'
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 500, 
                marginBottom: '4px',
                color: '#495057'
              }}>
                To <span style={{ color: '#c9190b' }}>*</span>
              </label>
              <Select
                id="to-release-select"
                aria-label="Select target release"
                toggle={(toggleRef) => (
                  <MenuToggle 
                    ref={toggleRef} 
                    onClick={() => setIsReleaseSelectOpen(!isReleaseSelectOpen)}
                    isExpanded={isReleaseSelectOpen}
                    isDisabled={isLoading}
                    style={{ width: '100%' }}
                  >
                    {targetRelease || 'Choose a target release'}
                  </MenuToggle>
                )}
                onSelect={onReleaseSelect}
                selected={targetRelease}
                isOpen={isReleaseSelectOpen}
                onOpenChange={setIsReleaseSelectOpen}
              >
                <SelectList>
                  {availableReleases.map((release) => (
                    <SelectOption 
                      key={release} 
                      value={release}
                      isDisabled={release === imageInfo.currentRelease}
                    >
                      {release}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
              {errors.targetRelease && (
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem variant="error">{errors.targetRelease}</HelperTextItem>
                  </HelperText>
                </FormHelperText>
              )}
            </div>
          </FormGroup>

          {/* Environment Group */}
          <FormGroup
            label="Environment"
            fieldId="environment-group"
          >
            <div style={{ marginBottom: '8px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 500, 
                marginBottom: '4px',
                color: '#495057'
              }}>
                From
              </label>
              <TextInput
                id="from-environment"
                value={imageInfo.currentEnvironment}
                readOnly
                style={{ 
                  backgroundColor: '#f8f9fa',
                  color: '#495057'
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: 500, 
                marginBottom: '4px',
                color: '#495057'
              }}>
                To <span style={{ color: '#c9190b' }}>*</span>
              </label>
              <Select
                id="to-environment-select"
                aria-label="Select target environment"
                toggle={(toggleRef) => (
                  <MenuToggle 
                    ref={toggleRef} 
                    onClick={() => setIsEnvironmentSelectOpen(!isEnvironmentSelectOpen)}
                    isExpanded={isEnvironmentSelectOpen}
                    isDisabled={isLoading}
                    style={{ width: '100%' }}
                  >
                    {targetEnvironment || 'Choose a target environment'}
                  </MenuToggle>
                )}
                onSelect={onEnvironmentSelect}
                selected={targetEnvironment}
                isOpen={isEnvironmentSelectOpen}
                onOpenChange={setIsEnvironmentSelectOpen}
              >
                <SelectList>
                  {availableEnvironments.map((environment) => (
                    <SelectOption 
                      key={environment} 
                      value={environment}
                      isDisabled={environment === imageInfo.currentEnvironment}
                    >
                      {environment}
                    </SelectOption>
                  ))}
                </SelectList>
              </Select>
              {errors.targetEnvironment && (
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem variant="error">{errors.targetEnvironment}</HelperTextItem>
                  </HelperText>
                </FormHelperText>
              )}
            </div>
          </FormGroup>
        </Form>

      {/* Footer with prominent divider */}
      <div style={{ 
        borderTop: '2px solid #d2d2d2', 
        marginTop: '24px', 
        paddingTop: '24px',
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'flex-end' 
      }}>
        <Button
          variant="primary"
          onClick={handleConfirm}
          isDisabled={isLoading}
          isLoading={isLoading}
          spinnerAriaValueText="Migrating image..."
        >
          {isLoading ? 'Migrating...' : 'Migrate Image'}
        </Button>
        <Button variant="link" onClick={handleCancel} isDisabled={isLoading}>
          Close
        </Button>
      </div>
      </div>
    </Modal>
  );
};

export { ImageMigrationModal };
export type { ImageInfo, MigrationData }; 