import React, { useState } from 'react';
import { ImageInfo } from './ImageMigrationModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Alert,
  Badge,
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
  Divider,
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
  Modal,
  ModalVariant,
  Pagination,
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
  Tab,
  TabTitleText,
  Tabs,
  TextArea,
  TextInput,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip
} from '@patternfly/react-core';

import { 
  ArrowRightIcon, 
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon, 
  ExternalLinkAltIcon, 
  InfoCircleIcon,
  MinusCircleIcon,
  MinusIcon,
  OutlinedQuestionCircleIcon,
  PlusIcon,
  TimesCircleIcon,
  TimesIcon,
  MagicIcon
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
  const [kernelAppend, setKernelAppend] = React.useState<string>('');

  // Public cloud state
  const [selectedCloudProvider, setSelectedCloudProvider] = React.useState<string[]>([]);
  

  
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
  const [otherFormat, setOtherFormat] = React.useState<string[]>([]);
  
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
  const [customCompliancePolicy, setCustomCompliancePolicy] = React.useState<string>('');
  const [isCustomCompliancePolicyOpen, setIsCustomCompliancePolicyOpen] = React.useState<boolean>(false);
  const [openscapProfile, setOpenscapProfile] = React.useState<string>('');
  const [isOpenscapProfileOpen, setIsOpenscapProfileOpen] = React.useState<boolean>(false);

  // Extended support state
  const [extendedSupport, setExtendedSupport] = React.useState<string>('none');
  const [isExtendedSupportCollapsed, setIsExtendedSupportCollapsed] = React.useState<boolean>(true);

  // Organization ID state
  const [organizationId, setOrganizationId] = React.useState<string>('11009103');

  // Systemd services state
  const [systemdDisabledServices, setSystemdDisabledServices] = React.useState<string>('');
  const [systemdMaskedServices, setSystemdMaskedServices] = React.useState<string>('');
  const [systemdEnabledServices, setSystemdEnabledServices] = React.useState<string>('');

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
    updateUser(userId, 'groups', [...(users.find(u => u.id === userId)?.groups || []), group.trim()]);
  };

  const removeGroupFromUser = (userId: string, groupToRemove: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, 'groups', user.groups.filter(g => g !== groupToRemove));
    }
  };

  
  // Track what the user has modified to detect migration-only changes
  const [modifiedFields, setModifiedFields] = React.useState<Set<string>>(new Set());

  // Initialize form with data when editing an existing image
  React.useEffect(() => {
    if (editingImage) {
      // Set basic image information
      setImageName(editingImage.name);
      setBaseImageRelease(editingImage.currentRelease);
      
      // For demo-edit-showcase, pre-populate with interesting configuration
      if (editingImage.name === 'demo-edit-showcase') {
        setImageDetails('Demo image showcasing comprehensive configuration options for editing workflow demonstration');
        setSelectedCloudProvider(['aws', 'gcp', 'azure']);
        setSelectedIntegration('integration-1');
        setAwsAccountId('123456789012');
        setGcpAccountType('Service Account');
        setGcpEmailOrDomain('demo-service@example.com');
        setIsAzureAuthorized(true);
        setPrivateCloudFormat(['ova', 'vmdk']);
        setOtherFormat(['wsl']);
        setRepeatableBuildOption('enable');
        setComplianceType('openscap');
        setOpenscapProfile('cis-rhel9-level2-server');
        setTimezone('America/New_York');
        setNtpServers('pool.ntp.org');
        setHostname('demo-showcase-host');
        setUsers([
          {
            id: '1',
            isAdministrator: true,
            username: 'admin',
            password: 'demo-password',
            sshKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC... demo@example.com',
            groups: ['wheel', 'docker'],
            isEditing: false
          },
          {
            id: '2',
            isAdministrator: false,
            username: 'deploy',
            password: 'deploy-password',
            sshKey: '',
            groups: ['deploy'],
            isEditing: false
          }
        ]);
        setFirewallPorts(['80:tcp', '443:tcp', '22:ssh']);
        setFirewallEnabledServices(['ssh', 'http', 'https']);
        setSystemdEnabledServices('nginx, postgresql, redis');
        setKernelAppend('console=ttyS0');
        
        // Add some demo packages and repositories
        setSelectedPackages([
          { id: 'httpd', name: 'httpd', version: '2.4.53', repository: 'AppStream' },
          { id: 'nginx', name: 'nginx', version: '1.20.1', repository: 'EPEL' },
          { id: 'postgresql', name: 'postgresql', version: '13.7', repository: 'AppStream' }
        ]);
        
        setRepositoryRows([
          // Keep existing OpenSCAP packages
          {
            id: 'openscap-1',
            repository: 'Red Hat',
            selectedPackage: null,
            selectedPackages: [
              { id: 'aide', name: 'aide', version: '0.16', repository: 'BaseOS' },
              { id: 'sudo', name: 'sudo', version: '1.9.5p2', repository: 'BaseOS' }
            ],
            isLocked: true,
            isOpenSCAPRequired: true,
            repositorySearchTerm: 'Red Hat',
            packageSearchTerm: '',
            searchResults: [],
            isRepositoryDropdownOpen: false,
            isLoading: false,
            isRepositorySearching: false,
            lightspeedRecommendations: []
          },
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
    // Mock OpenSCAP required packages - combined into one row with multiple packages
    {
      id: 'openscap-1',
      repository: 'Red Hat',
      repositorySearchTerm: 'Red Hat',
      packageSearchTerm: '',
      selectedPackage: null, // Legacy - using selectedPackages instead
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
    },
    {
      id: 'row-1',
      repository: '',
      repositorySearchTerm: 'Custom Repository',
      packageSearchTerm: '',
      selectedPackage: null,
      isLocked: false,
      isRepositoryDropdownOpen: false,
      searchResults: [],
      isOpenSCAPRequired: false,
      isLoading: false,
      isRepositorySearching: true
    }
  ]);
  
  // Package interface now uses search mode only  
  const packageInterfaceMode = 'search';
  
  // Browse table state - kept as stubs to prevent errors (unreachable since packageInterfaceMode='search')
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
      } else {
        setOpenscapProfile(selection);
        setComplianceType('openscap'); // Auto-select the OpenSCAP radio button
      }
      setIsOpenscapProfileOpen(false);
    }
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
    if (azureId.trim()) {
      setIsAzureAuthorized(true);
      
      // Clear Azure login validation error
      if (validationErrors.azureLogin) {
        const newErrors = { ...validationErrors };
        delete newErrors.azureLogin;
        setValidationErrors(newErrors);
      }
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





  const handleTabClick = (event: React.MouseEvent | React.KeyboardEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
    
    // Reset section indexes when switching tabs
    setCurrentBaseImageSection(0);
    setCurrentAdvancedSection(0);
    
    // Always scroll to top when changing tabs
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = 0;
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
      // Scroll to top when changing tabs
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTop = 0;
      }
    }
  };

  const handleBack = () => {
    if (typeof activeTabKey === 'number' && activeTabKey > 0) {
      setActiveTabKey(activeTabKey - 1);
      // Scroll to top when changing tabs
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTop = 0;
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
            usersRef
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
            title="Register with Red Hat Insights within 30 days"
            style={{ marginTop: '1rem' }}
          >
            <p style={{ marginBottom: '0.5rem' }}>
              If you don't register your systems within 30 days, you will not be able to use Red Hat Insights capabilities.
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
                    placeholder="Enter image name"
                    isRequired
                  />
                </FormGroup>

                <FormGroup
                  label="Description"
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
                          <SelectOption key={release} value={release}>
                            <div>
                              <div style={{ fontWeight: 500 }}>{release}</div>
                              {supportDetail && (
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                  {supportDetail}
                                </div>
                              )}
                            </div>
                          </SelectOption>
                        );
                      })}
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
                      isSelected={selectedCloudProvider.includes('aws')}
                      onClick={() => handleCloudProviderSelect('aws')}
                      style={{ 
                        cursor: 'pointer',
                        border: selectedCloudProvider.includes('aws') ? '2px solid #0066cc' : '1px solid #d2d2d2',
                        backgroundColor: selectedCloudProvider.includes('aws') ? '#f0f8ff' : '#fff'
                      }}
                    >
                      <CardBody style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>☁️</div>
                        <div>Amazon Web Services</div>
                      </CardBody>
                    </Card>
                    
                    <Card
                      isClickable
                      isSelected={selectedCloudProvider.includes('gcp')}
                      onClick={() => handleCloudProviderSelect('gcp')}
                      style={{ 
                        cursor: 'pointer',
                        border: selectedCloudProvider.includes('gcp') ? '2px solid #0066cc' : '1px solid #d2d2d2',
                        backgroundColor: selectedCloudProvider.includes('gcp') ? '#f0f8ff' : '#fff'
                      }}
                    >
                      <CardBody style={{ textAlign: 'center', padding: '16px' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>☁️</div>
                        <div>Google Cloud Platform</div>
                      </CardBody>
                    </Card>
                    
                    <Card
                      isClickable
                      isSelected={selectedCloudProvider.includes('azure')}
                      onClick={() => handleCloudProviderSelect('azure')}
                      style={{ 
                        cursor: 'pointer',
                        border: selectedCloudProvider.includes('azure') ? '2px solid #0066cc' : '1px solid #d2d2d2',
                        backgroundColor: selectedCloudProvider.includes('azure') ? '#f0f8ff' : '#fff'
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
                        isSelected={selectedCloudProvider.includes('oci')}
                        onClick={() => handleCloudProviderSelect('oci')}
                        style={{ 
                          cursor: 'pointer',
                          border: selectedCloudProvider.includes('oci') ? '2px solid #0066cc' : '1px solid #d2d2d2',
                          backgroundColor: selectedCloudProvider.includes('oci') ? '#f0f8ff' : '#fff'
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
                {selectedCloudProvider.includes('aws') && (
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
                {selectedCloudProvider.includes('gcp') && (
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
                {selectedCloudProvider.includes('azure') && (
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
                {selectedCloudProvider.includes('oci') && (
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
                </div>
                  
                {/* Kickstart File Section */}
                <div style={{ marginBottom: '2rem' }}>

                    {/* Divider between sections */}
                    <div style={{ 
                      height: '1px', 
                      backgroundColor: '#d2d2d2', 
                      margin: '0rem 0 2rem 0' 
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
                          <a href="#" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                            Manage with Insights Compliance
                            <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#0066cc' }} />
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
                          <a href="#" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                            Learn more about OpenSCAP profiles
                            <ExternalLinkAltIcon style={{ marginLeft: '0.25rem', fontSize: '0.75rem', color: '#0066cc' }} />
                          </a>
                        </div>
                      </div>
                    </FormGroup>
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
                        title="Register with Red Hat Insights within 30 days"
                      >
                        <p style={{ marginBottom: '0.5rem' }}>
                          If you don't register your systems within 30 days, you will not be able to use Red Hat Insights capabilities.
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
                        Satellite registration is currently being developed and will be available in a future release.
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
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '0rem' }}>
              Repositories and Packages
            </Title>
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
                {/* Extended Support Subscription - Collapsible */}
                  <FormGroup
                    fieldId="extended-support"
                    style={{ marginBottom: '2rem' }}
                  >
                    {/* Collapsible Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        padding: '0.5rem 0',
                        marginBottom: isExtendedSupportCollapsed ? '0' : '1rem'
                      }}
                      onClick={() => setIsExtendedSupportCollapsed(!isExtendedSupportCollapsed)}
                    >
                      {isExtendedSupportCollapsed ? (
                        <ChevronRightIcon style={{ fontSize: '1rem', color: '#666' }} />
                      ) : (
                        <ChevronDownIcon style={{ fontSize: '1rem', color: '#666' }} />
                      )}
                      <span style={{ fontWeight: 500, color: '#151515', fontSize: '0.875rem' }}>
                        Extended support subscription
                      </span>
                      {isExtendedSupportCollapsed && extendedSupport !== 'none' && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: '#666', 
                          fontWeight: 400,
                          marginLeft: '0.5rem'
                        }}>
                          ({extendedSupport === 'eus' ? 'EUS enabled' : 'EEUS enabled'})
                        </span>
                      )}
                    </div>

                    {/* Collapsible Content */}
                    {!isExtendedSupportCollapsed && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1.5rem' }}>
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
                    )}
                  </FormGroup>

              {packageInterfaceMode === 'search' ? (
                // Current Search Interface
                <>
                  {/* Repository Rows - Grouped Layout */}

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
                          label={index === 0 ? "Repository" : ""}
                          fieldId={`repository-${row.id}`}
                          style={{ position: 'relative' }}
                        >
                          {row.isOpenSCAPRequired || row.isLocked ? (
                            <TextInput
                              value={row.repositorySearchTerm}
                              readOnly
                              style={{ width: '100%' }}
                            />
                          ) : (
                            <SearchInput
                              ref={(el) => { (window as any)[`repositoryInput-${row.id}`] = el; }}
                              placeholder="Search or add repository..."
                              value={row.repositorySearchTerm}
                              onChange={(_event, value) => handleRepositorySearchInput(row.id, value)}
                              onSearch={() => handleRepositorySearchSelect(row.id, row.repositorySearchTerm)}
                              onClear={() => handleRepositorySearchClear(row.id)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' && row.repositorySearchTerm.trim()) {
                                  handleRepositorySearchSelect(row.id, row.repositorySearchTerm);
                                }
                              }}
                              onFocus={() => updateRepositoryRow(row.id, { isRepositorySearching: true })}
                              onBlur={() => {
                                // Small delay to allow dropdown clicks to register
                                setTimeout(() => updateRepositoryRow(row.id, { isRepositorySearching: false }), 200);
                              }}
                              style={{ width: '100%' }}
                            />
                          )}
                          
                          {/* Repository dropdown for search results */}
                          {!row.isOpenSCAPRequired && row.isRepositorySearching && (
                            (row.repositorySearchTerm && getFilteredRepositories(row.repositorySearchTerm).length > 0) ||
                            (!row.repositorySearchTerm && availableRepositories.length > 0)
                          ) && (
                            <div style={{ 
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              backgroundColor: 'white',
                              border: '1px solid #d2d2d2',
                              borderRadius: '4px',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                              zIndex: 9999,
                              maxHeight: '200px',
                              overflowY: 'auto',
                              marginTop: '4px'
                            }}>
                              {(row.repositorySearchTerm ? getFilteredRepositories(row.repositorySearchTerm) : availableRepositories).map((repo) => (
                                <div
                                  key={repo}
                                  style={{ 
                                    padding: '12px 16px',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    transition: 'background-color 0.15s ease'
                                  }}
                                  onClick={() => handleRepositorySearchSelect(row.id, repo)}
                                  onMouseEnter={(e) => {
                                    (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.target as HTMLElement).style.backgroundColor = 'white';
                                  }}
                                >
                                  {repo}
                                </div>
                              ))}

                            </div>
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
                                  {/* Package Labels/Chips for multi-selection */}
                                  {row.selectedPackages && row.selectedPackages.length > 0 && (
                                    <div style={{ 
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: '6px',
                                      marginBottom: '8px'
                                    }}>
                                      {row.selectedPackages.map((pkg, index) => (
                                        <div
                                          key={pkg.id || `${pkg.name}-${index}`}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            backgroundColor: '#e6f1ff',
                                            color: '#0066cc',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            border: '1px solid #b3d9ff',
                                            maxWidth: '200px'
                                          }}
                                        >
                                          <span style={{ 
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                          }}>
                                            {pkg.isAllPackages ? `All packages (${pkg.packageCount})` : pkg.name}
                                          </span>
                                          {!row.isOpenSCAPRequired && (
                                            <TimesIcon
                                              style={{ 
                                                marginLeft: '6px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                flexShrink: 0
                                              }}
                                              onClick={() => handleRemovePackageFromSelection(row.id, pkg)}
                                            />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* 
                                    DEVELOPMENT NOTE: PatternFly Multiple Typeahead with Chips
                                    ================================================================
                                    
                                    User requested: "Can we try using the PatternFly multiple typeahead with chips pattern 
                                    where the packages would show up in the field as chips on the left"
                                    
                                    ATTEMPTED IMPLEMENTATION:
                                    - Tried using MenuToggle + Popper + Menu components
                                    - Wanted chips inside the input field using Label components
                                    - Inline search input to the right of chips
                                    
                                    ISSUE ENCOUNTERED:
                                    - Implementation broke compilation with syntax errors
                                    - PatternFly v6 components may not fully support this pattern yet
                                    - Complex state management conflicts with existing functionality
                                    
                                    CURRENT APPROACH:
                                    - Using separate chip area above SearchInput (working solution)
                                    - Maintains all functionality while providing visual feedback
                                    - Can revisit PatternFly typeahead pattern in future iterations
                                  */}

                                  <SearchInput
                                    ref={(el) => { (window as any)[`packageInput-${row.id}`] = el; }}
                                    placeholder={
                                      row.selectedPackages && row.selectedPackages.length > 0 
                                        ? `Last selected: ${row.lastSelectedPackage?.name || 'package'} | Search for more...` 
                                        : (row.repository ? "Search for packages..." : "Select repository first")
                                    }
                                    value={row.packageSearchTerm}
                                    onChange={(_event, value) => handleRowPackageSearchInput(row.id, value)}
                                    onSearch={() => performRowPackageSearch(row.id)}
                                    onClear={() => handleRowPackageSearchClear(row.id)}
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
                                    style={{ width: '100%' }}
                                    isDisabled={!row.repository}
                                  />
                                </div>
                              ) : (
                                // Display for OpenSCAP or locked states
                                <div style={{ width: '100%' }}>
                                  {row.selectedPackages && row.selectedPackages.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                      {row.selectedPackages.map((pkg, index) => (
                                        <Label
                                          key={pkg.id || `${pkg.name}-${index}`}
                                          color="blue"
                                          onClose={!row.isOpenSCAPRequired ? () => handleRemovePackageFromSelection(row.id, pkg) : undefined}
                                          style={{ fontSize: '0.75rem' }}
                                        >
                                          {pkg.isAllPackages ? `All packages (${pkg.packageCount})` : pkg.name}
                                        </Label>
                                      ))}
                                    </div>
                                  )}
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
                              borderRadius: '4px',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                              zIndex: 9999,
                              maxHeight: '300px',
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
                                  <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                    <ArrowRightIcon style={{ marginRight: '4px', fontSize: '0.75rem' }} />
                                    Click the arrow or press Enter to search
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
                                      transition: 'background-color 0.15s ease'
                                    }}
                                    onClick={() => handlePackageSelection(row.id, pkg)}
                                    onMouseEnter={(e) => {
                                      (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.target as HTMLElement).style.backgroundColor = 'white';
                                    }}
                                  >
                                    <div style={{ fontWeight: 500, marginBottom: '2px' }}>
                                      {pkg.name}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '0.75rem' }}>
                                      v{pkg.version} • {pkg.repository}
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
                                  <div style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                                    <ArrowRightIcon style={{ marginRight: '4px', fontSize: '0.75rem' }} />
                                    Click the arrow or press Enter to search for "{row.packageSearchTerm}"
                                  </div>
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
              ) : (
                // New Table Browse Interface
                <>
                  {/* Repository Search */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <FormGroup
                      label="Search repositories"
                      fieldId="repository-search"
                    >
                      <SearchInput
                        placeholder="Search by repository name..."
                        value={repositorySearchTerm}
                        onChange={(_event, value) => setRepositorySearchTerm(value)}
                        onClear={() => setRepositorySearchTerm('')}
                        style={{ width: '100%' }}
                      />
                    </FormGroup>
                  </div>

                  {/* Fixed-Size Repository Table */}
                  <div style={{ 
                    border: '1px solid #d2d2d2', 
                    borderRadius: '4px',
                    overflow: 'hidden',
                    minHeight: '400px'
                  }}>
                    {/* Table Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                      gap: '1rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f8f8f8',
                      borderBottom: '1px solid #d2d2d2',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#151515'
                    }}>
                      <div>Name</div>
                      <div>Architecture</div>
                      <div>Version</div>
                      <div>Packages</div>
                      <div>Status</div>
                    </div>
                    {/* Table Rows */}
                    {getPaginatedRepositories().map((repository) => (
                      <div key={repository.id}>
                        {/* Repository Row */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: expandedRepositories.has(repository.id) ? '#f0f0f0' : 'white',
                            borderBottom: '1px solid #e8e8e8',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            transition: 'background-color 0.15s ease'
                          }}
                          onClick={() => handleRepositoryToggle(repository.id)}
                          onMouseEnter={(e) => {
                            if (!expandedRepositories.has(repository.id)) {
                              (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!expandedRepositories.has(repository.id)) {
                              (e.target as HTMLElement).style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            color: '#0066cc'
                          }}>
                            <div style={{ marginRight: '0.5rem' }}>
                              {expandedRepositories.has(repository.id) ? (
                                <ChevronDownIcon style={{ fontSize: '1rem', color: '#666' }} />
                              ) : (
                                <ChevronRightIcon style={{ fontSize: '1rem', color: '#666' }} />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 500 }}>{repository.name}</div>
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: '#0066cc',
                                textDecoration: 'underline'
                              }}>
                                {repository.url}
                              </div>
                            </div>
                          </div>
                          <div style={{ color: '#666' }}>{repository.architecture}</div>
                          <div style={{ color: '#666' }}>{repository.version}</div>
                          <div style={{ color: '#666' }}>
                            {(() => {
                              const selectedCount = getSelectedPackageCountForRepository(repository.id);
                              const totalCount = repository.packageCount;
                              return selectedCount > 0 ? 
                                `${selectedCount}/${totalCount.toLocaleString()}` : 
                                totalCount === 0 ? '-' : totalCount.toLocaleString();
                            })()}
                          </div>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            color: repository.status === 'valid' ? '#3e8635' : '#c9190b'
                          }}>
                            <div style={{ 
                              marginRight: '0.5rem',
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: repository.status === 'valid' ? '#3e8635' : '#c9190b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              color: 'white'
                            }}>
                              {repository.status === 'valid' ? '✓' : '!'}
                            </div>
                            {repository.status === 'valid' ? 'Valid' : 'Invalid'}
                          </div>
                        </div>

                        {/* Expanded Package List */}
                        {expandedRepositories.has(repository.id) && (
                          <div style={{ 
                            backgroundColor: '#fafafa',
                            borderBottom: '1px solid #e8e8e8'
                          }}>
                            {/* Package Search within Repository */}
                            <div style={{ 
                              padding: '1rem', 
                              backgroundColor: '#f0f0f0',
                              borderBottom: '1px solid #e0e0e0'
                            }}>
                              <FormGroup
                                label={`Search packages in ${repository.name}`}
                                fieldId={`package-search-${repository.id}`}
                              >
                                <SearchInput
                                  placeholder="Search packages by name or description..."
                                  value={repositoryPackageSearchTerms[repository.id] || ''}
                                  onChange={(_event, value) => updateRepositoryPackageSearch(repository.id, value)}
                                  onClear={() => updateRepositoryPackageSearch(repository.id, '')}
                                  style={{ width: '100%' }}
                                />
                              </FormGroup>
                            </div>

{(() => {
                              const result = getFilteredPackagesForRepository(repository.id);
                              const { packages, totalCount, hasMore } = result;
                              const currentPage = repositoryPagination[repository.id] || 1;
                              const searchTerm = repositoryPackageSearchTerms[repository.id] || '';
                              
                              if (packages.length === 0) {
                                return (
                                  <div style={{ 
                                    padding: '2rem', 
                                    textAlign: 'center', 
                                    color: '#666',
                                    fontSize: '0.875rem'
                                  }}>
                                    {searchTerm.trim() 
                                      ? 'No packages found matching your search criteria.'
                                      : 'No packages available in this repository.'
                                    }
                                  </div>
                                );
                              }

                              return (
                                <>
                                  {/* Package Results Info */}
                                  <div style={{ 
                                    padding: '0.75rem 1rem', 
                                    backgroundColor: '#ffffff',
                                    fontSize: '0.75rem',
                                    color: '#666',
                                    borderBottom: '1px solid #e0e0e0',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                  }}>
                                    <span>
                                      {searchTerm.trim() 
                                        ? `Found ${totalCount} packages matching "${searchTerm}"`
                                        : `Showing ${packages.length} of ${totalCount} packages`
                                      }
                                    </span>
                                    <span>Page {currentPage}</span>
                                  </div>

                                  {/* Package List */}
                                  {packages.map((pkg) => (
                                <div
                                  key={pkg.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    borderBottom: '1px solid #e8e8e8',
                                    backgroundColor: 'white',
                                    transition: 'background-color 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.target as HTMLElement).style.backgroundColor = 'white';
                                  }}
                                >
                                  <Checkbox
                                    id={`package-${pkg.id}`}
                                    isChecked={isPackageSelected(pkg.id)}
                                    onChange={(checked) => {
                                      if (checked) {
                                        handleTablePackageSelection({ ...pkg, repositoryId: repository.id });
                                      } else {
                                        handleTablePackageDeselection(pkg.id);
                                      }
                                    }}
                                    style={{ marginRight: '1rem' }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ 
                                      fontSize: '0.875rem', 
                                      fontWeight: 500, 
                                      marginBottom: '0.25rem',
                                      color: '#151515'
                                    }}>
                                      {pkg.name} v{pkg.version}
                                    </div>
                                    <div style={{ 
                                      fontSize: '0.75rem', 
                                      color: '#666',
                                      marginBottom: '0.25rem'
                                    }}>
                                      {pkg.description}
                                    </div>
                                    <div style={{ 
                                      fontSize: '0.75rem', 
                                      color: '#888',
                                      display: 'flex',
                                      gap: '1rem'
                                    }}>
                                      <span>Stream: {pkg.applicationStream}</span>
                                      <span>Support ends: {pkg.retirementDate}</span>
                                    </div>
                                  </div>
                                </div>
                                ))}

                                  {/* Pagination Controls */}
                                  {(hasMore || currentPage > 1) && (
                                    <div style={{ 
                                      padding: '1rem',
                                      backgroundColor: '#ffffff',
                                      borderTop: '1px solid #e0e0e0',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                    }}>
                                      <Button
                                        variant="secondary"
                                        isDisabled={currentPage === 1}
                                        onClick={() => updateRepositoryPagination(repository.id, currentPage - 1)}
                                        size="sm"
                                      >
                                        Previous
                                      </Button>
                                      
                                      <span style={{ fontSize: '0.875rem', color: '#666' }}>
                                        Page {currentPage} {hasMore ? `of ${Math.ceil(totalCount / 50)}` : ''}
                                      </span>
                                      
                                      <Button
                                        variant="secondary"
                                        isDisabled={!hasMore}
                                        onClick={() => updateRepositoryPagination(repository.id, currentPage + 1)}
                                        size="sm"
                                      >
                                        Next
                                      </Button>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Fill remaining table space if fewer than 5 rows */}
                    {Array.from({ length: Math.max(0, repositoriesPerPage - getPaginatedRepositories().length) }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                          gap: '1rem',
                          padding: '0.75rem 1rem',
                          backgroundColor: 'white',
                          borderBottom: '1px solid #e8e8e8',
                          fontSize: '0.875rem',
                          minHeight: '49px'
                        }}
                      >
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ))}
                    
                    {getFilteredRepositoryData().length === 0 && (
                      <div style={{ 
                        padding: '3rem', 
                        textAlign: 'center', 
                        color: '#666',
                        fontSize: '0.875rem'
                      }}>
                        No repositories found matching your search criteria.
                      </div>
                    )}
                  </div>

                  {/* Repository Table Pagination */}
                  {totalRepositoryPages > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '1rem',
                      gap: '1rem'
                    }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        isDisabled={repositoryTablePage === 1}
                        onClick={() => setRepositoryTablePage(repositoryTablePage - 1)}
                      >
                        Previous
                      </Button>
                      <span style={{ fontSize: '0.875rem', color: '#666' }}>
                        Page {repositoryTablePage} of {totalRepositoryPages}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        isDisabled={repositoryTablePage === totalRepositoryPages}
                        onClick={() => setRepositoryTablePage(repositoryTablePage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}

                  {/* Selected Packages Summary Table */}
                  {selectedPackages.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                      <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                        Selected Packages ({selectedPackages.length})
                      </Title>
                      
                      <div style={{
                        border: '1px solid #d2d2d2',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        {/* Table Header */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 2fr 1fr 1fr auto',
                          gap: '1rem',
                          padding: '0.75rem 1rem',
                          backgroundColor: '#f8f8f8',
                          borderBottom: '1px solid #d2d2d2',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#151515'
                        }}>
                          <div>Package</div>
                          <div>Repository</div>
                          <div>Version</div>
                          <div>Support End</div>
                          <div></div>
                        </div>

                        {/* Table Rows */}
                        {selectedPackages.map((pkg) => (
                          <div
                            key={pkg.id || pkg}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '2fr 2fr 1fr 1fr auto',
                              gap: '1rem',
                              padding: '0.75rem 1rem',
                              borderBottom: '1px solid #e8e8e8',
                              backgroundColor: 'white',
                              fontSize: '0.875rem',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.backgroundColor = 'white';
                            }}
                          >
                            <div style={{ 
                              fontWeight: 500,
                              color: '#151515'
                            }}>
                              {pkg.name || pkg}
                              {pkg.version && ` v${pkg.version}`}
                            </div>
                            <div style={{ color: '#666' }}>
                              {pkg.repositoryId ? getRepositoryNameById(pkg.repositoryId) : 'Unknown Repository'}
                            </div>
                            <div style={{ color: '#666' }}>
                              {pkg.version || '-'}
                            </div>
                            <div style={{ color: '#666' }}>
                              {pkg.retirementDate || '-'}
                            </div>
                            <div>
                              <Button
                                variant="plain"
                                aria-label={`Remove ${pkg.name || pkg}`}
                                onClick={() => {
                                  if (packageInterfaceMode === 'browse') {
                                    handleTablePackageDeselection(pkg.id || pkg);
                                  } else {
                                    // Handle removal for search mode
                                    setSelectedPackages(prev => prev.filter(p => (p.id || p) !== (pkg.id || pkg)));
                                  }
                                }}
                                style={{ 
                                  padding: '0.25rem',
                                  minHeight: 'auto'
                                }}
                              >
                                <MinusCircleIcon style={{ fontSize: '1rem', color: '#c9190b' }} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </>
              )}
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
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    Comma-separated list of NTP servers
                  </div>
                </FormGroup>

                <FormGroup
                  label="NTP servers"
                  fieldId="ntp-servers"
                  style={{ marginBottom: '0rem' }}
                >
                  <TextInput
                    id="ntp-servers"
                    value={ntpServers}
                    style={{ width: '200px' }}
                    onChange={(_event, value) => setNtpServers(value)}
                    placeholder="pool.ntp.org"
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    Comma-separated list of NTP servers
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>Must begin with a lowercase letter or digit</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>The address can only contain lowercase letters, digits or hyphens</span>
                  </div>
                      <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>Sections must be separated by a colon (:), period (.), or a forward slash (/)</span>
                  </div>
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
                  <TextInput
                    id="hostname"
                    value={hostname}
                    onChange={(_event, value) => setHostname(value)}
                    placeholder="Enter hostname"
                  />
                    <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>Each label must start and end with an alphanumeric character (a-z, 0-9)</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>Separate labels with dots</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>Hyphens are allowed within labels, but not at the beginning or end</span>
                  </div>
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
                  <TextInput
                    id="kernel-append"
                    value={kernelAppend}
                    onChange={(_event, value) => setKernelAppend(value)}
                    placeholder="Enter kernel append options"
                  />
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>Only alphanumeric characters, equals signs, hyphens, underscores, commas, periods, double quotes, and single quotes</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>Separate arguments with a comma</span>
                  </div>
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
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Systemd services
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                  This is filler text for now.                  
                  </Content>
                
                <FormGroup
                  label="Disabled services"
                  fieldId="systemd-disabled-services"
                  style={{ marginBottom: '1rem' }}
                >
                  <TextInput
                    id="systemd-disabled-services"
                    value={systemdDisabledServices}
                    onChange={(_event, value) => setSystemdDisabledServices(value)}
                    placeholder="Comma-separated list of services to disable"
                    style={{ width: '40%' }}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    These services are installed but will not start automatically at boot.
                  </div>
                </FormGroup>

                <FormGroup
                  label="Masked services"
                  fieldId="systemd-masked-services"
                  style={{ marginBottom: '1rem' }}
                >
                  <TextInput
                    id="systemd-masked-services"
                    value={systemdMaskedServices}
                    onChange={(_event, value) => setSystemdMaskedServices(value)}
                    placeholder="Comma-separated list of services to mask"
                    style={{ width: '40%' }}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    These services are completely blocked from being started manually or automatically.
                  </div>
                </FormGroup>

                <FormGroup
                  label="Enabled services"
                  fieldId="systemd-enabled-services"
                  style={{ marginBottom: '0rem' }}
                >
                  <TextInput
                    id="systemd-enabled-services"
                    value={systemdEnabledServices}
                    onChange={(_event, value) => setSystemdEnabledServices(value)}
                    placeholder="Comma-separated list of services to enable"
                    style={{ width: '40%' }}
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                    These services are currently active and set to start automatically at boot.
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
                            placeholder="Enter port (e.g., 8080, 443)"
                            style={{ flex: 1 }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>Must begin with a port number (up to 5 digits) or a lowercase name (up to 6 letters); a dash may be used to specify a range</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#666',
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <MinusIcon style={{ fontSize: '0.875rem' }} />
                    <span>Must include : or / followed by a lowercase protocol like tcp or udp</span>
                  </div>
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



              {/* Users Section */}

              <div style={{ marginBottom: '2rem', marginTop : '0rem'}}>
                  <Title headingLevel="h3" size="lg" className="pf-v6-u-mb-sm">
                    Users
                  </Title>
                  <Content component="p" className="pf-v6-u-color-200 pf-v6-u-font-size-sm pf-v6-u-mb-md">
                  Create user accounts for systems that will use this image. Duplicate usernames are not allowed.                  
                  </Content>


                {/* User management table */}
                <div style={{ border: '1px solid #d2d2d2', borderRadius: '4px', overflow: 'hidden' }}>
                  {/* Table header */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '100px 1fr 1fr 1fr 1fr 40px', 
                    gap: '1rem',
                    padding: '12px 16px',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #d2d2d2',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    <div>Administrator</div>
                    <div>Username</div>
                    <div>Password</div>
                    <div>SSH key</div>
                    <div>Groups</div>
                    <div></div>
                  </div>
                  
                  {/* Table rows */}
                  {users.map((user) => (
                    <div key={user.id} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '100px 1fr 1fr 1fr 1fr 40px', 
                      gap: '1rem',
                      padding: '12px 16px',
                      borderBottom: users.indexOf(user) === users.length - 1 ? 'none' : '1px solid #d2d2d2',
                      alignItems: 'center'
                    }}>
                      {/* Administrator checkbox */}
                      <Checkbox
                        id={`admin-${user.id}`}
                        isChecked={user.isAdministrator}
                        onChange={(event, checked) => updateUser(user.id, 'isAdministrator', checked)}
                      />
                      
                      {/* Username */}
                      <div>
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
                          style={{ fontSize: '14px' }}
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
                      </div>
                      
                      {/* Password */}
                      <TextInput
                        type="password"
                        value={user.password}
                        onChange={(event, value) => updateUser(user.id, 'password', value)}
                        placeholder="Password"
                        style={{ fontSize: '14px' }}
                      />
                      
                      {/* SSH key */}
                      <TextInput
                        type="text"
                        value={user.sshKey}
                        onChange={(event, value) => updateUser(user.id, 'sshKey', value)}
                        placeholder="SSH key"
                        style={{ fontSize: '14px' }}
                      />
                      
                      {/* Groups */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                        {user.groups.map((group) => (
                          <Label key={group} onClose={() => removeGroupFromUser(user.id, group)} closeBtnAriaLabel={`Remove ${group}`}>
                            {group}
                          </Label>
                        ))}
                        <Button
                          variant="link"
                          onClick={() => {
                            const group = prompt('Enter group name:');
                            if (group) addGroupToUser(user.id, group);
                          }}
                          style={{ padding: '2px 8px', fontSize: '12px' }}
                        >
                          Add group
                        </Button>
                      </div>
                      
                      {/* Remove button */}
                      <Button
                        variant="plain"
                        onClick={() => removeUser(user.id)}
                        isDisabled={users.length === 1}
                        style={{ minWidth: 'auto', padding: '4px' }}
                      >
                        <MinusCircleIcon />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Add user button */}
                <Button
                  variant="link"
                  icon={<PlusIcon />}
                  onClick={addUser}
                  style={{ marginTop: '1rem', fontSize: '0.875rem' }}
                >
                  Add another user
                </Button>
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
                                <Badge key={provider} isRead>
                                  {provider === 'aws' && 'Amazon Web Services'}
                                  {provider === 'gcp' && 'Google Cloud Platform'}
                                  {provider === 'azure' && 'Microsoft Azure'}
                                  {provider === 'oci' && 'Oracle Cloud Infrastructure'}
                                </Badge>
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
                                <Badge key={format} isRead>
                                  {format === 'ova' && 'VMware vSphere (.ova)'}
                                  {format === 'vmdk' && 'VMware vSphere (.vmdk)'}
                                </Badge>
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
                                <Badge key={format} isRead>
                                  {format === 'qcow2' && 'Virtualization (.qcow2)'}
                                  {format === 'iso' && 'Baremetal (.iso)'}
                                  {format === 'tar.gz' && 'WSL (.tar.gz)'}
                                </Badge>
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
                            <Badge isRead>
                              {registrationMethod === 'later' && 'Register later'}
                              {registrationMethod === 'satellite' && 'Register with Satellite'}
                            </Badge>
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
                              {kernelAppend && (
                                <div style={{ marginTop: '4px' }}>
                                  <span style={{ fontSize: '0.875rem', color: '#666' }}>{kernelAppend}</span>
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
                            <Label key={pkg.id || pkg}>
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
      style={{ minHeight: '80vh' }}
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
        <div 
          ref={contentAreaRef}
          style={{ 
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
                variant="secondary"
                onClick={handleNextSection}
                isDisabled={isLoading}
              >
                Next
              </Button>
            )}
            {activeTabKey !== 3 && (
              <Button
                variant="primary"
                onClick={() => {
                  // Only navigate to review if on base image tab and validation passes
                  if (activeTabKey === 0) {
                    const validationResult = validateBaseImageForm();
                    if (!validationResult.isValid) {
                      // Validation failed, stay on current tab and scroll to first error
                      if (contentAreaRef.current && validationResult.firstErrorRef && validationResult.firstErrorRef.current) {
                        // Scroll to the specific error section
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
                      return;
                    }
                  }
                  
                  setActiveTabKey(3);
                  // Reset section indexes when jumping to Review tab
                  setCurrentBaseImageSection(0);
                  setCurrentAdvancedSection(0);
                  // Scroll to top when navigating to Review tab to ensure users see the cloud expiration alert
                  if (contentAreaRef.current) {
                    contentAreaRef.current.scrollTop = 0;
                  }
                }}
                isDisabled={false}
              >
                Review image
              </Button>
            )}
            {activeTabKey === 3 && (
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
    </Modal>
  );
};

export default BuildImageModal; 