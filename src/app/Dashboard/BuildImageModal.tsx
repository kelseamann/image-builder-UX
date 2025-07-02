import React, { useState } from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Form,
  FormGroup,
  TextInput,
  Radio,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  ClipboardCopy,
  Alert,
  Popover,
  PopoverPosition,
  Checkbox,
  LabelGroup,
  Label,
  TextArea,
  Tabs,
  Tab,
  TabTitleText,
  Title,
  Split,
  SplitItem,
  Divider,
  Card,
  CardBody,
  Gallery,
  DatePicker,
  FileUpload,
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  Pagination,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Badge,
  Tooltip,
  Switch
} from '@patternfly/react-core';
import { 
  InfoCircleIcon, 
  ExternalLinkAltIcon, 
  CheckIcon, 
  TimesIcon, 
  MinusIcon,
  EditIcon,
  PlusIcon,
  TimesCircleIcon,
  ArrowRightIcon
} from '@patternfly/react-icons';

interface UserRow {
  id: string;
  isAdministrator: boolean;
  username: string;
  password: string;
  sshKey: string;
  groups: string[];
  isEditing: boolean;
}

interface BuildImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const BuildImageModal: React.FunctionComponent<BuildImageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [registrationMethod, setRegistrationMethod] = React.useState<string>('auto');
  const [selectedActivationKey, setSelectedActivationKey] = React.useState<string>('my-default-key');
  const [isActivationKeyOpen, setIsActivationKeyOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  // Base image form state
  const [imageName, setImageName] = React.useState<string>('');
  const [imageDetails, setImageDetails] = React.useState<string>('');
  const [baseImageRelease, setBaseImageRelease] = React.useState<string>('Red Hat Enterprise Linux 9');
  const [isBaseImageReleaseOpen, setIsBaseImageReleaseOpen] = React.useState<boolean>(false);
  const [baseImageArchitecture, setBaseImageArchitecture] = React.useState<string>('x86_64');
  const [isBaseImageArchitectureOpen, setIsBaseImageArchitectureOpen] = React.useState<boolean>(false);
  
  // Image output form state
  const [outputRelease, setOutputRelease] = React.useState<string>('');
  const [isOutputReleaseOpen, setIsOutputReleaseOpen] = React.useState<boolean>(false);

  // Users state
  const [users, setUsers] = React.useState<UserRow[]>([
    {
      id: '1',
      isAdministrator: true,
      username: 'admin',
      password: '',
      sshKey: '',
      groups: ['wheel'],
      isEditing: false
    }
  ]);

  // Additional form states for Advanced Settings
  const [timezone, setTimezone] = React.useState<string>('');
  const [isTimezoneOpen, setIsTimezoneOpen] = React.useState<boolean>(false);
  const [ntpServers, setNtpServers] = React.useState<string>('');
  const [languages, setLanguages] = React.useState<string[]>(['English/United States/utf-8']);
  const [suggestedKeyboard, setSuggestedKeyboard] = React.useState<string>('US QWERTY');
  const [isSuggestedKeyboardOpen, setIsSuggestedKeyboardOpen] = React.useState<boolean>(false);
  const [specialtyKeyboards, setSpecialtyKeyboards] = React.useState<string[]>([]);
  const [hostname, setHostname] = React.useState<string>('');
  const [kernelPackage, setKernelPackage] = React.useState<string>('kernel');
  const [isKernelPackageOpen, setIsKernelPackageOpen] = React.useState<boolean>(false);
  const [kernelArguments, setKernelArguments] = React.useState<string[]>([]);

  // Public cloud state
  const [selectedCloudProvider, setSelectedCloudProvider] = React.useState<string>('');
  
  // View mode state
  const [viewMode, setViewMode] = React.useState<'gui' | 'code'>('gui');
  
  // AWS integration state
  const [selectedIntegration, setSelectedIntegration] = React.useState<string>('');
  const [isIntegrationOpen, setIsIntegrationOpen] = React.useState<boolean>(false);
  const [awsAccountId, setAwsAccountId] = React.useState<string>('');
  const [awsDefaultRegion, setAwsDefaultRegion] = React.useState<string>('us-east-1');
  const [isAwsRegionOpen, setIsAwsRegionOpen] = React.useState<boolean>(false);
  
  // GCP integration state
  const [gcpAccountType, setGcpAccountType] = React.useState<string>('Google account');
  const [isGcpAccountTypeOpen, setIsGcpAccountTypeOpen] = React.useState<boolean>(false);
  const [gcpEmailOrDomain, setGcpEmailOrDomain] = React.useState<string>('');
  const [gcpImageSharing, setGcpImageSharing] = React.useState<string>('google-account');
  
  // Azure integration state
  const [azureHypervGeneration, setAzureHypervGeneration] = React.useState<string>('Generation 2 (BIOS)');
  const [isAzureHypervGenerationOpen, setIsAzureHypervGenerationOpen] = React.useState<boolean>(false);
  const [azureIntegration, setAzureIntegration] = React.useState<string>('');
  const [isAzureIntegrationOpen, setIsAzureIntegrationOpen] = React.useState<boolean>(false);
  const [azureId, setAzureId] = React.useState<string>('');
  const [isAzureAuthorized, setIsAzureAuthorized] = React.useState<boolean>(false);
  
  // Private cloud state
  const [isVMWareSelected, setIsVMWareSelected] = React.useState<boolean>(false);
  const [vmwareFormat, setVmwareFormat] = React.useState<string>('ova');
  
  // Other formats state
  const [otherFormat, setOtherFormat] = React.useState<string>('');
  
  // Repeatable build state
  const [snapshotDate, setSnapshotDate] = React.useState<string>('');
  
  // Kickstart file state
  const [kickstartFile, setKickstartFile] = React.useState<File | string>('');
  const [kickstartFilename, setKickstartFilename] = React.useState<string>('');
  const [isKickstartLoading, setIsKickstartLoading] = React.useState<boolean>(false);
  const [customKickstartCode, setCustomKickstartCode] = React.useState<string>('');


  // Compliance state
  const [complianceType, setComplianceType] = React.useState<string>('custom');
  const [customCompliancePolicy, setCustomCompliancePolicy] = React.useState<string>('');
  const [isCustomCompliancePolicyOpen, setIsCustomCompliancePolicyOpen] = React.useState<boolean>(false);
  const [openscapProfile, setOpenscapProfile] = React.useState<string>('');
  const [isOpenscapProfileOpen, setIsOpenscapProfileOpen] = React.useState<boolean>(false);

  // Extended support state
  const [extendedSupport, setExtendedSupport] = React.useState<string>('none');

  // Organization ID state
  const [organizationId, setOrganizationId] = React.useState<string>('11009103');

  // YAML editor state
  const [editableYaml, setEditableYaml] = React.useState<string>('');

  // Update editable YAML when switching to code view or when form data changes
  React.useEffect(() => {
    if (viewMode === 'code') {
      setEditableYaml(generateYAML());
    }
  }, [viewMode, imageName, imageDetails, baseImageRelease, baseImageArchitecture, selectedCloudProvider, registrationMethod, organizationId, selectedActivationKey, users]);

  // Selected packages state
  const [selectedPackages, setSelectedPackages] = React.useState<string[]>([]);
  const [packageSearchTerm, setPackageSearchTerm] = React.useState<string>('');
  const [packagePage, setPackagePage] = React.useState<number>(1);
  const [packagePerPage, setPackagePerPage] = React.useState<number>(10);
  const [isPackageAccordionExpanded, setIsPackageAccordionExpanded] = React.useState<boolean>(false);

  // Search packages state
  const [searchPackageType, setSearchPackageType] = React.useState<string>('individual');
  const [isSearchPackageTypeOpen, setIsSearchPackageTypeOpen] = React.useState<boolean>(false);
  const [selectedRepository, setSelectedRepository] = React.useState<string>('Red Hat');
  const [isRepositoryDropdownOpen, setIsRepositoryDropdownOpen] = React.useState<boolean>(false);
  const [advancedSearchTerm, setAdvancedSearchTerm] = React.useState<string>('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [selectedSearchResults, setSelectedSearchResults] = React.useState<string[]>([]);
  const [searchResultsPage, setSearchResultsPage] = React.useState<number>(1);
  const [searchResultsPerPage, setSearchResultsPerPage] = React.useState<number>(10);


  
  // Release options (same as in the table)
  const releaseOptions = [
    'Red Hat Enterprise Linux 10',
    'Red Hat Enterprise Linux 9', 
    'Red Hat Enterprise Linux 8'
  ];

  // Architecture options
  const architectureOptions = [
    'x86_64',
    'aarch64'
  ];

  const activationKeys = [
    'my-default-key',
    'production-key',
    'development-key',
    'staging-key'
  ];

  const integrationOptions = [
    'AWS Production Account',
    'AWS Development Account',
    'AWS Staging Account'
  ];

  const awsRegions = [
    'us-east-1',
    'us-east-2', 
    'us-west-1',
    'us-west-2',
    'eu-west-1',
    'eu-west-2',
    'eu-central-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1'
  ];

  const gcpAccountTypes = [
    'Google account',
    'Service account',
    'Google group',
    'Google Workspace domain or Cloud Identity domain'
  ];

  const azureIntegrationOptions = [
    'Azure Production Subscription',
    'Azure Development Subscription',
    'Azure Staging Subscription'
  ];

  const azureHypervGenerationOptions = [
    'Generation 1',
    'Generation 2 (BIOS)'
  ];

  const timezoneOptions = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo'
  ];

  const customCompliancePolicyOptions = [
    'DISA STIG for Red Hat Enterprise Linux 9',
    'CIS Red Hat Enterprise Linux 9 Benchmark',
    'NIST 800-53 Controls for Red Hat Enterprise Linux 9',
    'PCI-DSS v4.0.1 Control Baseline for Red Hat Enterprise Linux 9'
  ];

  const openscapProfileOptions = [
    'ANSSI-BP-028 (enhanced)',
    'ANSSI-BP-028 (high)',
    'ANSSI-BP-028 (intermediary)',
    'ANSSI-BP-028 (minimal)',
    'Australian Cyber Security Centre (ACSC) Essential Eight',
    'CIS Red Hat Enterprise Linux 9 Benchmark for Level 1 - Server',
    'CIS Red Hat Enterprise Linux 9 Benchmark for Level 2 - Server',
    'Criminal Justice Information Services (CJIS) Security Policy',
    'DISA STIG for Red Hat Enterprise Linux 9',
    'DISA STIG with GUI for Red Hat Enterprise Linux 9'
  ];

  // Package data
  const packageData = [
    { id: 'aide', name: 'aide', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'sudo', name: 'sudo', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'dnf-automatic', name: 'dnf-automatic', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'sssd', name: 'sssd', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'httpd', name: 'httpd', applicationStream: '2.4', retirementDate: '2030-12-31', packageRepository: 'AppStream' },
    { id: 'nginx', name: 'nginx', applicationStream: '1.20', retirementDate: '2030-06-30', packageRepository: 'AppStream' },
    { id: 'postgresql', name: 'postgresql', applicationStream: '13', retirementDate: '2030-11-13', packageRepository: 'AppStream' },
    { id: 'mariadb', name: 'mariadb', applicationStream: '10.5', retirementDate: '2030-06-24', packageRepository: 'AppStream' },
    { id: 'nodejs', name: 'nodejs', applicationStream: '18', retirementDate: '2030-04-30', packageRepository: 'AppStream' },
    { id: 'python3', name: 'python3', applicationStream: '3.9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'gcc', name: 'gcc', applicationStream: '11', retirementDate: '2032-05-31', packageRepository: 'AppStream' },
    { id: 'git', name: 'git', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'AppStream' },
    { id: 'vim', name: 'vim', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'curl', name: 'curl', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'wget', name: 'wget', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' }
  ];

  // Repository options
  const availableRepositories = [
    'Red Hat',
    'EPEL',
    'CentOS Stream',
    'Fedora',
    'RPM Fusion',
    'Custom Repository 1',
    'Custom Repository 2'
  ];

  // Search package types
  const searchPackageTypes = [
    'Individual packages',
    'Package groups'
  ];

  // Sample search results data
  const allSearchResults = [
    { id: 'search-zsh', name: 'zsh', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'search-bash', name: 'bash', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'search-fish', name: 'fish', applicationStream: '3.4', retirementDate: '2030-08-15', packageRepository: 'AppStream' },
    { id: 'search-tmux', name: 'tmux', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'search-screen', name: 'screen', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' },
    { id: 'search-htop', name: 'htop', applicationStream: '3.2', retirementDate: '2030-12-01', packageRepository: 'EPEL' },
    { id: 'search-ncdu', name: 'ncdu', applicationStream: '1.16', retirementDate: '2031-06-30', packageRepository: 'EPEL' },
    { id: 'search-tree', name: 'tree', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', packageRepository: 'BaseOS' }
  ];

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onConfirm) {
        onConfirm();
      }
      onClose();
    } catch (error) {
      console.error('Error building image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const onActivationKeySelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    setSelectedActivationKey(String(selection));
    setIsActivationKeyOpen(false);
  };

  const onOutputReleaseSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setOutputRelease(selection);
      setIsOutputReleaseOpen(false);
    }
  };

  const onBaseImageReleaseSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setBaseImageRelease(selection);
      setIsBaseImageReleaseOpen(false);
    }
  };

  const onBaseImageArchitectureSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setBaseImageArchitecture(selection);
      setIsBaseImageArchitectureOpen(false);
    }
  };

  const onCustomCompliancePolicySelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setCustomCompliancePolicy(selection);
      setIsCustomCompliancePolicyOpen(false);
    }
  };

  const onOpenscapProfileSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setOpenscapProfile(selection);
      setIsOpenscapProfileOpen(false);
    }
  };

  const onIntegrationSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setSelectedIntegration(selection);
      setIsIntegrationOpen(false);
      
      // Handle clearing integration
      if (selection === '') {
        setAwsAccountId('');
        return;
      }
      
      // Auto-fill AWS Account ID based on integration
      if (selection === 'AWS Production Account') {
        setAwsAccountId('123456789012');
      } else if (selection === 'AWS Development Account') {
        setAwsAccountId('234567890123');
      } else if (selection === 'AWS Staging Account') {
        setAwsAccountId('345678901234');
      }
    }
  };

  const onAwsRegionSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setAwsDefaultRegion(selection);
      setIsAwsRegionOpen(false);
    }
  };

  const onGcpAccountTypeSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setGcpAccountType(selection);
      setIsGcpAccountTypeOpen(false);
      // Clear the email/domain field when account type changes
      setGcpEmailOrDomain('');
    }
  };

  const onAzureIntegrationSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setAzureIntegration(selection);
      setIsAzureIntegrationOpen(false);
      // Simulate populating the Azure ID when an integration is selected
      if (selection === 'Azure Production Subscription') {
        setAzureId('12345678-1234-1234-1234-123456789abc');
      } else if (selection === 'Azure Development Subscription') {
        setAzureId('87654321-4321-4321-4321-cba987654321');
      } else if (selection === 'Azure Staging Subscription') {
        setAzureId('11111111-2222-3333-4444-555555555555');
      }
    }
  };

  const onAzureHypervGenerationSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setAzureHypervGeneration(selection);
      setIsAzureHypervGenerationOpen(false);
    }
  };

  const handleAzureAuthorize = () => {
    if (azureId.trim()) {
      setIsAzureAuthorized(true);
    }
  };

  // Package management functions
  const handlePackageSelection = (packageId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPackages([...selectedPackages, packageId]);
    } else {
      setSelectedPackages(selectedPackages.filter(id => id !== packageId));
    }
  };

  const handleSelectAllPackages = (isSelected: boolean) => {
    if (isSelected) {
      const filteredPackages = getFilteredPackages();
      const allPackageIds = filteredPackages.map(pkg => pkg.id);
      const uniquePackages = Array.from(new Set([...selectedPackages, ...allPackageIds]));
      setSelectedPackages(uniquePackages);
    } else {
      const filteredPackages = getFilteredPackages();
      const filteredPackageIds = filteredPackages.map(pkg => pkg.id);
      setSelectedPackages(selectedPackages.filter(id => !filteredPackageIds.includes(id)));
    }
  };

  const getFilteredPackages = () => {
    return packageData.filter(pkg => 
      pkg.name.toLowerCase().includes(packageSearchTerm.toLowerCase()) ||
      pkg.applicationStream.toLowerCase().includes(packageSearchTerm.toLowerCase()) ||
      pkg.retirementDate.toLowerCase().includes(packageSearchTerm.toLowerCase()) ||
      pkg.packageRepository.toLowerCase().includes(packageSearchTerm.toLowerCase())
    );
  };

  const getPaginatedPackages = () => {
    const filteredPackages = getFilteredPackages();
    const startIndex = (packagePage - 1) * packagePerPage;
    const endIndex = startIndex + packagePerPage;
    return filteredPackages.slice(startIndex, endIndex);
  };

  // Search packages functions
  const onSearchPackageTypeSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setSearchPackageType(selection === 'Individual packages' ? 'individual' : 'groups');
      setIsSearchPackageTypeOpen(false);
    }
  };

  const handleRepositorySelect = (repository: string) => {
    setSelectedRepository(repository);
    setIsRepositoryDropdownOpen(false);
  };

  const handleSearchPackages = () => {
    // Simulate search - filter results based on search term
    const filtered = allSearchResults.filter(pkg => 
      pkg.name.toLowerCase().includes(advancedSearchTerm.toLowerCase())
    );
    setSearchResults(filtered);
    setSearchResultsPage(1);
  };

  const handleSearchResultSelection = (packageId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedSearchResults([...selectedSearchResults, packageId]);
    } else {
      setSelectedSearchResults(selectedSearchResults.filter(id => id !== packageId));
    }
  };

  const handleSelectAllSearchResults = (isSelected: boolean) => {
    if (isSelected) {
      const filteredResults = getFilteredSearchResults();
      const allResultIds = filteredResults.map(pkg => pkg.id);
      const uniqueResults = Array.from(new Set([...selectedSearchResults, ...allResultIds]));
      setSelectedSearchResults(uniqueResults);
    } else {
      const filteredResults = getFilteredSearchResults();
      const filteredResultIds = filteredResults.map(pkg => pkg.id);
      setSelectedSearchResults(selectedSearchResults.filter(id => !filteredResultIds.includes(id)));
    }
  };

  const getFilteredSearchResults = () => {
    return searchResults;
  };

  const getPaginatedSearchResults = () => {
    const filteredResults = getFilteredSearchResults();
    const startIndex = (searchResultsPage - 1) * searchResultsPerPage;
    const endIndex = startIndex + searchResultsPerPage;
    return filteredResults.slice(startIndex, endIndex);
  };

  const getFilteredRepositories = () => {
    return availableRepositories;
  };

  const handleTabClick = (event: React.MouseEvent | React.KeyboardEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const handleNext = () => {
    if (typeof activeTabKey === 'number' && activeTabKey < 4) {
      setActiveTabKey(activeTabKey + 1);
    }
  };

  const handleBack = () => {
    if (typeof activeTabKey === 'number' && activeTabKey > 0) {
      setActiveTabKey(activeTabKey - 1);
    }
  };

  const isFirstTab = activeTabKey === 0;
  const isLastTab = activeTabKey === 3;

  const renderChangeableContent = () => {
    switch (registrationMethod) {
      case 'auto':
        return (
          <div>
            <FormGroup
              label="Activation key"
              fieldId="activation-key"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Select
                  id="activation-key-select"
                  isOpen={isActivationKeyOpen}
                  selected={selectedActivationKey}
                  onSelect={onActivationKeySelect}
                  onOpenChange={(isOpen) => setIsActivationKeyOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle 
                      ref={toggleRef} 
                      onClick={() => setIsActivationKeyOpen(!isActivationKeyOpen)}
                      isExpanded={isActivationKeyOpen}
                      style={{ width: '300px' }}
                    >
                      {selectedActivationKey}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {activationKeys.map((key) => (
                      <SelectOption key={key} value={key}>
                        {key}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
                
                <Popover
                  aria-label="Activation key details"
                  position={PopoverPosition.right}
                  bodyContent={
                    <div>
                      <div style={{ marginBottom: '0.5rem' }}><strong>Key:</strong> {selectedActivationKey}</div>
                      <div style={{ marginBottom: '0.5rem' }}><strong>Environment:</strong> Production</div>
                      <div style={{ marginBottom: '0.5rem' }}><strong>Usage:</strong> 45/100 systems</div>
                      <div style={{ marginBottom: '0.5rem' }}><strong>Auto-attach:</strong> Enabled</div>
                      <div><strong>Content view:</strong> RHEL-8-CV</div>
                    </div>
                  }
                >
                  <Button variant="plain" style={{ padding: '0.25rem' }}>
                    View details
                  </Button>
                </Popover>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                <a href="#" style={{ color: '#0066cc', textDecoration: 'none' }}>
                  <ExternalLinkAltIcon style={{ marginRight: '0.25rem', fontSize: '0.75rem' }} />
                  Manage Activation keys
                </a>
              </div>
            </FormGroup>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#d2d2d2', margin: '2rem 0' }} />

            {/* Timezone Section */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#151515' }}>
                Timezone
              </h4>
              
              <FormGroup
                label="Timezone"
                fieldId="timezone"
              >
                <Select
                  id="timezone-select"
                  isOpen={isTimezoneOpen}
                  selected={timezone}
                  onSelect={(_, selection) => {
                    setTimezone(String(selection));
                    setIsTimezoneOpen(false);
                  }}
                  onOpenChange={(isOpen) => setIsTimezoneOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle 
                      ref={toggleRef} 
                      onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
                      isExpanded={isTimezoneOpen}
                      style={{ width: '300px' }}
                    >
                      {timezone || 'Select timezone'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {timezoneOptions.map((tz) => (
                      <SelectOption key={tz} value={tz}>
                        {tz}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </FormGroup>

              <FormGroup
                label="NTP servers"
                fieldId="ntp-servers"
              >
                <TextInput
                  id="ntp-servers"
                  value={ntpServers}
                  onChange={(_event, value) => setNtpServers(value)}
                  placeholder="pool.ntp.org"
                />
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                  Comma-separated list of NTP servers
                </div>
              </FormGroup>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#d2d2d2', margin: '2rem 0' }} />

            {/* Locale Section */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#151515' }}>
                Locale
              </h4>
              
              <FormGroup
                label="Languages"
                fieldId="languages"
              >
                <LabelGroup>
                  {languages.map((lang, index) => (
                    <Label key={index} onClose={() => {
                      setLanguages(languages.filter((_, i) => i !== index));
                    }}>
                      {lang}
                    </Label>
                  ))}
                </LabelGroup>
                <Button
                  variant="link"
                  icon={<PlusIcon />}
                  style={{ marginTop: '0.5rem', padding: 0 }}
                >
                  Add language
                </Button>
              </FormGroup>

              <FormGroup
                label="Suggested keyboards"
                fieldId="suggested-keyboards"
              >
                <Select
                  id="suggested-keyboards-select"
                  isOpen={isSuggestedKeyboardOpen}
                  selected={suggestedKeyboard}
                  onSelect={(_, selection) => {
                    setSuggestedKeyboard(String(selection));
                    setIsSuggestedKeyboardOpen(false);
                  }}
                  onOpenChange={(isOpen) => setIsSuggestedKeyboardOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle 
                      ref={toggleRef} 
                      onClick={() => setIsSuggestedKeyboardOpen(!isSuggestedKeyboardOpen)}
                      isExpanded={isSuggestedKeyboardOpen}
                      style={{ width: '300px' }}
                    >
                      {suggestedKeyboard}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="US QWERTY">US QWERTY</SelectOption>
                    <SelectOption value="German QWERTZ">German QWERTZ</SelectOption>
                    <SelectOption value="French AZERTY">French AZERTY</SelectOption>
                    <SelectOption value="UK QWERTY">UK QWERTY</SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#d2d2d2', margin: '2rem 0' }} />

            {/* Hostname Section */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#151515' }}>
                Hostname
              </h4>
              
              <FormGroup
                label="Hostname"
                fieldId="hostname"
              >
                <TextInput
                  id="hostname"
                  value={hostname}
                  onChange={(_event, value) => setHostname(value)}
                  placeholder="Enter hostname"
                />
              </FormGroup>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#d2d2d2', margin: '2rem 0' }} />

            {/* Kernel Section */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#151515' }}>
                Kernel
              </h4>
              
              <FormGroup
                label="Kernel package"
                fieldId="kernel-package"
              >
                <Select
                  id="kernel-package-select"
                  isOpen={isKernelPackageOpen}
                  selected={kernelPackage}
                  onSelect={(_, selection) => {
                    setKernelPackage(String(selection));
                    setIsKernelPackageOpen(false);
                  }}
                  onOpenChange={(isOpen) => setIsKernelPackageOpen(isOpen)}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle 
                      ref={toggleRef} 
                      onClick={() => setIsKernelPackageOpen(!isKernelPackageOpen)}
                      isExpanded={isKernelPackageOpen}
                      style={{ width: '300px' }}
                    >
                      {kernelPackage}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    <SelectOption value="kernel">kernel</SelectOption>
                    <SelectOption value="kernel-debug">kernel-debug</SelectOption>
                  </SelectList>
                </Select>
              </FormGroup>

              <FormGroup
                label="Kernel arguments"
                fieldId="kernel-arguments"
              >
                <LabelGroup>
                  {kernelArguments.map((arg, index) => (
                    <Label key={index} onClose={() => {
                      setKernelArguments(kernelArguments.filter((_, i) => i !== index));
                    }}>
                      {arg}
                    </Label>
                  ))}
                </LabelGroup>
                <Button
                  variant="link"
                  icon={<PlusIcon />}
                  style={{ marginTop: '0.5rem', padding: 0 }}
                >
                  Add kernel argument
                </Button>
              </FormGroup>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#d2d2d2', margin: '2rem 0' }} />

            {/* Users Section */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#151515' }}>
                Users
              </h4>
              <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '1rem', color: '#666' }}>
                Create user accounts for systems that will use this image.
              </p>

              {/* User management table would go here - simplified for now */}
              <div style={{ border: '1px solid #d2d2d2', borderRadius: '4px', padding: '1rem' }}>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  User management interface - add users, set passwords, configure SSH keys, assign groups
                </p>
              </div>
            </div>
          </div>
        );
      case 'later':
        return (
          <Alert
            variant="info"
            isInline
            title="Register with Red Hat Insights within 30 days"
            style={{ marginTop: '1rem' }}
          >
            <p style={{ marginBottom: '0.5rem' }}>
              If you don't register your systems within 30 days, you will not be able to use Red Hat Insights capabilities.
            </p>
            <p>
              <a href="#" style={{ color: '#0066cc', textDecoration: 'none' }}>
                <ExternalLinkAltIcon style={{ marginRight: '0.25rem', fontSize: '0.75rem' }} />
                Learn more about registration
              </a>
            </p>
          </Alert>
        );
      case 'satellite':
        return (
          <Alert
            variant="warning"
            isInline
            title="Work in Progress"
            style={{ marginTop: '1rem' }}
          >
            Satellite registration is currently being developed and will be available in a future release.
          </Alert>
        );
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTabKey) {
      case 0:
        return (
          <div>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '1rem' }}>
              Base Image Selection
            </Title>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
              Choose the base operating system and version for your custom image.
            </p>
            
            <Form>
              {/* Image Details Section */}
              <div style={{ marginBottom: '2rem' }}>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                  Image details
                </Title>
                
                <FormGroup
                  label="Name"
                  fieldId="image-name"
                  isRequired
                >
                  <TextInput
                    id="image-name"
                    value={imageName}
                    onChange={(_event, value) => setImageName(value)}
                    placeholder="Enter image name"
                    isRequired
                  />
                </FormGroup>

                <FormGroup
                  label="Details"
                  fieldId="image-details"
                >
                  <TextInput
                    id="image-details"
                    value={imageDetails}
                    onChange={(_event, value) => setImageDetails(value)}
                    placeholder="Enter image details"
                  />
                </FormGroup>
              </div>
              
              {/* Divider between Image details and Image output */}
              <Divider style={{ margin: '32px 0 24px 0', borderColor: '#d2d2d2' }} />
              
              {/* Image Output Section */}
              <div style={{ marginBottom: '2rem' }}>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                  Image output
                </Title>
                
                <FormGroup
                  label="Release"
                  fieldId="base-image-release"
                  isRequired
                >
                  <Select
                    id="base-image-release-select"
                    isOpen={isBaseImageReleaseOpen}
                    selected={baseImageRelease}
                    onSelect={onBaseImageReleaseSelect}
                    onOpenChange={(isOpen) => setIsBaseImageReleaseOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsBaseImageReleaseOpen(!isBaseImageReleaseOpen)}
                        isExpanded={isBaseImageReleaseOpen}
                        style={{ width: '300px' }}
                      >
                        {baseImageRelease || 'Select a release'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {releaseOptions.map((release) => (
                        <SelectOption key={release} value={release}>
                          {release}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    The latest release is recommended and selected by default
                  </div>
                </FormGroup>

                <FormGroup
                  label="Architecture"
                  fieldId="base-image-architecture"
                  isRequired
                  style={{ marginTop: '1rem' }}
                >
                  <Select
                    id="base-image-architecture-select"
                    isOpen={isBaseImageArchitectureOpen}
                    selected={baseImageArchitecture}
                    onSelect={onBaseImageArchitectureSelect}
                    onOpenChange={(isOpen) => setIsBaseImageArchitectureOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsBaseImageArchitectureOpen(!isBaseImageArchitectureOpen)}
                        isExpanded={isBaseImageArchitectureOpen}
                        style={{ width: '300px' }}
                      >
                        {baseImageArchitecture || 'Select architecture'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      {architectureOptions.map((arch) => (
                        <SelectOption key={arch} value={arch}>
                          {arch}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                </FormGroup>

                <FormGroup
                  label="Public cloud"
                  fieldId="public-cloud"
                  style={{ marginTop: '1rem' }}
                >
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6a6e73', 
                    marginBottom: '1rem' 
                  }}>
                    Selecting a public cloud provider will prompt you to sign in to your account on the next step
                  </div>
                  <Gallery hasGutter minWidths={{ default: '200px' }}>
                    <Card
                      isClickable
                      isSelected={selectedCloudProvider === 'aws'}
                      onClick={() => setSelectedCloudProvider(selectedCloudProvider === 'aws' ? '' : 'aws')}
                      style={{ 
                        cursor: 'pointer',
                        border: selectedCloudProvider === 'aws' ? '2px solid #0066cc' : '1px solid #d2d2d2',
                        backgroundColor: selectedCloudProvider === 'aws' ? '#f0f8ff' : '#fff'
                      }}
                    >
                      <CardBody style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>☁️</div>
                        <div>Amazon Web Services</div>
                      </CardBody>
                    </Card>
                    
                    <Card
                      isClickable
                      isSelected={selectedCloudProvider === 'gcp'}
                      onClick={() => setSelectedCloudProvider(selectedCloudProvider === 'gcp' ? '' : 'gcp')}
                      style={{ 
                        cursor: 'pointer',
                        border: selectedCloudProvider === 'gcp' ? '2px solid #0066cc' : '1px solid #d2d2d2',
                        backgroundColor: selectedCloudProvider === 'gcp' ? '#f0f8ff' : '#fff'
                      }}
                    >
                      <CardBody style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>☁️</div>
                        <div>Google Cloud Platform</div>
                      </CardBody>
                    </Card>
                    
                    <Card
                      isClickable
                      isSelected={selectedCloudProvider === 'azure'}
                      onClick={() => setSelectedCloudProvider(selectedCloudProvider === 'azure' ? '' : 'azure')}
                      style={{ 
                        cursor: 'pointer',
                        border: selectedCloudProvider === 'azure' ? '2px solid #0066cc' : '1px solid #d2d2d2',
                        backgroundColor: selectedCloudProvider === 'azure' ? '#f0f8ff' : '#fff'
                      }}
                    >
                      <CardBody style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>☁️</div>
                        <div>Microsoft Azure</div>
                      </CardBody>
                    </Card>
                    
                    <Tooltip content="No sign-in required for Oracle Cloud Infrastructure">
                      <Card
                        isClickable
                        isSelected={selectedCloudProvider === 'oci'}
                        onClick={() => setSelectedCloudProvider(selectedCloudProvider === 'oci' ? '' : 'oci')}
                        style={{ 
                          cursor: 'pointer',
                          border: selectedCloudProvider === 'oci' ? '2px solid #0066cc' : '1px solid #d2d2d2',
                          backgroundColor: selectedCloudProvider === 'oci' ? '#f0f8ff' : '#fff'
                        }}
                      >
                        <CardBody style={{ textAlign: 'center', padding: '16px' }}>
                          <div style={{ fontSize: '24px', marginBottom: '8px' }}>☁️</div>
                          <div>Oracle Cloud Infrastructure</div>
                        </CardBody>
                      </Card>
                    </Tooltip>
                  </Gallery>
                </FormGroup>

                {/* AWS Integration Section */}
                {selectedCloudProvider === 'aws' && (
                  <div style={{ 
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    border: '1px solid #d2d2d2',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <FormGroup
                      label="Integrations"
                      fieldId="integrations"
                    >
                                                <Select
                            id="integrations-select"
                            isOpen={isIntegrationOpen}
                            selected={selectedIntegration}
                            onSelect={onIntegrationSelect}
                            onOpenChange={(isOpen) => setIsIntegrationOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setIsIntegrationOpen(!isIntegrationOpen)}
                                isExpanded={isIntegrationOpen}
                                style={{ width: '300px' }}
                              >
                                {selectedIntegration || 'Choose source'}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              {selectedIntegration && (
                                <SelectOption 
                                  key="clear-integration" 
                                  value=""
                                  style={{ 
                                    fontStyle: 'italic',
                                    color: '#6a6e73',
                                    borderBottom: '1px solid #d2d2d2',
                                    marginBottom: '4px',
                                    paddingBottom: '8px'
                                  }}
                                >
                                  Clear selection
                                </SelectOption>
                              )}
                              {integrationOptions.map((integration) => (
                                <SelectOption key={integration} value={integration}>
                                  {integration}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </Select>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6a6e73', 
                        marginTop: '8px',
                        lineHeight: '1.4'
                      }}>
                        Using an Integration will auto-fill your account information. If you can't add an integration, manually paste your account ID.
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <Button
                          variant="link"
                          isInline
                          icon={<ExternalLinkAltIcon />}
                          iconPosition="right"
                          style={{ padding: 0, fontSize: '14px' }}
                        >
                          Manage Insights Integrations
                        </Button>
                      </div>
                    </FormGroup>

                    {!selectedIntegration && (
                      <Alert
                        variant="info"
                        isInline
                        title="If you're not using an integration, you can still manually paste your account ID from AWS"
                        style={{ marginTop: '1rem', marginBottom: '1rem' }}
                      />
                    )}

                    <FormGroup
                      label="Account ID"
                      fieldId="aws-account-id"
                      style={{ marginTop: '1rem' }}
                    >
                      <TextInput
                        id="aws-account-id"
                        type="text"
                        value={awsAccountId}
                        onChange={(event, value) => setAwsAccountId(value)}
                        placeholder="XXXX-XXXX-XXXX"
                        style={{ width: '300px' }}
                      />
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6a6e73', 
                        marginTop: '8px',
                        lineHeight: '1.4'
                      }}>
                        Detected from Integrations or copy the 12 digit number in the upper-right dropdown next to your AWS username
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <Button
                          variant="link"
                          isInline
                          icon={<ExternalLinkAltIcon />}
                          iconPosition="right"
                          style={{ padding: 0, fontSize: '14px' }}
                        >
                          Sign into AWS
                        </Button>
                      </div>
                    </FormGroup>

                    <FormGroup
                      label="Default region"
                      fieldId="aws-default-region"
                      style={{ marginTop: '1rem' }}
                    >
                      <Select
                        id="aws-region-select"
                        isOpen={isAwsRegionOpen}
                        selected={awsDefaultRegion}
                        onSelect={onAwsRegionSelect}
                        onOpenChange={(isOpen) => setIsAwsRegionOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setIsAwsRegionOpen(!isAwsRegionOpen)}
                            isExpanded={isAwsRegionOpen}
                            style={{ width: '200px' }}
                          >
                            {awsDefaultRegion}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          {awsRegions.map((region) => (
                            <SelectOption key={region} value={region}>
                              {region}
                            </SelectOption>
                          ))}
                        </SelectList>
                      </Select>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6a6e73', 
                        marginTop: '8px',
                        lineHeight: '1.4'
                      }}>
                        Images are built in the default region but can be copied to other regions later.
                      </div>
                    </FormGroup>
                  </div>
                )}

                {/* GCP Integration Section */}
                {selectedCloudProvider === 'gcp' && (
                  <div style={{ 
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    border: '1px solid #d2d2d2',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <FormGroup
                      label="Account Credentials"
                      fieldId="gcp-credentials"
                    >
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <Select
                            id="gcp-account-type-select"
                            isOpen={isGcpAccountTypeOpen}
                            selected={gcpAccountType}
                            onSelect={onGcpAccountTypeSelect}
                            onOpenChange={(isOpen) => setIsGcpAccountTypeOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setIsGcpAccountTypeOpen(!isGcpAccountTypeOpen)}
                                isExpanded={isGcpAccountTypeOpen}
                                style={{ width: '300px' }}
                              >
                                {gcpAccountType}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              {gcpAccountTypes.map((accountType, index) => (
                                <SelectOption key={index} value={accountType}>
                                  {accountType}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </Select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <TextInput
                            id="gcp-email-domain"
                            value={gcpEmailOrDomain}
                            onChange={(event, value) => setGcpEmailOrDomain(value)}
                            placeholder={
                              gcpAccountType === 'Google Workspace domain or Cloud Identity domain' 
                                ? 'Domain' 
                                : 'Principal email address'
                            }
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6a6e73', 
                        marginTop: '8px',
                        lineHeight: '1.4'
                      }}>
                        The email or domain associated with your Google Cloud Platform account
                      </div>
                    </FormGroup>

                    <FormGroup
                      label="Select image sharing"
                      fieldId="gcp-image-sharing"
                      style={{ marginTop: '1.5rem' }}
                    >
                      <Radio
                        id="gcp-share-google-account"
                        name="gcp-image-sharing"
                        label="Share with a Google Account"
                        isChecked={gcpImageSharing === 'google-account'}
                        onChange={() => setGcpImageSharing('google-account')}
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <Radio
                        id="gcp-share-insights-only"
                        name="gcp-image-sharing"
                        label="Share with Red Hat Insights only"
                        isChecked={gcpImageSharing === 'insights-only'}
                        onChange={() => setGcpImageSharing('insights-only')}
                      />
                    </FormGroup>
                  </div>
                )}

                {/* Azure Integration Section */}
                {selectedCloudProvider === 'azure' && (
                  <div style={{ 
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    border: '1px solid #d2d2d2',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <FormGroup
                      label="HyperV Generation"
                      fieldId="azure-hyperv-generation"
                    >
                      <Select
                        id="azure-hyperv-generation-select"
                        isOpen={isAzureHypervGenerationOpen}
                        selected={azureHypervGeneration}
                        onSelect={onAzureHypervGenerationSelect}
                        onOpenChange={(isOpen) => setIsAzureHypervGenerationOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setIsAzureHypervGenerationOpen(!isAzureHypervGenerationOpen)}
                            isExpanded={isAzureHypervGenerationOpen}
                            style={{ width: '300px' }}
                          >
                            {azureHypervGeneration}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          {azureHypervGenerationOptions.map((generation) => (
                            <SelectOption key={generation} value={generation}>
                              {generation}
                            </SelectOption>
                          ))}
                        </SelectList>
                      </Select>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6a6e73', 
                        marginTop: '8px',
                        lineHeight: '1.4'
                      }}>
                        The latest generation is recommended and selected by default.
                      </div>
                    </FormGroup>

                    <FormGroup
                      label="Integrations"
                      fieldId="azure-integrations"
                      style={{ marginTop: '1rem' }}
                    >
                      <Select
                        id="azure-integrations-select"
                        isOpen={isAzureIntegrationOpen}
                        selected={azureIntegration}
                        onSelect={onAzureIntegrationSelect}
                        onOpenChange={(isOpen) => setIsAzureIntegrationOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setIsAzureIntegrationOpen(!isAzureIntegrationOpen)}
                            isExpanded={isAzureIntegrationOpen}
                            style={{ width: '300px' }}
                          >
                            {azureIntegration || 'Choose source'}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          {azureIntegration && (
                            <SelectOption 
                              key="clear-azure-integration" 
                              value=""
                              style={{ 
                                fontStyle: 'italic',
                                color: '#6a6e73',
                                borderBottom: '1px solid #d2d2d2',
                                marginBottom: '4px',
                                paddingBottom: '8px'
                              }}
                            >
                              Clear selection
                            </SelectOption>
                          )}
                          {azureIntegrationOptions.map((integration) => (
                            <SelectOption key={integration} value={integration}>
                              {integration}
                            </SelectOption>
                          ))}
                        </SelectList>
                      </Select>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6a6e73', 
                        marginTop: '8px',
                        lineHeight: '1.4'
                      }}>
                        Choosing a Source will populate the ID or you can enter it manually.
                      </div>
                    </FormGroup>

                    <FormGroup
                      label="Azure ID"
                      fieldId="azure-id"
                      style={{ marginTop: '1rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <TextInput
                          id="azure-id"
                          type="text"
                          value={azureId}
                          onChange={(event, value) => setAzureId(value)}
                          placeholder="GUID or Tenant ID"
                          style={{ width: '300px' }}
                        />
                        
                        <Popover
                          aria-label="Authorize Image Builder details"
                          position={PopoverPosition.right}
                          bodyContent={
                            <div>
                              Configures Image Builder as an authorized application for the provided Tenant ID
                            </div>
                          }
                        >
                          <Button 
                            variant="secondary"
                            onClick={handleAzureAuthorize}
                            isDisabled={!azureId.trim() || isAzureAuthorized}
                          >
                            {isAzureAuthorized ? (
                              <>
                                <CheckIcon style={{ marginRight: '8px', color: '#3e8635' }} />
                                Authorized
                              </>
                            ) : (
                              'Authorize Image Builder'
                            )}
                          </Button>
                        </Popover>
                      </div>
                      
                      {/* Validation criteria */}
                      <div style={{ 
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px'
                      }}>
                        {isAzureAuthorized ? (
                          <>
                            <CheckIcon style={{ color: '#3e8635', fontSize: '16px' }} />
                            <span style={{ color: '#3e8635' }}>Authorize ID with Image Builder</span>
                          </>
                        ) : (
                          <>
                            <TimesIcon style={{ color: '#c9190b', fontSize: '16px' }} />
                            <span style={{ color: '#c9190b' }}>Authorize ID with Image Builder</span>
                          </>
                        )}
                      </div>
                      
                      <div style={{ marginTop: '8px' }}>
                        <Button
                          variant="link"
                          isInline
                          icon={<ExternalLinkAltIcon />}
                          iconPosition="right"
                          style={{ padding: 0, fontSize: '14px' }}
                        >
                          Sign into the Azure Portal
                        </Button>
                      </div>
                    </FormGroup>
                  </div>
                )}

                <FormGroup
                  label="Private cloud"
                  fieldId="private-cloud"
                  style={{ marginTop: '2rem' }}
                >
                  <Checkbox
                    id="vmware-vsphere"
                    label="VMWare vSphere"
                    isChecked={isVMWareSelected}
                    onChange={() => setIsVMWareSelected(!isVMWareSelected)}
                    style={{ marginBottom: '1rem' }}
                  />
                  
                  {isVMWareSelected && (
                    <div style={{ marginLeft: '24px', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Radio
                          isChecked={vmwareFormat === 'ova'}
                          name="vmware-format"
                          onChange={() => setVmwareFormat('ova')}
                          label="Open virtualization format (.ova)"
                          id="vmware-ova"
                        />
                        <Radio
                          isChecked={vmwareFormat === 'vmdk'}
                          name="vmware-format"
                          onChange={() => setVmwareFormat('vmdk')}
                          label="Virtual disk (.vmdk)"
                          id="vmware-vmdk"
                        />
                      </div>
                    </div>
                  )}
                </FormGroup>

                <FormGroup
                  label="Other"
                  fieldId="other-formats"
                  style={{ marginTop: '2rem' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Radio
                      isChecked={otherFormat === 'qcow2'}
                      name="other-format"
                      onChange={() => setOtherFormat('qcow2')}
                      label="Virtualization - Guest image (.qcow2)"
                      id="other-qcow2"
                    />
                    <Radio
                      isChecked={otherFormat === 'iso'}
                      name="other-format"
                      onChange={() => setOtherFormat('iso')}
                      label="Baremetal - Installer (.iso)"
                      id="other-iso"
                    />
                    <Radio
                      isChecked={otherFormat === 'tar.gz'}
                      name="other-format"
                      onChange={() => setOtherFormat('tar.gz')}
                      label="WSL - Windows Subsystem for Linux (.tar.gz)"
                      id="other-wsl"
                    />
                  </div>
                </FormGroup>

                {/* Divider before Enable repeatable build */}
                <Divider style={{ margin: '32px 0 24px 0', borderColor: '#d2d2d2' }} />
                
                {/* Enable repeatable build Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                    Enable repeatable build
                  </Title>
                  <FormGroup
                    label="Select snapshot date"
                    fieldId="snapshot-date"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <DatePicker
                        value={snapshotDate}
                        onChange={(event, value, date) => {
                          setSnapshotDate(value);
                        }}
                        placeholder="MM/DD/YYYY"
                        style={{ width: '200px' }}
                      />
                      <Button
                        variant="secondary"
                        onClick={() => setSnapshotDate('')}
                        isDisabled={!snapshotDate}
                      >
                        Clear date
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const today = new Date();
                          const formattedToday = today.toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric'
                          });
                          setSnapshotDate(formattedToday);
                        }}
                      >
                        Today's date
                      </Button>
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#6a6e73', 
                      marginTop: '8px',
                      lineHeight: '1.4'
                    }}>
                      Image Builder will reflect the state of repositories based on the selected date when building this image.
                    </div>
                  </FormGroup>
                </div>

                {/* Divider before Kickstart File */}
                <Divider style={{ margin: '32px 0 24px 0', borderColor: '#d2d2d2' }} />
                
                {/* Kickstart File Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                    Kickstart File
                  </Title>
                  <FormGroup fieldId="kickstart-file">
                    <FileUpload
                      id="kickstart-file-upload"
                      value={kickstartFile}
                      filename={kickstartFilename}
                      onFileInputChange={(event, file) => {
                        setKickstartFile(file || '');
                        setKickstartFilename(file instanceof File ? file.name : '');
                      }}
                      onClearClick={() => {
                        setKickstartFile('');
                        setKickstartFilename('');
                      }}
                      isLoading={isKickstartLoading}
                      browseButtonText="Upload"
                      clearButtonText="Clear"
                    />
                    <TextArea
                      id="custom-kickstart-code"
                      value={customKickstartCode}
                      onChange={(event, value) => setCustomKickstartCode(value)}
                      placeholder="Enter custom kickstart code here..."
                      rows={8}
                      style={{ 
                        fontFamily: 'monospace',
                        marginTop: '12px',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#6a6e73', 
                      marginTop: '8px',
                      lineHeight: '1.4'
                    }}>
                      Upload a CSV file or enter custom kickstart code.
                    </div>
                  </FormGroup>
                </div>

                {/* Divider before Compliance */}
                <Divider style={{ margin: '32px 0 24px 0', borderColor: '#d2d2d2' }} />
                
                {/* Compliance Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                    Compliance
                  </Title>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6a6e73', 
                    marginBottom: '1.5rem',
                    lineHeight: '1.4'
                  }}>
                    Below you can select which Insights compliance policy or OpenSCAP profile your image will be compliant to. Insights can automatically help monitor the adherence of your registered RHEL systems to a selected policy or profile.
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Custom Compliance Policy */}
                    <div>
                      <Radio
                        isChecked={complianceType === 'custom'}
                        name="compliance-type"
                        onChange={() => setComplianceType('custom')}
                        label="Use a custom Compliance policy"
                        id="compliance-custom"
                        style={{ marginBottom: '0.5rem' }}
                      />
                                            <div style={{ 
                        fontSize: '14px', 
                        color: '#6a6e73', 
                        marginLeft: '24px',
                        marginBottom: '0.5rem'
                      }}>
                        <a 
                          href="#" 
                          style={{ 
                            color: '#0066cc', 
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          Manage with Insights Compliance
                          <ExternalLinkAltIcon size={16} />
                        </a>
                      </div>
                      
                      {complianceType === 'custom' && (
                        <div style={{ marginLeft: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Select
                            id="custom-compliance-policy-select"
                            isOpen={isCustomCompliancePolicyOpen}
                            selected={customCompliancePolicy}
                            onSelect={onCustomCompliancePolicySelect}
                            onOpenChange={(isOpen) => setIsCustomCompliancePolicyOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setIsCustomCompliancePolicyOpen(!isCustomCompliancePolicyOpen)}
                                isExpanded={isCustomCompliancePolicyOpen}
                                style={{ width: '400px' }}
                              >
                                {customCompliancePolicy || 'Select a compliance policy'}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              {customCompliancePolicyOptions.map((policy) => (
                                <SelectOption key={policy} value={policy}>
                                  {policy}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </Select>
                          
                          {customCompliancePolicy && (
                            <Popover
                              aria-label="Compliance policy details"
                              headerContent={<div>Selected Compliance policy</div>}
                              bodyContent={
                                <div>
                                  <div style={{ marginBottom: '12px' }}>
                                    <strong>Policy type:</strong> {customCompliancePolicy}
                                  </div>
                                  <div style={{ marginBottom: '12px' }}>
                                    <strong>Policy description:</strong> This compliance policy provides security guidelines and configurations to help ensure your system meets regulatory requirements.
                                  </div>
                                  <div style={{ marginBottom: '12px' }}>
                                    <strong>Compliance threshold (usually 100%):</strong> 100%
                                  </div>
                                  <div style={{ marginBottom: '12px' }}>
                                    <strong>Business objective:</strong> Maintain security compliance and regulatory adherence
                                  </div>
                                  <div>
                                    <strong>Last Updated:</strong> December 2024
                                  </div>
                                </div>
                              }
                            >
                              <Button variant="secondary" icon={<InfoCircleIcon />}>
                                View details
                              </Button>
                            </Popover>
                          )}
                        </div>
                      )}
                    </div>

                    {/* OpenSCAP Profile */}
                    <div>
                      <Radio
                        isChecked={complianceType === 'openscap'}
                        name="compliance-type"
                        onChange={() => setComplianceType('openscap')}
                        label="Use a default OpenSCAP profile"
                        id="compliance-openscap"
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6a6e73', 
                        marginLeft: '24px',
                        marginBottom: '0.5rem'
                      }}>
                        <a 
                          href="#" 
                          style={{ 
                            color: '#0066cc', 
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                                                 >
                           Learn more in OpenSCAP
                           <ExternalLinkAltIcon size={16} />
                         </a>
                      </div>
                      
                      {complianceType === 'openscap' && (
                        <div style={{ marginLeft: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Select
                            id="openscap-profile-select"
                            isOpen={isOpenscapProfileOpen}
                            selected={openscapProfile}
                            onSelect={onOpenscapProfileSelect}
                            onOpenChange={(isOpen) => setIsOpenscapProfileOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle 
                                ref={toggleRef} 
                                onClick={() => setIsOpenscapProfileOpen(!isOpenscapProfileOpen)}
                                isExpanded={isOpenscapProfileOpen}
                                style={{ width: '400px' }}
                              >
                                {openscapProfile || 'Select an OpenSCAP profile'}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              {openscapProfileOptions.map((profile) => (
                                <SelectOption key={profile} value={profile}>
                                  {profile}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </Select>
                          
                          {openscapProfile && (
                            <Popover
                              aria-label="OpenSCAP profile details"
                              headerContent={<div>Selected Compliance policy</div>}
                              bodyContent={
                                <div>
                                  <div style={{ marginBottom: '12px' }}>
                                    <strong>Policy type:</strong> {openscapProfile}
                                  </div>
                                  <div style={{ marginBottom: '12px' }}>
                                    <strong>Policy description:</strong> This OpenSCAP profile provides automated security compliance scanning and remediation capabilities.
                                  </div>
                                  <div style={{ marginBottom: '12px' }}>
                                    <strong>Compliance threshold (usually 100%):</strong> 100%
                                  </div>
                                  <div style={{ marginBottom: '12px' }}>
                                    <strong>Business objective:</strong> Maintain security compliance and regulatory adherence
                                  </div>
                                  <div>
                                    <strong>Last Updated:</strong> December 2024
                                  </div>
                                </div>
                              }
                            >
                              <Button variant="secondary" icon={<InfoCircleIcon />}>
                                View details
                              </Button>
                            </Popover>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        );
      case 1:
        return (
          <div>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '1rem' }}>
              Repositories and Packages
            </Title>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
              Configure package repositories and select additional software packages to include in your image.
            </p>
            
            <Form>
              {/* Use Extended Support Section */}
              <div style={{ marginBottom: '32px' }}>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                  Use Extended Support
                </Title>
                
                <FormGroup
                  label="Extended support subscription"
                  fieldId="extended-support"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Radio
                      isChecked={extendedSupport === 'none'}
                      name="extended-support"
                      onChange={() => setExtendedSupport('none')}
                      label="None"
                      id="extended-support-none"
                    />
                    <Radio
                      isChecked={extendedSupport === 'eus'}
                      name="extended-support"
                      onChange={() => setExtendedSupport('eus')}
                      label="Extended update support (EUS)"
                      id="extended-support-eus"
                    />
                    <Radio
                      isChecked={extendedSupport === 'eeus'}
                      name="extended-support"
                      onChange={() => setExtendedSupport('eeus')}
                      label="Enhanced extended update support (EEUS)"
                      id="extended-support-eeus"
                    />
                  </div>
                </FormGroup>
              </div>

              {/* Divider between sections */}
              <Divider style={{ margin: '32px 0 24px 0', borderColor: '#d2d2d2' }} />

              {/* Selected Packages Accordion */}
              <div style={{ marginBottom: '32px' }}>
                <Accordion 
                  asDefinitionList={false}
                  togglePosition="start"
                >
                  <AccordionItem>
                    <AccordionToggle
                      onClick={() => setIsPackageAccordionExpanded(!isPackageAccordionExpanded)}
                      id="packages-accordion-toggle"
                    >
                      <h4 style={{ 
                        fontSize: '1rem', 
                        fontWeight: 600,
                        color: '#151515',
                        margin: 0
                      }}>
                        Selected packages
                      </h4>
                    </AccordionToggle>
                    <AccordionContent id="packages-accordion-content" hidden={!isPackageAccordionExpanded}>
                      <div style={{ padding: '16px 0' }}>
                        {/* Toolbar with search */}
                        <Toolbar id="packages-toolbar" style={{ marginBottom: '16px' }}>
                          <ToolbarContent>
                            <ToolbarItem>
                              <SearchInput
                                placeholder="Search packages..."
                                value={packageSearchTerm}
                                onChange={(_event, value) => {
                                  setPackageSearchTerm(value);
                                  setPackagePage(1); // Reset to first page when searching
                                }}
                                onClear={() => {
                                  setPackageSearchTerm('');
                                  setPackagePage(1);
                                }}
                                style={{ width: '300px' }}
                              />
                            </ToolbarItem>
                          </ToolbarContent>
                        </Toolbar>

                        {/* Compact Table */}
                        <div style={{ 
                          border: '1px solid #d2d2d2',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse',
                            fontSize: '0.875rem'
                          }}>
                            <thead style={{ backgroundColor: '#f5f5f5' }}>
                              <tr>
                                <th style={{ 
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  borderBottom: '1px solid #d2d2d2',
                                  fontWeight: 600,
                                  width: '40px'
                                }}>
                                  <Checkbox
                                    id="select-all-packages"
                                    isChecked={
                                      getFilteredPackages().length > 0 &&
                                      getFilteredPackages().every(pkg => selectedPackages.includes(pkg.id))
                                    }
                                    onChange={(_event, checked) => handleSelectAllPackages(checked)}
                                  />
                                </th>
                                <th style={{ 
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  borderBottom: '1px solid #d2d2d2',
                                  fontWeight: 600
                                }}>
                                  Name
                                </th>
                                <th style={{ 
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  borderBottom: '1px solid #d2d2d2',
                                  fontWeight: 600
                                }}>
                                  Application Stream
                                </th>
                                <th style={{ 
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  borderBottom: '1px solid #d2d2d2',
                                  fontWeight: 600
                                }}>
                                  Retirement date
                                </th>
                                <th style={{ 
                                  padding: '8px 12px',
                                  textAlign: 'left',
                                  borderBottom: '1px solid #d2d2d2',
                                  fontWeight: 600
                                }}>
                                  Package repository
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getPaginatedPackages().map((pkg, index) => (
                                <tr key={pkg.id} style={{ 
                                  borderBottom: index < getPaginatedPackages().length - 1 ? '1px solid #f0f0f0' : 'none'
                                }}>
                                  <td style={{ padding: '8px 12px' }}>
                                    <Checkbox
                                      id={`package-${pkg.id}`}
                                      isChecked={selectedPackages.includes(pkg.id)}
                                      onChange={(_event, checked) => handlePackageSelection(pkg.id, checked)}
                                    />
                                  </td>
                                  <td style={{ 
                                    padding: '8px 12px',
                                    fontWeight: 500
                                  }}>
                                    {pkg.name}
                                  </td>
                                  <td style={{ padding: '8px 12px' }}>
                                    {pkg.applicationStream}
                                  </td>
                                  <td style={{ padding: '8px 12px' }}>
                                    {pkg.retirementDate}
                                  </td>
                                  <td style={{ padding: '8px 12px' }}>
                                    {pkg.packageRepository}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                          <Pagination
                            itemCount={getFilteredPackages().length}
                            perPage={packagePerPage}
                            page={packagePage}
                            onSetPage={(_event, pageNumber) => setPackagePage(pageNumber)}
                            onPerPageSelect={(_event, perPage) => {
                              setPackagePerPage(perPage);
                              setPackagePage(1);
                            }}
                            variant="bottom"
                            isCompact
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Divider between sections */}
              <Divider style={{ margin: '20px 0 16px 0', borderColor: '#d2d2d2' }} />

              {/* Search Packages Section */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  marginBottom: '12px',
                  color: '#151515'
                }}>
                  Search packages
                </h4>

                {/* Search Form */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    {/* Types Dropdown */}
                    <div style={{ flex: '0 0 200px' }}>
                      <FormGroup
                        label="Types"
                        fieldId="search-package-types"
                        isRequired
                      >
                        <Select
                          id="search-package-types-select"
                          isOpen={isSearchPackageTypeOpen}
                          selected={searchPackageType === 'individual' ? 'Individual packages' : 'Package groups'}
                          onSelect={onSearchPackageTypeSelect}
                          onOpenChange={(isOpen) => setIsSearchPackageTypeOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle 
                              ref={toggleRef} 
                              onClick={() => setIsSearchPackageTypeOpen(!isSearchPackageTypeOpen)}
                              isExpanded={isSearchPackageTypeOpen}
                              style={{ width: '100%' }}
                            >
                              {searchPackageType === 'individual' ? 'Individual packages' : 'Package groups'}
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            {searchPackageTypes.map((type) => (
                              <SelectOption key={type} value={type}>
                                {type}
                              </SelectOption>
                            ))}
                          </SelectList>
                        </Select>
                      </FormGroup>
                    </div>

                    {/* Repositories Section */}
                    <div style={{ flex: '0 0 180px' }}>
                      <FormGroup
                        label="Repositories"
                        fieldId="repositories"
                        isRequired
                      >
                        <Select
                          id="repositories-select"
                          isOpen={isRepositoryDropdownOpen}
                          selected={selectedRepository}
                          onSelect={(_event, selection) => {
                            if (typeof selection === 'string') {
                              handleRepositorySelect(selection);
                            }
                          }}
                          onOpenChange={(isOpen) => setIsRepositoryDropdownOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle 
                              ref={toggleRef} 
                              onClick={() => setIsRepositoryDropdownOpen(!isRepositoryDropdownOpen)}
                              isExpanded={isRepositoryDropdownOpen}
                              style={{ width: '100%' }}
                            >
                              {selectedRepository}
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            {getFilteredRepositories().map((repo) => (
                              <SelectOption key={repo} value={repo}>
                                {repo}
                              </SelectOption>
                            ))}
                          </SelectList>
                        </Select>
                      </FormGroup>
                    </div>

                    {/* Advanced Search */}
                    <div style={{ flex: 1 }}>
                      <FormGroup
                        label="Search"
                        fieldId="advanced-search"
                        isRequired
                      >
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <TextInput
                            id="advanced-search-input"
                            value={advancedSearchTerm}
                            onChange={(_event, value) => setAdvancedSearchTerm(value)}
                            placeholder="Search for packages by name"
                            style={{ flex: 1 }}
                            onKeyPress={(event) => {
                              if (event.key === 'Enter') {
                                handleSearchPackages();
                              }
                            }}
                          />
                          <Button
                            variant="control"
                            onClick={handleSearchPackages}
                            icon={<ArrowRightIcon />}
                            aria-label="Search packages"
                            isDisabled={!advancedSearchTerm.trim()}
                          />
                        </div>
                      </FormGroup>
                    </div>
                  </div>
                </div>

                {/* Search Results Table */}
                {searchResults.length > 0 && (
                  <div>
                    <h5 style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      marginBottom: '8px',
                      color: '#151515'
                    }}>
                      Search Results ({searchResults.length} packages)
                    </h5>
                    
                    <div style={{ 
                      border: '1px solid #d2d2d2',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        fontSize: '0.875rem'
                      }}>
                        <thead style={{ backgroundColor: '#f5f5f5' }}>
                          <tr>
                            <th style={{ 
                              padding: '8px 12px',
                              textAlign: 'left',
                              borderBottom: '1px solid #d2d2d2',
                              fontWeight: 600,
                              width: '40px'
                            }}>
                              <Checkbox
                                id="select-all-search-results"
                                isChecked={
                                  getFilteredSearchResults().length > 0 &&
                                  getFilteredSearchResults().every(pkg => selectedSearchResults.includes(pkg.id))
                                }
                                onChange={(_event, checked) => handleSelectAllSearchResults(checked)}
                              />
                            </th>
                            <th style={{ 
                              padding: '8px 12px',
                              textAlign: 'left',
                              borderBottom: '1px solid #d2d2d2',
                              fontWeight: 600
                            }}>
                              Name
                            </th>
                            <th style={{ 
                              padding: '8px 12px',
                              textAlign: 'left',
                              borderBottom: '1px solid #d2d2d2',
                              fontWeight: 600
                            }}>
                              Application Stream
                            </th>
                            <th style={{ 
                              padding: '8px 12px',
                              textAlign: 'left',
                              borderBottom: '1px solid #d2d2d2',
                              fontWeight: 600
                            }}>
                              Retirement date
                            </th>
                            <th style={{ 
                              padding: '8px 12px',
                              textAlign: 'left',
                              borderBottom: '1px solid #d2d2d2',
                              fontWeight: 600
                            }}>
                              Package repository
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedSearchResults().map((pkg, index) => (
                            <tr key={pkg.id} style={{ 
                              borderBottom: index < getPaginatedSearchResults().length - 1 ? '1px solid #f0f0f0' : 'none'
                            }}>
                              <td style={{ padding: '8px 12px' }}>
                                <Checkbox
                                  id={`search-result-${pkg.id}`}
                                  isChecked={selectedSearchResults.includes(pkg.id)}
                                  onChange={(_event, checked) => handleSearchResultSelection(pkg.id, checked)}
                                />
                              </td>
                              <td style={{ 
                                padding: '8px 12px',
                                fontWeight: 500
                              }}>
                                {pkg.name}
                              </td>
                              <td style={{ padding: '8px 12px' }}>
                                {pkg.applicationStream}
                              </td>
                              <td style={{ padding: '8px 12px' }}>
                                {pkg.retirementDate}
                              </td>
                              <td style={{ padding: '8px 12px' }}>
                                {pkg.packageRepository}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Search Results Pagination */}
                    {searchResults.length > searchResultsPerPage && (
                      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Pagination
                          itemCount={getFilteredSearchResults().length}
                          perPage={searchResultsPerPage}
                          page={searchResultsPage}
                          onSetPage={(_event, pageNumber) => setSearchResultsPage(pageNumber)}
                          onPerPageSelect={(_event, perPage) => {
                            setSearchResultsPerPage(perPage);
                            setSearchResultsPage(1);
                          }}
                          variant="bottom"
                          isCompact
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Form>
          </div>
        );
      case 2:
        return (
          <div>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '1rem' }}>
              Advanced Settings
            </Title>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
              Configure advanced system settings including registration, timezone, locale, and security options.
            </p>
            <Form>
              {/* Register Section */}
              <div style={{ marginBottom: '32px' }}>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '0.5rem' }}>
                  Register
                </Title>
                <p style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.5',
                  marginBottom: '1rem',
                  color: '#666'
                }}>
                  Configure registration settings for systems that will use this image.
                </p>
              </div>

              <FormGroup
                label="Organization ID"
                fieldId="organization-id"
              >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <TextInput
                    value={organizationId}
                    onChange={(_event, value) => setOrganizationId(value)}
                    id="organization-id"
                    style={{ flex: 1 }}
                    placeholder="Enter your organization ID"
                  />
                  <ClipboardCopy 
                    isReadOnly 
                    hoverTip="Copy Organization ID" 
                    clickTip="Organization ID copied!"
                    variant="inline"
                    style={{ minWidth: 'auto' }}
                  >
                    {organizationId}
                  </ClipboardCopy>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                  If you're using an activation key with command line registration, you must provide your organization's ID
                </div>
              </FormGroup>

              <FormGroup
                label="Registration method"
                fieldId="registration-method"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Radio
                    isChecked={registrationMethod === 'auto'}
                    name="registration-method"
                    onChange={() => setRegistrationMethod('auto')}
                    label="Automatically register and enable advanced capabilities"
                    id="auto-register"
                  />
                  <Radio
                    isChecked={registrationMethod === 'later'}
                    name="registration-method"
                    onChange={() => setRegistrationMethod('later')}
                    label="Register later"
                    id="register-later"
                  />
                  <Radio
                    isChecked={registrationMethod === 'satellite'}
                    name="registration-method"
                    onChange={() => setRegistrationMethod('satellite')}
                    label="Register with Satellite"
                    id="register-satellite"
                  />
                </div>
              </FormGroup>

              {renderChangeableContent()}
            </Form>
          </div>
        );

      case 3:
        return (
          <div>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '1rem' }}>
              Review Image Configuration
            </Title>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
              Review your image configuration and build settings before creating the image.
            </p>
            
            <Stack hasGutter>
              {/* Image Overview Card */}
              <StackItem>
                <Card>
                  <CardBody>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <Title headingLevel="h3" size="lg" style={{ margin: 0 }}>
                        Image Overview
                      </Title>
                      <Button
                        variant="link"
                        onClick={() => setActiveTabKey(0)}
                        style={{ padding: 0, fontSize: '0.875rem' }}
                      >
                        Edit
                      </Button>
                    </div>
                    <DescriptionList isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>
                          {imageName || <span style={{ color: '#666', fontStyle: 'italic' }}>Not specified</span>}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Details</DescriptionListTerm>
                        <DescriptionListDescription>
                          {imageDetails || <span style={{ color: '#666', fontStyle: 'italic' }}>Not specified</span>}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Base Release</DescriptionListTerm>
                        <DescriptionListDescription>{baseImageRelease}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Architecture</DescriptionListTerm>
                        <DescriptionListDescription>{baseImageArchitecture}</DescriptionListDescription>
                      </DescriptionListGroup>
                      {selectedCloudProvider && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Target Platform</DescriptionListTerm>
                          <DescriptionListDescription>
                            <Badge isRead>
                              {selectedCloudProvider === 'aws' && 'Amazon Web Services'}
                              {selectedCloudProvider === 'gcp' && 'Google Cloud Platform'}
                              {selectedCloudProvider === 'azure' && 'Microsoft Azure'}
                              {selectedCloudProvider === 'oci' && 'Oracle Cloud Infrastructure'}
                            </Badge>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                    </DescriptionList>
                  </CardBody>
                </Card>
              </StackItem>

              {/* Registration Settings Card */}
              <StackItem>
                <Card>
                  <CardBody>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <Title headingLevel="h3" size="lg" style={{ margin: 0 }}>
                        Registration Settings
                      </Title>
                      <Button
                        variant="link"
                        onClick={() => setActiveTabKey(2)}
                        style={{ padding: 0, fontSize: '0.875rem' }}
                      >
                        Edit
                      </Button>
                    </div>
                    <DescriptionList isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Registration Method</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Badge isRead>
                            {registrationMethod === 'auto' && 'Auto registration'}
                            {registrationMethod === 'later' && 'Register later'}
                            {registrationMethod === 'satellite' && 'Register with Satellite'}
                          </Badge>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Organization ID</DescriptionListTerm>
                        <DescriptionListDescription>{organizationId}</DescriptionListDescription>
                      </DescriptionListGroup>
                      {registrationMethod === 'auto' && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Activation Key</DescriptionListTerm>
                          <DescriptionListDescription>{selectedActivationKey}</DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                    </DescriptionList>
                  </CardBody>
                </Card>
              </StackItem>

              {/* Users Configuration Card */}
              <StackItem>
                <Card>
                  <CardBody>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <Title headingLevel="h3" size="lg" style={{ margin: 0 }}>
                        Users Configuration
                      </Title>
                      <Button
                        variant="link"
                        onClick={() => setActiveTabKey(2)}
                        style={{ padding: 0, fontSize: '0.875rem' }}
                      >
                        Edit
                      </Button>
                    </div>
                    {users.length > 0 ? (
                      <Stack hasGutter>
                        {users.map((user, index) => (
                          <StackItem key={user.id}>
                            <div style={{ 
                              padding: '12px', 
                              backgroundColor: '#f5f5f5', 
                              borderRadius: '4px',
                              border: '1px solid #d2d2d2'
                            }}>
                              <DescriptionList isHorizontal isCompact>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Username</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {user.username}
                                    {user.isAdministrator && (
                                      <Badge style={{ marginLeft: '8px' }}>Administrator</Badge>
                                    )}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Password</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {user.password ? '••••••••' : <span style={{ color: '#666', fontStyle: 'italic' }}>Not set</span>}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>SSH Key</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {user.sshKey ? 'Configured' : <span style={{ color: '#666', fontStyle: 'italic' }}>Not set</span>}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                {user.groups.length > 0 && (
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Groups</DescriptionListTerm>
                                    <DescriptionListDescription>
                                      <LabelGroup>
                                        {user.groups.map((group) => (
                                          <Label key={group}>{group}</Label>
                                        ))}
                                      </LabelGroup>
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                )}
                              </DescriptionList>
                            </div>
                          </StackItem>
                        ))}
                      </Stack>
                    ) : (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>No users configured</p>
                    )}
                  </CardBody>
                </Card>
              </StackItem>

              {/* Advanced Settings Card */}
              <StackItem>
                <Card>
                  <CardBody>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#151515', margin: 0 }}>
                        Advanced Settings
                      </h4>
                      <Button
                        variant="link"
                        onClick={() => setActiveTabKey(2)}
                        style={{ padding: 0, fontSize: '0.875rem' }}
                      >
                        Edit
                      </Button>
                    </div>
                    <Grid hasGutter>
                      <GridItem span={6}>
                        <DescriptionList isHorizontal isCompact>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Timezone</DescriptionListTerm>
                            <DescriptionListDescription>
                              {timezone || <span style={{ color: '#666', fontStyle: 'italic' }}>Default</span>}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>NTP Servers</DescriptionListTerm>
                            <DescriptionListDescription>
                              {ntpServers || <span style={{ color: '#666', fontStyle: 'italic' }}>Default</span>}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Hostname</DescriptionListTerm>
                            <DescriptionListDescription>
                              {hostname || <span style={{ color: '#666', fontStyle: 'italic' }}>Auto-generated</span>}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </GridItem>
                      <GridItem span={6}>
                        <DescriptionList isHorizontal isCompact>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Languages</DescriptionListTerm>
                            <DescriptionListDescription>
                              {languages.length > 0 ? (
                                <LabelGroup>
                                  {languages.map((lang) => (
                                    <Label key={lang}>{lang}</Label>
                                  ))}
                                </LabelGroup>
                              ) : (
                                <span style={{ color: '#666', fontStyle: 'italic' }}>Default</span>
                              )}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Keyboard</DescriptionListTerm>
                            <DescriptionListDescription>
                              {suggestedKeyboard || <span style={{ color: '#666', fontStyle: 'italic' }}>Default</span>}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Kernel</DescriptionListTerm>
                            <DescriptionListDescription>
                              {kernelPackage}
                              {kernelArguments.length > 0 && (
                                <div style={{ marginTop: '4px' }}>
                                  <LabelGroup>
                                    {kernelArguments.map((arg, index) => (
                                      <Label key={index}>{arg}</Label>
                                    ))}
                                  </LabelGroup>
                                </div>
                              )}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </GridItem>
                    </Grid>
                  </CardBody>
                </Card>
              </StackItem>

              {/* Packages Card */}
              <StackItem>
                <Card>
                  <CardBody>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#151515', margin: 0 }}>
                        Packages
                      </h4>
                      <Button
                        variant="link"
                        onClick={() => setActiveTabKey(1)}
                        style={{ padding: 0, fontSize: '0.875rem' }}
                      >
                        Edit
                      </Button>
                    </div>
                    {selectedPackages.length > 0 ? (
                      <div>
                        <p style={{ marginBottom: '12px', color: '#666' }}>
                          {selectedPackages.length} package{selectedPackages.length !== 1 ? 's' : ''} selected
                        </p>
                        <LabelGroup>
                          {selectedPackages.slice(0, 10).map((pkg) => (
                            <Label key={pkg}>{pkg}</Label>
                          ))}
                          {selectedPackages.length > 10 && (
                            <Label>+{selectedPackages.length - 10} more</Label>
                          )}
                        </LabelGroup>
                      </div>
                    ) : (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>No additional packages selected</p>
                    )}
                  </CardBody>
                </Card>
              </StackItem>

              {/* Build Summary Alert */}
              <StackItem>
                <Alert
                  variant="info"
                  title="Ready to build"
                  actionClose={<></>}
                >
                  <p>
                    Your image configuration is complete and ready to build. The build process may take several minutes depending on the size and complexity of your image.
                  </p>
                  <p style={{ marginTop: '8px', marginBottom: 0 }}>
                    <strong>Estimated build time:</strong> 5-15 minutes
                  </p>
                </Alert>
              </StackItem>
            </Stack>
          </div>
        );
      default:
        return null;
    }
  };

  // Generate YAML based on current form state
  const generateYAML = () => {
    const config = {
      name: imageName || 'untitled-image',
      details: imageDetails || '',
      baseRelease: baseImageRelease || '',
      baseArchitecture: baseImageArchitecture || '',
      outputRelease: outputRelease || '',
      registration: {
        method: registrationMethod,
        organizationId: organizationId,
        ...(registrationMethod === 'auto' && { activationKey: selectedActivationKey })
      },
      timezone: timezone || '',
      ntpServers: ntpServers || '',
      languages: languages,
      keyboard: suggestedKeyboard || '',
      hostname: hostname || '',
      kernel: {
        package: kernelPackage || '',
        arguments: kernelArguments
      }
    };
    
    return `# Image Builder Configuration
name: "${config.name}"
${config.details ? `details: "${config.details}"` : ''}
${config.baseRelease ? `baseRelease: "${config.baseRelease}"` : ''}
${config.baseArchitecture ? `baseArchitecture: "${config.baseArchitecture}"` : ''}
${config.outputRelease ? `outputRelease: "${config.outputRelease}"` : ''}

registration:
  method: ${config.registration.method}
  organizationId: "${config.registration.organizationId}"
${config.registration.activationKey ? `  activationKey: "${config.registration.activationKey}"` : ''}

${config.timezone ? `timezone: "${config.timezone}"` : ''}
${config.ntpServers ? `ntpServers: "${config.ntpServers}"` : ''}

locale:
  languages:
${config.languages.map(lang => `    - "${lang}"`).join('\n')}
${config.keyboard ? `  keyboard: "${config.keyboard}"` : ''}

${config.hostname ? `hostname: "${config.hostname}"` : ''}

kernel:
${config.kernel.package ? `  package: "${config.kernel.package}"` : ''}
${config.kernel.arguments.length > 0 ? `  arguments:\n${config.kernel.arguments.map(arg => `    - "${arg}"`).join('\n')}` : ''}

# Additional configuration sections will appear here as you fill out the form
`;
  };

  return (
    <Modal
      variant={ModalVariant.large}
      title="Register systems using this image"
      isOpen={isOpen}
      onClose={onClose}
      width="min(1400px, 95vw)"
      height="90vh"
    >
      <div style={{ height: 'calc(90vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header Section */}
        <div style={{ 
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #d2d2d2'
        }}>
          <Title headingLevel="h1" size="xl" style={{ marginBottom: '8px' }}>
            Build an image
          </Title>
          <p style={{ 
            fontSize: '16px', 
            lineHeight: '1.5',
            marginBottom: '24px',
            color: '#666'
          }}>
            Create custom system images with your preferred configurations, packages, and settings. Build images for different target environments and deployment scenarios.
          </p>
          
          {/* Tabs and View Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs
              activeKey={activeTabKey}
              onSelect={handleTabClick}
              variant="default"
            >
              <Tab eventKey={0} title={<TabTitleText>Base image</TabTitleText>} />
              <Tab eventKey={1} title={<TabTitleText>Repositories and packages</TabTitleText>} />
              <Tab eventKey={2} title={<TabTitleText>Advanced settings</TabTitleText>} />
              <Tab eventKey={3} title={<TabTitleText>Review image</TabTitleText>} />
            </Tabs>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>GUI</span>
              <Switch
                id="view-mode-toggle"
                isChecked={viewMode === 'code'}
                onChange={(_event, checked) => setViewMode(checked ? 'code' : 'gui')}
                aria-label="Toggle between GUI and code view"
              />
              <span style={{ fontSize: '14px', color: '#666' }}>Code</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: 1,
          overflow: 'hidden'
        }}>
          {viewMode === 'gui' ? (
            /* GUI View - Form Content */
            <div style={{ 
              height: '100%',
              padding: '24px',
              overflowY: 'auto'
            }}>
              {renderTabContent()}
            </div>
          ) : (
            /* Code View - Enhanced Editor Experience */
            <div style={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#2d2d30', // Grey editor background
              overflow: 'hidden'
            }}>
              {/* Code Editor Header */}
              <div style={{
                padding: '8px 16px',
                backgroundColor: '#2d2d30',
                borderBottom: '1px solid #3e3e42',
                fontSize: '13px',
                color: '#cccccc',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: '#569cd6' }}>📄</span>
                <span>image-config.yaml</span>
                <span style={{ marginLeft: 'auto', color: '#858585', fontSize: '11px' }}>
                  Configuration Preview
                </span>
              </div>
              
              {/* Line Numbers and Code Content */}
              <div style={{ 
                flex: 1,
                display: 'flex',
                overflow: 'hidden'
              }}>
                {/* Line Numbers */}
                <div style={{
                  width: '60px',
                  backgroundColor: '#2d2d30',
                  borderRight: '1px solid #3e3e42',
                  padding: '12px 8px',
                  fontSize: '12px',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  color: '#858585',
                  textAlign: 'right',
                  lineHeight: '1.5',
                  overflowY: 'hidden',
                  userSelect: 'none'
                }}>
                  {editableYaml.split('\n').map((_, index) => (
                    <div key={index} style={{ 
                      minHeight: '18px',
                      paddingRight: '8px'
                    }}>
                      {index + 1}
                    </div>
                  ))}
                </div>
                
                {/* Editable Code Content */}
                <div style={{
                  flex: 1,
                  backgroundColor: '#2d2d30',
                  overflow: 'hidden'
                }}>
                  <TextArea
                    value={editableYaml}
                    onChange={(_event, value) => setEditableYaml(value)}
                    style={{
                      width: '100%',
                      height: '100%',
                      margin: 0,
                      padding: '12px 16px',
                      fontSize: '12px',
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      lineHeight: '1.5',
                      color: '#d4d4d4',
                      backgroundColor: '#2d2d30',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      whiteSpace: 'pre',
                      wordBreak: 'normal'
                    }}
                    rows={editableYaml.split('\n').length}
                    aria-label="YAML configuration editor"
                  />
                </div>
              </div>
              
              {/* Status Bar */}
              <div style={{
                padding: '4px 16px',
                backgroundColor: '#007acc',
                fontSize: '11px',
                color: '#ffffff',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>YAML</span>
                  <span>UTF-8</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>Lines: {editableYaml.split('\n').length}</span>
                  <span>Ln 1, Col 1</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div style={{ 
          padding: '16px 24px',
          borderTop: '1px solid #d2d2d2'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Button
                variant="link"
                onClick={handleCancel}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {!isFirstTab && (
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  isDisabled={isLoading}
                >
                  Back
                </Button>
              )}
              {!isLastTab ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  isDisabled={isLoading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleConfirm}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  {isLoading ? 'Building...' : 'Build image'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BuildImageModal; 