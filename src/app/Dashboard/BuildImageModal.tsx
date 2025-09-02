import React from 'react';
import { ImageInfo } from './ImageMigrationModal';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Checkbox,
  ClipboardCopy,
  Content,
  DatePicker,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  FileUpload,
  Form,
  FormGroup,
  FormHelperText,
  Gallery,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  Label,
  LabelGroup,
  MenuToggle,
  MenuToggleElement,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  DrilldownMenu,
  Divider,
  MenuContainer,
  Modal,
  ModalVariant,
  Popover,
  PopoverPosition,
  Radio,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Switch,
  Tab,
  TabTitleText,
  Tabs,
  TextInput,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Title,
  Tooltip
} from '@patternfly/react-core';

import { 
  ArrowRightIcon,
  ExternalLinkAltIcon, 
  InfoCircleIcon,
  MagicIcon,
  MinusCircleIcon,
  MinusIcon,
  OutlinedQuestionCircleIcon,
  PlusIcon,
  SearchIcon,
  TimesIcon
} from '@patternfly/react-icons';

interface UserRow {
  id: string;
  isAdministrator: boolean;
  username: string;
  password: string;
  sshKey: string;
  groups: string[];
  groupInput: string; // For comma-triggered group input
  isEditing: boolean;
}

interface BuildImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  editingImage?: ImageInfo & { lastUpdate?: string; dateUpdated?: Date };
}

