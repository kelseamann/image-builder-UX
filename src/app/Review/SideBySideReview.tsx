import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Checkbox,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  Radio,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Stack,
  StackItem,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { MinusCircleIcon, PlusIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

interface RepositoryRow {
  id: string;
  repository: string;
  repositorySearchTerm: string;
  packageSearchTerm: string;
  selectedPackage: any | null;
  isLocked: boolean;
  isRepositoryDropdownOpen: boolean;
  searchResults: any[];
  isOpenSCAPRequired: boolean;
  isLoading: boolean;
  isRepositorySearching: boolean;
}

interface UserRow {
  id: string;
  isAdministrator: boolean;
  username: string;
  password: string;
  sshKey: string;
  groups: string[];
  isEditing: boolean;
}

export const SideBySideReview: React.FunctionComponent = () => {
  useDocumentTitle('Side-by-Side Review');

  // Refs for scroll synchronization
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef<boolean>(false);
  
  // Section refs for both panels
  const leftBaseImageRef = useRef<HTMLDivElement>(null);
  const leftRepositoriesRef = useRef<HTMLDivElement>(null);
  const leftAdvancedRef = useRef<HTMLDivElement>(null);
  
  const rightImageOverviewRef = useRef<HTMLDivElement>(null);
  const rightPackagesRef = useRef<HTMLDivElement>(null);
  const rightAdvancedSettingsRef = useRef<HTMLDivElement>(null);

  // Base image form state
  const [imageName, setImageName] = useState<string>('');
  const [imageDetails, setImageDetails] = useState<string>('');
  const [baseImageRelease, setBaseImageRelease] = useState<string>('Red Hat Enterprise Linux 9');
  const [isBaseImageReleaseOpen, setIsBaseImageReleaseOpen] = useState<boolean>(false);
  const [baseImageArchitecture, setBaseImageArchitecture] = useState<string>('x86_64');
  const [isBaseImageArchitectureOpen, setIsBaseImageArchitectureOpen] = useState<boolean>(false);

  // Repository and package state
  const [extendedSupport, setExtendedSupport] = useState<string>('none');
  const [searchPackageType, setSearchPackageType] = useState<string>('individual');
  const [isSearchPackageTypeOpen, setIsSearchPackageTypeOpen] = useState<boolean>(false);
  const [selectedPackages, setSelectedPackages] = useState<any[]>([]);
  
  const [repositoryRows, setRepositoryRows] = useState<RepositoryRow[]>([
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

  // OpenSCAP required packages - only for display in review panel
  const openscapRequiredPackages = [
    { id: 'aide', name: 'aide', version: '0.16', repository: 'BaseOS' },
    { id: 'sudo', name: 'sudo', version: '1.9.5p2', repository: 'BaseOS' }
  ];

  const [availableRepositories] = useState<string[]>([
    'Red Hat',
    'EPEL',
    'CentOS Stream',
    'Fedora',
    'RPM Fusion',
    'Custom Repository 1',
    'Custom Repository 2'
  ]);

  // Advanced settings state
  const [registrationMethod, setRegistrationMethod] = useState<string>('auto');
  const [organizationId, setOrganizationId] = useState<string>('11009103');
  const [timezone, setTimezone] = useState<string>('');
  const [isTimezoneOpen, setIsTimezoneOpen] = useState<boolean>(false);
  const [hostname, setHostname] = useState<string>('');
  const [kernelPackage, setKernelPackage] = useState<string>('kernel');
  const [isKernelPackageOpen, setIsKernelPackageOpen] = useState<boolean>(false);
  const [systemdDisabledServices, setSystemdDisabledServices] = useState<string>('');
  const [systemdEnabledServices, setSystemdEnabledServices] = useState<string>('');
  const [firewallPorts, setFirewallPorts] = useState<string[]>(['']);
  const [firewallEnabledServices, setFirewallEnabledServices] = useState<string[]>(['']);
  
  // Users state
  const [users, setUsers] = useState<UserRow[]>([
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

  // Scroll synchronization logic
  const synchronizeScroll = (sourcePanel: HTMLDivElement, targetPanel: HTMLDivElement) => {
    if (isScrolling.current) return;
    
    isScrolling.current = true;
    
    // Calculate the scroll percentage of the source panel
    const scrollPercentage = sourcePanel.scrollTop / (sourcePanel.scrollHeight - sourcePanel.clientHeight);
    
    // Apply the same scroll percentage to the target panel
    const targetScrollTop = scrollPercentage * (targetPanel.scrollHeight - targetPanel.clientHeight);
    targetPanel.scrollTop = targetScrollTop;
    
    // Reset the scrolling flag after a short delay
    setTimeout(() => {
      isScrolling.current = false;
    }, 50);
  };

  // Set up scroll event listeners
  useEffect(() => {
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    
    if (!leftPanel || !rightPanel) return;
    
    const handleLeftScroll = () => {
      synchronizeScroll(leftPanel, rightPanel);
    };
    
    const handleRightScroll = () => {
      synchronizeScroll(rightPanel, leftPanel);
    };
    
    leftPanel.addEventListener('scroll', handleLeftScroll);
    rightPanel.addEventListener('scroll', handleRightScroll);
    
    return () => {
      leftPanel.removeEventListener('scroll', handleLeftScroll);
      rightPanel.removeEventListener('scroll', handleRightScroll);
    };
  }, []);

  // Function to scroll to a specific section in both panels
  const scrollToSection = (leftSectionRef: React.RefObject<HTMLDivElement | null>, rightSectionRef: React.RefObject<HTMLDivElement | null>) => {
    if (leftSectionRef.current && rightSectionRef.current) {
      leftSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      rightSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Repository management functions
  const addRepositoryRow = () => {
    const newRow: RepositoryRow = {
      id: `row-${Date.now()}`,
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
    };
    setRepositoryRows([...repositoryRows, newRow]);
  };

  const updateRepositoryRow = (rowId: string, updates: Partial<RepositoryRow>) => {
    setRepositoryRows(prev => 
      prev.map(row => 
        row.id === rowId ? { ...row, ...updates } : row
      )
    );
  };

  const removeRepositoryRow = (rowId: string) => {
    const row = repositoryRows.find(r => r.id === rowId);
    if (row) {
      if (row.selectedPackage) {
        setSelectedPackages(prev => 
          prev.filter(pkg => (pkg.id || pkg) !== (row.selectedPackage.id || row.selectedPackage))
        );
      }
      setRepositoryRows(prev => prev.filter(r => r.id !== rowId));
    }
  };

  const handleRepositorySelect = (rowId: string, repository: string) => {
    updateRepositoryRow(rowId, { 
      repository, 
      repositorySearchTerm: repository,
      isRepositoryDropdownOpen: false,
      packageSearchTerm: '',
      searchResults: [],
      selectedPackage: null,
      isLocked: false,
      isRepositorySearching: false
    });
  };

  const handleRowPackageSearchInput = (rowId: string, searchTerm: string) => {
    updateRepositoryRow(rowId, { packageSearchTerm: searchTerm });
  };

  const performRowPackageSearch = (rowId: string) => {
    const row = repositoryRows.find(r => r.id === rowId);
    if (row && row.packageSearchTerm.trim() && row.repository) {
      // Mock search results
      const mockResults = [
        { id: `${row.packageSearchTerm}-1`, name: row.packageSearchTerm, version: '1.0.0', repository: row.repository },
        { id: `${row.packageSearchTerm}-2`, name: `${row.packageSearchTerm}-dev`, version: '1.0.0', repository: row.repository }
      ];
      updateRepositoryRow(rowId, { searchResults: mockResults });
    }
  };

  const selectPackageForRow = (rowId: string, packageItem: any) => {
    updateRepositoryRow(rowId, { 
      selectedPackage: packageItem,
      isLocked: true,
      searchResults: []
    });
    setSelectedPackages(prev => [...prev, packageItem]);
  };

  // User management functions
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
  };

  const updateUser = (userId: string, updates: Partial<UserRow>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  // Firewall functions
  const addFirewallPort = () => {
    setFirewallPorts([...firewallPorts, '']);
  };

  const updateFirewallPort = (index: number, value: string) => {
    const updated = [...firewallPorts];
    updated[index] = value;
    setFirewallPorts(updated);
  };

  const removeFirewallPort = (index: number) => {
    setFirewallPorts(prev => prev.filter((_, i) => i !== index));
  };

  const addFirewallService = () => {
    setFirewallEnabledServices([...firewallEnabledServices, '']);
  };

  const updateFirewallService = (index: number, value: string) => {
    const updated = [...firewallEnabledServices];
    updated[index] = value;
    setFirewallEnabledServices(updated);
  };

  const removeFirewallService = (index: number) => {
    setFirewallEnabledServices(prev => prev.filter((_, i) => i !== index));
  };

  const renderSearchForm = () => (
    <div ref={leftPanelRef} style={{ height: '100%', overflowY: 'auto', padding: '1rem' }}>
      <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
        Search Configuration
      </Title>
      
      <Form>
        {/* Base Image Section */}
        <div ref={leftBaseImageRef} style={{ marginBottom: '2rem' }}>
          <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
            Base Image
          </Title>
          
          <FormGroup label="Image Name" fieldId="image-name" style={{ marginBottom: '1rem' }}>
            <TextInput
              id="image-name"
              value={imageName}
              onChange={(_event, value) => setImageName(value)}
              placeholder="Enter image name"
            />
          </FormGroup>

          <FormGroup label="Description" fieldId="image-details" style={{ marginBottom: '1rem' }}>
            <TextInput
              id="image-details"
              value={imageDetails}
              onChange={(_event, value) => setImageDetails(value)}
              placeholder="Enter image description"
            />
          </FormGroup>

          <FormGroup label="Base Release" fieldId="base-release" style={{ marginBottom: '1rem' }}>
            <Select
              id="base-release-select"
              isOpen={isBaseImageReleaseOpen}
              selected={baseImageRelease}
              onSelect={(_, selection) => {
                setBaseImageRelease(selection as string);
                setIsBaseImageReleaseOpen(false);
              }}
              onOpenChange={(isOpen) => setIsBaseImageReleaseOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle 
                  ref={toggleRef} 
                  onClick={() => setIsBaseImageReleaseOpen(!isBaseImageReleaseOpen)}
                  isExpanded={isBaseImageReleaseOpen}
                  style={{ width: '100%' }}
                >
                  {baseImageRelease}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="Red Hat Enterprise Linux 9">Red Hat Enterprise Linux 9</SelectOption>
                <SelectOption value="Red Hat Enterprise Linux 8">Red Hat Enterprise Linux 8</SelectOption>
                <SelectOption value="CentOS Stream 9">CentOS Stream 9</SelectOption>
                <SelectOption value="CentOS Stream 8">CentOS Stream 8</SelectOption>
              </SelectList>
            </Select>
          </FormGroup>

          <FormGroup label="Architecture" fieldId="architecture" style={{ marginBottom: '1rem' }}>
            <Select
              id="architecture-select"
              isOpen={isBaseImageArchitectureOpen}
              selected={baseImageArchitecture}
              onSelect={(_, selection) => {
                setBaseImageArchitecture(selection as string);
                setIsBaseImageArchitectureOpen(false);
              }}
              onOpenChange={(isOpen) => setIsBaseImageArchitectureOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle 
                  ref={toggleRef} 
                  onClick={() => setIsBaseImageArchitectureOpen(!isBaseImageArchitectureOpen)}
                  isExpanded={isBaseImageArchitectureOpen}
                  style={{ width: '100%' }}
                >
                  {baseImageArchitecture}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="x86_64">x86_64</SelectOption>
                <SelectOption value="aarch64">aarch64</SelectOption>
              </SelectList>
            </Select>
          </FormGroup>
        </div>

        <Divider style={{ margin: '1rem 0' }} />

        {/* Repositories and Packages Section */}
        <div ref={leftRepositoriesRef} style={{ marginBottom: '2rem' }}>
          <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
            Repositories and Packages
          </Title>

          <FormGroup label="Extended Support" fieldId="extended-support" style={{ marginBottom: '1rem' }}>
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

          <FormGroup label="Package Type" fieldId="package-type" style={{ marginBottom: '1rem' }}>
            <Select
              id="package-type-select"
              isOpen={isSearchPackageTypeOpen}
              selected={searchPackageType === 'individual' ? 'Individual packages' : 'Package groups'}
              onSelect={(_, selection) => {
                setSearchPackageType(selection === 'Individual packages' ? 'individual' : 'groups');
                setIsSearchPackageTypeOpen(false);
              }}
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
                <SelectOption value="Individual packages">Individual packages</SelectOption>
                <SelectOption value="Package groups">Package groups</SelectOption>
              </SelectList>
            </Select>
          </FormGroup>

          {/* Repository Rows */}
          <Stack hasGutter>
            {repositoryRows.map((row, index) => (
              <StackItem key={row.id}>
                <Grid hasGutter>
                  <GridItem span={5}>
                    <FormGroup
                      label={index === 0 ? "Repository" : ""}
                      fieldId={`repository-${row.id}`}
                    >
                      <SearchInput
                        placeholder="Search repository..."
                        value={row.repositorySearchTerm}
                        onChange={(_event, value) => updateRepositoryRow(row.id, { repositorySearchTerm: value })}
                        onSearch={() => handleRepositorySelect(row.id, row.repositorySearchTerm)}
                        onClear={() => updateRepositoryRow(row.id, { repositorySearchTerm: '', repository: '' })}
                        style={{ width: '100%' }}
                      />
                    </FormGroup>
                  </GridItem>
                  
                                      <GridItem span={6}>
                    <FormGroup
                      label={index === 0 ? "Package" : ""}
                      fieldId={`package-${row.id}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {row.isLocked && row.selectedPackage ? (
                          <TextInput
                            value={`${row.selectedPackage.name} v${row.selectedPackage.version}`}
                            readOnly
                            style={{ flex: 1 }}
                          />
                        ) : (
                          <SearchInput
                            placeholder={row.repository ? "Search packages..." : "Select repository first"}
                            value={row.packageSearchTerm}
                            onChange={(_event, value) => handleRowPackageSearchInput(row.id, value)}
                            onSearch={() => performRowPackageSearch(row.id)}
                            onClear={() => updateRepositoryRow(row.id, { packageSearchTerm: '', searchResults: [] })}
                            isDisabled={!row.repository || row.isLocked}
                            style={{ flex: 1 }}
                          />
                        )}
                        <MinusCircleIcon
                          style={{ 
                            fontSize: '1.25rem', 
                            color: '#151515',
                            cursor: 'pointer'
                          }}
                          onClick={() => removeRepositoryRow(row.id)}
                        />
                      </div>
                      
                      {/* Package Search Results */}
                      {row.searchResults.length > 0 && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: 0, 
                          right: 0, 
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          zIndex: 1000,
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}>
                          {row.searchResults.map((pkg) => (
                            <div
                              key={pkg.id}
                              style={{ 
                                padding: '8px 12px',
                                borderBottom: '1px solid #f0f0f0',
                                cursor: 'pointer'
                              }}
                              onClick={() => selectPackageForRow(row.id, pkg)}
                            >
                              <div style={{ fontWeight: 'bold' }}>{pkg.name}</div>
                              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                v{pkg.version} • {pkg.repository}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </FormGroup>
                  </GridItem>
                </Grid>
              </StackItem>
            ))}
          </Stack>

          <Button
            variant="secondary"
            onClick={addRepositoryRow}
            style={{ marginTop: '1rem' }}
          >
            Add Repository
          </Button>
        </div>

        <Divider style={{ margin: '1rem 0' }} />

        {/* Advanced Settings Section */}
        <div ref={leftAdvancedRef} style={{ marginBottom: '2rem' }}>
          <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
            Advanced Settings
          </Title>

          <FormGroup label="Registration Method" fieldId="registration-method" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Radio
                isChecked={registrationMethod === 'auto'}
                name="registration-method"
                onChange={() => setRegistrationMethod('auto')}
                label="Auto-register"
                id="registration-auto"
              />
              <Radio
                isChecked={registrationMethod === 'manual'}
                name="registration-method"
                onChange={() => setRegistrationMethod('manual')}
                label="Manual registration"
                id="registration-manual"
              />
            </div>
          </FormGroup>

          <FormGroup label="Organization ID" fieldId="organization-id" style={{ marginBottom: '1rem' }}>
            <TextInput
              id="organization-id"
              value={organizationId}
              onChange={(_event, value) => setOrganizationId(value)}
              placeholder="Enter organization ID"
            />
          </FormGroup>

          <FormGroup label="Hostname" fieldId="hostname" style={{ marginBottom: '1rem' }}>
            <TextInput
              id="hostname"
              value={hostname}
              onChange={(_event, value) => setHostname(value)}
              placeholder="Enter hostname"
            />
          </FormGroup>

          <FormGroup label="Kernel Package" fieldId="kernel-package" style={{ marginBottom: '1rem' }}>
            <Select
              id="kernel-package-select"
              isOpen={isKernelPackageOpen}
              selected={kernelPackage}
              onSelect={(_, selection) => {
                setKernelPackage(selection as string);
                setIsKernelPackageOpen(false);
              }}
              onOpenChange={(isOpen) => setIsKernelPackageOpen(isOpen)}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle 
                  ref={toggleRef} 
                  onClick={() => setIsKernelPackageOpen(!isKernelPackageOpen)}
                  isExpanded={isKernelPackageOpen}
                  style={{ width: '100%' }}
                >
                  {kernelPackage}
                </MenuToggle>
              )}
            >
              <SelectList>
                <SelectOption value="kernel">kernel</SelectOption>
                <SelectOption value="kernel-rt">kernel-rt</SelectOption>
                <SelectOption value="kernel-debug">kernel-debug</SelectOption>
              </SelectList>
            </Select>
          </FormGroup>

          <FormGroup label="Systemd Disabled Services" fieldId="systemd-disabled" style={{ marginBottom: '1rem' }}>
            <TextInput
              id="systemd-disabled"
              value={systemdDisabledServices}
              onChange={(_event, value) => setSystemdDisabledServices(value)}
              placeholder="Comma-separated list of services"
            />
          </FormGroup>

          <FormGroup label="Systemd Enabled Services" fieldId="systemd-enabled" style={{ marginBottom: '1rem' }}>
            <TextInput
              id="systemd-enabled"
              value={systemdEnabledServices}
              onChange={(_event, value) => setSystemdEnabledServices(value)}
              placeholder="Comma-separated list of services"
            />
          </FormGroup>

          {/* Firewall Ports */}
          <FormGroup label="Firewall Ports" fieldId="firewall-ports" style={{ marginBottom: '1rem' }}>
            <Stack hasGutter>
              {firewallPorts.map((port, index) => (
                <StackItem key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TextInput
                      value={port}
                      onChange={(_event, value) => updateFirewallPort(index, value)}
                      placeholder="Enter port (e.g., 8080, 443)"
                      style={{ flex: 1 }}
                    />
                    <MinusCircleIcon
                      style={{ 
                        fontSize: '1.25rem', 
                        color: '#151515',
                        cursor: 'pointer'
                      }}
                      onClick={() => removeFirewallPort(index)}
                    />
                  </div>
                </StackItem>
              ))}
            </Stack>
            <Button
              variant="link"
              onClick={addFirewallPort}
              style={{ padding: 0, marginTop: '0.5rem' }}
            >
              <PlusIcon style={{ marginRight: '0.5rem' }} />
              Add Port
            </Button>
          </FormGroup>

          {/* Firewall Services */}
          <FormGroup label="Firewall Services" fieldId="firewall-services" style={{ marginBottom: '1rem' }}>
            <Stack hasGutter>
              {firewallEnabledServices.map((service, index) => (
                <StackItem key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TextInput
                      value={service}
                      onChange={(_event, value) => updateFirewallService(index, value)}
                      placeholder="Enter service name"
                      style={{ flex: 1 }}
                    />
                    <MinusCircleIcon
                      style={{ 
                        fontSize: '1.25rem', 
                        color: '#151515',
                        cursor: 'pointer'
                      }}
                      onClick={() => removeFirewallService(index)}
                    />
                  </div>
                </StackItem>
              ))}
            </Stack>
            <Button
              variant="link"
              onClick={addFirewallService}
              style={{ padding: 0, marginTop: '0.5rem' }}
            >
              <PlusIcon style={{ marginRight: '0.5rem' }} />
              Add Service
            </Button>
          </FormGroup>

          {/* Users Management */}
          <FormGroup label="Users" fieldId="users" style={{ marginBottom: '1rem' }}>
            <Stack hasGutter>
              {users.map((user, index) => (
                <StackItem key={user.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Checkbox
                      id={`user-admin-${user.id}`}
                      isChecked={user.isAdministrator}
                      onChange={(_, checked) => updateUser(user.id, { isAdministrator: checked })}
                      label="Admin"
                    />
                    <TextInput
                      value={user.username}
                      onChange={(_event, value) => updateUser(user.id, { username: value })}
                      placeholder="Username"
                      style={{ flex: 1 }}
                    />
                    <TextInput
                      value={user.password}
                      onChange={(_event, value) => updateUser(user.id, { password: value })}
                      placeholder="Password"
                      type="password"
                      style={{ flex: 1 }}
                    />
                    <MinusCircleIcon
                      style={{ 
                        fontSize: '1.25rem', 
                        color: '#151515',
                        cursor: 'pointer'
                      }}
                      onClick={() => removeUser(user.id)}
                    />
                  </div>
                </StackItem>
              ))}
            </Stack>
            <Button
              variant="link"
              onClick={addUser}
              style={{ padding: 0, marginTop: '0.5rem' }}
            >
              <PlusIcon style={{ marginRight: '0.5rem' }} />
              Add User
            </Button>
          </FormGroup>
        </div>
      </Form>
    </div>
  );

  const renderReviewPanel = () => (
    <div ref={rightPanelRef} style={{ height: '100%', overflowY: 'auto', padding: '1rem' }}>
      <Title headingLevel="h2" size="lg" style={{ marginBottom: '1rem' }}>
        Review Configuration
      </Title>
      
      <Stack hasGutter>
        {/* Image Overview Card */}
        <StackItem>
          <Card ref={rightImageOverviewRef}>
            <CardBody>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                Image Overview
              </Title>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>
                    {imageName || <span style={{ color: '#666', fontStyle: 'italic' }}>Not specified</span>}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
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
                  <DescriptionListTerm>Extended Support</DescriptionListTerm>
                  <DescriptionListDescription>
                    {extendedSupport === 'none' ? 'None' : 
                     extendedSupport === 'eus' ? 'Extended Update Support (EUS)' : 
                     'Enhanced Extended Update Support (EEUS)'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </StackItem>

        {/* Packages Card */}
        <StackItem>
          <Card ref={rightPackagesRef}>
            <CardBody>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                Packages
              </Title>
              
              {/* OpenSCAP Required Packages */}
              <div style={{ marginBottom: '1rem' }}>
                <strong>OpenSCAP Required Packages:</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  <LabelGroup>
                    {openscapRequiredPackages.map((pkg, index) => (
                      <Label key={index} color="orange">
                        {pkg.name} v{pkg.version} (Required)
                      </Label>
                    ))}
                  </LabelGroup>
                </div>
              </div>

              {/* User Selected Packages */}
              <div style={{ marginBottom: '1rem' }}>
                <strong>Additional Packages:</strong>
                {selectedPackages.length > 0 ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ marginBottom: '8px', color: '#666', fontSize: '0.875rem' }}>
                      {selectedPackages.length} package{selectedPackages.length !== 1 ? 's' : ''} selected
                    </p>
                    <LabelGroup>
                      {selectedPackages.map((pkg, index) => (
                        <Label key={index} color="blue">
                          {pkg.name} v{pkg.version}
                        </Label>
                      ))}
                    </LabelGroup>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', marginTop: '0.5rem' }}>
                    No additional packages selected
                  </p>
                )}
              </div>

              {/* Package Configuration */}
              <div style={{ marginTop: '1rem' }}>
                <strong>Package Type:</strong> {searchPackageType === 'individual' ? 'Individual packages' : 'Package groups'}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Repositories:</strong>
                {repositoryRows.filter(row => row.repository).length > 0 ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ marginLeft: '1rem' }}>• Red Hat (OpenSCAP required)</div>
                    {repositoryRows.filter(row => row.repository).map((row, index) => (
                      <div key={row.id} style={{ marginLeft: '1rem' }}>
                        • {row.repository}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ marginLeft: '1rem' }}>• Red Hat (OpenSCAP required)</div>
                    <span style={{ color: '#666', fontStyle: 'italic', marginLeft: '1rem' }}>No additional repositories configured</span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </StackItem>

        {/* Advanced Settings Card */}
        <StackItem>
          <Card ref={rightAdvancedSettingsRef}>
            <CardBody>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                Advanced Settings
              </Title>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Registration Method</DescriptionListTerm>
                  <DescriptionListDescription>
                    {registrationMethod === 'auto' ? 'Auto-register' : 'Manual registration'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Organization ID</DescriptionListTerm>
                  <DescriptionListDescription>{organizationId}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Hostname</DescriptionListTerm>
                  <DescriptionListDescription>
                    {hostname || <span style={{ color: '#666', fontStyle: 'italic' }}>Not specified</span>}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Kernel Package</DescriptionListTerm>
                  <DescriptionListDescription>{kernelPackage}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Systemd Services</DescriptionListTerm>
                  <DescriptionListDescription>
                    <div>
                      {systemdDisabledServices && (
                        <div>Disabled: {systemdDisabledServices}</div>
                      )}
                      {systemdEnabledServices && (
                        <div>Enabled: {systemdEnabledServices}</div>
                      )}
                      {!systemdDisabledServices && !systemdEnabledServices && (
                        <span style={{ color: '#666', fontStyle: 'italic' }}>Default services</span>
                      )}
                    </div>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </StackItem>

        {/* Firewall Settings Card */}
        <StackItem>
          <Card>
            <CardBody>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                Firewall Settings
              </Title>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Enabled Ports</DescriptionListTerm>
                  <DescriptionListDescription>
                    {firewallPorts.filter(port => port.trim()).length > 0 ? (
                      <LabelGroup>
                        {firewallPorts.filter(port => port.trim()).map((port, index) => (
                          <Label key={index} color="green">
                            {port}
                          </Label>
                        ))}
                      </LabelGroup>
                    ) : (
                      <span style={{ color: '#666', fontStyle: 'italic' }}>No custom ports</span>
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Enabled Services</DescriptionListTerm>
                  <DescriptionListDescription>
                    {firewallEnabledServices.filter(service => service.trim()).length > 0 ? (
                      <LabelGroup>
                        {firewallEnabledServices.filter(service => service.trim()).map((service, index) => (
                          <Label key={index} color="green">
                            {service}
                          </Label>
                        ))}
                      </LabelGroup>
                    ) : (
                      <span style={{ color: '#666', fontStyle: 'italic' }}>No custom services</span>
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          </Card>
        </StackItem>

        {/* Users Card */}
        <StackItem>
          <Card>
            <CardBody>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '1rem' }}>
                Users
              </Title>
              {users.length > 0 ? (
                <div>
                  <p style={{ marginBottom: '12px', color: '#666' }}>
                    {users.length} user{users.length !== 1 ? 's' : ''} configured
                  </p>
                  <Stack hasGutter>
                    {users.map((user, index) => (
                      <StackItem key={user.id}>
                        <div style={{ 
                          padding: '0.5rem', 
                          backgroundColor: '#f5f5f5', 
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <strong>{user.username || 'Unnamed User'}</strong>
                            {user.isAdministrator && (
                              <Label color="red" style={{ marginLeft: '0.5rem' }}>
                                Administrator
                              </Label>
                            )}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            {user.password ? 'Password set' : 'No password'}
                          </div>
                        </div>
                      </StackItem>
                    ))}
                  </Stack>
                </div>
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  No users configured
                </p>
              )}
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </div>
  );

  return (
    <PageSection>
      <div style={{ marginBottom: '2rem' }}>
        <Title headingLevel="h1" size="2xl">
          Side-by-Side Review
        </Title>
        <p style={{ fontSize: '16px', color: '#666', marginTop: '0.5rem' }}>
          Configure your image settings on the left and review the configuration on the right. 
          Search and select packages, repositories, and advanced settings to see the real-time review.
          <br />
          <strong>💡 Tip:</strong> The panels scroll together automatically, or use the section buttons below to jump to specific areas.
        </p>
        
        {/* Section Navigation */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => scrollToSection(leftBaseImageRef, rightImageOverviewRef)}
          >
            Base Image
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => scrollToSection(leftRepositoriesRef, rightPackagesRef)}
          >
            Repositories & Packages
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => scrollToSection(leftAdvancedRef, rightAdvancedSettingsRef)}
          >
            Advanced Settings
          </Button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        height: '70vh', 
        gap: '2rem',
        border: '1px solid #d2d2d2',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Left Panel - Search Form */}
        <div style={{ 
          flex: 1, 
          borderRight: '1px solid #d2d2d2',
          backgroundColor: '#fafafa',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '12px',
            color: '#666',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: '4px 8px',
            borderRadius: '4px',
            zIndex: 1000
          }}>
            ↕️ Synchronized
          </div>
          {renderSearchForm()}
        </div>

        {/* Right Panel - Review */}
        <div style={{ 
          flex: 1,
          backgroundColor: '#ffffff',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '12px',
            color: '#666',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: '4px 8px',
            borderRadius: '4px',
            zIndex: 1000
          }}>
            ↕️ Synchronized
          </div>
          {renderReviewPanel()}
        </div>
      </div>
    </PageSection>
  );
}; 