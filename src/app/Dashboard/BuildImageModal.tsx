import React, { useState } from 'react';
import { ImageInfo } from './ImageMigrationModal';
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
  Content,
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
  Divider
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
  editingImage?: ImageInfo;
}

const BuildImageModal: React.FunctionComponent<BuildImageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  editingImage,
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
  const [languages, setLanguages] = React.useState<Array<{ id: number; value: string; isOpen: boolean; filterValue: string }>>([
    { id: 0, value: 'English/United States/utf-8', isOpen: false, filterValue: '' }
  ]);
  const [nextLanguageId, setNextLanguageId] = React.useState<number>(1);
  const [suggestedKeyboard, setSuggestedKeyboard] = React.useState<string>('');
  const [isSuggestedKeyboardOpen, setIsSuggestedKeyboardOpen] = React.useState<boolean>(false);
  const [specialtyKeyboards, setSpecialtyKeyboards] = React.useState<string[]>([]);
  const [hostname, setHostname] = React.useState<string>('');
  const [kernelPackage, setKernelPackage] = React.useState<string>('kernel');
  const [isKernelPackageOpen, setIsKernelPackageOpen] = React.useState<boolean>(false);
  const [kernelArguments, setKernelArguments] = React.useState<string[]>([]);

  // Public cloud state
  const [selectedCloudProvider, setSelectedCloudProvider] = React.useState<string>('');
  

  
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
  const [azureResourceGroup, setAzureResourceGroup] = React.useState<string>('');
  
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
  const [complianceType, setComplianceType] = React.useState<string>('');
  const [customCompliancePolicy, setCustomCompliancePolicy] = React.useState<string>('');
  const [isCustomCompliancePolicyOpen, setIsCustomCompliancePolicyOpen] = React.useState<boolean>(false);
  const [openscapProfile, setOpenscapProfile] = React.useState<string>('');
  const [isOpenscapProfileOpen, setIsOpenscapProfileOpen] = React.useState<boolean>(false);

  // Extended support state
  const [extendedSupport, setExtendedSupport] = React.useState<string>('none');

  // Organization ID state
  const [organizationId, setOrganizationId] = React.useState<string>('11009103');


  
  // Track what the user has modified to detect migration-only changes
  const [modifiedFields, setModifiedFields] = React.useState<Set<string>>(new Set());
  
  // Check if user should see migration suggestion (only in editing mode)
  const shouldShowMigrationSuggestion = React.useMemo(() => {
    // Only show in editing mode (when editingImage exists)
    if (!editingImage) return false;
    
    // Only show if they've changed the release
    return modifiedFields.has('baseImageRelease');
  }, [modifiedFields, editingImage]);

  // Helper function to handle cloud provider selection with tracking
  const handleCloudProviderSelect = (provider: string) => {
    const newProvider = selectedCloudProvider === provider ? '' : provider;
    setSelectedCloudProvider(newProvider);
    // Track target environment change
    setModifiedFields(prev => new Set(prev.add('targetEnvironment')));
  };



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

  const languageOptions = [
    'Arabic/Egypt/utf-8',
    'Bulgarian/Bulgaria/utf-8',
    'Chinese/China/utf-8',
    'Czech/Czech Republic/utf-8',
    'Danish/Denmark/utf-8',
    'Dutch/Netherlands/utf-8',
    'English/United States/utf-8',
    'Estonian/Estonia/utf-8',
    'Finnish/Finland/utf-8',
    'French/France/utf-8',
    'German/Germany/utf-8',
    'Greek/Greece/utf-8',
    'Hebrew/Israel/utf-8',
    'Hungarian/Hungary/utf-8',
    'Italian/Italy/utf-8',
    'Japanese/Japan/utf-8',
    'Korean/South Korea/utf-8',
    'Norwegian/Norway/utf-8',
    'Polish/Poland/utf-8',
    'Portuguese/Portugal/utf-8',
    'Portuguese/Brazil/utf-8',
    'Romanian/Romania/utf-8',
    'Russian/Russia/utf-8',
    'Slovak/Slovakia/utf-8',
    'Spanish/Spain/utf-8',
    'Spanish/Mexico/utf-8',
    'Swedish/Sweden/utf-8',
    'Turkish/Turkey/utf-8',
    'Ukrainian/Ukraine/utf-8'
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

  // Language management functions
  const addLanguage = () => {
    setLanguages([...languages, { id: nextLanguageId, value: '', isOpen: false, filterValue: '' }]);
    setNextLanguageId(nextLanguageId + 1);
  };

  const removeLanguage = (id: number) => {
    if (id === 0) return; // Cannot remove the first language
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const updateLanguage = (id: number, value: string) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, value } : lang
    ));
  };

  const toggleLanguageDropdown = (id: number) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, isOpen: !lang.isOpen } : { ...lang, isOpen: false }
    ));
  };

  const updateLanguageFilter = (id: number, filterValue: string) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, filterValue } : lang
    ));
  };

  const getFilteredLanguageOptions = (filterValue: string) => {
    if (!filterValue) return languageOptions;
    return languageOptions.filter(option => 
      option.toLowerCase().includes(filterValue.toLowerCase())
    );
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
      // Track this modification
      setModifiedFields(prev => new Set(prev.add('outputRelease')));
    }
  };

  const onBaseImageReleaseSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setBaseImageRelease(selection);
      setIsBaseImageReleaseOpen(false);
      // Track this modification
      setModifiedFields(prev => new Set(prev.add('baseImageRelease')));
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
      setComplianceType('custom'); // Auto-select the custom radio button
      setIsCustomCompliancePolicyOpen(false);
    }
  };

  const onOpenscapProfileSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setOpenscapProfile(selection);
      setComplianceType('openscap'); // Auto-select the OpenSCAP radio button
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
    // Track package modifications
    setModifiedFields(prev => new Set(prev.add('packages')));
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
      setSearchPackageType(selection === 'individual' ? 'individual' : 'groups');
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
              style={{ marginBottom: '1rem' }}
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
                  <Button variant="secondary" icon={<InfoCircleIcon />}>
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
            <div style={{ 
              height: '1px', 
              backgroundColor: '#d2d2d2', 
              margin: '2rem 0' 
            }} />

            {/* Timezone Section */}
            <div style={{ marginBottom: '2rem' }}>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                Timezone
              </Title>
              
              <FormGroup
                label="Timezone"
                fieldId="timezone"
                style={{ marginBottom: '1rem' }}
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
                style={{ marginBottom: '1rem' }}
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
            <div style={{ 
              height: '1px', 
              backgroundColor: '#d2d2d2', 
              margin: '2rem 0' 
            }} />

            {/* Locale Section */}
            <div style={{ marginBottom: '2rem' }}>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                Locale
              </Title>
              
              <FormGroup
                label="Suggest keyboards from these languages"
                fieldId="languages"
                style={{ marginBottom: '1rem' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {languages.map((language) => (
                    <div key={language.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '400px' }}>
                        <Select
                          id={`language-select-${language.id}`}
                          isOpen={language.isOpen}
                          selected={language.value}
                          onSelect={(_, selection) => {
                            updateLanguage(language.id, String(selection));
                            toggleLanguageDropdown(language.id);
                          }}
                          onOpenChange={() => toggleLanguageDropdown(language.id)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle 
                              ref={toggleRef} 
                              onClick={() => toggleLanguageDropdown(language.id)}
                              isExpanded={language.isOpen}
                              style={{ width: '100%' }}
                            >
                              {language.value || 'Select language'}
                            </MenuToggle>
                          )}
                        >
                          <SelectList>
                            <div style={{ padding: '0.5rem', borderBottom: '1px solid #D2D2D2' }}>
                              <SearchInput
                                placeholder="Search languages..."
                                value={language.filterValue}
                                onChange={(_, value) => updateLanguageFilter(language.id, value)}
                                onClear={() => updateLanguageFilter(language.id, '')}
                              />
                            </div>
                            {getFilteredLanguageOptions(language.filterValue).map((lang) => (
                              <SelectOption key={lang} value={lang}>
                                {lang}
                              </SelectOption>
                            ))}
                          </SelectList>
                        </Select>
                      </div>
                      {language.id !== 0 && (
                        <Button
                          variant="plain"
                          aria-label="Remove language"
                          onClick={() => removeLanguage(language.id)}
                          style={{ minWidth: 'auto', padding: '0.5rem', color: '#6A6E73' }}
                        >
                          <MinusIcon />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ color: '#6A6E73', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                    Search by country, language or UTF code
                  </div>
                  <Button
                    variant="link"
                    onClick={addLanguage}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      border: '1px solid #C7C7C7', 
                      borderRadius: '24px', 
                      color: '#0066CC', 
                      backgroundColor: 'transparent',
                      textDecoration: 'none'
                    }}
                  >
                    Add more
                  </Button>
                </div>
              </FormGroup>

              <FormGroup
                label="Suggested keyboards"
                fieldId="suggested-keyboards"
                style={{ marginBottom: '1rem' }}
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
                      {suggestedKeyboard || 'Select keyboard'}
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
            <div style={{ 
              height: '1px', 
              backgroundColor: '#d2d2d2', 
              margin: '2rem 0' 
            }} />

            {/* Hostname Section */}
            <div style={{ marginBottom: '2rem' }}>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                Hostname
              </Title>
              
              <FormGroup
                label="Hostname"
                fieldId="hostname"
                style={{ marginBottom: '1rem' }}
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
            <div style={{ 
              height: '1px', 
              backgroundColor: '#d2d2d2', 
              margin: '2rem 0' 
            }} />

            {/* Kernel Section */}
            <div style={{ marginBottom: '2rem' }}>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                Kernel
              </Title>
              
              <FormGroup
                label="Kernel package"
                fieldId="kernel-package"
                style={{ marginBottom: '1rem' }}
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


            </div>

            {/* Divider */}
            <div style={{ 
              height: '1px', 
              backgroundColor: '#d2d2d2', 
              margin: '2rem 0' 
            }} />

            {/* Users Section */}
            <div style={{ marginBottom: '2rem' }}>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                Users
              </Title>
              <p style={{ 
                fontSize: '14px', 
                lineHeight: '1.5',
                marginBottom: '1rem',
                color: '#666'
              }}>
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
            style={{ marginTop: '2rem' }}
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
            style={{ marginTop: '2rem' }}
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
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '0rem' }}>
              Base Image Selection
            </Title>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
              Choose the base operating system and version for your custom image.
            </p>
            
            <Form>
              {/* Image Details Section */}
              <div>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                  Image details
                </Title>
                
                <FormGroup
                  label="Name"
                  fieldId="image-name"
                  isRequired
                  style={{ marginBottom: '1rem' }}
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
                  style={{ marginTop: '12px', marginBottom: '1rem' }}
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
              <div style={{ 
                height: '1px', 
                backgroundColor: '#d2d2d2', 
                margin: '0px 0 0px 0' 
              }} />

              {/* Image Output Section */}
              <div style={{ marginBottom: '2rem' }}>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                  Image output
                </Title>
                
                <FormGroup
                  label="Release"
                  fieldId="base-image-release"
                  isRequired
                  style={{ marginBottom: '1rem' }}
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

                {/* Migration suggestion alert - shown immediately when release changes */}
                {shouldShowMigrationSuggestion && (
                  <Alert
                    variant="info"
                    title="Consider using migration instead"
                    style={{ marginBottom: '1rem' }}
                  >
                    <p>
                      If you're only changing the release version, you might want to use the migration 
                      feature instead. Try using the "Migrate" button on an existing image for faster results.
                    </p>
                  </Alert>
                )}

                <FormGroup
                  label="Architecture"
                  fieldId="base-image-architecture"
                  isRequired
                  style={{ marginBottom: '1rem' }}
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
                  style={{ marginBottom: '1rem' }}
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
                      onClick={() => handleCloudProviderSelect('aws')}
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
                      onClick={() => handleCloudProviderSelect('gcp')}
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
                      onClick={() => handleCloudProviderSelect('azure')}
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
                        onClick={() => handleCloudProviderSelect('oci')}
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
                    marginBottom: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #d2d2d2',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <FormGroup
                      label="Integrations"
                      fieldId="integrations"
                      style={{ marginBottom: '1rem' }}
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
                            {selectedIntegration || 'Select integration'}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="aws-account">AWS Account</SelectOption>
                          <SelectOption value="aws-iam">AWS IAM</SelectOption>
                          <SelectOption value="aws-ec2">AWS EC2</SelectOption>
                        </SelectList>
                      </Select>
                    </FormGroup>

                    <FormGroup
                      label="Default region"
                      fieldId="aws-default-region"
                      style={{ marginBottom: '1rem' }}
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
                    marginBottom: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #d2d2d2',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <FormGroup
                      label="GCP account type"
                      fieldId="gcp-account-type"
                      style={{ marginBottom: '1rem' }}
                    >
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
                            style={{ width: '200px' }}
                          >
                            {gcpAccountType}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="Service account">Service account</SelectOption>
                          <SelectOption value="Service account (JSON)">Service account (JSON)</SelectOption>
                        </SelectList>
                      </Select>
                    </FormGroup>

                    <FormGroup
                      label="Select image sharing"
                      fieldId="gcp-image-sharing"
                      style={{ marginBottom: '1rem' }}
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
                    marginBottom: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #d2d2d2',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <FormGroup
                      label="Azure integration"
                      fieldId="azure-integration"
                      style={{ marginBottom: '1rem' }}
                    >
                      <Select
                        id="azure-integration-select"
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
                            {azureIntegration}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="Microsoft Azure">Microsoft Azure</SelectOption>
                          <SelectOption value="Azure Government">Azure Government</SelectOption>
                        </SelectList>
                      </Select>
                    </FormGroup>

                    <FormGroup
                      label="Resource group"
                      fieldId="azure-resource-group"
                      style={{ marginBottom: '1rem' }}
                    >
                      <TextInput
                        id="azure-resource-group"
                        value={azureResourceGroup}
                        onChange={(_event, value) => setAzureResourceGroup(value)}
                        placeholder="Enter resource group name"
                      />
                    </FormGroup>

                    <FormGroup
                      label="Hyper-V generation"
                      fieldId="azure-hyperv-generation"
                      style={{ marginBottom: '1rem' }}
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
                            style={{ width: '200px' }}
                          >
                            {azureHypervGeneration}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="V1">V1</SelectOption>
                          <SelectOption value="V2">V2</SelectOption>
                        </SelectList>
                      </Select>
                    </FormGroup>

                    <Button
                      variant="primary"
                      onClick={handleAzureAuthorize}
                      style={{ marginTop: '1rem' }}
                    >
                      Authorize Azure
                    </Button>
                  </div>
                )}

                {/* Oracle Cloud Infrastructure Section */}
                {selectedCloudProvider === 'oci' && (
                  <div style={{ 
                    marginBottom: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #d2d2d2',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6a6e73' }}>
                      Oracle Cloud Infrastructure integration is ready to use. No additional configuration required.
                    </p>
                  </div>
                )}

                <FormGroup
                  label="Other"
                  fieldId="other-formats"
                  style={{ marginBottom: '1rem' }}
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
                <div style={{ 
                  height: '1px', 
                  backgroundColor: '#d2d2d2', 
                  margin: '2rem 0' 
                }} />
                
                {/* Enable repeatable build Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Enable repeatable build
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                    Create images that can be reproduced consistently with the same package versions and configurations.
                  </Content>
                
                  <FormGroup
                    label="Snapshot date"
                    fieldId="snapshot-date"
                  >
                    <Split hasGutter>
                      <SplitItem>
                        <DatePicker
                          id="snapshot-date"
                          value={snapshotDate}
                          onChange={(_event, value) => setSnapshotDate(value)}
                          placeholder="MM-DD-YYYY"
                          popoverProps={{ position: "bottom" }}
                          dateFormat={(date: Date) => {
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const day = date.getDate().toString().padStart(2, '0');
                            const year = date.getFullYear();
                            return `${month}-${day}-${year}`;
                          }}
                          dateParse={(value: string) => {
                            const parts = value.split('-');
                            if (parts.length === 3) {
                              const month = parseInt(parts[0], 10) - 1;
                              const day = parseInt(parts[1], 10);
                              const year = parseInt(parts[2], 10);
                              return new Date(year, month, day);
                            }
                            return new Date(NaN);
                          }}
                          className="pf-v6-u-width-200px"
                        />
                      </SplitItem>
                      <SplitItem>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            const today = new Date();
                            const month = (today.getMonth() + 1).toString().padStart(2, '0');
                            const day = today.getDate().toString().padStart(2, '0');
                            const year = today.getFullYear();
                            setSnapshotDate(`${month}-${day}-${year}`);
                          }}
                          className="pf-v6-u-font-size-sm"
                        >
                          Today's date
                        </Button>
                      </SplitItem>
                      <SplitItem>
                        <Button
                          variant="secondary"
                          onClick={() => setSnapshotDate('')}
                          className="pf-v6-u-font-size-sm"
                        >
                          Clear date
                        </Button>
                      </SplitItem>
                    </Split>
                    <div style={{ marginTop: '0.5rem', marginBottom: '1rem' ,fontSize: '0.875rem', color: '#666' }}>
                      Use packages from this date to ensure reproducible builds
                    </div>
                  </FormGroup>
                </div>
                
                {/* Kickstart File Section */}
                <div style={{ marginBottom: '2rem' }}>
                  {/* Divider between sections */}
                  <div style={{ 
                    height: '1px', 
                    backgroundColor: '#d2d2d2', 
                    margin: '0rem 0 2rem 0' 
                  }} />
                  
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-xs">
                    Kickstart File
                  </Title>
                  
                  <div style={{
                    '--pf-v5-c-file-upload__file-details-textarea--FontFamily': '"Red Hat Mono", "Monaco", "Menlo", "Ubuntu Mono", monospace'
                  } as React.CSSProperties}>
                    <FileUpload
                      id="kickstart-file"
                      type="text" 
                      value={kickstartFile || 'Manually enter the kickstart CSV data here.'} style={{color: 'blue' }}
                      filename={kickstartFilename}
                      onTextChange={(event: React.ChangeEvent<HTMLTextAreaElement>, text: string) => {
                        setKickstartFile(text);
                        setKickstartFilename('');
                      }}
                      onClearClick={() => {
                        setKickstartFile('');
                        setKickstartFilename('');
                      }}
                      isLoading={isKickstartLoading}
                      browseButtonText="Upload"
                      clearButtonText="Clear"
                    />
                    <div className="pf-v6-u-font-size-sm pf-v6-u-color-200 pf-v6-u-mt-xs">
                      Upload a CSV file
                    </div>
                  </div>
                </div>

                {/* Compliance Section */}
                <div style={{ marginBottom: '2rem' }}>
                  {/* Divider after Kickstart File section */}
                  <div style={{ 
                    height: '1px', 
                    backgroundColor: '#d2d2d2', 
                    margin: '0rem 0 2rem 0' 
                  }} />
                  
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '0rem' }}>
                    Compliance
                  </Title>
                  <p style={{ 
                    fontSize: '14px', 
                    lineHeight: '1.5',
                    marginBottom: '1.5rem', marginTop: '1rem',
                    color: '#666'
                  }}>
                    Below you can select which Insights compliance policy or OpenSCAP profile your image will be compliant to. Insights compliance allows the use of tailored policies, whereas OpenSCAP gives you the default versions. This will automatically help monitor the adherence of your registered RHEL systems to a selected policy or profile.
                  </p>

                  {/* Custom Compliance Policy */}
                  <FormGroup
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <Radio
                        isChecked={complianceType === 'custom'}
                        name="compliance-type"
                        onChange={() => setComplianceType('custom')}
                        label=""
                        id="compliance-custom"
                      />
                      <label htmlFor="compliance-custom" style={{ fontWeight: 600, fontSize: '14px' }}>
                        Use a custom Compliance policy
                      </label>
                    </div>
                    
                    <div style={{ marginLeft: '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                        
                        {complianceType === 'custom' && (
                          <Popover
                            aria-label="Custom compliance policy details"
                            position={PopoverPosition.right}
                            bodyContent={
                              <div style={{ minWidth: '300px' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Policy type</div>
                                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {customCompliancePolicy ? 'Custom Insights Compliance Policy' : 'No policy selected'}
                                  </div>
                                </div>
                                
                                <div style={{ marginBottom: '1rem' }}>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Policy description</div>
                                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {customCompliancePolicy 
                                      ? 'This policy provides comprehensive security controls and compliance requirements tailored for enterprise environments.'
                                      : 'Select a policy to view description'
                                    }
                                  </div>
                                </div>
                                
                                <div style={{ marginBottom: '1rem' }}>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Compliance score</div>
                                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {customCompliancePolicy ? '85% compliant' : 'N/A'}
                                  </div>
                                </div>
                                
                                <div>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Business objective</div>
                                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {customCompliancePolicy 
                                      ? 'Maintain security standards and regulatory compliance for critical business systems.'
                                      : 'Select a policy to view objective'
                                    }
                                  </div>
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
                      
                      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        <a href="#" style={{ color: '#0066cc', textDecoration: 'none' }}>
                          <ExternalLinkAltIcon style={{ marginRight: '0.25rem', fontSize: '0.75rem' }} />
                          Manage with Insights Compliance
                        </a>
                      </div>
                    </div>
                  </FormGroup>

                  {/* OpenSCAP Profile */}
                  <FormGroup
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <Radio
                        isChecked={complianceType === 'openscap'}
                        name="compliance-type"
                        onChange={() => setComplianceType('openscap')}
                        label=""
                        id="compliance-openscap"
                      />
                      <label htmlFor="compliance-openscap" style={{ fontWeight: 600, fontSize: '14px' }}>
                        Use a default OpenSCAP profile
                      </label>
                    </div>
                    
                    <div style={{ marginLeft: '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                        
                        {complianceType === 'openscap' && (
                          <Popover
                            aria-label="OpenSCAP profile details"
                            position={PopoverPosition.right}
                            bodyContent={
                              <div style={{ minWidth: '300px' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Policy type</div>
                                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {openscapProfile ? 'Default OpenSCAP Security Profile' : 'No profile selected'}
                                  </div>
                                </div>
                                
                                <div style={{ marginBottom: '1rem' }}>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Policy description</div>
                                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {openscapProfile 
                                      ? 'Standard security configuration profile based on industry best practices and security benchmarks.'
                                      : 'Select a profile to view description'
                                    }
                                  </div>
                                </div>
                                
                                <div style={{ marginBottom: '1rem' }}>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Compliance score</div>
                                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {openscapProfile ? '92% compliant' : 'N/A'}
                                  </div>
                                </div>
                                
                                <div>
                                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Business objective</div>
                                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                    {openscapProfile 
                                      ? 'Implement standardized security configurations to reduce vulnerabilities and ensure baseline protection.'
                                      : 'Select a profile to view objective'
                                    }
                                  </div>
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
                      
                      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        <a href="#" style={{ color: '#0066cc', textDecoration: 'none' }}>
                          <ExternalLinkAltIcon style={{ marginRight: '0.25rem', fontSize: '0.75rem' }} />
                          Learn more about OpenSCAP profiles
                        </a>
                      </div>
                    </div>
                  </FormGroup>
                </div>
              </div>
            </Form>
          </div>
        );
      case 1:
        return (
          <div>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '0rem' }}>
              Repositories and Packages
            </Title>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
              Configure package repositories and select additional software packages to include in your image.
            </p>
            
            <Form>
              {/* Use Extended Support Section */}
              <div style={{ marginBottom: '2rem' }}>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                  Use Extended Support
                </Title>
                
                <FormGroup
                  label="Extended support subscription"
                  fieldId="extended-support"
                  style={{ marginBottom: '1rem' }}
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
              <div style={{ 
                height: '1px', 
                backgroundColor: '#d2d2d2', 
                margin: '2rem 0' 
              }} />

              {/* Search Packages Section */}
              <div style={{ marginBottom: '2rem' }}>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                  Search packages
                </Title>

                {/* Search Form */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    {/* Types Dropdown */}
                    <div style={{ flex: '0 0 200px' }}>
                      <FormGroup
                        label="Types"
                        fieldId="search-package-types"
                        isRequired
                        style={{ marginBottom: '1rem' }}
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
                            <SelectOption value="individual">Individual packages</SelectOption>
                            <SelectOption value="groups">Package groups</SelectOption>
                          </SelectList>
                        </Select>
                      </FormGroup>
                    </div>

                    {/* Repository Dropdown */}
                    <div style={{ flex: '0 0 200px' }}>
                      <FormGroup
                        label="Repository"
                        fieldId="search-repository"
                        isRequired
                        style={{ marginBottom: '1rem' }}
                      >
                        <Select
                          id="search-repository-select"
                          isOpen={isRepositoryDropdownOpen}
                          selected={selectedRepository}
                          onSelect={(_, selection) => {
                            setSelectedRepository(String(selection));
                            setIsRepositoryDropdownOpen(false);
                          }}
                          onOpenChange={(isOpen) => setIsRepositoryDropdownOpen(isOpen)}
                          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle 
                              ref={toggleRef} 
                              onClick={() => setIsRepositoryDropdownOpen(!isRepositoryDropdownOpen)}
                              isExpanded={isRepositoryDropdownOpen}
                              style={{ width: '100%' }}
                            >
                              {selectedRepository || 'Select repository'}
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

                    {/* Search Input */}
                    <div style={{ flex: 1 }}>
                      <FormGroup
                        label="Search terms"
                        fieldId="search-terms"
                        style={{ marginBottom: '1rem' }}
                      >
                        <SearchInput
                          placeholder="Search for packages..."
                          value={advancedSearchTerm}
                          onChange={(_event, value) => setAdvancedSearchTerm(value)}
                          onClear={() => setAdvancedSearchTerm('')}
                          style={{ width: '100%' }}
                        />
                      </FormGroup>
                    </div>

                    {/* Search Button */}
                    <div style={{ flex: '0 0 auto' }}>
                      <Button
                        variant="primary"
                        onClick={handleSearchPackages}
                        isDisabled={!selectedRepository || !advancedSearchTerm.trim()}
                        style={{ marginBottom: '1rem' }}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <h5 style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600, 
                      marginBottom: '1rem',
                      color: '#151515'
                    }}>
                      Search Results ({getFilteredSearchResults().length} packages found)
                    </h5>

                    {/* Compact Table */}
                    <div style={{ 
                      border: '1px solid #d2d2d2',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '1rem'
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
                              Version
                            </th>
                            <th style={{ 
                              padding: '8px 12px',
                              textAlign: 'left',
                              borderBottom: '1px solid #d2d2d2',
                              fontWeight: 600
                            }}>
                              Repository
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
                                {pkg.version}
                              </td>
                              <td style={{ padding: '8px 12px' }}>
                                {pkg.repository}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination for Search Results */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button
                        variant="primary"
                        onClick={() => {
                          // Add selected search results to the main packages list
                          setSelectedPackages(prev => [...prev, ...selectedSearchResults]);
                          setSelectedSearchResults([]);
                          setSearchResults([]);
                          setAdvancedSearchTerm('');
                        }}
                        isDisabled={selectedSearchResults.length === 0}
                      >
                        Add Selected ({selectedSearchResults.length})
                      </Button>
                      
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
                  </div>
                )}
              </div>
            </Form>
          </div>
        );
      case 2:
        return (
          <div>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '0rem' }}>
              Advanced Settings
            </Title>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '2rem' }}>
              Configure advanced system settings including registration, timezone, locale, and security options.
            </p>
            <Form>
              {/* Register Section */}
              <div style={{ marginBottom: '2rem' }}>
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
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
                
                <FormGroup
                  label="Organization ID"
                  fieldId="organization-id"
                  style={{ marginBottom: '1rem' }}
                >
                  <ClipboardCopy 
                    isReadOnly 
                    hoverTip="Copy Organization ID" 
                    clickTip="Organization ID copied!"
                    variant="inline"
                  >
                    {organizationId}
                  </ClipboardCopy>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    If you're using an activation key with command line registration, you must provide your organization's ID
                  </div>
                </FormGroup>

                <FormGroup
                  label="Registration method"
                  fieldId="registration-method"
                  style={{ marginBottom: '1rem' }}
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
              </div>

              {renderChangeableContent()}
            </Form>
          </div>
        );

      case 3:
        return (
          <div>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '0rem' }}>
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
                      <Title headingLevel="h3" size="lg" style={{ margin: 0 }}>
                        Advanced Settings
                      </Title>
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
                                  {languages.filter(lang => lang.value).map((lang) => (
                                    <Label key={lang.id}>{lang.value}</Label>
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
                      <Title headingLevel="h3" size="lg" style={{ margin: 0 }}>
                        Packages
                      </Title>
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


  return (
    <Modal
      variant={ModalVariant.large}
      title="Register systems using this image"
      isOpen={isOpen}
      onClose={onClose}
      width="min(1400px, 95vw)"
      height="80vh"
    >
      <div style={{ 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 0
      }}>
        {/* Header Section */}
        <div style={{ 
          flexShrink: 0,
          padding: '32px 24px 0 32px',
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
          
          {/* Tabs */}
          <div>
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
          </div>
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: 1,
          minHeight: 0,
          padding: '24px 24px 24px 32px',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {renderTabContent()}
        </div>

        {/* Footer Section */}
        <div style={{ 
          flexShrink: 0,
          padding: '16px 24px',
          borderTop: '1px solid #d2d2d2'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="secondary"
              onClick={handleCancel}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            {activeTabKey !== 3 && (
              <Button
                variant="primary"
                onClick={() => setActiveTabKey(3)}
                isDisabled={false}
              >
                Review image
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleConfirm}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading ? 'Building...' : 'Build image'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BuildImageModal; 