const BuildImageModal: React.FunctionComponent<BuildImageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  editingImage,
}) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const contentAreaRef = React.useRef<HTMLDivElement>(null);
  
  // Section refs for navigation
  const imageDetailsRef = React.useRef<HTMLDivElement>(null);
  const imageOutputRef = React.useRef<HTMLDivElement>(null);
  const enableRepeatableRef = React.useRef<HTMLDivElement>(null);
  const kickstartRef = React.useRef<HTMLDivElement>(null);
  const complianceRef = React.useRef<HTMLDivElement>(null);
  
  // Advanced Settings section refs
  const timezoneRef = React.useRef<HTMLDivElement>(null);
  const localeRef = React.useRef<HTMLDivElement>(null);
  const hostnameRef = React.useRef<HTMLDivElement>(null);
  const kernelRef = React.useRef<HTMLDivElement>(null);
  const systemdRef = React.useRef<HTMLDivElement>(null);
  const firewallRef = React.useRef<HTMLDivElement>(null);

  const usersRef = React.useRef<HTMLDivElement>(null);
  const firstBootRef = React.useRef<HTMLDivElement>(null);
  
  // Track current section index for each tab
  const [currentBaseImageSection, setCurrentBaseImageSection] = React.useState<number>(0);
  const [currentAdvancedSection, setCurrentAdvancedSection] = React.useState<number>(0);

  const [registrationMethod, setRegistrationMethod] = React.useState<string>('auto');
  const [selectedActivationKey, setSelectedActivationKey] = React.useState<string>('my-default-key');
  const [isActivationKeyOpen, setIsActivationKeyOpen] = React.useState<boolean>(false);
  const [enablePredictiveAnalytics, setEnablePredictiveAnalytics] = React.useState<boolean>(true);
  const [enableRemoteRemediations, setEnableRemoteRemediations] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
  // Base image form state
  const [imageName, setImageName] = React.useState<string>('my-custom-image');
  const [imageDetails, setImageDetails] = React.useState<string>('');
  const [owner, setOwner] = React.useState<string>('kelseamann@redhat.com');
  const [baseImageRelease, setBaseImageRelease] = React.useState<string>('Red Hat Enterprise Linux 9');
  const [isBaseImageReleaseOpen, setIsBaseImageReleaseOpen] = React.useState<boolean>(false);
  
  // Drilldown menu state for release dropdown
  const [activeReleaseMenu, setActiveReleaseMenu] = React.useState<string>('rootReleaseMenu');
  const [releaseMenuDrilledIn, setReleaseMenuDrilledIn] = React.useState<string[]>([]);
  const [releaseDrilldownPath, setReleaseDrilldownPath] = React.useState<string[]>([]);
  const [releaseMenuHeights, setReleaseMenuHeights] = React.useState<{[id: string]: number}>({});
  const releaseToggleRef = React.useRef<HTMLButtonElement>(null);
  const releaseMenuRef = React.useRef<HTMLDivElement>(null);
  const [baseImageArchitecture, setBaseImageArchitecture] = React.useState<string>('x86_64');
  const [isBaseImageArchitectureOpen, setIsBaseImageArchitectureOpen] = React.useState<boolean>(false);
  
  // Image output form state
  // Removed unused outputRelease state variables

  // Users state
  const [users, setUsers] = React.useState<UserRow[]>([
    {
      id: '1',
      isAdministrator: true,
      username: 'admin',
      password: '',
      sshKey: '',
      groups: ['wheel'],
      groupInput: '',
      isEditing: false
    }
  ]);

  // Additional form states for Advanced Settings
  const [timezone, setTimezone] = React.useState<string>('');
  const [isTimezoneOpen, setIsTimezoneOpen] = React.useState<boolean>(false);
  const [ntpServers, setNtpServers] = React.useState<string[]>([]);
  const [ntpServersInput, setNtpServersInput] = React.useState<string>('');
  const [languages, setLanguages] = React.useState<Array<{ id: number; value: string; isOpen: boolean; filterValue: string }>>([
    { id: 0, value: 'English/United States/utf-8', isOpen: false, filterValue: '' }
  ]);
  const [nextLanguageId, setNextLanguageId] = React.useState<number>(1);
  const [suggestedKeyboard, setSuggestedKeyboard] = React.useState<string>('');
  const [isSuggestedKeyboardOpen, setIsSuggestedKeyboardOpen] = React.useState<boolean>(false);
  // Removed unused specialtyKeyboards state
  const [hostname, setHostname] = React.useState<string>('');
  const [kernelPackage, setKernelPackage] = React.useState<string>('kernel');
  const [isKernelPackageOpen, setIsKernelPackageOpen] = React.useState<boolean>(false);
  const [kernelAppend, setKernelAppend] = React.useState<string[]>([]);
  const [kernelAppendInput, setKernelAppendInput] = React.useState<string>('');

  // Validation states for advanced settings
  const [ntpValidated, setNtpValidated] = React.useState<'default' | 'success' | 'error'>('default');
  const [ntpHelperText, setNtpHelperText] = React.useState<string>('Enter NTP server addresses separated by commas');
  const [hostnameValidated, setHostnameValidated] = React.useState<'default' | 'success' | 'error'>('default');
  const [hostnameHelperText, setHostnameHelperText] = React.useState<string>('Enter a valid hostname for the system');
  const [kernelValidated, setKernelValidated] = React.useState<'default' | 'success' | 'error'>('default');
  const [kernelHelperText, setKernelHelperText] = React.useState<string>('Enter kernel append options for system configuration');
  const [firewallValidated, setFirewallValidated] = React.useState<'default' | 'success' | 'error'>('default');
  const [firewallHelperText, setFirewallHelperText] = React.useState<string>('Enter port configuration for firewall rules');
  
  // Focus states for advanced settings (to hide clear buttons while typing)
  const [hostnameFocused, setHostnameFocused] = React.useState<boolean>(false);
  const [kernelFocused, setKernelFocused] = React.useState<boolean>(false);
  // Removed unused ntpFocused and firewallFocused states
  
  // Focus states for main fields
  const [imageNameFocused, setImageNameFocused] = React.useState<boolean>(false);
  const [imageDetailsFocused, setImageDetailsFocused] = React.useState<boolean>(false);
  const [ownerFocused, setOwnerFocused] = React.useState<boolean>(false);

  // Public cloud state
  const [selectedCloudProvider, setSelectedCloudProvider] = React.useState<string[]>([]);
  

  
  // AWS integration state
  const [selectedIntegration, setSelectedIntegration] = React.useState<string>('');
  const [isIntegrationOpen, setIsIntegrationOpen] = React.useState<boolean>(false);
  const [awsAccountId, setAwsAccountId] = React.useState<string>('');
  const [awsDefaultRegion, setAwsDefaultRegion] = React.useState<string>('us-east-1');
  const [isAwsRegionOpen, setIsAwsRegionOpen] = React.useState<boolean>(false);
  const [isAwsIntegrationEnabled, setIsAwsIntegrationEnabled] = React.useState<boolean>(true);
  
  // GCP integration state
  const [gcpAccountType, setGcpAccountType] = React.useState<string>('Google account');
  const [isGcpAccountTypeOpen, setIsGcpAccountTypeOpen] = React.useState<boolean>(false);
  const [gcpEmailOrDomain, setGcpEmailOrDomain] = React.useState<string>('');
  const [gcpImageSharing, setGcpImageSharing] = React.useState<string>('google-account');
  const [gcpShareAccount, setGcpShareAccount] = React.useState<string>('');
  
  // Azure integration state
  const [azureHypervGeneration, setAzureHypervGeneration] = React.useState<string>('Generation 2 (BIOS)');
  const [isAzureHypervGenerationOpen, setIsAzureHypervGenerationOpen] = React.useState<boolean>(false);
  const [azureIntegration, setAzureIntegration] = React.useState<string>('');
  const [isAzureIntegrationOpen, setIsAzureIntegrationOpen] = React.useState<boolean>(false);
  const [azureId, setAzureId] = React.useState<string>('');
  const [isAzureAuthorized, setIsAzureAuthorized] = React.useState<boolean>(false);
  const [azureResourceGroup, setAzureResourceGroup] = React.useState<string>('');
  const [azureSubscriptionId, setAzureSubscriptionId] = React.useState<string>('');
  
  // Private cloud state
  const [isVMWareSelected, setIsVMWareSelected] = React.useState<boolean>(false);
  const [vmwareFormat, setVmwareFormat] = React.useState<string>('ova');
  
  // Other formats state - Auto-check Baremetal for testing
  const [otherFormat, setOtherFormat] = React.useState<string[]>(['iso']);
  
  // Private cloud formats state
  const [privateCloudFormat, setPrivateCloudFormat] = React.useState<string[]>([]);
  
  // Repeatable build state
  const [snapshotDate, setSnapshotDate] = React.useState<string>('');
  const [repeatableBuildOption, setRepeatableBuildOption] = React.useState<string>('disable');
  
  // Validation state
  const [validationErrors, setValidationErrors] = React.useState<{[key: string]: string}>({});
  const [usernameErrors, setUsernameErrors] = React.useState<{[key: string]: string}>({});
  
  // Kickstart file state
  const [kickstartFile, setKickstartFile] = React.useState<File | string>('');
  const [kickstartFilename, setKickstartFilename] = React.useState<string>('');
  const [isKickstartLoading, setIsKickstartLoading] = React.useState<boolean>(false);
  const [customKickstartCode, setCustomKickstartCode] = React.useState<string>('');


  // Compliance state
  const [complianceType, setComplianceType] = React.useState<string>('');
  const [isComplianceTypeOpen, setIsComplianceTypeOpen] = React.useState<boolean>(false);
  const [customCompliancePolicy, setCustomCompliancePolicy] = React.useState<string>('');
  const [isCustomCompliancePolicyOpen, setIsCustomCompliancePolicyOpen] = React.useState<boolean>(false);
  const [openscapProfile, setOpenscapProfile] = React.useState<string>('');
  const [isOpenscapProfileOpen, setIsOpenscapProfileOpen] = React.useState<boolean>(false);

  // Extended support state
  const [extendedSupport, setExtendedSupport] = React.useState<string>('none');

  // Organization ID state
  const [organizationId, setOrganizationId] = React.useState<string>('11009103');

  // Systemd services state - now using arrays for chip-based input
  const [systemdDisabledServices, setSystemdDisabledServices] = React.useState<string[]>([]);
  const [systemdMaskedServices, setSystemdMaskedServices] = React.useState<string[]>([]);
  const [systemdEnabledServices, setSystemdEnabledServices] = React.useState<string[]>([]);
  
  // Input values for typing new services
  const [disabledServicesInput, setDisabledServicesInput] = React.useState<string>('');
  const [maskedServicesInput, setMaskedServicesInput] = React.useState<string>('');
  const [enabledServicesInput, setEnabledServicesInput] = React.useState<string>('');

  // OpenSCAP inheritance tracking
  const [openscapAddedPackagesCount, setOpenscapAddedPackagesCount] = React.useState<number>(0);
  const [openscapAddedServicesCount, setOpenscapAddedServicesCount] = React.useState<number>(0);

  // Firewall state
  const [firewallPorts, setFirewallPorts] = React.useState<string[]>(['']);
  const [firewallDisabledServices, setFirewallDisabledServices] = React.useState<string[]>(['']);
  const [firewallEnabledServices, setFirewallEnabledServices] = React.useState<string[]>(['']);





  // Specialty keyboards state
  const [specialtyKeyboard, setSpecialtyKeyboard] = React.useState<string>('');
  const [isSpecialtyKeyboardOpen, setIsSpecialtyKeyboardOpen] = React.useState<boolean>(false);

  // User management helper functions
  const addUser = () => {
    const newUser: UserRow = {
      id: Date.now().toString(),
      isAdministrator: false,
      username: '',
      password: '',
      sshKey: '',
      groups: [],
      groupInput: '',
      isEditing: false
    };
    setUsers(prev => [...prev, newUser]);
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    // Clean up username validation errors for the removed user
    setUsernameErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[userId];
      return newErrors;
    });
  };

  const updateUser = (userId: string, field: keyof UserRow, value: any) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, [field]: value } : user
    ));
  };

  const checkDuplicateUsername = (currentUserId: string, username: string) => {
    if (!username.trim()) return false;
    return users.some(user => user.id !== currentUserId && user.username.trim() === username.trim());
  };

  const addGroupToUser = (userId: string, group: string) => {
    if (!group.trim()) return;
    const user = users.find(u => u.id === userId);
    if (user && !user.groups.includes(group.trim())) {
      updateUser(userId, 'groups', [...user.groups, group.trim()]);
    }
  };

  const removeGroupFromUser = (userId: string, groupToRemove: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, 'groups', user.groups.filter(g => g !== groupToRemove));
    }
  };

  const updateUserGroupInput = (userId: string, input: string) => {
    updateUser(userId, 'groupInput', input);
  };

  const handleGroupInputChange = (userId: string, value: string) => {
    if (value.includes(',')) {
      // Extract group name before comma and add as chip
      const newGroup = value.split(',')[0].trim();
      if (newGroup) {
        addGroupToUser(userId, newGroup);
      }
      updateUserGroupInput(userId, ''); // Clear input after adding
    } else {
      updateUserGroupInput(userId, value);
    }
  };

  
  // Track what the user has modified to detect migration-only changes
  const [modifiedFields, setModifiedFields] = React.useState<Set<string>>(new Set());

  // Reset form to defaults when modal opens for new image creation
  React.useEffect(() => {
    if (!editingImage) {
      setImageName('my-custom-image');
      setImageDetails('');
    }
  }, [editingImage]);

  // Initialize form with data when editing an existing image
  React.useEffect(() => {
    if (editingImage) {
      // Set basic image information
      setImageName(editingImage.name);
      setBaseImageRelease(editingImage.currentRelease);
      
      // For demo-edit-showcase, pre-populate with interesting configuration
      if (editingImage.name === 'demo-edit-showcase') {
        setImageDetails('Demo image showcasing comprehensive configuration options for editing workflow demonstration');
        setSelectedCloudProvider(['aws', 'gcp']);
        setSelectedIntegration('integration-1');
        setAwsAccountId('123456789012');
        setGcpAccountType('Service Account');
        setGcpEmailOrDomain('demo-service@example.com');
        setPrivateCloudFormat(['ova', 'vmdk']);
        setOtherFormat(['wsl']);
        setRepeatableBuildOption('enable');
        // Pre-populate with OpenSCAP inheritance and profile selection for demo
        setComplianceType('openscap');
        setOpenscapProfile('cis-rhel9-level2-server');
        addOpenscapInheritance('CIS Red Hat Enterprise Linux 9 Benchmark for Level 2 - Server');
        setTimezone('America/New_York');
        setNtpServers(['pool.ntp.org', 'time.nist.gov']);
        setHostname('demo-showcase-host');
        setUsers([
          {
            id: '1',
            isAdministrator: true,
            username: 'admin',
            password: 'demo-password',
            sshKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC... demo@example.com',
            groups: ['wheel', 'docker'],
            groupInput: '',
            isEditing: false
          },
          {
            id: '2',
            isAdministrator: false,
            username: 'deploy',
            password: 'deploy-password',
            sshKey: '',
            groups: ['deploy'],
            groupInput: '',
            isEditing: false
          }
        ]);
        setFirewallPorts(['80:tcp', '443:tcp', '22:ssh']);
        setFirewallEnabledServices(['ssh', 'http', 'https']);
        setSystemdEnabledServices(['nginx', 'postgresql', 'redis']);
        setKernelAppend(['console=ttyS0']);
        
        // Add some demo packages and repositories
        setSelectedPackages([
          { id: 'httpd', name: 'httpd', version: '2.4.53', repository: 'AppStream' },
          { id: 'nginx', name: 'nginx', version: '1.20.1', repository: 'EPEL' },
          { id: 'postgresql', name: 'postgresql', version: '13.7', repository: 'AppStream' }
        ]);
        
        setRepositoryRows([
          // Add demo repository with packages  
          {
            id: 'demo-repo-1',
            repository: 'Red Hat Enterprise Linux AppStream',
            repositorySearchTerm: 'Red Hat Enterprise Linux AppStream',
            packageSearchTerm: '',
            selectedPackage: null,
            selectedPackages: [
              { id: 'httpd', name: 'httpd', version: '2.4.53', repository: 'AppStream' },
              { id: 'postgresql', name: 'postgresql', version: '13.7', repository: 'AppStream' }
            ],
            repositoryPackageCount: 4521,
            lastSelectedPackage: { id: 'postgresql', name: 'postgresql', version: '13.7', repository: 'AppStream' },
            isLocked: true,
            isRepositoryDropdownOpen: false,
            searchResults: [],
            isOpenSCAPRequired: false,
            isLoading: false,
            isRepositorySearching: false,
            lightspeedRecommendations: []
          },
          // Empty row for user interaction (will be moved to bottom by addOpenscapInheritance)
          {
            id: 'user-row-1',
            repository: '',
            repositorySearchTerm: '',
            packageSearchTerm: '',
            selectedPackage: null,
            isLocked: false,
            isRepositoryDropdownOpen: false,
            searchResults: [],
            isOpenSCAPRequired: false,
            isLoading: false,
            isRepositorySearching: false
          }
        ]);
        
        // Automatically navigate to Review tab to show all configurations
        setActiveTabKey(3);
      }
    }
  }, [editingImage]);
  
  // Check if user should see migration suggestion (only in editing mode)
  const shouldShowMigrationSuggestion = React.useMemo(() => {
    // Only show in editing mode (when editingImage exists)
    if (!editingImage) return false;
    
    // Only show if they've changed the release
    return modifiedFields.has('baseImageRelease');
  }, [modifiedFields, editingImage]);

  // Helper function to handle cloud provider selection with tracking
  const handleCloudProviderSelect = (provider: string) => {
    setSelectedCloudProvider(prev => {
      const isSelected = prev.includes(provider);
      if (isSelected) {
        // Remove provider if already selected
        return prev.filter(p => p !== provider);
      } else {
        // Add provider if not selected
        return [...prev, provider];
      }
    });
    // Track target environment change
    setModifiedFields(prev => new Set(prev.add('targetEnvironment')));
    // Clear target environment validation error when user makes a selection
    if (validationErrors.targetEnvironment) {
      const newErrors = { ...validationErrors };
      delete newErrors.targetEnvironment;
      setValidationErrors(newErrors);
    }
  };

  // Helper function to handle other format selection
  const handleOtherFormatSelect = (format: string) => {
    setOtherFormat(prev => {
      const isSelected = prev.includes(format);
      if (isSelected) {
        // Remove format if already selected
        return prev.filter(f => f !== format);
      } else {
        // Add format if not selected
        return [...prev, format];
      }
    });
    // Clear target environment validation error when user makes a selection
    if (validationErrors.targetEnvironment) {
      const newErrors = { ...validationErrors };
      delete newErrors.targetEnvironment;
      setValidationErrors(newErrors);
    }
  };
  
  // Helper function to handle private cloud format selection
  const handlePrivateCloudFormatSelect = (format: string) => {
    setPrivateCloudFormat(prev => {
      const isSelected = prev.includes(format);
      if (isSelected) {
        // Remove format if already selected
        return prev.filter(f => f !== format);
      } else {
        // Add format if not selected
        return [...prev, format];
      }
    });
    // Clear target environment validation error when user makes a selection
    if (validationErrors.targetEnvironment) {
      const newErrors = { ...validationErrors };
      delete newErrors.targetEnvironment;
      setValidationErrors(newErrors);
    }
  };



  // Selected packages state - include OpenSCAP packages initially
  const [selectedPackages, setSelectedPackages] = React.useState<any[]>([
    { id: 'aide', name: 'aide', version: '0.16', repository: 'BaseOS' },
    { id: 'sudo', name: 'sudo', version: '1.9.5p2', repository: 'BaseOS' }
  ]);
  const [packageSearchTerm, setPackageSearchTerm] = React.useState<string>('');
  const [packagePage, setPackagePage] = React.useState<number>(1);
  const [packagePerPage, setPackagePerPage] = React.useState<number>(10);
  const [isPackageAccordionExpanded, setIsPackageAccordionExpanded] = React.useState<boolean>(false);

  // Repository rows state - each row represents a repository-package selection
  interface RepositoryRow {
    id: string;
    repository: string;
    repositorySearchTerm: string;
    packageSearchTerm: string;
    selectedPackage: any | null; // Legacy for existing OpenSCAP packages
    selectedPackages?: any[]; // New multi-selection support
    repositoryPackageCount?: number; // Total packages available in repository
    lastSelectedPackage?: any; // For Lightspeed recommendations
    isLocked: boolean;
    isRepositoryDropdownOpen: boolean;
    searchResults: any[];
    isOpenSCAPRequired: boolean;
    isLoading: boolean;
    isRepositorySearching: boolean;
    lightspeedRecommendations?: any[]; // Lightspeed package suggestions
  }

  const [repositoryRows, setRepositoryRows] = React.useState<RepositoryRow[]>([
    {
      id: 'row-1',
      repository: '',
      repositorySearchTerm: '',
      packageSearchTerm: '',
      selectedPackage: null,
      isLocked: false,
      isRepositoryDropdownOpen: false,
      searchResults: [],
      isOpenSCAPRequired: false,
      isLoading: false,
      isRepositorySearching: false
    }
  ]);
  
  // Package interface now uses search mode only  
  // Browse table state - kept as stubs to prevent errors (legacy references)
  const expandedRepositories = new Set<string>();
  const setExpandedRepositories = (_value: any) => {}; // Stub function
  const repositorySearchTerm = '';
  const setRepositorySearchTerm = (_value: any) => {}; // Stub function  
  const repositoryPackageSearchTerms: {[key: string]: string} = {};
  const setRepositoryPackageSearchTerms = (_value: any) => {}; // Stub function
  const repositoryPagination: {[key: string]: number} = {};
  const setRepositoryPagination = (_value: any) => {}; // Stub function
  const [repositoryTablePage, setRepositoryTablePage] = React.useState<number>(1);
  const repositoriesPerPage = 5;

  // Repository data structure for table view (matches screenshot format)
  const repositoryData = [
    {
      id: 'epel_test',
      name: 'epel_test',
      url: 'https://dl.fedoraproject.org/pub/epel/9/Everything/x86_64/',
      architecture: 'Any',
      version: 'Any',
      packageCount: 24209,
      status: 'valid',
      packages: [
        { id: 'aide', name: 'aide', version: '0.16', description: 'Advanced Intrusion Detection Environment', applicationStream: 'RHEL 9', retirementDate: '2032-05-31' },
        { id: 'sudo', name: 'sudo', version: '1.9.5p2', description: 'Execute commands as another user', applicationStream: 'RHEL 9', retirementDate: '2032-05-31' },
        { id: 'vim', name: 'vim', version: '9.0', description: 'Vi IMproved text editor', applicationStream: 'RHEL 9', retirementDate: '2032-05-31' },
        { id: 'curl', name: 'curl', version: '7.76.1', description: 'Command line tool for transferring data', applicationStream: 'RHEL 9', retirementDate: '2032-05-31' },
        { id: 'wget', name: 'wget', version: '1.21.1', description: 'Network utility to retrieve files from servers', applicationStream: 'RHEL 9', retirementDate: '2032-05-31' },
        { id: 'git', name: 'git', version: '2.39.1', description: 'Distributed version control system', applicationStream: 'RHEL 9', retirementDate: '2032-05-31' },
        { id: 'python3', name: 'python3', version: '3.9.16', description: 'Python 3 programming language', applicationStream: '3.9', retirementDate: '2032-05-31' },
        { id: 'systemd', name: 'systemd', version: '250', description: 'System and service manager', applicationStream: 'RHEL 9', retirementDate: '2032-05-31' }
      ]
    },
    {
      id: 'fedora',
      name: 'Fedora',
      url: 'http://fedora.mirror.constant.com/fedora/linux/releases/36/Everything/x86_64/os/',
      architecture: 'Any',
      version: 'Any',
      packageCount: 0,
      status: 'invalid',
      packages: [
        { id: 'httpd', name: 'httpd', version: '2.4.53', description: 'Apache HTTP Server', applicationStream: '2.4', retirementDate: '2030-12-31' },
        { id: 'nginx', name: 'nginx', version: '1.20.1', description: 'High performance web server', applicationStream: '1.20', retirementDate: '2030-06-30' },
        { id: 'postgresql', name: 'postgresql', version: '13.7', description: 'PostgreSQL database server', applicationStream: '13', retirementDate: '2030-11-13' }
      ]
    },
    {
      id: 'microshift-corp-testing',
      name: 'microshift-corp-testing',
      url: 'https://download.corp.fedorainfracloud.org/results/@redhat-et/microshift-testing/epel-8-x86_64/',
      architecture: 'Any',
      version: 'Any',
      packageCount: 145,
      status: 'valid',
      packages: [
        { id: 'htop', name: 'htop', version: '3.2.1', description: 'Interactive process viewer', applicationStream: '3.2', retirementDate: '2030-12-01' },
        { id: 'ncdu', name: 'ncdu', version: '1.16', description: 'NCurses disk usage analyzer', applicationStream: '1.16', retirementDate: '2031-06-30' },
        { id: 'fish', name: 'fish', version: '3.4.1', description: 'Friendly Interactive Shell', applicationStream: '3.4', retirementDate: '2030-08-15' }
      ]
    },
    {
      id: 'microshift-manifests-example',
      name: 'microshift-manifests-example',
      url: 'https://copr.fedorainfracloud.org/coprs/mangelajo/microshift-hello-world/',
      architecture: 'Any',
      version: 'Any',
      packageCount: 0,
      status: 'invalid',
      packages: [
        { id: 'podman', name: 'podman', version: '4.4.1', description: 'Daemonless container engine', applicationStream: '4.4', retirementDate: '2030-12-31' },
        { id: 'buildah', name: 'buildah', version: '1.29.0', description: 'Build container images', applicationStream: '1.29', retirementDate: '2030-12-31' }
      ]
    },
    {
      id: 'microshift-x86_64',
      name: 'microshift-x86_64',
      url: 'https://download.corp.fedorainfracloud.org/results/@redhat-et/microshift/epel-9-x86_64/',
      architecture: 'Any',
      version: 'Any',
      packageCount: 6,
      status: 'valid',
      packages: [
        { id: 'enterprise-tool', name: 'enterprise-tool', version: '2.1.0', description: 'Internal enterprise management tool', applicationStream: '2.1', retirementDate: '2025-12-31' },
        { id: 'monitoring-agent', name: 'monitoring-agent', version: '1.5.3', description: 'Custom monitoring solution', applicationStream: '1.5', retirementDate: '2025-06-30' }
      ]
    },
    {
      id: 'odoo-nights',
      name: 'Odoo Nights',
      url: 'https://nightly.odoo.com/16.0/nightly/rpm/',
      architecture: 'Any',
      version: 'Any',
      packageCount: 1,
      status: 'valid',
      packages: [
        { id: 'odoo', name: 'odoo', version: '16.0', description: 'Open Source ERP and CRM', applicationStream: 'Odoo', retirementDate: '2025-12-31' }
      ]
    }
  ];
  
  const [searchPackageType, setSearchPackageType] = React.useState<string>('individual');
  const [isSearchPackageTypeOpen, setIsSearchPackageTypeOpen] = React.useState<boolean>(false);
  
  // Separate state for Selected packages section dropdown
  const [selectedPackageType, setSelectedPackageType] = React.useState<string>('individual');
  const [isSelectedPackageTypeOpen, setIsSelectedPackageTypeOpen] = React.useState<boolean>(false);
  
  // Typeahead dropdown state for demo
  const [repositoryTypeaheadOpen, setRepositoryTypeaheadOpen] = React.useState<boolean>(false);
  const [repositoryTypeaheadValue, setRepositoryTypeaheadValue] = React.useState<string>('');
  const [packageTypeaheadOpen, setPackageTypeaheadOpen] = React.useState<boolean>(false);
  const [packageTypeaheadValue, setPackageTypeaheadValue] = React.useState<string>('');
  
  // External search state
  const [isSearchingExternalRepos, setIsSearchingExternalRepos] = React.useState<boolean>(false);
  const [isSearchingExternalPackages, setIsSearchingExternalPackages] = React.useState<boolean>(false);
  
  // Dynamic table rows state
  const [addedRepositories, setAddedRepositories] = React.useState<Array<{id: string, name: string, applicationStream: string, retirementDate: string}>>([]);
  const [addedPackages, setAddedPackages] = React.useState<Array<{id: string, name: string, applicationStream: string, retirementDate: string}>>([]);
  
  // Lightspeed feature state - track user selections for AI suggestions
  const [repositorySelectionHistory, setRepositorySelectionHistory] = React.useState<string[]>([]);
  const [packageSelectionHistory, setPackageSelectionHistory] = React.useState<string[]>([]);
  const [searchResultsPage, setSearchResultsPage] = React.useState<number>(1);
  const [searchResultsPerPage, setSearchResultsPerPage] = React.useState<number>(10);

  // Function to calculate dropdown position to avoid modal overflow
  const getDropdownPosition = (inputElement: HTMLElement | null) => {
    if (!inputElement) return { top: '100%', bottom: 'auto', marginTop: '4px', marginBottom: '0' };
    
    const inputRect = inputElement.getBoundingClientRect();
    const modalElement = contentAreaRef.current;
    const modalRect = modalElement?.getBoundingClientRect();
    
    if (!modalRect) return { top: '100%', bottom: 'auto', marginTop: '4px', marginBottom: '0' };
    
    const spaceBelow = modalRect.bottom - inputRect.bottom;
    const spaceAbove = inputRect.top - modalRect.top;
    const dropdownHeight = 200; // maxHeight of dropdown
    
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      // Position above input
      return { top: 'auto', bottom: '100%', marginTop: '0', marginBottom: '4px' };
    } else {
      // Position below input (default)
      return { top: '100%', bottom: 'auto', marginTop: '4px', marginBottom: '0' };
    }
  };


  
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
  const [availableRepositories, setAvailableRepositories] = React.useState<string[]>([
    'Red Hat',
    'EPEL',
    'CentOS Stream',
    'Fedora',
    'RPM Fusion',
    'Custom Repository 1',
    'Custom Repository 2'
  ]);

  // Search package types
  const searchPackageTypes = [
    'Individual packages',
    'Package groups'
  ];

  // Mock data for typeahead dropdowns
  const mockRepositories = [
    'Red Hat Enterprise Linux BaseOS',
    'Red Hat Enterprise Linux AppStream', 
    'Red Hat Enterprise Linux CRB',
    'EPEL (Extra Packages for Enterprise Linux)',
    'Red Hat CodeReady Builder',
    'Custom Repository',
    'Third-party Repository'
  ];

  const mockPackages = [
    'bash - Bash shell',
    'bind - DNS server',
    'bzip2 - Compression utility',
    'httpd - Apache HTTP Server',
    'nginx - High performance web server',
    'mysql-server - MySQL database server',
    'postgresql-server - PostgreSQL database server',
    'php - PHP scripting language',
    'nodejs - JavaScript runtime',
    'python3 - Python programming language',
    'gcc - GNU Compiler Collection',
    'git - Version control system',
    'vim - Vi improved text editor'
  ];

  // External search mock data
  const externalRepositories = [
    'something3 - External repository',
    'something-dev - Development repository',
    'something-tools - Tools repository',
    'external-repo-1 - External repo 1',
    'external-repo-2 - External repo 2'
  ];

  const externalPackages = [
    'something3 - External package',
    'something-dev - Development package',
    'something-tools - Tools package',
    'external-package-1 - External package 1',
    'external-package-2 - External package 2'
  ];

  // Sample search results data
  const allSearchResults = [
    { id: 'search-zsh', name: 'zsh', version: '5.8', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', repository: 'BaseOS' },
    { id: 'search-bash', name: 'bash', version: '5.1.8', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', repository: 'BaseOS' },
    { id: 'search-fish', name: 'fish', version: '3.4', applicationStream: '3.4', retirementDate: '2030-08-15', repository: 'AppStream' },
    { id: 'search-tmux', name: 'tmux', version: '3.2a', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', repository: 'BaseOS' },
    { id: 'search-screen', name: 'screen', version: '4.8.0', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', repository: 'BaseOS' },
    { id: 'search-htop', name: 'htop', version: '3.2.1', applicationStream: '3.2', retirementDate: '2030-12-01', repository: 'EPEL' },
    { id: 'search-ncdu', name: 'ncdu', version: '1.16', applicationStream: '1.16', retirementDate: '2031-06-30', repository: 'EPEL' },
    { id: 'search-tree', name: 'tree', version: '1.8.0', applicationStream: 'RHEL 9', retirementDate: '2032-05-31', repository: 'BaseOS' }
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
    const selectedValue = String(selection);
    // For activation key, just set the selection (required field)
    setSelectedActivationKey(selectedValue);
    setIsActivationKeyOpen(false);
  };

  // Removed unused onOutputReleaseSelect function

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

  // Drilldown menu handlers for release dropdown
  const onReleaseToggleClick = () => {
    setIsBaseImageReleaseOpen(!isBaseImageReleaseOpen);
    setReleaseMenuDrilledIn([]);
    setReleaseDrilldownPath([]);
    setActiveReleaseMenu('rootReleaseMenu');
  };

  const onReleaseDrillIn = (
    _event: React.KeyboardEvent | React.MouseEvent,
    fromMenuId: string,
    toMenuId: string,
    pathId: string
  ) => {
    setReleaseMenuDrilledIn([...releaseMenuDrilledIn, fromMenuId]);
    setReleaseDrilldownPath([...releaseDrilldownPath, pathId]);
    setActiveReleaseMenu(toMenuId);
  };

  const onReleaseDrillOut = (_event: React.KeyboardEvent | React.MouseEvent, toMenuId: string) => {
    setReleaseMenuDrilledIn(releaseMenuDrilledIn.slice(0, releaseMenuDrilledIn.length - 1));
    setReleaseDrilldownPath(releaseDrilldownPath.slice(0, releaseDrilldownPath.length - 1));
    setActiveReleaseMenu(toMenuId);
  };

  const setReleaseMenuHeight = (menuId: string, height: number) => {
    if (releaseMenuHeights[menuId] === undefined || (menuId !== 'rootReleaseMenu' && releaseMenuHeights[menuId] !== height)) {
      setReleaseMenuHeights({
        ...releaseMenuHeights,
        [menuId]: height
      });
    }
  };

  const onReleaseItemSelect = (itemId: string) => {
    setBaseImageRelease(itemId);
    setIsBaseImageReleaseOpen(false);
    setModifiedFields(prev => new Set(prev.add('baseImageRelease')));
    // Reset drilldown state
    setReleaseMenuDrilledIn([]);
    setReleaseDrilldownPath([]);
    setActiveReleaseMenu('rootReleaseMenu');
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

  const onComplianceTypeSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setComplianceType(selection);
      // Clear the other compliance selections when switching types
      if (selection === 'custom') {
        setOpenscapProfile('');
        clearOpenscapInheritance();
      } else if (selection === 'openscap') {
        setCustomCompliancePolicy('');
      }
      setIsComplianceTypeOpen(false);
    }
  };

  const onCustomCompliancePolicySelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      if (customCompliancePolicy === selection) {
        // Toggle off - clear selection and reset compliance type
        setCustomCompliancePolicy('');
        setComplianceType('');
      } else {
        setCustomCompliancePolicy(selection);
        setComplianceType('custom'); // Auto-select the custom radio button
      }
      setIsCustomCompliancePolicyOpen(false);
    }
  };

  const onOpenscapProfileSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      if (openscapProfile === selection) {
        // Toggle off - clear selection and reset compliance type
        setOpenscapProfile('');
        setComplianceType('');
        // Clear OpenSCAP inheritance when deselecting
        clearOpenscapInheritance();
      } else {
        setOpenscapProfile(selection);
        setComplianceType('openscap'); // Auto-select the OpenSCAP radio button
        // Add OpenSCAP inheritance when selecting a profile
        addOpenscapInheritance(selection);
      }
      setIsOpenscapProfileOpen(false);
    }
  };

  // Function to clear OpenSCAP-added items
  const clearOpenscapInheritance = () => {
    console.log('Clearing OpenSCAP inheritance');
    
    // Reset disabled services (remove OpenSCAP additions)
            setSystemdDisabledServices([]);
    setOpenscapAddedServicesCount(0);
    setOpenscapAddedPackagesCount(0);
    
    // Keep existing OpenSCAP packages but reset any additional ones
    setRepositoryRows(prev => prev.filter(row => row.isOpenSCAPRequired || !row.id.startsWith('openscap-')));
  };

  // Function to add OpenSCAP inheritance based on selected profile
  const addOpenscapInheritance = (profile: string) => {
    console.log('OpenSCAP inheritance triggered for profile:', profile);
    
    // Define OpenSCAP inheritance rules based on profile
    const inheritanceRules: { [key: string]: { services: string[], additionalPackages?: any[], repositories?: any[] } } = {
      'CIS Red Hat Enterprise Linux 9 Benchmark for Level 1 - Server': {
        services: ['telnet', 'rsh'],
        additionalPackages: [
          { id: 'rsyslog', name: 'rsyslog', version: '8.2102.0', repository: 'BaseOS' }
        ]
      },
      'CIS Red Hat Enterprise Linux 9 Benchmark for Level 2 - Server': {
        services: ['telnet', 'rsh', 'rlogin'],
        additionalPackages: [
          { id: 'rsyslog', name: 'rsyslog', version: '8.2102.0', repository: 'BaseOS' },
          { id: 'chrony', name: 'chrony', version: '4.2', repository: 'BaseOS' }
        ]
      },
      'DISA STIG for Red Hat Enterprise Linux 9': {
        services: ['telnet', 'rsh', 'rlogin', 'tftp', 'xinetd'],
        additionalPackages: [
          { id: 'firewalld', name: 'firewalld', version: '1.2.3', repository: 'BaseOS' },
          { id: 'audit', name: 'audit', version: '3.0.7', repository: 'BaseOS' },
          { id: 'rsyslog', name: 'rsyslog', version: '8.2102.0', repository: 'BaseOS' }
        ]
      },
      'Australian Cyber Security Centre (ACSC) Essential Eight': {
        services: ['telnet', 'ftp'],
        additionalPackages: [
          { id: 'chrony', name: 'chrony', version: '4.2', repository: 'BaseOS' }
        ]
      }
    };

    const rules = inheritanceRules[profile];
    
    // If no specific rules found, use a default CIS Level 2 pattern
    const effectiveRules = rules || {
      services: ['telnet', 'rsh', 'rlogin'],
      additionalPackages: [
        { id: 'rsyslog', name: 'rsyslog', version: '8.2102.0', repository: 'BaseOS' },
        { id: 'chrony', name: 'chrony', version: '4.2', repository: 'BaseOS' }
      ]
    };
    
    // Add disabled services
    if (effectiveRules.services.length > 0) {
      setSystemdDisabledServices(effectiveRules.services);
      setOpenscapAddedServicesCount(effectiveRules.services.length);
    }

    // Add OpenSCAP packages (always include base aide/sudo, plus any additional packages)
    const newRows: RepositoryRow[] = [];
    
    // Always add the base OpenSCAP row with aide and sudo
    newRows.push({
      id: 'openscap-1',
      repository: 'Red Hat',
      repositorySearchTerm: '',
      packageSearchTerm: '',
      selectedPackage: null,
      selectedPackages: [
        { id: 'aide', name: 'aide', version: '0.16', repository: 'BaseOS' },
        { id: 'sudo', name: 'sudo', version: '1.9.5p2', repository: 'BaseOS' }
      ],
      isLocked: true,
      isRepositoryDropdownOpen: false,
      searchResults: [],
      isOpenSCAPRequired: true,
      isLoading: false,
      isRepositorySearching: false
    });
    
    // Add additional packages if any
    if (effectiveRules.additionalPackages) {
      const additionalRows = effectiveRules.additionalPackages.map((pkg, index) => ({
        id: `openscap-additional-${index + 1}`,
        repository: 'Red Hat',
        repositorySearchTerm: '',
        isRepositoryDropdownOpen: false,
        isRepositorySearching: false,
        packageSearchTerm: '',
        searchResults: [],
        selectedPackages: [pkg],
        isLocked: true,
        isLoading: false,
        selectedPackage: pkg,
        lastSelectedPackage: null,
        lightspeedRecommendations: [],
        isOpenSCAPRequired: true
      }));
      newRows.push(...additionalRows);
    }
    
    // Add OpenSCAP rows at the beginning, keeping user rows at the bottom
    setRepositoryRows(prev => [...newRows, ...prev.filter(row => !row.isOpenSCAPRequired)]);
    setOpenscapAddedPackagesCount(2 + (effectiveRules.additionalPackages?.length || 0));
  };

  const onIntegrationSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      if (selectedIntegration === selection) {
        // Toggle off - clear selection
        setSelectedIntegration('');
        setAwsAccountId('');
      } else {
        setSelectedIntegration(selection);
        
        // Clear AWS login validation error
        if (validationErrors.awsLogin) {
          const newErrors = { ...validationErrors };
          delete newErrors.awsLogin;
          setValidationErrors(newErrors);
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
      setIsIntegrationOpen(false);
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
      
      // Clear GCP login validation error
      if (validationErrors.gcpLogin && selection !== 'Google account') {
        const newErrors = { ...validationErrors };
        delete newErrors.gcpLogin;
        setValidationErrors(newErrors);
      }
      
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
    // For demo purposes, allow authorization without requiring specific credentials
    setIsAzureAuthorized(true);
    
    // Clear Azure login validation error
    if (validationErrors.azureLogin) {
      const newErrors = { ...validationErrors };
      delete newErrors.azureLogin;
      setValidationErrors(newErrors);
    }
  };

  // Package management functions (for the old accordion-style package browser)
  const handleOldPackageSelection = (packageId: string, isSelected: boolean) => {
    if (isSelected) {
      // Find the package object from packageData
      const packageObj = packageData.find(pkg => pkg.id === packageId);
      if (packageObj) {
        setSelectedPackages(prev => {
          const existingIds = prev.map(p => p.id || p);
          if (!existingIds.includes(packageId)) {
            return [...prev, packageObj];
          }
          return prev;
        });
      }
    } else {
      setSelectedPackages(selectedPackages.filter(pkg => (pkg.id || pkg) !== packageId));
    }
    // Track package modifications
    setModifiedFields(prev => new Set(prev.add('packages')));
  };

  const handleSelectAllPackages = (isSelected: boolean) => {
    if (isSelected) {
      const filteredPackages = getFilteredPackages();
      setSelectedPackages(prev => {
        const existingIds = prev.map(p => p.id || p);
        const newPackages = filteredPackages.filter(pkg => !existingIds.includes(pkg.id));
        return [...prev, ...newPackages];
      });
    } else {
      const filteredPackages = getFilteredPackages();
      const filteredPackageIds = filteredPackages.map(pkg => pkg.id);
      setSelectedPackages(selectedPackages.filter(pkg => !filteredPackageIds.includes(pkg.id || pkg)));
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

  // Selected packages section dropdown handler
  const onSelectedPackageTypeSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined,
  ) => {
    if (typeof selection === 'string') {
      setSelectedPackageType(selection === 'individual' ? 'individual' : 'groups');
      setIsSelectedPackageTypeOpen(false);
    }
  };

  // Lightspeed AI suggestion generators
  const generateRepositoryLightspeedSuggestions = (): string[] => {
    const suggestions: string[] = [];
    
    // Generate suggestions based on combined package and repository history
    const hasSelectionHistory = repositorySelectionHistory.length > 0 || packageSelectionHistory.length > 0;
    
    if (hasSelectionHistory) {
      // Check recent package selections to suggest relevant repositories
      if (packageSelectionHistory.length > 0) {
        const lastPackage = packageSelectionHistory[0].toLowerCase();
        
        // Shell/development tools - suggest development repositories
        if (lastPackage.includes('bash') || lastPackage.includes('git') || lastPackage.includes('gcc') || lastPackage.includes('vim')) {
          suggestions.push('EPEL (Extra Packages for Enterprise Linux)');
          suggestions.push('Red Hat CodeReady Builder');
          suggestions.push('Red Hat Software Collections');
        }
        // Web servers - suggest web-related repositories
        else if (lastPackage.includes('nginx') || lastPackage.includes('httpd') || lastPackage.includes('php')) {
          suggestions.push('EPEL (Extra Packages for Enterprise Linux)');
          suggestions.push('Red Hat Enterprise Linux AppStream');
          suggestions.push('Custom Web Repository');
        }
        // Database packages - suggest database repositories
        else if (lastPackage.includes('mysql') || lastPackage.includes('postgresql') || lastPackage.includes('database')) {
          suggestions.push('Red Hat Enterprise Linux CRB');
          suggestions.push('Custom Database Repository');
          suggestions.push('EPEL (Extra Packages for Enterprise Linux)');
        }
        // Network/compression tools - suggest general repositories
        else {
          suggestions.push('Red Hat Enterprise Linux AppStream');
          suggestions.push('EPEL (Extra Packages for Enterprise Linux)');
          suggestions.push('Red Hat CodeReady Builder');
        }
      }
      
      // Also consider repository history
      if (repositorySelectionHistory.length > 0) {
        const lastRepo = repositorySelectionHistory[0].toLowerCase();
        if (lastRepo.includes('appstream')) {
          suggestions.push('Red Hat Enterprise Linux CRB');
          suggestions.push('EPEL (Extra Packages for Enterprise Linux)');
        } else if (lastRepo.includes('epel')) {
          suggestions.push('Red Hat Enterprise Linux AppStream');
          suggestions.push('Red Hat CodeReady Builder');
        }
      }
    } else {
      // Default suggestions for new users
      suggestions.push('Red Hat Enterprise Linux AppStream');
      suggestions.push('EPEL (Extra Packages for Enterprise Linux)');
      suggestions.push('Red Hat CodeReady Builder');
    }
    
    // Filter out duplicates and already selected repositories
    const uniqueSuggestions = Array.from(new Set(suggestions));
    const filteredSuggestions = uniqueSuggestions.filter(suggestion => 
      !repositorySelectionHistory.some(selected => 
        selected.toLowerCase() === suggestion.toLowerCase()
      )
    );
    
    return filteredSuggestions.slice(0, 3); // Limit to top 3 suggestions
  };

  const generatePackageLightspeedSuggestions = (): string[] => {
    const suggestions: string[] = [];
    
    // Always show suggestions when user has selection history
    if (packageSelectionHistory.length > 0) {
      const lastSelection = packageSelectionHistory[0].toLowerCase();
      
      // Shell/command line tools - if they selected bash, suggest related tools
      if (lastSelection.includes('bash') || lastSelection.includes('zsh') || lastSelection.includes('fish')) {
        suggestions.push('git - Version control system');
        suggestions.push('vim - Vi improved text editor');
        suggestions.push('htop - Interactive process viewer');
      }
      // Web servers - suggest complementary packages
      else if (lastSelection.includes('nginx') || lastSelection.includes('httpd') || lastSelection.includes('apache')) {
        suggestions.push('php - PHP scripting language');
        suggestions.push('certbot - SSL certificate management');
        suggestions.push('fail2ban - Intrusion prevention');
      }
      // Development tools - suggest related packages
      else if (lastSelection.includes('gcc') || lastSelection.includes('git') || lastSelection.includes('make')) {
        suggestions.push('nodejs - JavaScript runtime');
        suggestions.push('docker - Container platform');
        suggestions.push('python3 - Python programming language');
      }
      // Database tools - suggest related packages
      else if (lastSelection.includes('mysql') || lastSelection.includes('postgresql') || lastSelection.includes('database')) {
        suggestions.push('php - PHP scripting language');
        suggestions.push('python3 - Python programming language');
        suggestions.push('nodejs - JavaScript runtime');
      }
      // Compression tools - suggest file management tools
      else if (lastSelection.includes('bzip2') || lastSelection.includes('gzip') || lastSelection.includes('tar')) {
        suggestions.push('curl - Data transfer utility');
        suggestions.push('wget - File retrieval utility');
        suggestions.push('tree - Directory tree viewer');
      }
      // DNS/network tools - suggest network utilities
      else if (lastSelection.includes('bind') || lastSelection.includes('dns') || lastSelection.includes('network')) {
        suggestions.push('curl - Data transfer utility');
        suggestions.push('nginx - High performance web server');
        suggestions.push('fail2ban - Intrusion prevention');
      }
      // Generic suggestions based on any previous selection
      else {
        suggestions.push('curl - Data transfer utility');
        suggestions.push('git - Version control system');
        suggestions.push('vim - Vi improved text editor');
      }
    } else {
      // Default suggestions for new users
      suggestions.push('curl - Data transfer utility');
      suggestions.push('htop - Interactive process viewer');
      suggestions.push('tree - Directory tree viewer');
    }
    
    // Filter out items already selected to avoid duplicates
    const filteredSuggestions = suggestions.filter(suggestion => 
      !packageSelectionHistory.some(selected => 
        selected.toLowerCase() === suggestion.toLowerCase()
      )
    );
    
    return filteredSuggestions.slice(0, 3); // Limit to top 3 suggestions
  };

  // Typeahead handlers for demo
  const getFilteredTypeaheadRepositories = () => {
    if (!repositoryTypeaheadValue && !isSearchingExternalRepos) {
      // Show Lightspeed suggestions when no input and not searching externally
      return generateRepositoryLightspeedSuggestions();
    }
    
    if (!repositoryTypeaheadValue && isSearchingExternalRepos) {
      // Show all external results when external search is active but no input
      return externalRepositories;
    }
    
    // Show filtered results when typing
    const normalResults = mockRepositories.filter(repo => 
      repo.toLowerCase().startsWith(repositoryTypeaheadValue.toLowerCase())
    );
    
    // If searching externally, also include external results
    if (isSearchingExternalRepos) {
      const externalResults = externalRepositories.filter(repo => 
        repo.toLowerCase().startsWith(repositoryTypeaheadValue.toLowerCase())
      );
      return [...normalResults, ...externalResults];
    }
    
    return normalResults;
  };

  const getFilteredTypeaheadPackages = () => {
    if (!packageTypeaheadValue && !isSearchingExternalPackages) {
      // Show Lightspeed suggestions when no input and not searching externally
      return generatePackageLightspeedSuggestions();
    }
    
    if (!packageTypeaheadValue && isSearchingExternalPackages) {
      // Show all external results when external search is active but no input
      return externalPackages;
    }
    
    // Show filtered results when typing
    const normalResults = mockPackages.filter(pkg => 
      pkg.toLowerCase().startsWith(packageTypeaheadValue.toLowerCase())
    );
    
    // If searching externally, also include external results
    if (isSearchingExternalPackages) {
      const externalResults = externalPackages.filter(pkg => 
        pkg.toLowerCase().startsWith(packageTypeaheadValue.toLowerCase())
      );
      return [...normalResults, ...externalResults];
    }
    
    return normalResults;
  };

  const onRepositoryTypeaheadSelect = (selection: string) => {
    // Add to repositories table at the top
    const newRepository = {
      id: `repo-${Date.now()}`,
      name: selection,
      applicationStream: 'RHEL 9',
      retirementDate: '2032-05-31'
    };
    setAddedRepositories(prev => [newRepository, ...prev]);
    
    // Track selection for Lightspeed suggestions
    setRepositorySelectionHistory(prev => {
      const updated = [selection, ...prev.filter(item => item !== selection)];
      return updated.slice(0, 10); // Keep last 10 selections
    });
    
    // Clear search input and reset external search
    setRepositoryTypeaheadValue('');
    setRepositoryTypeaheadOpen(false);
    setIsSearchingExternalRepos(false);
  };

  const onPackageTypeaheadSelect = (selection: string) => {
    // Add to packages table at the top
    const newPackage = {
      id: `pkg-${Date.now()}`,
      name: selection,
      applicationStream: 'RHEL 9',
      retirementDate: '2032-05-31'
    };
    setAddedPackages(prev => [newPackage, ...prev]);
    
    // Track selection for Lightspeed suggestions
    setPackageSelectionHistory(prev => {
      const updated = [selection, ...prev.filter(item => item !== selection)];
      return updated.slice(0, 10); // Keep last 10 selections
    });
    
    // Clear search input and reset external search
    setPackageTypeaheadValue('');
    setPackageTypeaheadOpen(false);
    setIsSearchingExternalPackages(false);
  };

  // Functions to remove items from tables
  const removeAddedRepository = (id: string) => {
    setAddedRepositories(prev => prev.filter(repo => repo.id !== id));
  };

  const removeAddedPackage = (id: string) => {
    setAddedPackages(prev => prev.filter(pkg => pkg.id !== id));
  };

  // Repository row management functions
  const addRepositoryRow = () => {
    // Lock all existing non-OpenSCAP rows when adding a new one
    const lockedRows = repositoryRows.map(row => {
      if (!row.isOpenSCAPRequired && row.repository) {
        return {
          ...row,
          isLocked: true,
          isRepositorySearching: false,
          // Clear search state to properly close dropdowns
          packageSearchTerm: '',
          searchResults: [],
          isLoading: false
        };
      }
      return row;
    });

    const newRow: RepositoryRow = {
      id: `row-${Date.now()}`,
      repository: 'Red Hat',
      repositorySearchTerm: 'Red Hat',
      packageSearchTerm: '',
      selectedPackage: null,
      isLocked: false,
      isRepositoryDropdownOpen: false,
      searchResults: [],
      isOpenSCAPRequired: false,
      isLoading: false,
      isRepositorySearching: false
    };
    setRepositoryRows([...lockedRows, newRow]);
  };

  const handleRepositorySearchClear = (rowId: string) => {
    updateRepositoryRow(rowId, {
      repositorySearchTerm: '',
      repository: '',
      isRepositorySearching: false
    });
  };

    const updateRepositoryRow = (rowId: string, updates: Partial<RepositoryRow>) => {
    setRepositoryRows(prev =>
      prev.map(row => 
        row.id === rowId ? { ...row, ...updates } : row
      )
    );
  };

  const handleRepositorySelect = (rowId: string, repository: string) => {
    // Mock package counts for different repositories
    const getRepositoryPackageCount = (repoName: string): number => {
      const packageCounts: {[key: string]: number} = {
        'Red Hat Enterprise Linux BaseOS': 2847,
        'Red Hat Enterprise Linux AppStream': 4521,
        'Red Hat Enterprise Linux CodeReady Builder': 1863,
        'Red Hat': 2847,
        'EPEL': 15420,
        'Custom Repository': 342,
        'Docker CE': 156,
        'PostgreSQL': 89,
        'MongoDB': 124,
        'Grafana': 67
      };
      
      // Default package count for unknown repositories
      return packageCounts[repoName] || Math.floor(Math.random() * 2000) + 500;
    };

    updateRepositoryRow(rowId, { 
      repository, 
      repositorySearchTerm: repository,
      repositoryPackageCount: getRepositoryPackageCount(repository),
      isRepositoryDropdownOpen: false,
      packageSearchTerm: '', // Reset search when repository changes
      searchResults: [],
      selectedPackage: null,
      selectedPackages: [],
      isLocked: false,
      isRepositorySearching: false
    });

    // Auto-scroll to show the dropdown that will appear when repository is selected
    setTimeout(() => {
      const element = document.getElementById(`package-${rowId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 300);
  };

  const handleRepositorySearchInput = (rowId: string, searchTerm: string) => {
    if (searchTerm.trim() === '') {
      // Empty search term should have same effect as clear
      updateRepositoryRow(rowId, {
        repositorySearchTerm: '',
        repository: '',
        isRepositorySearching: false
      });
    } else {
      updateRepositoryRow(rowId, { 
        repositorySearchTerm: searchTerm,
        isRepositorySearching: true
      });
    }
  };

  const handleRepositorySearchSelect = (rowId: string, repository: string) => {
    // If it's a new repository not in the list, add it
    if (!availableRepositories.includes(repository) && repository.trim()) {
      setAvailableRepositories(prev => [...prev, repository.trim()]);
    }
    handleRepositorySelect(rowId, repository);
  };

  const handleRowPackageSearchInput = (rowId: string, searchTerm: string) => {
    // Update the search term for this row (without performing search)
    updateRepositoryRow(rowId, { packageSearchTerm: searchTerm });
  };

  const performRowPackageSearch = (rowId: string) => {
    // Perform search if repository is selected and term is not empty
    const row = repositoryRows.find(r => r.id === rowId);
    if (row && row.repository && row.packageSearchTerm.trim()) {
      // Set loading state
      updateRepositoryRow(rowId, { isLoading: true, searchResults: [] });
      
      // Auto-scroll to ensure dropdown visibility
      setTimeout(() => {
        const element = document.getElementById(`package-${rowId}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 100);
      
      // Simulate async search with timeout (replace with real API call)
      setTimeout(() => {
        const filtered = allSearchResults.filter(pkg => 
          pkg.name.toLowerCase().includes(row.packageSearchTerm.toLowerCase())
        );
        updateRepositoryRow(rowId, { searchResults: filtered, isLoading: false });
        
        // Scroll again after results load to ensure full dropdown is visible
        setTimeout(() => {
          const element = document.getElementById(`package-${rowId}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // If the element is in the bottom third of viewport, scroll down more
            if (rect.top > windowHeight * 0.66) {
              element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
              });
            }
          }
        }, 150);
      }, 800);
    } else {
      updateRepositoryRow(rowId, { searchResults: [], isLoading: false });
    }
  };

  const handleRowPackageSearchClear = (rowId: string) => {
    updateRepositoryRow(rowId, { 
      packageSearchTerm: '',
      searchResults: [],
      isLoading: false
    });
  };

  const handlePackageSelection = (rowId: string, pkg: any) => {
    const row = repositoryRows.find(r => r.id === rowId);
    if (!row) return;

    if (row.selectedPackages && row.selectedPackages.length > 0) {
      // Multi-selection mode: Add to selected packages (don't lock - allow continued search)
      updateRepositoryRow(rowId, {
        selectedPackages: [...(row.selectedPackages || []), pkg],
        lastSelectedPackage: pkg,
        searchResults: [],
        packageSearchTerm: '',
        lightspeedRecommendations: generateLightspeedRecommendations(pkg)
      });
    } else {
      // First selection: Start multi-selection mode (don't lock unless OpenSCAP)
      updateRepositoryRow(rowId, {
        selectedPackage: row.isOpenSCAPRequired ? pkg : null, // Keep selectedPackage for OpenSCAP compatibility
        selectedPackages: [pkg],
        lastSelectedPackage: pkg,
        isLocked: row.isOpenSCAPRequired, // Only lock OpenSCAP packages
        searchResults: [],
        packageSearchTerm: '',
        lightspeedRecommendations: generateLightspeedRecommendations(pkg)
      });
    }
    
    // Add to overall selected packages
    setSelectedPackages(prev => {
      const existingIds = prev.map(p => p.id || p);
      if (!existingIds.includes(pkg.id)) {
        return [...prev, pkg];
      }
      return prev;
    });
  };

  const handleAddAllPackages = (rowId: string) => {
    const row = repositoryRows.find(r => r.id === rowId);
    if (!row || !row.repository) return;

    // Mock "add all packages" - in real implementation this would fetch all packages from repository
    const allPackagesPlaceholder = {
      id: `all-packages-${row.repository.toLowerCase().replace(/\s+/g, '-')}`,
      name: `All packages from ${row.repository}`,
      version: 'Multiple versions',
      repository: row.repository,
      isAllPackages: true,
      packageCount: row.repositoryPackageCount || 1247
    };

    updateRepositoryRow(rowId, {
      selectedPackages: [allPackagesPlaceholder],
      lastSelectedPackage: allPackagesPlaceholder,
      isLocked: true,
      searchResults: [],
      packageSearchTerm: `All packages (${row.repositoryPackageCount || 1247})`
    });

    // Add to overall selected packages
    setSelectedPackages(prev => {
      const existingIds = prev.map(p => p.id || p);
      if (!existingIds.includes(allPackagesPlaceholder.id)) {
        return [...prev, allPackagesPlaceholder];
      }
      return prev;
    });
  };

  // Generate mock Lightspeed recommendations based on selected package
  const generateLightspeedRecommendations = (selectedPackage: any) => {
    const recommendations: {[key: string]: any[]} = {
      'httpd': [
        { id: 'mod_ssl', name: 'mod_ssl', version: '2.4.6', description: 'SSL/TLS module for Apache HTTP Server' },
        { id: 'php', name: 'php', version: '8.0.20', description: 'PHP scripting language for web development' },
        { id: 'mariadb-server', name: 'mariadb-server', version: '10.5.16', description: 'MariaDB database server' }
      ],
      'mysql': [
        { id: 'mysql-connector', name: 'mysql-connector', version: '8.0.33', description: 'MySQL database connector' },
        { id: 'php-mysql', name: 'php-mysql', version: '8.0.20', description: 'MySQL module for PHP' },
        { id: 'phpmyadmin', name: 'phpmyadmin', version: '5.2.1', description: 'Web interface for MySQL administration' }
      ],
      'nginx': [
        { id: 'nginx-mod-http-ssl', name: 'nginx-mod-http-ssl', version: '1.20.1', description: 'SSL module for Nginx' },
        { id: 'certbot', name: 'certbot', version: '1.32.0', description: 'HTTPS certificate management tool' },
        { id: 'nginx-mod-http-geoip', name: 'nginx-mod-http-geoip', version: '1.20.1', description: 'GeoIP module for Nginx' }
      ]
    };

    return recommendations[selectedPackage.name] || [
      { id: 'generic-1', name: 'related-package-1', version: '1.0.0', description: 'Commonly used with this package' },
      { id: 'generic-2', name: 'related-package-2', version: '2.1.0', description: 'Popular companion package' }
    ];
  };

  const handleRemovePackageFromSelection = (rowId: string, packageToRemove: any) => {
    const row = repositoryRows.find(r => r.id === rowId);
    if (!row || !row.selectedPackages) return;

    // Remove from row's selected packages
    const updatedPackages = row.selectedPackages.filter(pkg => pkg.id !== packageToRemove.id);
    
    updateRepositoryRow(rowId, {
      selectedPackages: updatedPackages,
      // If no packages left, unlock the row
      isLocked: updatedPackages.length > 0,
      // Clear Lightspeed recommendations if this was the last selected package
      lightspeedRecommendations: updatedPackages.length > 0 ? row.lightspeedRecommendations : []
    });

    // Remove from overall selected packages
    setSelectedPackages(prev => 
      prev.filter(pkg => (pkg.id || pkg) !== (packageToRemove.id || packageToRemove))
    );
  };

  const unlockRepositoryRow = (rowId: string) => {
    const row = repositoryRows.find(r => r.id === rowId);
    if (row && row.selectedPackage && !row.isOpenSCAPRequired) {
      // Remove from selected packages
      setSelectedPackages(prev => 
        prev.filter(pkg => (pkg.id || pkg) !== (row.selectedPackage.id || row.selectedPackage))
      );
      
      // Unlock the row
      updateRepositoryRow(rowId, {
        selectedPackage: null,
        isLocked: false,
        packageSearchTerm: '',
        searchResults: []
      });
    }
  };

  const removeRepositoryRow = (rowId: string) => {
    const row = repositoryRows.find(r => r.id === rowId);
    if (row && !row.isOpenSCAPRequired) {
      // Remove from selected packages if there was one
      if (row.selectedPackage) {
        setSelectedPackages(prev => 
          prev.filter(pkg => (pkg.id || pkg) !== (row.selectedPackage.id || row.selectedPackage))
        );
      }
      
      // Remove the row entirely
      setRepositoryRows(prev => prev.filter(r => r.id !== rowId));
    }
  };

  const getFilteredRepositories = (searchTerm: string = '') => {
    if (!searchTerm.trim()) {
      return availableRepositories;
    }
    return availableRepositories.filter(repo => 
      repo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Table browse helper functions
  const handleRepositoryToggle = (repositoryId: string) => {
    const newExpanded = new Set(expandedRepositories);
    if (newExpanded.has(repositoryId)) {
      newExpanded.delete(repositoryId);
    } else {
      newExpanded.add(repositoryId);
    }
    setExpandedRepositories(newExpanded);
  };

  const handleTablePackageSelection = (pkg: any) => {
    setSelectedPackages(prev => {
      const existingIds = prev.map(p => p.id || p);
      if (!existingIds.includes(pkg.id)) {
        return [...prev, { ...pkg, repository: getRepositoryNameById(pkg.repositoryId) }];
      }
      return prev;
    });
  };

  const handleTablePackageDeselection = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.filter(pkg => (pkg.id || pkg) !== packageId)
    );
  };

  const isPackageSelected = (packageId: string) => {
    return selectedPackages.some(pkg => (pkg.id || pkg) === packageId);
  };

  const getRepositoryNameById = (repositoryId: string) => {
    const repo = repositoryData.find(r => r.id === repositoryId);
    return repo ? repo.name : 'Unknown Repository';
  };

  const getFilteredRepositoryData = () => {
    if (!repositorySearchTerm.trim()) {
      return repositoryData;
    }
    
    return repositoryData.filter(repo => 
      repo.name.toLowerCase().includes(repositorySearchTerm.toLowerCase())
    );
  };

  const getFilteredPackagesForRepository = (repositoryId: string) => {
    const repository = repositoryData.find(r => r.id === repositoryId);
    if (!repository) return { packages: [], totalCount: 0, hasMore: false };
    
    // Only show packages if this repository is expanded
    if (!expandedRepositories.has(repositoryId)) return { packages: [], totalCount: 0, hasMore: false };
    
    const searchTerm = repositoryPackageSearchTerms[repositoryId] || '';
    const currentPage = repositoryPagination[repositoryId] || 1;
    const packagesPerPage = 50;
    
    let filteredPackages = repository.packages;
    
    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      filteredPackages = repository.packages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    const totalCount = filteredPackages.length;
    const startIndex = (currentPage - 1) * packagesPerPage;
    const endIndex = startIndex + packagesPerPage;
    const packages = filteredPackages.slice(startIndex, endIndex);
    const hasMore = endIndex < totalCount;
    
    return { packages, totalCount, hasMore };
  };

  const updateRepositoryPackageSearch = (repositoryId: string, searchTerm: string) => {
    setRepositoryPackageSearchTerms(prev => ({
      ...prev,
      [repositoryId]: searchTerm
    }));
    // Reset to first page when search changes
    setRepositoryPagination(prev => ({
      ...prev,
      [repositoryId]: 1
    }));
  };

  const updateRepositoryPagination = (repositoryId: string, page: number) => {
    setRepositoryPagination(prev => ({
      ...prev,
      [repositoryId]: page
    }));
  };

  // Get count of selected packages for a specific repository
  const getSelectedPackageCountForRepository = (repositoryId: string) => {
    return selectedPackages.filter(pkg => pkg.repositoryId === repositoryId).length;
  };

  // Get paginated repository data for the fixed table
  const getPaginatedRepositories = () => {
    const filteredRepos = getFilteredRepositoryData();
    const startIndex = (repositoryTablePage - 1) * repositoriesPerPage;
    const endIndex = startIndex + repositoriesPerPage;
    return filteredRepos.slice(startIndex, endIndex);
  };

  const totalRepositoryPages = Math.ceil(getFilteredRepositoryData().length / repositoriesPerPage);

  // Firewall helper functions
  const addFirewallRow = () => {
    setFirewallPorts([...firewallPorts, '']);
    setFirewallDisabledServices([...firewallDisabledServices, '']);
    setFirewallEnabledServices([...firewallEnabledServices, '']);
  };

  const removeFirewallRow = (index: number) => {
    if (firewallPorts.length > 1) {
      const newPorts = firewallPorts.filter((_, i) => i !== index);
      const newDisabledServices = firewallDisabledServices.filter((_, i) => i !== index);
      const newEnabledServices = firewallEnabledServices.filter((_, i) => i !== index);
      setFirewallPorts(newPorts);
      setFirewallDisabledServices(newDisabledServices);
      setFirewallEnabledServices(newEnabledServices);
    }
  };

  const updateFirewallPort = (index: number, value: string) => {
    const newPorts = [...firewallPorts];
    newPorts[index] = value;
    setFirewallPorts(newPorts);
    
    // Validate the first port for demonstration
    if (index === 0) {
      validateFirewallPort(value);
    }
  };

  const updateFirewallDisabledService = (index: number, value: string) => {
    const newServices = [...firewallDisabledServices];
    newServices[index] = value;
    setFirewallDisabledServices(newServices);
  };

  const updateFirewallEnabledService = (index: number, value: string) => {
    const newServices = [...firewallEnabledServices];
    newServices[index] = value;
    setFirewallEnabledServices(newServices);
  };




  // Validation functions for advanced settings
  const validateNTPServers = (servers: string[]): boolean => {
    if (servers.length === 0) {
      setNtpValidated('default');
      setNtpHelperText('Enter NTP server addresses');
      return true;
    }
    
    for (const server of servers) {
      if (!server.trim()) continue;
      
      if (!/^[a-z0-9]/.test(server)) {
        setNtpValidated('error');
        setNtpHelperText('Server address must begin with a lowercase letter or digit');
        return false;
      }
      
      if (!/^[a-z0-9\-\.\/:]+$/.test(server)) {
        setNtpValidated('error');
        setNtpHelperText('Server address can only contain lowercase letters, digits, hyphens, periods, colons, or forward slashes');
        return false;
      }
    }
    
    setNtpValidated('default');
    setNtpHelperText('Enter NTP server addresses');
    return true;
  };

  const validateHostname = (input: string): boolean => {
    if (!input.trim()) {
      setHostnameValidated('default');
      setHostnameHelperText('Enter a valid hostname for the system');
      return true;
    }
    
    const labels = input.split('.');
    
    for (const label of labels) {
      if (!label) continue;
      
      if (!/^[a-zA-Z0-9]/.test(label) || !/[a-zA-Z0-9]$/.test(label)) {
        setHostnameValidated('error');
        setHostnameHelperText('Each label must start and end with an alphanumeric character (a-z, 0-9)');
        return false;
      }
      
      if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(label) && label.length > 1) {
        setHostnameValidated('error');
        setHostnameHelperText('Hyphens are allowed within labels, but not at the beginning or end');
        return false;
      }
    }
    
    setHostnameValidated('default');
    setHostnameHelperText('Enter a valid hostname for the system');
    return true;
  };

  const validateKernelAppend = (options: string[]): boolean => {
    if (options.length === 0) {
      setKernelValidated('default');
      setKernelHelperText('Enter kernel append options for system configuration');
      return true;
    }
    
    const validCharsRegex = /^[a-zA-Z0-9=\-_,.\"' ]*$/;
    for (const option of options) {
      if (!validCharsRegex.test(option)) {
        setKernelValidated('error');
        setKernelHelperText('Only alphanumeric characters, equals signs, hyphens, underscores, commas, periods, double quotes, and single quotes are allowed');
        return false;
      }
    }
    
    setKernelValidated('default');
    setKernelHelperText('Enter kernel append options for system configuration');
    return true;
  };

  const validateFirewallPort = (input: string): boolean => {
    if (!input.trim()) {
      setFirewallValidated('default');
      setFirewallHelperText('Enter port configuration for firewall rules'); 
      return true;
    }
    
    const portRegex = /^(\d{1,5}|[a-z]{1,6})(-\d{1,5})?(:|\/)(tcp|udp)$/i;
    
    if (!portRegex.test(input)) {
      setFirewallValidated('error');
      setFirewallHelperText('Invalid port format. Must be: port/protocol or port-range/protocol (e.g., 8080/tcp, 80-443/udp)');
      return false;
    }
    
    setFirewallValidated('default');
    setFirewallHelperText('Enter port configuration for firewall rules');
    return true;
  };

  const handleTabClick = (event: React.MouseEvent | React.KeyboardEvent, tabIndex: string | number) => {
    // If trying to leave the base image tab (tab 0), validate target environment first
    if (activeTabKey === 0 && tabIndex !== 0) {
      const hasTargetEnvironment = selectedCloudProvider.length > 0 || 
                                  privateCloudFormat.length > 0 || 
                                  otherFormat.length > 0;
      
      if (!hasTargetEnvironment) {
        // Set validation error and prevent tab change
        setValidationErrors({
          targetEnvironment: "Select one or multiple target environments for this image configuration"
        });
        
        // Scroll to the target environment section to make error visible
        if (imageOutputRef.current && contentAreaRef.current) {
          const element = imageOutputRef.current;
          const container = contentAreaRef.current;
          const containerRect = container.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 20;
          
          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
        
        return; // Don't allow tab change
      }
    }
    
    setActiveTabKey(tabIndex);
    
    // Reset section indexes when switching tabs
    setCurrentBaseImageSection(0);
    setCurrentAdvancedSection(0);
    
    // Smooth scroll to top when changing tabs
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const validateBaseImageForm = (): { isValid: boolean; firstErrorRef?: React.RefObject<HTMLDivElement | null> } => {
    const errors: {[key: string]: string} = {};
    let firstErrorRef: React.RefObject<HTMLDivElement | null> | undefined;
    
    // Check if image name is filled out (first section)
    if (!imageName.trim()) {
      errors.imageName = 'Image name is required';
      if (!firstErrorRef) {
        firstErrorRef = imageDetailsRef;
      }
    }
    
    // Check target environment selection (in image output section)
    const hasTargetEnvironment = selectedCloudProvider.length > 0 || 
                                privateCloudFormat.length > 0 || 
                                otherFormat.length > 0;
    
    if (!hasTargetEnvironment) {
      errors.targetEnvironment = 'Select one or multiple target environments for this image configuration';
      if (!firstErrorRef) {
        firstErrorRef = imageOutputRef;
      }
    }
    
    // Note: Snapshot date validation removed - Enable repeatable build now auto-populates with today's date
    
    // Check cloud provider login status (in image output section)
    if (selectedCloudProvider.includes('aws') && !selectedIntegration.trim()) {
      errors.awsLogin = 'Please sign in to your AWS account by selecting an integration';
      if (!firstErrorRef) {
        firstErrorRef = imageOutputRef;
      }
    }
    
    if (selectedCloudProvider.includes('gcp') && gcpAccountType === 'Google account') {
      errors.gcpLogin = 'Please select a GCP account type to proceed';
      if (!firstErrorRef) {
        firstErrorRef = imageOutputRef;
      }
    }
    
    if (selectedCloudProvider.includes('azure') && !isAzureAuthorized) {
      errors.azureLogin = 'Please authorize your Microsoft Azure account';
      if (!firstErrorRef) {
        firstErrorRef = imageOutputRef;
      }
    }
    
    // Release and architecture have defaults so we don't need to validate them as strictly
    
    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    
    return { isValid, firstErrorRef };
  };

  const handleNext = () => {
    if (typeof activeTabKey === 'number' && activeTabKey < 3) {
      setActiveTabKey(activeTabKey + 1);
      // Reset section indexes when advancing to next tab
      setCurrentBaseImageSection(0);
      setCurrentAdvancedSection(0);
      // Smooth scroll to top when changing tabs
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleBack = () => {
    if (typeof activeTabKey === 'number' && activeTabKey > 0) {
      setActiveTabKey(activeTabKey - 1);
      // Smooth scroll to top when changing tabs
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleNextSection = () => {
    if (typeof activeTabKey === 'number') {
      switch (activeTabKey) {
        case 0:
          // Base image tab: validate current section before proceeding
          let hasValidationError = false;
          const newValidationErrors: {[key: string]: string} = {};
          
          // Validate target environment selection
          const hasTargetEnvironment = selectedCloudProvider.length > 0 || 
                                      privateCloudFormat.length > 0 || 
                                      otherFormat.length > 0;
          
          if (!hasTargetEnvironment) {
            newValidationErrors.targetEnvironment = "Select one or multiple target environments for this image configuration";
            hasValidationError = true;
          }
          
          // Note: Snapshot date section validation removed - Enable repeatable build now auto-populates with today's date
          
          setValidationErrors(newValidationErrors);
          
          if (hasValidationError) {
            return; // Don't proceed if validation fails
          }
          
          // Base image tab: cycle through sections (starting from Image Details)
          const baseImageSections = [
            imageDetailsRef,
            imageOutputRef,
            enableRepeatableRef, 
            kickstartRef,
            complianceRef
          ];
          
          if (currentBaseImageSection < baseImageSections.length) {
            // Move to next section within Base Image tab
            const targetRef = baseImageSections[currentBaseImageSection];
            setCurrentBaseImageSection(currentBaseImageSection + 1);
            
            if (targetRef.current && contentAreaRef.current) {
              const element = targetRef.current;
              const container = contentAreaRef.current;
              const containerRect = container.getBoundingClientRect();
              const elementRect = element.getBoundingClientRect();
              const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 20;
              
              container.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
              });
            }
          } else {
            // All sections visited, go to next tab
            setCurrentBaseImageSection(0);
            handleNext();
          }
          break;
        case 1:
          // Repositories and packages tab: go to next tab (Advanced settings)
          handleNext();
          break;
        case 2:
          // Advanced settings tab: cycle through sections
          const advancedSections = [
            timezoneRef,
            localeRef,
            hostnameRef,
            kernelRef,
            systemdRef,
            firewallRef,
            usersRef,
            firstBootRef
          ];
          
          if (currentAdvancedSection < advancedSections.length) {
            // Move to next section within Advanced Settings tab
            const targetRef = advancedSections[currentAdvancedSection];
            setCurrentAdvancedSection(currentAdvancedSection + 1);
            
            if (targetRef.current && contentAreaRef.current) {
              const element = targetRef.current;
              const container = contentAreaRef.current;
              const containerRect = container.getBoundingClientRect();
              const elementRect = element.getBoundingClientRect();
              const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 20;
              
              container.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
              });
            }
          } else {
            // All sections visited, go to review
            setCurrentAdvancedSection(0);
            handleNext();
          }
          break;
        case 3:
          // Review tab: no next section
          break;
      }
    }
  };

  const isFirstTab = activeTabKey === 0;
  const isLastTab = activeTabKey === 3;


  const renderChangeableContent = () => {
    switch (registrationMethod) {
      case 'auto':
        return (
          <div style={{ marginTop: '0rem', marginBottom: '0rem' }}>
            <FormGroup
              label="Activation key"
              fieldId="activation-key"
              style={{ marginBottom: '0rem' }}
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
                    <div style={{ minWidth: '300px' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Key</div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          {selectedActivationKey}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Environment</div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          Production
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Usage</div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          45/100 systems
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Auto-attach</div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          Enabled
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Content view</div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          RHEL-8-CV
                        </div>
                      </div>
                    </div>
                  }
                >
                  <Button variant="secondary" icon={<InfoCircleIcon />}>
                    View details
                  </Button>
                </Popover>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                Image Builder provides and defaults to a no-cost activation key if none exist.{' '}
                <a href="#" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                  Manage Activation keys
                  <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#0066cc' }} />
                </a>
              </div>
            </FormGroup>
          </div>
        );
      case 'later':
        return (
          <Alert
            variant="info"
            isInline
            title="Lorem ipsum dolor sit amet"
            style={{ marginTop: '1rem' }}
          >
            <p style={{ marginBottom: '0.5rem' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              <a href="#" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                Learn more about registration
                <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#0066cc' }} />
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
            The satellite step should show what's currently implemented.
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
              The selections on this page may automatically add required packages and/or configurations you'll find in the Repositories and packages step and the Advanced Settings step.
            </p>
            
            <Form>
              {/* Image Details Section */}
              <div ref={imageDetailsRef}>
                {validationErrors.imageName && (
                  <Alert
                    variant="warning"
                    isInline
                    title="Please complete the required fields"
                    style={{ marginBottom: '1rem' }}
                  >
                    <p>{validationErrors.imageName}</p>
                  </Alert>
                )}
                <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                  Image details
                </Title>
                
                <FormGroup
                  label="Name"
                  fieldId="image-name"
                  isRequired
                  style={{ marginBottom: '1rem' }}
                >
                  <div style={{ position: 'relative' }}>
                    <TextInput
                      id="image-name"
                      value={imageName}
                      onChange={(_event, value) => {
                        setImageName(value);
                        // Clear validation error when user starts typing
                        if (validationErrors.imageName && value.trim()) {
                          const newErrors = { ...validationErrors };
                          delete newErrors.imageName;
                          setValidationErrors(newErrors);
                        }
                      }}
                      onFocus={() => setImageNameFocused(true)}
                      onBlur={() => setImageNameFocused(false)}
                      placeholder="Enter image name"
                      isRequired
                    />
                    {imageName && !imageNameFocused && (
                      <Button
                        variant="plain"
                        onClick={() => setImageName('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '0.25rem',
                          minWidth: 'auto',
                          height: 'auto'
                        }}
                        aria-label="Clear image name"
                      >
                        <TimesIcon style={{ fontSize: '0.875rem', color: '#666' }} />
                      </Button>
                    )}
                  </div>
                </FormGroup>

                <FormGroup
                  label="Description"
                  fieldId="image-details"
                  style={{ marginTop: '12px', marginBottom: '1rem' }}
                >
                  <div style={{ position: 'relative' }}>
                    <TextInput
                      id="image-details"
                      value={imageDetails}
                      onChange={(_event, value) => setImageDetails(value)}
                      onFocus={() => setImageDetailsFocused(true)}
                      onBlur={() => setImageDetailsFocused(false)}
                      placeholder="Enter image details"
                    />
                    {imageDetails && !imageDetailsFocused && (
                      <Button
                        variant="plain"
                        onClick={() => setImageDetails('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '0.25rem',
                          minWidth: 'auto',
                          height: 'auto'
                        }}
                        aria-label="Clear image description"
                      >
                        <TimesIcon style={{ fontSize: '0.875rem', color: '#666' }} />
                      </Button>
                    )}
                  </div>
                </FormGroup>

                <FormGroup
                  label="Owner"
                  fieldId="image-owner"
                  style={{ marginTop: '12px', marginBottom: '1rem' }}
                >
                  <div style={{ position: 'relative' }}>
                    <TextInput
                      id="image-owner"
                      value={owner}
                      onChange={(_event, value) => setOwner(value)}
                      onFocus={() => setOwnerFocused(true)}
                      onBlur={() => setOwnerFocused(false)}
                      placeholder="Enter owner email"
                    />
                    {owner && !ownerFocused && (
                      <Button
                        variant="plain"
                        onClick={() => setOwner('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '0.25rem',
                          minWidth: 'auto',
                          height: 'auto'
                        }}
                        aria-label="Clear owner"
                      >
                        <TimesIcon style={{ fontSize: '0.875rem', color: '#666' }} />
                      </Button>
                    )}
                  </div>
                </FormGroup>
              </div>
              
              {/* Divider between Image details and Image output */}

              <div style={{ 
                height: '1px', 
                backgroundColor: '#d2d2d2', 
                margin: '0 0 1rem 0' 
              }} />

              {/* Image Output Section */}
              <div style={{ marginBottom: '2rem' }}>
                  {(validationErrors.awsLogin || validationErrors.gcpLogin || validationErrors.azureLogin) && (
                    <Alert
                      variant="warning"
                      isInline
                      title="Please sign in to your cloud accounts"
                      style={{ marginBottom: '1rem' }}
                    >
                      {validationErrors.awsLogin && <p>{validationErrors.awsLogin}</p>}
                      {validationErrors.gcpLogin && <p>{validationErrors.gcpLogin}</p>}
                      {validationErrors.azureLogin && <p>{validationErrors.azureLogin}</p>}
                    </Alert>
                  )}
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                  Image output
                </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                  Select any number of target environments to simultaneously build this image from. Learn more about{' '}
                  <a 
                    href="https://docs.redhat.com/en/documentation/red_hat_insights/1-latest/html/deploying_and_managing_rhel_systems_in_hybrid_clouds/index" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#0066cc', textDecoration: 'underline' }}
                  >
                    Deploying and managing RHEL systems in the hybrid cloud
                    <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#0066cc' }} />
                  </a>                  </Content>
                
                <FormGroup
                  label="Release"
                  fieldId="base-image-release"
                  isRequired
                  style={{ marginBottom: '1rem' }}
                >
                  <MenuContainer
                    isOpen={isBaseImageReleaseOpen}
                    onOpenChange={(isOpen) => setIsBaseImageReleaseOpen(isOpen)}
                    menu={
                      <Menu
                        id="rootReleaseMenu"
                        containsDrilldown
                        drilldownItemPath={releaseDrilldownPath}
                        drilledInMenus={releaseMenuDrilledIn}
                        activeMenu={activeReleaseMenu}
                        onDrillIn={onReleaseDrillIn}
                        onDrillOut={onReleaseDrillOut}
                        onGetMenuHeight={setReleaseMenuHeight}
                        ref={releaseMenuRef}
                        style={{ width: '300px' }}
                      >
                        <MenuContent menuHeight={`${releaseMenuHeights[activeReleaseMenu]}px`}>
                          <MenuList>
                            {releaseOptions.map((release) => {
                              let supportDetail = '';
                              if (release === 'Red Hat Enterprise Linux 10') {
                                supportDetail = 'Full support ends: May 2030 | Maintenance support ends: May 2035';
                              } else if (release === 'Red Hat Enterprise Linux 9') {
                                supportDetail = 'Full support ends: May 2027 | Maintenance support ends: May 2032';
                              } else if (release === 'Red Hat Enterprise Linux 8') {
                                supportDetail = 'Full support ends: May 2024 | Maintenance support ends: May 2029';
                              }
                              
                              return (
                                <MenuItem 
                                  key={release} 
                                  itemId={release}
                                  isSelected={baseImageRelease === release}
                                  onClick={() => onReleaseItemSelect(release)}
                                >
                                  <div>
                                    <div style={{ fontWeight: 500 }}>{release}</div>
                                    {supportDetail && (
                                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                        {supportDetail}
                                      </div>
                                    )}
                                  </div>
                                </MenuItem>
                              );
                            })}
                            <Divider component="li" />
                            <MenuItem
                              itemId="further_development_rhel"
                              direction="down"
                              drilldownMenu={
                                <DrilldownMenu id="drilldownMenuDevelopment">
                                  <MenuItem itemId="further_development_rhel_breadcrumb" direction="up">
                                    Further Development of RHEL
                                  </MenuItem>
                                  <Divider component="li" />
                                  <MenuItem 
                                    itemId="CentOS Stream 9"
                                    isSelected={baseImageRelease === 'CentOS Stream 9'}
                                    onClick={() => onReleaseItemSelect('CentOS Stream 9')}
                                  >
                                    <div>
                                      <div style={{ fontWeight: 500 }}>CentOS Stream 9</div>
                                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                        Continuous delivery platform for RHEL 9
                                      </div>
                                    </div>
                                  </MenuItem>
                                  <MenuItem 
                                    itemId="CentOS Stream 10"
                                    isSelected={baseImageRelease === 'CentOS Stream 10'}
                                    onClick={() => onReleaseItemSelect('CentOS Stream 10')}
                                  >
                                    <div>
                                      <div style={{ fontWeight: 500 }}>CentOS Stream 10</div>
                                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                        Continuous delivery platform for RHEL 10
                                      </div>
                                    </div>
                                  </MenuItem>
                                </DrilldownMenu>
                              }
                            >
                              Further Development of RHEL
                            </MenuItem>
                          </MenuList>
                        </MenuContent>
                      </Menu>
                    }
                    menuRef={releaseMenuRef}
                    toggle={
                      <MenuToggle 
                        ref={releaseToggleRef} 
                        onClick={onReleaseToggleClick}
                        isExpanded={isBaseImageReleaseOpen}
                        style={{ width: '300px' }}
                      >
                        {baseImageRelease || 'Select a release'}
                      </MenuToggle>
                    }
                    toggleRef={releaseToggleRef}
                  />
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
              </div>

                {/* Target Environment Section */}
                <FormGroup
                  label="Target environment"
                  fieldId="target-environment"
                  isRequired
                  style={{ marginBottom: '1rem' }}
                >
                  <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '1rem' }}>
                    Select one or multiple target environments for this image configuration
                  </div>
                  {validationErrors.targetEnvironment && (
                    <Alert
                      variant="warning"
                      isInline
                      title="Target environment required"
                      style={{ marginTop: '0.5rem' }}
                    >
                      <p>{validationErrors.targetEnvironment}</p>
                    </Alert>
                  )}
                </FormGroup>

                <FormGroup
                  label="Private cloud"
                  fieldId="private-cloud"
                  style={{ marginBottom: '1rem' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Checkbox
                      isChecked={privateCloudFormat.includes('ova')}
                      onChange={() => handlePrivateCloudFormatSelect('ova')}
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>VMware vSphere - Open virtualization format (.ova)</span>
                          <Tooltip
                            content="An OVA file is a virtual appliance used by virtualization platforms such as VMware vSphere. It is a package that contains files used to describe a virtual machine, which includes a VMDK image, OVF descriptor, and a manifest file."
                            position="top"
                          >
                            <OutlinedQuestionCircleIcon 
                              style={{ 
                                color: '#6a6e73',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                              }} 
                            />
                          </Tooltip>
                        </div>
                      }
                      id="private-ova"
                    />
                    <Checkbox
                      isChecked={privateCloudFormat.includes('vmdk')}
                      onChange={() => handlePrivateCloudFormatSelect('vmdk')}
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>VMware vSphere - Virtual disk (.vmdk)</span>
                          <Tooltip
                            content="A VMDK file is a virtual disk that stores the contents of a virtual machine. This disk has to be imported into vSphere using govc import.vmdk, use the OVA version when using the vSphere UI."
                            position="top"
                          >
                            <OutlinedQuestionCircleIcon 
                              style={{ 
                                color: '#6a6e73',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                              }} 
                            />
                          </Tooltip>
                        </div>
                      }
                      id="private-vmdk"
                    />
                  </div>
                </FormGroup>

                <FormGroup
                  label="Additional formats"
                  fieldId="additional-formats"
                  style={{ marginBottom: '1rem' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Checkbox
                      isChecked={otherFormat.includes('qcow2')}
                      onChange={() => handleOtherFormatSelect('qcow2')}
                      label="Virtualization - Guest image (.qcow2)"
                      id="other-qcow2"
                    />
                    <Checkbox
                      isChecked={otherFormat.includes('iso')}
                      onChange={() => handleOtherFormatSelect('iso')}
                      label="Baremetal - Installer (.iso)"
                      id="other-iso"
                    />
                    <Checkbox
                      isChecked={otherFormat.includes('tar.gz')}
                      onChange={() => handleOtherFormatSelect('tar.gz')}
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>WSL - Windows Subsystem for Linux (.tar.gz)</span>
                          <Tooltip
                            content={
                              <div>
                                WSL is not officially supported by Red Hat. Using RHEL on Microsoft's Windows Subsystem for Linux (WSL) is permitted as a Validated Software Platform and Third Party Component Support Policy.{' '}
                                <a
                                  href="https://access.redhat.com/articles/7115538"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#73bcf7', textDecoration: 'underline' }}
                                >
                                  More about RHEL on WSL Support
                                  <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#73bcf7' }} />
                                </a>
                              </div>
                            }
                            position="top"
                          >
                            <OutlinedQuestionCircleIcon 
                              style={{ 
                                color: '#6a6e73',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                              }} 
                            />
                          </Tooltip>
                        </div>
                      }
                      id="other-wsl"
                    />
                  </div>
                </FormGroup>



                {/* Removed old AWS Integration Section - now inline with checkbox */}
                {false && selectedCloudProvider.includes('aws') && (
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

                {/* Removed old GCP Integration Section - now inline with checkbox */}
                {false && selectedCloudProvider.includes('gcp') && (
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

                {/* Removed old Azure Integration Section - now inline with checkbox */}
                {false && selectedCloudProvider.includes('azure') && (
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

                    {isAzureAuthorized ? (
                      <div style={{ 
                        marginTop: '1rem',
                        padding: '0.75rem',
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        borderRadius: '4px',
                        color: '#155724'
                      }}>
                        ✓ Azure account authorized successfully
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleAzureAuthorize}
                        style={{ marginTop: '1rem' }}
                      >
                        Authorize Azure
                      </Button>
                    )}
                  </div>
                )}

                {/* Removed old Oracle Section - now inline with checkbox */}
                {false && selectedCloudProvider.includes('oci') && (
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



                {/* Divider before Enable repeatable build */}
                <div 
                  ref={enableRepeatableRef}
                  style={{ 
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
                      Create images that can be reproduced consistently with the same package versions and configurations.{' '}
                      <a
                        href="#"
                        style={{ color: '#06c', textDecoration: 'underline' }}
                      >
                        Create and manage repositories here
                      </a>{' '}
                      <ExternalLinkAltIcon style={{ fontSize: '0.75rem', color: '#06c', marginLeft: '0.25rem' }} />
                    </Content>

                    <FormGroup fieldId="repeatable-build-options" className="pf-v6-u-mb-md">
                      <Radio
                        id="disable-repeatable-build"
                        name="repeatable-build-option"
                        label="Disable repeatable build"
                        description="Use the newest repository content available when building this image"
                        isChecked={repeatableBuildOption === 'disable'}
                        onChange={() => {
                          setRepeatableBuildOption('disable');
                          setSnapshotDate('');
                        }}
                      />
                      <Radio
                        id="enable-repeatable-build"
                        name="repeatable-build-option"
                        label="Enable repeatable build"
                        description="Build this image with the repository content of a selected date"
                        isChecked={repeatableBuildOption === 'enable'}
                        onChange={() => {
                          setRepeatableBuildOption('enable');
                          // Auto-populate with today's date by default
                          const today = new Date();
                          const month = (today.getMonth() + 1).toString().padStart(2, '0');
                          const day = today.getDate().toString().padStart(2, '0');
                          const year = today.getFullYear();
                          setSnapshotDate(`${month}-${day}-${year}`);
                        }}
                      />
                      <Radio
                        id="use-content-template"
                        name="repeatable-build-option"
                        label="Use a content template"
                        description="Select a content template and build this image with repository snapshots included in that template"
                        isChecked={repeatableBuildOption === 'template'}
                        onChange={() => {
                          setRepeatableBuildOption('template');
                          setSnapshotDate('');
                        }}
                      />
                    </FormGroup>
                  
                    {repeatableBuildOption === 'enable' && (
                      <FormGroup
                        label="Snapshot date"
                        fieldId="snapshot-date"
                        isRequired={true}
                      >
                      <Split hasGutter>
                        <SplitItem>
                          <DatePicker
                            id="snapshot-date"
                            value={snapshotDate}
                            onChange={(_event, value) => setSnapshotDate(value)}
                            placeholder="MM-DD-YYYY"
                            popoverProps={{ position: "left" }}
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
                            isDisabled={(() => {
                              // Check if current snapshot date is today's date
                              const today = new Date();
                              const month = (today.getMonth() + 1).toString().padStart(2, '0');
                              const day = today.getDate().toString().padStart(2, '0');
                              const year = today.getFullYear();
                              const todayFormatted = `${month}-${day}-${year}`;
                              return snapshotDate === todayFormatted;
                            })()}
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
                      Use packages from this date to ensure reproducible builds.
                      </div>
                    </FormGroup>
                    )}

                    {repeatableBuildOption === 'template' && (
                      <Alert
                        variant="warning"
                        isInline
                        title="Work in Progress"
                        style={{ marginTop: '1rem' }}
                      >
                        The content template step should show what's currently implemented.
                      </Alert>
                    )}
                </div>
                  
                {/* Kickstart File Section */}
                <div style={{ marginBottom: '2rem' }}>

                    {/* Divider between sections */}
                    <div style={{ 
                      height: '1px', 
                      backgroundColor: '#d2d2d2', 
                      margin: '0rem 0 2rem 0' 
                    }} />


                    
                {/* Compliance Section */}
                <div style={{ marginBottom: '2rem' }}>

                    {/* Divider after Kickstart File section */}
                    <div style={{ 
                      height: '1px', 
                      backgroundColor: '#d2d2d2', 
                    margin: '0rem 0 2rem 0' 
                    }} />


                  <div style={{ marginBottom: '2rem' }}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                      Compliance
                    </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                      Below you can select which Insights compliance policy or OpenSCAP profile your image will be compliant to. Insights compliance allows the use of tailored policies, whereas OpenSCAP gives you the default versions. This will automatically help monitor the adherence of your registered RHEL systems to a selected policy or profile.
                    This is filler text for now.  
                  </Content>
                  </div>

                    {/* Compliance Type Selection */}
                    <FormGroup
                      label="Compliance type"
                      fieldId="compliance-type-select"
                      style={{ marginBottom: '1.5rem' }}
                    >
                      <Select
                        id="compliance-type-select"
                        isOpen={isComplianceTypeOpen}
                        selected={complianceType}
                        onSelect={onComplianceTypeSelect}
                        onOpenChange={(isOpen) => setIsComplianceTypeOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle 
                            ref={toggleRef} 
                            onClick={() => setIsComplianceTypeOpen(!isComplianceTypeOpen)}
                            isExpanded={isComplianceTypeOpen}
                            style={{ width: '400px' }}
                          >
                            {complianceType === 'custom' && 'Use a custom Compliance policy'}
                            {complianceType === 'openscap' && 'Use a default OpenSCAP profile'}
                            {!complianceType && 'Select compliance type'}
                          </MenuToggle>
                        )}
                      >
                        <SelectList>
                          <SelectOption value="custom" description="Use a custom Insights Compliance policy">
                            Use a custom Compliance policy
                          </SelectOption>
                          <SelectOption value="openscap" description="Use a default OpenSCAP security profile">
                            Use a default OpenSCAP profile
                          </SelectOption>
                        </SelectList>
                      </Select>
                    </FormGroup>

                    {/* Custom Compliance Policy (conditional) */}
                    {complianceType === 'custom' && (
                    <FormGroup
                      style={{ marginBottom: '1.5rem' }}
                    >
                      
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
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                  <span style={{ 
                                    flex: 1, 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap',
                                    marginRight: '8px'
                                  }}>
                                    {customCompliancePolicy || 'Select a compliance policy'}
                                  </span>
                                  {customCompliancePolicy && (
                                    <Button
                                      variant="plain"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCustomCompliancePolicy('');
                                        setComplianceType('');
                                      }}
                                      style={{ 
                                        padding: '2px', 
                                        minWidth: 'auto',
                                        flexShrink: 0
                                      }}
                                    >
                                      <TimesIcon style={{ fontSize: '0.875rem' }} />
                                    </Button>
                                  )}
                                </div>
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
                          <a href="#" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                            Manage with Insights Compliance
                            <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#0066cc' }} />
                          </a>
                        </div>
                      </div>
                    </FormGroup>
                    )}

                    {/* OpenSCAP Profile (conditional) */}
                    {complianceType === 'openscap' && (
                    <FormGroup
                      style={{ marginBottom: '1.5rem' }}
                    >
                      
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
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                  <span style={{ 
                                    flex: 1, 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap',
                                    marginRight: '8px'
                                  }}>
                                    {openscapProfile || 'Select an OpenSCAP profile'}
                                  </span>
                                  {openscapProfile && (
                                    <Button
                                      variant="plain"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenscapProfile('');
                                        setComplianceType('');
                                        clearOpenscapInheritance();
                                      }}
                                      style={{ 
                                        padding: '2px', 
                                        minWidth: 'auto',
                                        flexShrink: 0
                                      }}
                                    >
                                      <TimesIcon style={{ fontSize: '0.875rem' }} />
                                    </Button>
                                  )}
                                </div>
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
                          <a href="#" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                            Learn more about OpenSCAP profiles
                            <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#0066cc' }} />
                          </a>
                        </div>
                      </div>
                    </FormGroup>
                    )}
                </div>


                {/* Divider */}
                <div style={{ 
                  height: '1px', 
                  backgroundColor: '#d2d2d2', 
                  margin: '2rem 0' 
                }} />

                {/* Registration Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Register
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                    Configure registration settings for systems that will use this image.
                  </Content>
                
                  <FormGroup
                    label="Organization ID"
                    fieldId="organization-id"
                    style={{ marginBottom: '2rem' }}
                  >
                    <ClipboardCopy 
                      isReadOnly 
                      hoverTip="Copy Organization ID" 
                      clickTip="Organization ID copied!"
                      variant="inline"
                      style={{ width: '25%' }}
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
                    style={{ marginTop: '1rem', marginBottom: '1rem' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Radio
                        isChecked={registrationMethod === 'auto'}
                        name="registration-method"
                        onChange={() => setRegistrationMethod('auto')}
                        label="Automatically register and enable advanced capabilities"
                        id="auto-register"
                      />
                      
                      {registrationMethod === 'auto' && (
                        <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <Checkbox
                            isChecked={enablePredictiveAnalytics}
                            onChange={() => setEnablePredictiveAnalytics(!enablePredictiveAnalytics)}
                            label="Enable predictive analytics and management capabilities"
                            id="enable-predictive-analytics"
                          />
                          <Checkbox
                            isChecked={enableRemoteRemediations}
                            onChange={() => setEnableRemoteRemediations(!enableRemoteRemediations)}
                            label="Enable remote remediations and system management with automation"
                            id="enable-remote-remediations"
                          />
                        </div>
                      )}
                      
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

                  {registrationMethod === 'auto' && (
                    <FormGroup
                      label="Activation key"
                      fieldId="activation-key"
                      style={{ marginBottom: '0rem' }}
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
                            <div style={{ minWidth: '300px' }}>
                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Name</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                  {selectedActivationKey}
                                </div>
                              </div>

                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Role</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                  Development Environment
                                </div>
                              </div>
                              
                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>SLA</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                  Standard (Business Hours)
                                </div>
                              </div>
                              
                              <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Usage</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                  45/100 systems
                                </div>
                              </div>
                              
                              <div>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Additional repositories</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                  EPEL, Red Hat Codeready Builder
                                </div>
                              </div>
                            </div>
                          }
                        >
                          <Button variant="secondary" icon={<InfoCircleIcon />}>
                            View details
                          </Button>
                        </Popover>
                      </div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                        Image Builder provides and defaults to a no-cost activation key if none exist.{' '}
                        <a href="#" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                          Manage Activation keys
                          <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#0066cc' }} />
                        </a>
                      </div>
                    </FormGroup>
                  )}

                  {registrationMethod === 'later' && (
                    <div style={{ marginTop: '1rem' }}>
                      <Alert
                        variant="info"
                        isInline
                        title="Lorem ipsum dolor sit amet"
                      >
                        <p style={{ marginBottom: '0.5rem' }}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <p>
                          <a href="#" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                            Learn more about registration
                            <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#0066cc' }} />
                          </a>
                        </p>
                      </Alert>
                    </div>
                  )}

                  {registrationMethod === 'satellite' && (
                    <div style={{ marginTop: '1rem' }}>
                      <Alert
                        variant="warning"
                        isInline
                        title="Work in Progress"
                      >
                        The satellite step should show what's currently implemented.
                      </Alert>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </div>
        );
      case 1:
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0rem' }}>
              <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
                Repositories and Packages
              </Title>
              {openscapAddedPackagesCount > 0 && (
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: '#666',
                  backgroundColor: '#f0f0f0',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 500
                }}>
                  {openscapAddedPackagesCount} added by OpenSCAP
                </span>
              )}
            </div>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '1rem' }}>
              The repositories listed below are sourced from your Red Hat Insights account. 
              Need to add more repositories? Visit{' '}
              <a 
                href="https://console.redhat.com/insights/content/repositories" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#0066cc',
                  textDecoration: 'underline'
                }}
              >
                Insights Repositories
                <ExternalLinkAltIcon style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }} />
              </a>
            </p>
            
            {/* Package Interface - Search Mode Only */}
            
                          <Form>
                {/* Extended Support Subscription */}
                  <FormGroup
                    label="Extended support subscription"
                    fieldId="extended-support"
                    style={{ marginBottom: '2rem' }}
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

              {/* NEW: Included Repositories Section */}
              <div style={{ marginBottom: '2rem' }}>
                <Title headingLevel="h3" size="md" style={{ marginBottom: '0.5rem' }}>
                  Included repositories
                </Title>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                    <SearchInput
                        value={repositoryTypeaheadValue}
                        onChange={(_event, value) => {
                          setRepositoryTypeaheadValue(value);
                          setRepositoryTypeaheadOpen(true); // Always show dropdown when typing
                          setIsSearchingExternalRepos(false); // Reset external search when typing
                        }}
                        onClear={() => {
                          setRepositoryTypeaheadValue('');
                          setRepositoryTypeaheadOpen(false);
                          setIsSearchingExternalRepos(false); // Reset external search when clearing
                        }}
                        onFocus={() => {
                          // Show Lightspeed suggestions when focusing empty input
                          if (!repositoryTypeaheadValue) {
                            setRepositoryTypeaheadOpen(true);
                          }
                        }}
                        onBlur={() => {
                          // Close dropdown when clicking outside (with small delay to allow selection)
                          setTimeout(() => setRepositoryTypeaheadOpen(false), 150);
                        }}
                        placeholder="Search repositories..."
                        style={{ width: '100%' }}
                      />
                      {repositoryTypeaheadOpen && (
                        <div data-dropdown="repository" style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          backgroundColor: 'white',
                          border: '1px solid #d2d2d2',
                          borderTop: 'none',
                          borderRadius: '0 0 4px 4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          zIndex: 1000,
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}>
                          {getFilteredTypeaheadRepositories().length > 0 ? (
                            getFilteredTypeaheadRepositories().map((repo) => {
                              const isLightspeedSuggestion = !repositoryTypeaheadValue && generateRepositoryLightspeedSuggestions().includes(repo);
                              return (
                                <div
                                  key={repo}
                                  onClick={() => onRepositoryTypeaheadSelect(repo)}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f0f0f0',
                                    fontSize: '0.875rem',
                                    backgroundColor: isLightspeedSuggestion ? '#f8f9ff' : 'white',
                                    borderLeft: isLightspeedSuggestion ? '3px solid #0066cc' : 'none'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isLightspeedSuggestion ? '#eef1ff' : '#f0f0f0'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isLightspeedSuggestion ? '#f8f9ff' : 'white'}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {isLightspeedSuggestion && (
                                      <MagicIcon style={{ fontSize: '14px', color: '#0066cc', flexShrink: 0 }} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: isLightspeedSuggestion ? 500 : 400 }}>
                                        {repo}
                                      </div>
                                      {isLightspeedSuggestion && (
                                        <div style={{ fontSize: '0.75rem', color: '#6a6e73', marginTop: '2px' }}>
                                          Suggested based on your selections • Enabled by RHEL Lightspeed
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : repositoryTypeaheadValue ? (
                            // Empty state when user has typed something but no results
                            <div style={{ padding: '24px', textAlign: 'center' }}>
                              <div style={{ fontSize: '0.875rem', color: '#6a6e73', marginBottom: '8px' }}>
                                No results for "{repositoryTypeaheadValue}" in known repositories. If you know the name of your repository, make sure it's included in your{' '}
                                <a href="#" style={{ color: '#0066cc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                  Insights Repositories
                                  <ExternalLinkAltIcon style={{ fontSize: '0.75rem', color: '#0066cc' }} />
                                </a>{' '}
                                account.
                              </div>
                              <button
                                style={{
                                  background: 'transparent',
                                  border: '1px solid #d2d2d2',
                                  borderRadius: '4px',
                                  padding: '8px 16px',
                                  fontSize: '0.875rem',
                                  color: '#0066cc',
                                  cursor: 'pointer',
                                  marginTop: '8px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => {
                                  setRepositoryTypeaheadValue(''); // Clear the search input
                                  setIsSearchingExternalRepos(true);
                                  setRepositoryTypeaheadOpen(true);
                                  // Refocus the search input to keep it active
                                  setTimeout(() => {
                                    const searchInput = document.querySelector('input[placeholder="Search repositories..."]') as HTMLInputElement;
                                    if (searchInput) {
                                      searchInput.focus();
                                    }
                                  }, 10);
                                }}
                              >
                                Search repositories outside of this image
                              </button>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '1rem' }}>
                    Can't find a repository? Make sure it's been added to your account on{' '}
                    <a 
                      href="https://console.redhat.com/insights/content/repositories" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#0066cc', textDecoration: 'underline' }}
                    >
                      Insights Repositories
                      <ExternalLinkAltIcon style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }} />
                    </a>
                  </p>

                  <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    border: '1px solid #d2d2d2',
                    backgroundColor: 'white'
                  }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d2d2d2', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d2d2d2', fontWeight: 600, fontSize: '0.875rem' }}>Application stream</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d2d2d2', fontWeight: 600, fontSize: '0.875rem' }}>Retirement date</th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #d2d2d2', fontWeight: 600, fontSize: '0.875rem', width: '60px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Dynamic repository rows - appear at top */}
                      {addedRepositories.map((repo) => (
                        <tr key={repo.id}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>{repo.name}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>{repo.applicationStream}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>{repo.retirementDate}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                            <Button variant="plain" icon={<MinusCircleIcon />} onClick={() => removeAddedRepository(repo.id)} />
                          </td>
                        </tr>
                      ))}
                      {/* Static repository rows */}
                      <tr>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>My application</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ color: '#0066cc' }}>⚡</span>Code branch</div></td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>My application</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}><Button variant="plain" icon={<MinusCircleIcon />} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>My application</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ color: '#0066cc' }}>⚡</span>Code branch</div></td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>My application</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}><Button variant="plain" icon={<MinusCircleIcon />} /></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px', fontSize: '0.875rem' }}>My application</td>
                        <td style={{ padding: '12px', fontSize: '0.875rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ color: '#0066cc' }}>⚡</span>Code branch</div></td>
                        <td style={{ padding: '12px', fontSize: '0.875rem' }}>My application</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}><Button variant="plain" icon={<MinusCircleIcon />} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NEW: Selected Packages Section */}
              <div style={{ marginBottom: '2rem' }}>
                <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                  Selected packages
                </Title>

                <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', marginBottom: '1rem' }}>
                  <FormGroup label="Package Type" fieldId="package-type-new">
                    <Select
                      id="package-type-select-new"
                      isOpen={isSelectedPackageTypeOpen}
                      selected={selectedPackageType === 'individual' ? 'Individual packages' : 'Package groups'}
                      onSelect={onSelectedPackageTypeSelect}
                      onOpenChange={(isOpen) => setIsSelectedPackageTypeOpen(isOpen)}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle 
                          ref={toggleRef} 
                          onClick={() => setIsSelectedPackageTypeOpen(!isSelectedPackageTypeOpen)} 
                          isExpanded={isSelectedPackageTypeOpen} 
                          style={{ width: '180px' }}
                        >
                          {selectedPackageType === 'individual' ? 'Individual packages' : 'Package groups'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="individual">Individual packages</SelectOption>
                        <SelectOption value="groups">Package groups</SelectOption>
                      </SelectList>
                    </Select>
                  </FormGroup>

                  <FormGroup label="Packages" fieldId="packages-search-new" style={{ flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                      <SearchInput
                        value={packageTypeaheadValue}
                        onChange={(_event, value) => {
                          setPackageTypeaheadValue(value);
                          setPackageTypeaheadOpen(true); // Always show dropdown when typing
                          setIsSearchingExternalPackages(false); // Reset external search when typing
                        }}
                        onClear={() => {
                          setPackageTypeaheadValue('');
                          setPackageTypeaheadOpen(false);
                          setIsSearchingExternalPackages(false); // Reset external search when clearing
                        }}
                        onFocus={() => {
                          // Show Lightspeed suggestions when focusing empty input
                          if (!packageTypeaheadValue) {
                            setPackageTypeaheadOpen(true);
                          }
                        }}
                        onBlur={() => {
                          // Close dropdown when clicking outside (with small delay to allow selection)
                          setTimeout(() => setPackageTypeaheadOpen(false), 150);
                        }}
                        placeholder="Search packages..."
                        style={{ width: '100%' }}
                      />
                      {packageTypeaheadOpen && (
                        <div data-dropdown="package" style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          backgroundColor: 'white',
                          border: '1px solid #d2d2d2',
                          borderTop: 'none',
                          borderRadius: '0 0 4px 4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          zIndex: 1000,
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}>
                          {getFilteredTypeaheadPackages().length > 0 ? (
                            getFilteredTypeaheadPackages().map((pkg) => {
                              const isLightspeedSuggestion = !packageTypeaheadValue && generatePackageLightspeedSuggestions().includes(pkg);
                              return (
                                <div
                                  key={pkg}
                                  onClick={() => onPackageTypeaheadSelect(pkg)}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f0f0f0',
                                    fontSize: '0.875rem',
                                    backgroundColor: isLightspeedSuggestion ? '#f8f9ff' : 'white',
                                    borderLeft: isLightspeedSuggestion ? '3px solid #0066cc' : 'none'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isLightspeedSuggestion ? '#eef1ff' : '#f0f0f0'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isLightspeedSuggestion ? '#f8f9ff' : 'white'}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {isLightspeedSuggestion && (
                                      <MagicIcon style={{ fontSize: '14px', color: '#0066cc', flexShrink: 0 }} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: isLightspeedSuggestion ? 500 : 400 }}>
                                        {pkg}
                                      </div>
                                      {isLightspeedSuggestion && (
                                        <div style={{ fontSize: '0.75rem', color: '#6a6e73', marginTop: '2px' }}>
                                          Suggested based on your selections • Enabled by RHEL Lightspeed
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : packageTypeaheadValue ? (
                            // Empty state when user has typed something but no results
                            <div style={{ padding: '24px', textAlign: 'center' }}>
                              <div style={{ fontSize: '0.875rem', color: '#6a6e73', marginBottom: '8px' }}>
                                No results for "{packageTypeaheadValue}" in known repositories. If you know the name of your repository, make sure it's included in your{' '}
                                <a href="#" style={{ color: '#0066cc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                  Insights Repositories
                                  <ExternalLinkAltIcon style={{ fontSize: '0.75rem', color: '#0066cc' }} />
                                </a>{' '}
                                account.
                              </div>
                              <button
                                style={{
                                  background: 'transparent',
                                  border: '1px solid #d2d2d2',
                                  borderRadius: '4px',
                                  padding: '8px 16px',
                                  fontSize: '0.875rem',
                                  color: '#0066cc',
                                  cursor: 'pointer',
                                  marginTop: '8px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => {
                                  setPackageTypeaheadValue(''); // Clear the search input
                                  setIsSearchingExternalPackages(true);
                                  // Small delay to ensure state updates, then open dropdown and refocus
                                  setTimeout(() => {
                                    setPackageTypeaheadOpen(true);
                                    const searchInput = document.querySelector('input[placeholder="Search packages..."]') as HTMLInputElement;
                                    if (searchInput) {
                                      searchInput.focus();
                                    }
                                  }, 50);
                                }}
                              >
                                Search packages outside of this image
                              </button>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </FormGroup>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d2d2d2', backgroundColor: 'white' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d2d2d2', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d2d2d2', fontWeight: 600, fontSize: '0.875rem' }}>Application stream</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #d2d2d2', fontWeight: 600, fontSize: '0.875rem' }}>Retirement date</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #d2d2d2', fontWeight: 600, fontSize: '0.875rem', width: '60px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dynamic package rows - appear at top */}
                    {addedPackages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>{pkg.name}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>{pkg.applicationStream}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>{pkg.retirementDate}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                          <Button variant="plain" icon={<MinusCircleIcon />} onClick={() => removeAddedPackage(pkg.id)} />
                        </td>
                    </tr>
                    ))}
                    {/* Static package rows - BaseOS and AppStream */}
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>BaseOS</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem', color: '#6a6e73' }}>Added to all RHEL builds</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>2032-05-31</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}><Button variant="plain" icon={<MinusCircleIcon />} isDisabled /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>AppStream</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem', color: '#6a6e73' }}>Added to all RHEL builds</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>2032-05-31</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}><Button variant="plain" icon={<MinusCircleIcon />} isDisabled /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* OLD: Repository Rows - Grouped Layout - HIDDEN */}
              <div style={{ display: 'none' }}>
              <>

              <Stack hasGutter>
                {repositoryRows.map((row, index) => (
                  <StackItem key={row.id}>
                    <Grid hasGutter>
                      <GridItem span={3}>
                        <FormGroup
                          label={index === 0 ? "Package Type" : ""}
                          fieldId={`package-type-${row.id}`}
                        >
                          <Select
                            id={`package-type-select-${row.id}`}
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
                                isDisabled={row.isOpenSCAPRequired || row.isLocked}
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
                      </GridItem>
                      
                      <GridItem span={3}>
                        <FormGroup
                          label={index === 0 ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                              Repository
                              <Tooltip
                                content="Missing a repository? This list has been generated from your Insights account. Go to Insights Repositories to add another"
                              >
                                <OutlinedQuestionCircleIcon 
                                  style={{ 
                                    cursor: 'default',
                                    fontSize: '0.875rem',
                                    color: '#6a6e73'
                                  }} 
                                />
                              </Tooltip>
                            </span>
                          ) : ""}
                          fieldId={`repository-${row.id}`}
                          style={{ position: 'relative' }}
                        >
                          {row.isOpenSCAPRequired || row.isLocked ? (
                            <TextInput
                              value={row.repositorySearchTerm}
                              isDisabled
                              readOnly
                              style={{ 
                                width: '100%',
                                backgroundColor: '#f5f5f5',
                                color: '#666',
                                cursor: 'not-allowed'
                              }}
                            />
                          ) : (
                            <Select
                              id={`repository-select-${row.id}`}
                              isOpen={row.isRepositorySearching}
                              selected={row.repository || 'Select repository'}
                              onSelect={(_, selection) => {
                                const selectedValue = String(selection);
                                if (row.repository === selectedValue) {
                                  // Toggle off - clear selection
                                  handleRepositorySearchSelect(row.id, '');
                                } else {
                                  handleRepositorySearchSelect(row.id, selectedValue);
                                }
                                updateRepositoryRow(row.id, { isRepositorySearching: false });
                              }}
                              onOpenChange={(isOpen) => updateRepositoryRow(row.id, { isRepositorySearching: isOpen })}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle 
                                  ref={toggleRef} 
                                  onClick={() => updateRepositoryRow(row.id, { isRepositorySearching: !row.isRepositorySearching })}
                                  isExpanded={row.isRepositorySearching}
                                  style={{ width: '100%' }}
                                >
                                  {row.repository || 'Select repository'}
                                </MenuToggle>
                              )}
                            >
                              <SelectList>
                                {availableRepositories.map((repo) => (
                                  <SelectOption key={repo} value={repo}>
                                    {repo}
                                  </SelectOption>
                                ))}
                              </SelectList>
                            </Select>
                          )}

                        </FormGroup>
                      </GridItem>
                      
                      <GridItem span={6} style={{ overflow: 'visible' }}>
                        <FormGroup
                          label={index === 0 ? "Package" : ""}
                          fieldId={`package-${row.id}`}
                          style={{ position: 'relative', overflow: 'visible' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                            {/* Package Multi-Select with Chips */}
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                              {row.isLocked && row.selectedPackage && !row.selectedPackages ? (
                                <TextInput
                                  value={`${row.selectedPackage.name} v${row.selectedPackage.version}`}
                                  readOnly
                                  style={{ width: '100%' }}
                                />
                              ) : !row.isOpenSCAPRequired && !row.selectedPackages?.some(pkg => pkg.isAllPackages) && !(row.isLocked && (row.selectedPackages?.length ?? 0) > 0) ? (
                                <div style={{ position: 'relative', width: '100%' }}>


                                  {/* TextInputGroup with inline package chips */}
                                  <TextInputGroup>
                                    <TextInputGroupMain 
                                      icon={(!row.selectedPackages || row.selectedPackages.length === 0) && <SearchIcon />}
                                      value={row.packageSearchTerm}
                                      onChange={(_event, value) => handleRowPackageSearchInput(row.id, value)}
                                      onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                          performRowPackageSearch(row.id);
                                        }
                                      }}
                                      onFocus={() => {
                                        if (row.repository) {
                                          updateRepositoryRow(row.id, { isRepositoryDropdownOpen: true });
                                        }
                                      }}
                                      onBlur={() => {
                                        setTimeout(() => updateRepositoryRow(row.id, { isRepositoryDropdownOpen: false }), 200);
                                      }}
                                      placeholder={
                                        row.selectedPackages && row.selectedPackages.length > 0 
                                          ? "Search for more packages..." 
                                          : (row.repository ? "Search for packages..." : "Select repository first")
                                      }
                                      disabled={!row.repository}
                                    >
                                      {row.selectedPackages && row.selectedPackages.length > 0 && (
                                        <LabelGroup>
                                          {row.selectedPackages.slice(0, 8).map((pkg, index) => (
                                            <Label
                                              key={pkg.id || `${pkg.name}-${index}`}
                                              color={row.isOpenSCAPRequired ? "orange" : "blue"}
                                              variant="outline"
                                              isCompact
                                              onClose={!row.isOpenSCAPRequired ? () => handleRemovePackageFromSelection(row.id, pkg) : undefined}
                                            >
                                              {pkg.isAllPackages ? `All packages (${pkg.packageCount})` : pkg.name}
                                            </Label>
                                          ))}
                                          {row.selectedPackages.length > 8 && (
                                            <Label color="grey" variant="outline" isCompact>
                                              +{row.selectedPackages.length - 8} more
                                            </Label>
                                          )}
                                        </LabelGroup>
                                      )}
                                    </TextInputGroupMain>
                                    {((row.packageSearchTerm && row.packageSearchTerm.trim()) || (row.selectedPackages && row.selectedPackages.length > 0)) && (
                                      <TextInputGroupUtilities>
                                        <Button
                                          variant="plain"
                                          onClick={() => {
                                            handleRowPackageSearchClear(row.id);
                                            // Also clear selected packages for this row
                                            updateRepositoryRow(row.id, { selectedPackages: [] });
                                          }}
                                          aria-label="Clear search and selected packages"
                                          icon={<TimesIcon />}
                                        />
                                      </TextInputGroupUtilities>
                                    )}
                                  </TextInputGroup>
                                </div>
                              ) : (
                                // Display for OpenSCAP or locked states - read-only TextInputGroup
                                <div style={{ width: '100%' }}>
                                  <TextInputGroup>
                                    <TextInputGroupMain 
                                      value=""
                                      onChange={() => {}} // No-op for read-only
                                      placeholder={
                                        row.selectedPackages && row.selectedPackages.length > 0 
                                          ? `${row.selectedPackages.length} package${row.selectedPackages.length > 1 ? 's' : ''} selected (read-only)`
                                          : "No packages selected"
                                      }
                                      disabled={true}
                                    >
                                      {row.selectedPackages && row.selectedPackages.length > 0 && (
                                        <LabelGroup>
                                          {row.selectedPackages.slice(0, 8).map((pkg, index) => (
                                            <Label
                                              key={pkg.id || `${pkg.name}-${index}`}
                                              color={row.isOpenSCAPRequired ? "orange" : "blue"}
                                              variant="outline"
                                              isCompact
                                              onClose={!row.isOpenSCAPRequired ? () => handleRemovePackageFromSelection(row.id, pkg) : undefined}
                                            >
                                              {pkg.isAllPackages ? `All packages (${pkg.packageCount})` : pkg.name}
                                            </Label>
                                          ))}
                                          {row.selectedPackages.length > 8 && (
                                            <Label color="grey" variant="outline" isCompact>
                                              +{row.selectedPackages.length - 8} more
                                            </Label>
                                          )}
                                        </LabelGroup>
                                      )}
                                    </TextInputGroupMain>
                                  </TextInputGroup>
                                </div>
                              )}
                            </div>

                            {/* Minus icon - always positioned at far right */}
                            {!row.isOpenSCAPRequired && (
                              <MinusCircleIcon
                                style={{ 
                                  fontSize: '1.25rem', 
                                  color: '#151515',
                                  cursor: 'pointer',
                                  flexShrink: 0
                                }}
                                onClick={() => removeRepositoryRow(row.id)}
                              />
                            )}
                          </div>
                          {row.isOpenSCAPRequired && row.isLocked && (
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#666', 
                              marginTop: '4px',
                              fontStyle: 'italic'
                            }}>
                              Added by OpenSCAP
                            </div>
                          )}

                          
                          {/* Search Results Dropdown for this row */}
                          {!row.isOpenSCAPRequired && !row.selectedPackages?.some(pkg => pkg.isAllPackages) && !(row.isLocked && (row.selectedPackages?.length ?? 0) > 0) && (row.isLoading || row.searchResults.length > 0 || (row.packageSearchTerm.trim() && !row.isLoading) || (row.repository && !row.packageSearchTerm.trim())) && (
                            <div style={{ 
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              backgroundColor: 'white',
                              border: '1px solid #d2d2d2',
                              borderRadius: '8px',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                              zIndex: 9999,
                              maxHeight: '320px',
                              overflowY: 'auto',
                              marginTop: '4px'
                            }}>
                              {/* Default state: Add all packages from repository */}
                              {row.repository && !row.packageSearchTerm.trim() && !row.isLoading && (
                                <div>
                                  <div
                                    style={{ 
                                      padding: '12px 16px',
                                      borderBottom: '1px solid #f0f0f0',
                                      cursor: 'pointer',
                                      fontSize: '0.875rem',
                                      transition: 'background-color 0.15s ease',
                                      backgroundColor: '#f8f9ff',
                                      border: '1px solid #d1e7ff'
                                    }}
                                    onClick={() => handleAddAllPackages(row.id)}
                                    onMouseEnter={(e) => {
                                      (e.target as HTMLElement).style.backgroundColor = '#e6f1ff';
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.target as HTMLElement).style.backgroundColor = '#f8f9ff';
                                    }}
                                  >
                                    <div style={{ fontWeight: 500, color: '#0066cc', marginBottom: '4px' }}>
                                      <PlusIcon style={{ marginRight: '6px', fontSize: '0.875rem' }} />
                                      Add all packages from {row.repository}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                      {row.repositoryPackageCount ? `${row.repositoryPackageCount.toLocaleString()} packages available` : 'Multiple packages available'}
                                    </div>
                                  </div>

                                </div>
                              )}

                              {row.isLoading ? (
                                <div style={{ 
                                  padding: '16px',
                                  textAlign: 'center',
                                  color: '#666'
                                }}>
                                  <Spinner size="md" style={{ marginBottom: '8px' }} />
                                  <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>
                                    Searching packages...
                                  </div>

                                  <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                                    Tip: Type the full package name for better results
                                  </div>
                                </div>
                              ) : row.searchResults.length > 0 ? (
                                row.searchResults.slice(0, 5).map((pkg) => (
                                  <div
                                    key={pkg.id}
                                    style={{ 
                                      padding: '12px 16px',
                                      borderBottom: '1px solid #f0f0f0',
                                      cursor: 'pointer',
                                      fontSize: '0.875rem',
                                      transition: 'all 0.15s ease',
                                      borderRadius: '6px',
                                      margin: '4px 8px'
                                    }}
                                    onClick={() => handlePackageSelection(row.id, pkg)}
                                    onMouseEnter={(e) => {
                                      (e.target as HTMLElement).style.backgroundColor = '#f8f9fa';
                                      (e.target as HTMLElement).style.borderColor = '#dee2e6';
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.target as HTMLElement).style.backgroundColor = 'white';
                                      (e.target as HTMLElement).style.borderColor = '#f0f0f0';
                                    }}
                                  >
                                    <div style={{ 
                                      fontWeight: 500, 
                                      marginBottom: '4px',
                                      color: '#495057'
                                    }}>
                                      {pkg.name}
                                    </div>
                                    <div style={{ 
                                      color: '#6c757d', 
                                      fontSize: '0.75rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}>
                                      <span>v{pkg.version}</span>
                                      <span>•</span>
                                      <span>{pkg.repository}</span>
                                    </div>
                                  </div>
                                ))
                              ) : null}

                              {row.packageSearchTerm.trim() && (
                                <div style={{ 
                                  padding: '16px',
                                  textAlign: 'center',
                                  color: '#666'
                                }}>

                                  <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                    Tip: Type the full package name for better results
                                  </div>
                                </div>
                              )}

                              {/* RHEL Lightspeed Package Recommendations - Top 2 only */}
                              {row.lightspeedRecommendations && row.lightspeedRecommendations.length > 0 && (
                                <>
                                  {/* Add separator line */}
                                  <div style={{ borderTop: '1px solid #e8e8e8', margin: '8px 0' }} />
                                  
                                  {row.lightspeedRecommendations.slice(0, 2).map((rec) => (
                                    <div
                                      key={rec.id}
                                      style={{ 
                                        padding: '10px 16px',
                                        borderBottom: '1px solid #f0f0f0',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        transition: 'background-color 0.15s ease',
                                        backgroundColor: '#f8f9fa'
                                      }}
                                      onClick={() => handlePackageSelection(row.id, rec)}
                                      onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.backgroundColor = '#e9ecef';
                                      }}
                                      onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.backgroundColor = '#f8f9fa';
                                      }}
                                    >
                                      <div style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontWeight: 500,
                                        marginBottom: '2px'
                                      }}>
                                        <MagicIcon style={{ fontSize: '14px', color: '#0066cc' }} />
                                        {rec.name}
                                        <span style={{ 
                                          fontSize: '0.7rem', 
                                          color: '#666', 
                                          fontWeight: 400,
                                          fontStyle: 'italic',
                                          marginLeft: '0.5rem'
                                        }}>
                                          RHEL Lightspeed
                                        </span>
                                      </div>
                                      <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '2px' }}>
                                        v{rec.version}
                                      </div>
                                      <div style={{ color: '#666', fontSize: '0.75rem' }}>
                                        {rec.description}
                                      </div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          )}
                        </FormGroup>
                      </GridItem>
                    </Grid>
                  </StackItem>
                ))}
              </Stack>

              {/* Add Repository Button */}
              <div style={{ marginTop: '1rem' }}>
                <Button
                  variant="link"
                  icon={<PlusIcon />}
                  onClick={addRepositoryRow}
                  style={{ fontSize: '0.875rem' }}
                >
                  Add Repository
                </Button>
              </div>
                </>
              </div>
              
              {/* End of repository interface - OLD SYSTEM HIDDEN */}
            </Form>
          </div>
        );
      case 2:
        return (
          <div>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '0rem' }}>
              Advanced Settings
            </Title>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '1rem' }}>
              Configure advanced system settings including registration, timezone, locale, and security options.
            </p>
            <Form>
              


              {/* Timezone Section */}

              <div style={{ marginBottom: '2rem', marginTop : '1rem'}}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Timezone
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                    Create images that can be reproduced consistently with the same package versions and configurations.
                  </Content>

                
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
                      const selectedValue = String(selection);
                      if (timezone === selectedValue) {
                        // Toggle off - clear selection
                        setTimezone('');
                      } else {
                        setTimezone(selectedValue);
                      }
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
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <span style={{ 
                            flex: 1, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            marginRight: '8px'
                          }}>
                            {timezone || 'Select timezone'}
                          </span>
                          {timezone && (
                            <Button
                              variant="plain"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTimezone('');
                              }}
                              style={{ 
                                padding: '2px', 
                                minWidth: 'auto',
                                flexShrink: 0
                              }}
                            >
                              <TimesIcon style={{ fontSize: '0.875rem' }} />
                            </Button>
                          )}
                        </div>
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
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    Network time servers for system clock synchronization
                  </div>
                </FormGroup>

                <FormGroup
                  label="NTP servers"
                  fieldId="ntp-servers"
                  style={{ marginBottom: '0rem' }}
                >
                  <TextInputGroup style={{ width: '60%' }}>
                    <TextInputGroupMain>
                      <LabelGroup>
                        {ntpServers.map((server, index) => (
                          <Label 
                            key={index}
                            variant="filled" 
                            color="teal"
                            onClose={() => {
                              const newServers = ntpServers.filter((_, i) => i !== index);
                              setNtpServers(newServers);
                              validateNTPServers(newServers);
                            }}
                          >
                            {server}
                          </Label>
                        ))}
                      </LabelGroup>
                      <input
                        type="text"
                        value={ntpServersInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.includes(',')) {
                            // Extract server name before comma and add as chip
                            const newServer = value.split(',')[0].trim();
                            if (newServer && !ntpServers.includes(newServer)) {
                              const updatedServers = [...ntpServers, newServer];
                              setNtpServers(updatedServers);
                              validateNTPServers(updatedServers);
                            }
                            setNtpServersInput(''); // Clear input after adding
                          } else {
                            setNtpServersInput(value);
                          }
                        }}
                                          // Removed focus handlers for NTP field
                        placeholder={ntpServers.length > 0 ? "Type server, comma to add..." : "e.g. pool.ntp.org, comma to add..."}
                        style={{ 
                          border: 'none', 
                          outline: 'none', 
                          background: 'transparent',
                          flex: 1,
                          minWidth: '150px'
                        }}
                      />
                    </TextInputGroupMain>
                    {(ntpServers.length > 0 || ntpServersInput) && (
                      <TextInputGroupUtilities>
                        <Button
                          variant="plain"
                          onClick={() => {
                            setNtpServers([]);
                            setNtpServersInput('');
                            validateNTPServers([]);
                          }}
                          aria-label="Clear NTP servers"
                          icon={<TimesIcon />}
                        />
                      </TextInputGroupUtilities>
                    )}
                  </TextInputGroup>
                  {ntpValidated === 'error' && (
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem variant="error">
                          {ntpHelperText}
                        </HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  )}

                </FormGroup>
              </div>

              {/* Divider */}
              <div style={{ 
                height: '1px', 
                backgroundColor: '#d2d2d2', 
                margin: '0rem 0 1rem 0' 
              }} />

              {/* Locale Section */}

              <div style={{ marginBottom: '2rem', marginTop : '0rem'}}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Locale
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                  This is filler text for now.                  
                  </Content>
                
                <FormGroup
                  label="Suggest keyboards from these languages"
                  fieldId="languages"
                  style={{ marginBottom: '2rem', marginTop:'2rem' }}
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
                      icon={<PlusIcon />}
                      onClick={addLanguage}
                      style={{ fontSize: '0.875rem' }}
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

                <FormGroup
                  label="Specialty keyboards"
                  fieldId="specialty-keyboards"
                  style={{ marginBottom: '0rem' }}
                >
                  <Select
                    id="specialty-keyboards-select"
                    isOpen={isSpecialtyKeyboardOpen}
                    selected={specialtyKeyboard}
                    onSelect={(_, selection) => {
                      setSpecialtyKeyboard(String(selection));
                      setIsSpecialtyKeyboardOpen(false);
                    }}
                    onOpenChange={(isOpen) => setIsSpecialtyKeyboardOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                      <MenuToggle 
                        ref={toggleRef} 
                        onClick={() => setIsSpecialtyKeyboardOpen(!isSpecialtyKeyboardOpen)}
                        isExpanded={isSpecialtyKeyboardOpen}
                        style={{ width: '300px' }}
                      >
                        {specialtyKeyboard || 'Select specialty keyboard'}
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="Dvorak">Dvorak</SelectOption>
                      <SelectOption value="Colemak">Colemak</SelectOption>
                      <SelectOption value="Workman">Workman</SelectOption>
                      <SelectOption value="Neo">Neo</SelectOption>
                      <SelectOption value="Bépo">Bépo</SelectOption>
                    </SelectList>
                  </Select>
                </FormGroup>
              </div>

              {/* Divider */}
              <div style={{ 
                height: '1px', 
                backgroundColor: '#d2d2d2', 
                margin: '1rem 0' 
              }} />

              {/* Hostname Section */}

              <div style={{ marginBottom: '2rem', marginTop : '0rem'}}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Hostname
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                  This is filler text for now.                  
                  </Content>

                
                <FormGroup
                  label="Hostname"
                  fieldId="hostname"
                  style={{ marginBottom: '0rem', width: '25%' }}
                >
                  <div style={{ position: 'relative', width: '100%' }}>
                    <TextInput
                      id="hostname"
                      value={hostname}
                      onChange={(_event, value) => {
                        setHostname(value);
                        validateHostname(value);
                      }}
                      onFocus={() => setHostnameFocused(true)}
                      onBlur={() => setHostnameFocused(false)}
                      validated={hostnameValidated}
                      placeholder="Enter hostname"
                    />
                    {hostname && !hostnameFocused && (
                      <Button
                        variant="plain"
                        onClick={() => {
                          setHostname('');
                          validateHostname('');
                        }}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '0.25rem',
                          minWidth: 'auto',
                          height: 'auto'
                        }}
                        aria-label="Clear hostname"
                      >
                        <TimesIcon style={{ fontSize: '0.875rem', color: '#666' }} />
                      </Button>
                    )}
                  </div>
                  {hostnameValidated === 'error' && (
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem variant="error">
                          {hostnameHelperText}
                        </HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  )}

                </FormGroup>
              </div>

              {/* Divider */}
              <div style={{ 
                height: '1px', 
                backgroundColor: '#d2d2d2', 
                margin: '1rem 0' 
              }} />

              {/* Kernel Section */}

              <div style={{ marginBottom: '2rem', marginTop : '0rem'}}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Kernel
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                  This is filler text for now.                  
                  </Content>

                
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

                <FormGroup
                  label="Append"
                  fieldId="kernel-append"
                  style={{ marginBottom: '1rem' }}
                >
                  <TextInputGroup style={{ width: '60%' }}>
                    <TextInputGroupMain>
                      <LabelGroup>
                        {kernelAppend.map((option, index) => (
                          <Label
                            key={index}
                            variant="filled"
                            color="grey"
                            onClose={() => {
                              const newOptions = kernelAppend.filter((_, i) => i !== index);
                              setKernelAppend(newOptions);
                              validateKernelAppend(newOptions);
                            }}
                          >
                            {option}
                          </Label>
                        ))}
                      </LabelGroup>
                      <input
                        type="text"
                        value={kernelAppendInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.includes(',')) {
                            const newOption = value.split(',')[0].trim();
                            if (newOption && !kernelAppend.includes(newOption)) {
                              const updatedOptions = [...kernelAppend, newOption];
                              setKernelAppend(updatedOptions);
                              validateKernelAppend(updatedOptions);
                            }
                            setKernelAppendInput('');
                          } else {
                            setKernelAppendInput(value);
                          }
                        }}
                        onFocus={() => setKernelFocused(true)}
                        onBlur={() => setKernelFocused(false)}
                        placeholder={kernelAppend.length > 0 ? "Type option, comma to add..." : "e.g. console=ttyS0, comma to add..."}
                        style={{
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          flex: 1,
                          minWidth: '150px'
                        }}
                      />
                    </TextInputGroupMain>
                    {(kernelAppend.length > 0 || kernelAppendInput) && (
                      <TextInputGroupUtilities>
                        <Button
                          variant="plain"
                          onClick={() => {
                            setKernelAppend([]);
                            setKernelAppendInput('');
                            validateKernelAppend([]);
                          }}
                          aria-label="Clear kernel append options"
                          icon={<TimesIcon />}
                        />
                      </TextInputGroupUtilities>
                    )}
                  </TextInputGroup>
                  {kernelValidated === 'error' && (
                    <FormHelperText>
                      <HelperText>
                        <HelperTextItem variant="error">
                          {kernelHelperText}
                        </HelperTextItem>
                      </HelperText>
                    </FormHelperText>
                  )}

                </FormGroup>
              </div>

              {/* Divider */}
              <div style={{ 
                height: '1px', 
                backgroundColor: '#d2d2d2', 
                margin: '1rem 0' 
              }} />

              {/* Systemd Services Section */}

              <div style={{ marginBottom: '2rem', marginTop : '0rem'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                      Systemd services
                    </Title>
                    {openscapAddedServicesCount > 0 && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: '#666',
                        backgroundColor: '#f0f0f0',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 500
                      }}>
                        {openscapAddedServicesCount} added by OpenSCAP
                      </span>
                    )}
                  </div>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                  This is filler text for now.                  
                  </Content>
                
                <FormGroup
                  label="Enabled services"
                  fieldId="systemd-enabled-services"
                  style={{ marginBottom: '1rem' }}
                >
                  <TextInputGroup style={{ width: '60%' }}>
                    <TextInputGroupMain>
                      <LabelGroup>
                        {systemdEnabledServices.map((service, index) => (
                          <Label 
                            key={index}
                            variant="filled" 
                            color="green"
                            onClose={() => {
                              const newServices = systemdEnabledServices.filter((_, i) => i !== index);
                              setSystemdEnabledServices(newServices);
                            }}
                          >
                            {service}
                          </Label>
                        ))}
                      </LabelGroup>
                      <input
                        type="text"
                        value={enabledServicesInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.includes(',')) {
                            // Extract service name before comma and add as chip
                            const newService = value.split(',')[0].trim();
                            if (newService && !systemdEnabledServices.includes(newService)) {
                              setSystemdEnabledServices([...systemdEnabledServices, newService]);
                            }
                            setEnabledServicesInput(''); // Clear input after adding
                          } else {
                            setEnabledServicesInput(value);
                          }
                        }}
                        placeholder={systemdEnabledServices.length > 0 ? "Type service name, comma to add..." : "Type service name, comma to add..."}
                        style={{ 
                          border: 'none', 
                          outline: 'none', 
                          background: 'transparent',
                          flex: 1,
                          minWidth: '150px'
                        }}
                      />
                    </TextInputGroupMain>
                    {(systemdEnabledServices.length > 0 || enabledServicesInput) && (
                      <TextInputGroupUtilities>
                        <Button
                          variant="plain"
                          onClick={() => {
                            setSystemdEnabledServices([]);
                            setEnabledServicesInput('');
                          }}
                          aria-label="Clear enabled services"
                          icon={<TimesIcon />}
                        />
                      </TextInputGroupUtilities>
                    )}
                  </TextInputGroup>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    These services are currently active and set to start automatically at boot.
                  </div>
                </FormGroup>

                <FormGroup
                  label="Disabled services"
                  fieldId="systemd-disabled-services"
                  style={{ marginBottom: '1rem' }}
                >
                  <TextInputGroup style={{ width: '60%' }}>
                    <TextInputGroupMain>
                      <LabelGroup>
                        {systemdDisabledServices.map((service, index) => (
                          <Label 
                            key={index}
                            variant="filled" 
                            color="blue"
                            onClose={() => {
                              const newServices = systemdDisabledServices.filter((_, i) => i !== index);
                              setSystemdDisabledServices(newServices);
                            }}
                          >
                            {service}
                          </Label>
                        ))}
                      </LabelGroup>
                      <input
                        type="text"
                        value={disabledServicesInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.includes(',')) {
                            // Extract service name before comma and add as chip
                            const newService = value.split(',')[0].trim();
                            if (newService && !systemdDisabledServices.includes(newService)) {
                              setSystemdDisabledServices([...systemdDisabledServices, newService]);
                            }
                            setDisabledServicesInput(''); // Clear input after adding
                          } else {
                            setDisabledServicesInput(value);
                          }
                        }}
                        placeholder={systemdDisabledServices.length > 0 ? "Type service name, comma to add..." : "Type service name, comma to add..."}
                        style={{ 
                          border: 'none', 
                          outline: 'none', 
                          background: 'transparent',
                          flex: 1,
                          minWidth: '150px'
                        }}
                      />
                    </TextInputGroupMain>
                    {(systemdDisabledServices.length > 0 || disabledServicesInput) && (
                      <TextInputGroupUtilities>
                        <Button
                          variant="plain"
                          onClick={() => {
                            setSystemdDisabledServices([]);
                            setDisabledServicesInput('');
                          }}
                          aria-label="Clear disabled services"
                          icon={<TimesIcon />}
                        />
                      </TextInputGroupUtilities>
                    )}
                  </TextInputGroup>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    These services are installed but will not start automatically at boot.
                  </div>
                </FormGroup>

                <FormGroup
                  label="Masked services"
                  fieldId="systemd-masked-services"
                  style={{ marginBottom: '0rem' }}
                >
                  <TextInputGroup style={{ width: '60%' }}>
                    <TextInputGroupMain>
                      <LabelGroup>
                        {systemdMaskedServices.map((service, index) => (
                          <Label 
                            key={index}
                            variant="filled" 
                            color="orange"
                            onClose={() => {
                              const newServices = systemdMaskedServices.filter((_, i) => i !== index);
                              setSystemdMaskedServices(newServices);
                            }}
                          >
                            {service}
                          </Label>
                        ))}
                      </LabelGroup>
                      <input
                        type="text"
                        value={maskedServicesInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.includes(',')) {
                            // Extract service name before comma and add as chip
                            const newService = value.split(',')[0].trim();
                            if (newService && !systemdMaskedServices.includes(newService)) {
                              setSystemdMaskedServices([...systemdMaskedServices, newService]);
                            }
                            setMaskedServicesInput(''); // Clear input after adding
                          } else {
                            setMaskedServicesInput(value);
                          }
                        }}
                        placeholder={systemdMaskedServices.length > 0 ? "Type service name, comma to add..." : "Type service name, comma to add..."}
                        style={{ 
                          border: 'none', 
                          outline: 'none', 
                          background: 'transparent',
                          flex: 1,
                          minWidth: '150px'
                        }}
                      />
                    </TextInputGroupMain>
                    {(systemdMaskedServices.length > 0 || maskedServicesInput) && (
                      <TextInputGroupUtilities>
                        <Button
                          variant="plain"
                          onClick={() => {
                            setSystemdMaskedServices([]);
                            setMaskedServicesInput('');
                          }}
                          aria-label="Clear masked services"
                          icon={<TimesIcon />}
                        />
                      </TextInputGroupUtilities>
                    )}
                  </TextInputGroup>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    These services are completely blocked from being started manually or automatically.
                  </div>
                </FormGroup>
              </div>

              {/* Divider */}
              <div style={{ 
                height: '1px', 
                backgroundColor: '#d2d2d2', 
                margin: '1rem 0' 
              }} />

              {/* Firewall Section */}

              <div style={{ marginBottom: '2rem', marginTop : '0rem'}}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Firewall
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                  This is filler text for now.                  
                  </Content>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <FormGroup
                    label="Enabled ports"
                    fieldId="firewall-enabled-ports"
                    style={{ flex: 1 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {firewallPorts.map((port, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <TextInput
                            id={`firewall-enabled-ports-${index}`}
                            value={port}
                            onChange={(_event, value) => updateFirewallPort(index, value)}
                            // Removed focus handlers for firewall field
                            validated={index === 0 ? firewallValidated : 'default'}
                            placeholder="Enter port (e.g., 8080/tcp, 443/udp)"
                            style={{ flex: 1 }}
                          />
                        </div>
                      ))}
                    </div>
                    {firewallValidated === 'error' && (
                      <FormHelperText>
                        <HelperText>
                          <HelperTextItem variant="error">
                            {firewallHelperText}
                          </HelperTextItem>
                        </HelperText>
                      </FormHelperText>
                    )}

                  </FormGroup>

                  <FormGroup
                    label="Disabled services"
                    fieldId="firewall-disabled-services"
                    style={{ flex: 1 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                              {firewallDisabledServices.map((service, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TextInput
                              id={`firewall-disabled-services-${index}`}
                              value={service}
                              onChange={(_event, value) => updateFirewallDisabledService(index, value)}
                              placeholder="Enter service name"
                              style={{ flex: 1 }}
                            />
                          </div>
                        ))}
                    </div>
                  </FormGroup>

                  <FormGroup
                    label="Enabled services"
                    fieldId="firewall-enabled-services"
                    style={{ flex: 1 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {firewallEnabledServices.map((service, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <TextInput
                            id={`firewall-enabled-services-${index}`}
                            value={service}
                            onChange={(_event, value) => updateFirewallEnabledService(index, value)}
                            placeholder="Enter service name"
                            style={{ flex: 1 }}
                          />
                          <MinusCircleIcon
                            style={{ 
                              fontSize: '1.25rem', 
                              color: '#151515',
                              cursor: firewallEnabledServices.length > 1 ? 'pointer' : 'not-allowed',
                              opacity: firewallEnabledServices.length > 1 ? 1 : 0.3
                            }}
                            onClick={() => {
                              if (firewallEnabledServices.length > 1) {
                                removeFirewallRow(index);
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </FormGroup>
                </div>

                <Button
                  variant="link"
                  icon={<PlusIcon />}
                  onClick={addFirewallRow}
                  style={{ marginBottom: '0rem', fontSize: '0.875rem' }}
                >
                  Add more
                </Button>
              </div>

              {/* Divider */}
              <div style={{ 
                height: '1px', 
                backgroundColor: '#d2d2d2', 
                margin: '1rem 0' 
              }} />

              {/* Users Section */}

              <div style={{ marginBottom: '2rem', marginTop : '0rem'}}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Users
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                  Create user accounts for systems that will use this image. Duplicate usernames are not allowed.                  
                  </Content>

                {/* User management rows */}
                <Stack hasGutter>
                  {users.map((user, index) => (
                    <StackItem key={user.id}>
                      <Grid hasGutter>
                        <GridItem span={2}>
                          <FormGroup
                            label={index === 0 ? "Administrator" : ""}
                            fieldId={`admin-${user.id}`}
                          >
                            <Checkbox
                              id={`admin-${user.id}`}
                              isChecked={user.isAdministrator}
                              onChange={(event, checked) => updateUser(user.id, 'isAdministrator', checked)}
                            />
                          </FormGroup>
                        </GridItem>
                        
                        <GridItem span={2}>
                          <FormGroup
                            label={index === 0 ? "Username" : ""}
                            fieldId={`username-${user.id}`}
                          >
                            <TextInput
                              type="text"
                              value={user.username}
                              onChange={(event, value) => {
                                updateUser(user.id, 'username', value);
                                // Check for duplicate usernames
                                const isDuplicate = checkDuplicateUsername(user.id, value);
                                setUsernameErrors(prev => {
                                  const newErrors = { ...prev };
                                  if (isDuplicate) {
                                    newErrors[user.id] = 'Duplicate usernames are not allowed';
                                  } else {
                                    delete newErrors[user.id];
                                  }
                                  return newErrors;
                                });
                                // Also clear validation errors for other users with same username when this one changes
                                if (!isDuplicate) {
                                  setUsernameErrors(prev => {
                                    const newErrors = { ...prev };
                                    Object.keys(newErrors).forEach(userId => {
                                      if (userId !== user.id) {
                                        const otherUser = users.find(u => u.id === userId);
                                        if (otherUser && otherUser.username.trim() === value.trim()) {
                                          delete newErrors[userId];
                                        }
                                      }
                                    });
                                    return newErrors;
                                  });
                                }
                              }}
                              placeholder="Username"
                              validated={usernameErrors[user.id] ? 'error' : 'default'}
                            />
                            {usernameErrors[user.id] && (
                              <div style={{ 
                                fontSize: '0.875rem', 
                                color: '#c9190b', 
                                marginTop: '0.25rem' 
                              }}>
                                {usernameErrors[user.id]}
                              </div>
                            )}
                          </FormGroup>
                        </GridItem>
                        
                        <GridItem span={2}>
                          <FormGroup
                            label={index === 0 ? "Password" : ""}
                            fieldId={`password-${user.id}`}
                          >
                            <TextInput
                              type="password"
                              value={user.password}
                              onChange={(event, value) => updateUser(user.id, 'password', value)}
                              placeholder="Password"
                            />
                          </FormGroup>
                        </GridItem>
                        
                        <GridItem span={3}>
                          <FormGroup
                            label={index === 0 ? "SSH key" : ""}
                            fieldId={`ssh-key-${user.id}`}
                          >
                            <TextInput
                              type="text"
                              value={user.sshKey}
                              onChange={(event, value) => updateUser(user.id, 'sshKey', value)}
                              placeholder="SSH key"
                            />
                          </FormGroup>
                        </GridItem>
                        
                        <GridItem span={2}>
                          <FormGroup
                            label={index === 0 ? "Groups" : ""}
                            fieldId={`groups-${user.id}`}
                          >
                            <TextInputGroup style={{ width: '100%' }}>
                              <TextInputGroupMain>
                                <LabelGroup>
                                  {user.groups.map((group) => (
                                    <Label 
                                      key={group} 
                                      variant="filled" 
                                      color="purple" 
                                      onClose={() => removeGroupFromUser(user.id, group)}
                                      closeBtnAriaLabel={`Remove ${group}`}
                                    >
                                      {group}
                                    </Label>
                                  ))}
                                </LabelGroup>
                                <input
                                  type="text"
                                  value={user.groupInput}
                                  onChange={(e) => handleGroupInputChange(user.id, e.target.value)}
                                  placeholder={user.groups.length > 0 ? "Type group, comma to add..." : "e.g. wheel, comma to add..."}
                                  style={{ 
                                    border: 'none', 
                                    outline: 'none', 
                                    background: 'transparent',
                                    flex: 1,
                                    minWidth: '120px',
                                    fontSize: '14px'
                                  }}
                                />
                              </TextInputGroupMain>
                            </TextInputGroup>
                          </FormGroup>
                        </GridItem>
                        
                        <GridItem span={1}>
                          <FormGroup
                            label={index === 0 ? "" : ""}
                            fieldId={`remove-${user.id}`}
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px', 
                              width: '100%'
                            }}>
                              <div style={{ flex: 1 }}></div>
                              <Button
                                variant="plain"
                                onClick={() => removeUser(user.id)}
                                isDisabled={users.length === 1}
                                style={{ 
                                  minWidth: 'auto', 
                                  padding: '4px',
                                  flexShrink: 0
                                }}
                              >
                                <MinusCircleIcon />
                              </Button>
                            </div>
                          </FormGroup>
                        </GridItem>
                      </Grid>
                    </StackItem>
                  ))}
                </Stack>
                
                {/* Add user button */}
                <Button
                  variant="link"
                  icon={<PlusIcon />}
                  onClick={addUser}
                  style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}
                >
                  Add another user
                </Button>
              </div>

              {/* First Boot Configuration Section - moved from Base Settings */}
              <div ref={firstBootRef} style={{ marginBottom: '2rem' }}>
                {/* Divider before First Boot Configuration */}
                <div style={{ 
                  height: '1px', 
                  backgroundColor: '#d2d2d2', 
                  margin: '2rem 0' 
                }} />

                <div style={{ marginBottom: '1rem' }}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    First boot configuration
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                    Configure the image with a custom script that will execute on its first boot.  
                  </Content>
                </div>
                    
                <div style={{
                  '--pf-v5-c-file-upload__file-details-textarea--FontFamily': '"Red Hat Mono", "Monaco", "Menlo", "Ubuntu Mono", monospace'
                } as React.CSSProperties}>
                  <FileUpload
                    id="kickstart-file"
                    type="text"
                    value={kickstartFile || 'Manually enter the script here.'} 
                    style={{color: '#000000' }}
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
                    Supports bash shell, python or Ansible playbooks
                  </div>
                </div>
              </div>
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
            
            {/* Cloud Environment Expiration Reminder */}
            {(selectedCloudProvider.includes('aws') || selectedCloudProvider.includes('gcp') || selectedCloudProvider.includes('azure')) && (
              <Alert
                variant="warning"
                title="Important: Cloud image expiration notice"
                style={{ marginBottom: '2rem' }}
              >
                <p>
                  You are seeing this notice because you selected <strong>
                  {selectedCloudProvider.map(provider => {
                    switch (provider) {
                      case 'aws': return 'Amazon Web Services';
                      case 'gcp': return 'Google Cloud Platform';
                      case 'azure': return 'Microsoft Azure';
                      case 'oci': return 'Oracle Cloud Infrastructure';
                      default: return provider;
                    }
                  }).join(', ')}
                  </strong> as your target environment{selectedCloudProvider.length > 1 ? 's' : ''}.
                </p>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                  <strong>The image will expire in 2 weeks</strong> after it's built{editingImage && editingImage.lastUpdate ? ` (last updated on ${editingImage.lastUpdate})` : ''}. You must copy it to your own 
                  cloud account{selectedCloudProvider.length > 1 ? 's' : ''} to ensure continued access.
                </p>
              </Alert>
            )}

            
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
                        <DescriptionListTerm>Owner</DescriptionListTerm>
                        <DescriptionListDescription>
                          {owner || <span style={{ color: '#666', fontStyle: 'italic' }}>Not specified</span>}
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
                      <DescriptionListGroup>
                        <DescriptionListTerm>Target Environment</DescriptionListTerm>
                        <DescriptionListDescription>
                          {selectedCloudProvider.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {selectedCloudProvider.map(provider => (
                                <Label key={provider} color="blue" variant="filled" isCompact>
                                  {provider === 'aws' && 'Amazon Web Services'}
                                  {provider === 'gcp' && 'Google Cloud Platform'}
                                  {provider === 'azure' && 'Microsoft Azure'}
                                  {provider === 'oci' && 'Oracle Cloud Infrastructure'}
                                </Label>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: '#666', fontStyle: 'italic' }}>No cloud provider selected</span>
                          )}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      {privateCloudFormat.length > 0 && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Private Cloud Formats</DescriptionListTerm>
                          <DescriptionListDescription>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {privateCloudFormat.map(format => (
                                <Label key={format} color="grey" variant="filled" isCompact>
                                  {format === 'ova' && 'VMware vSphere (.ova)'}
                                  {format === 'vmdk' && 'VMware vSphere (.vmdk)'}
                                </Label>
                              ))}
                            </div>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                      {otherFormat.length > 0 && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Additional formats</DescriptionListTerm>
                          <DescriptionListDescription>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {otherFormat.map(format => (
                                <Label key={format} color="grey" variant="filled" isCompact>
                                  {format === 'qcow2' && 'Virtualization (.qcow2)'}
                                  {format === 'iso' && 'Baremetal (.iso)'}
                                  {format === 'tar.gz' && 'WSL (.tar.gz)'}
                                </Label>
                              ))}
                            </div>
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
                          {registrationMethod === 'auto' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <Checkbox
                                isChecked={enablePredictiveAnalytics}
                                isDisabled={true}
                                label="Enable predictive analytics and management capabilities"
                                id="review-enable-predictive-analytics"
                              />
                              <Checkbox
                                isChecked={enableRemoteRemediations}
                                isDisabled={true}
                                label="Enable remote remediations and system management with automation"
                                id="review-enable-remote-remediations"
                              />
                            </div>
                          ) : (
                            <Label color="grey" variant="filled" isCompact>
                              {registrationMethod === 'later' && 'Register later'}
                              {registrationMethod === 'satellite' && 'Register with Satellite'}
                            </Label>
                          )}
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

              {/* Compliance Configuration Card */}
              <StackItem>
                <Card>
                  <CardBody>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <Title headingLevel="h3" size="lg" style={{ margin: 0 }}>
                        Compliance Configuration
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
                        <DescriptionListTerm>Compliance policy</DescriptionListTerm>
                        <DescriptionListDescription>
                          <span style={{ color: '#666', fontStyle: 'italic' }}>Not set</span>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>OpenSCAP profile</DescriptionListTerm>
                        <DescriptionListDescription>
                          {openscapProfile ? (
                            <span>{openscapProfile}</span>
                          ) : (
                            <span style={{ color: '#666', fontStyle: 'italic' }}>Not selected</span>
                          )}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      {(openscapProfile && (openscapAddedPackagesCount > 0 || openscapAddedServicesCount > 0)) && (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Added Items</DescriptionListTerm>
                          <DescriptionListDescription>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {openscapAddedPackagesCount > 0 && (
                                <Label color="orange" variant="filled" isCompact>{openscapAddedPackagesCount} packages</Label>
                              )}
                              {openscapAddedServicesCount > 0 && (
                                <Label color="orange" variant="filled" isCompact>{openscapAddedServicesCount} services</Label>
                              )}
                            </div>
                          </DescriptionListDescription>
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
                        {users.map((user) => (
                          <StackItem key={user.id}>
                            <div>
                              <DescriptionList isHorizontal isCompact>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Username</DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {user.username}
                                    {user.isAdministrator && (
                                      <Label color="blue" variant="filled" isCompact style={{ marginLeft: '8px' }}>Administrator</Label>
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
                                          <Label key={group} color="purple" variant="filled" isCompact>{group}</Label>
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
                  {ntpServers.length > 0 ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {ntpServers.map((server, index) => (
                        <Label key={index} variant="filled" color="teal" isCompact>
                          {server}
                        </Label>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#666', fontStyle: 'italic' }}>Default</span>
                  )}
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
                                    <Label key={lang.id} color="grey" variant="filled" isCompact>{lang.value}</Label>
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
                              {kernelAppend.length > 0 && (
                                <div style={{ marginTop: '4px' }}>
                                  <LabelGroup>
                                    {kernelAppend.map((option, index) => (
                                      <Label key={index} variant="filled" color="grey" isCompact>
                                        {option}
                                      </Label>
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
                        Packages and Repositories
                      </Title>
                      <Button
                        variant="link"
                        onClick={() => setActiveTabKey(1)}
                        style={{ padding: 0, fontSize: '0.875rem' }}
                      >
                        Edit
                      </Button>
                    </div>
                    <div>
                      {/* Repositories */}
                      {repositoryRows.filter(row => row.repository).length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                            Repositories ({repositoryRows.filter(row => row.repository).length})
                          </h4>
                          <LabelGroup>
                            {repositoryRows.filter(row => row.repository).map((row) => (
                              <Label key={row.id} color={row.isOpenSCAPRequired ? 'orange' : 'blue'}>
                                {row.repository}
                                {row.isOpenSCAPRequired && (
                                  <span style={{ fontSize: '0.75rem', marginLeft: '4px' }}>(OpenSCAP)</span>
                                )}
                              </Label>
                            ))}
                          </LabelGroup>
                        </div>
                      )}

                      {/* Packages */}
                      {selectedPackages.length > 0 ? (
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                            Packages ({selectedPackages.length})
                          </h4>
                          <LabelGroup>
                            {selectedPackages.slice(0, 10).map((pkg) => (
                              <Label key={pkg.id || pkg} color="grey" variant="filled" isCompact>
                                {pkg.name || pkg}
                                <Button
                                  variant="plain"
                                  onClick={() => {
                                    setSelectedPackages(prev => 
                                      prev.filter(p => (p.id || p) !== (pkg.id || pkg))
                                    );
                                  }}
                                  style={{ 
                                    marginLeft: '4px', 
                                    padding: '0 4px',
                                    minWidth: 'auto',
                                    height: 'auto'
                                  }}
                                >
                                  <TimesIcon style={{ fontSize: '0.75rem' }} />
                                </Button>
                              </Label>
                            ))}
                            {selectedPackages.length > 10 && (
                              <Label color="grey" variant="filled" isCompact>+{selectedPackages.length - 10} more</Label>
                            )}
                          </LabelGroup>
                        </div>
                      ) : repositoryRows.filter(row => row.repository).length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>No repositories or packages selected</p>
                      ) : null}
                    </div>
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
      width="min(1600px, 98vw)"
      style={{ height: '90vh', maxHeight: '1000px' }}
    >
            <div style={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        maxHeight: '100%'
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
          

        </div>

        {/* Wizard Layout */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Left Sidebar - Wizard Steps */}
          <div style={{ 
            width: '250px', 
            backgroundColor: '#f8f8f8', 
            borderRight: '1px solid #d2d2d2',
            padding: '1.5rem 1rem',
            flexShrink: 0
          }}>
            <nav>
              {[
                { key: 0, title: 'Base settings' },
                { key: 1, title: 'Repositories and packages' },
                { key: 2, title: 'Advanced settings' },
                { key: 3, title: 'Review' }
              ].map((step, index) => {
                const isActive = Number(activeTabKey) === step.key;
                const isCompleted = Number(activeTabKey) > step.key;
                const isPending = Number(activeTabKey) < step.key;
                
                return (
                  <div 
                    key={step.key}
                    onClick={(e) => handleTabClick(e, step.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#0066cc' : 'transparent',
                      color: isActive ? '#fff' : '#151515',
                      border: isActive ? '1px solid #0066cc' : '1px solid transparent',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#e7f1fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {/* Step Number */}
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isActive || isCompleted ? '#0066cc' : '#d2d2d2',
                      color: isActive || isCompleted ? '#fff' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginRight: '12px',
                      flexShrink: 0
                    }}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    
                    {/* Step Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '2px',
                        color: isActive ? '#fff' : '#151515'
                      }}>
                        {step.title}
                        {step.key === 1 && complianceType === 'openscap' && openscapProfile && openscapAddedPackagesCount > 0 && 
                          ` (${openscapAddedPackagesCount})`
                        }
                        {step.key === 2 && complianceType === 'openscap' && openscapProfile && openscapAddedServicesCount > 0 && 
                          ` (${openscapAddedServicesCount})`
                        }
                      </div>
                      {/* Dynamic descriptions for compliance-affected steps */}
                      {step.key === 1 && complianceType === 'openscap' && openscapProfile && openscapAddedPackagesCount > 0 && (
                        <div style={{
                          fontSize: '12px',
                          color: isActive ? '#cce7ff' : '#666',
                          marginTop: '2px'
                        }}>
                          {openscapAddedPackagesCount} packages added by compliance policy
                        </div>
                      )}
                      {step.key === 2 && complianceType === 'openscap' && openscapProfile && openscapAddedServicesCount > 0 && (
                        <div style={{
                          fontSize: '12px',
                          color: isActive ? '#cce7ff' : '#666',
                          marginTop: '2px'
                        }}>
                          {openscapAddedServicesCount} services added by compliance policy
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
          
          {/* Right Content Area */}
          <div 
            ref={contentAreaRef}
            style={{ 
              flex: 1,
              minHeight: 0,
              maxHeight: '100%',
              padding: '24px 24px 24px 32px',
              overflowY: 'auto',
              overflowX: 'hidden',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {renderTabContent()}
          </div>
        </div>

        {/* Footer Section */}
        <div style={{ 
          flexShrink: 0,
          padding: '16px 24px',
          borderTop: '1px solid #d2d2d2'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left side - Back button */}
            <div>
              {Number(activeTabKey) > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    const newTabKey = Number(activeTabKey) - 1;
                    setActiveTabKey(newTabKey);
                    // Smooth scroll to top of content area
                    if (contentAreaRef.current) {
                      contentAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  isDisabled={isLoading}
                >
                  Back
                </Button>
              )}
            </div>
            
            {/* Right side - Cancel, Next/Review/Build buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                variant="link"
                onClick={handleCancel}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              
              {/* Next/Review/Build button */}
              {Number(activeTabKey) < 3 && (
                <Button
                  variant="primary"
                  onClick={() => {
                    const currentStep = Number(activeTabKey);
                    
                    // Validate base settings before allowing progression
                    if (currentStep === 0) {
                      const validationResult = validateBaseImageForm();
                      if (!validationResult.isValid) {
                        // Validation failed, stay on current tab and scroll to first error
                        if (contentAreaRef.current && validationResult.firstErrorRef && validationResult.firstErrorRef.current) {
                          const element = validationResult.firstErrorRef.current;
                          const container = contentAreaRef.current;
                          const containerRect = container.getBoundingClientRect();
                          const elementRect = element.getBoundingClientRect();
                          const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 20;
                          
                          container.scrollTo({
                            top: scrollTop,
                            behavior: 'smooth'
                          });
                        }
                        return; // Don't proceed if validation fails
                      }
                    }
                    
                    const nextStep = currentStep + 1;
                    setActiveTabKey(nextStep);
                    
                    // Reset section indexes when navigating
                    if (nextStep === 3) {
                      setCurrentBaseImageSection(0);
                      setCurrentAdvancedSection(0);
                    }
                    
                    // Smooth scroll to top of content area
                    if (contentAreaRef.current) {
                      contentAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  isDisabled={isLoading}
                >
                  {Number(activeTabKey) === 2 ? 'Review' : 'Next'}
                </Button>
              )}
              
              {/* Build image button on final step */}
              {Number(activeTabKey) === 3 && (
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